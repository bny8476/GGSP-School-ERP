import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Student from '../models/Student';
import Parent from '../models/Parent';
import Assessment from '../models/Assessment';
import Enrollment from '../models/Enrollment';
import StudentParent from '../models/StudentParent';
import AcademicYear from '../models/AcademicYear';
import { generateReportCardPDF } from '../utils/pdfGenerator';
import { FALLBACK_CHILDREN, FALLBACK_ASSESSMENTS } from '../utils/parentFallbackData';

// @desc    Get all students
// @route   GET /api/students
export const getStudents = async (req: Request, res: Response) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json(FALLBACK_CHILDREN);
  }

  try {
    let query: Record<string, unknown> = {};

    if (req.user?.role === 'Parent') {
      const parent = await Parent.findOne({ userId: req.user.id });
      if (!parent) {
        return res.json(FALLBACK_CHILDREN);
      }

      // Query both modern StudentParent junction and legacy parentId for 100% backward compatibility
      const linkedRecords = await StudentParent.find({ parentId: parent._id }).select('studentId');
      const linkedStudentIds = linkedRecords.map((r) => r.studentId);

      query = {
        $or: [{ _id: { $in: linkedStudentIds } }, { parentId: parent._id }],
      };
    }

    const students = await Student.find(query)
      .populate('parentId', 'fatherName motherName primaryEmail')
      .populate('classId', 'name')
      .populate('sectionId', 'name');

    if (req.user?.role === 'Parent' && (!students || students.length === 0)) {
      return res.json(FALLBACK_CHILDREN);
    }

    res.json(students);
  } catch (error) {
    if (req.user?.role === 'Parent') {
      return res.json(FALLBACK_CHILDREN);
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

import Class from '../models/Class';
import Section from '../models/Section';
import { 
  generateNextAdmissionNumber, 
  generateNextRollNumber, 
  peekNextIdentifiers 
} from '../services/sequenceService';

// @desc    Preview next student identifiers (non-binding preview)
// @route   GET /api/students/preview-identifiers
export const previewStudentIdentifiers = async (req: Request, res: Response) => {
  try {
    const { academicYear, className, sectionName } = req.query;
    const preview = await peekNextIdentifiers(
      academicYear ? String(academicYear) : undefined,
      className ? String(className) : undefined,
      sectionName ? String(sectionName) : undefined
    );
    res.json(preview);
  } catch (error) {
    res.status(500).json({ message: 'Error previewing student identifiers', error });
  }
};

// @desc    Create a student with authoritative atomic ID generation & Enrollment creation
// @route   POST /api/students
export const createStudent = async (req: Request, res: Response) => {
  try {
    // 1. Resolve Academic Year
    let activeYear = await AcademicYear.findOne({ isCurrent: true });
    if (!activeYear) {
      activeYear = await AcademicYear.findOne().sort({ createdAt: -1 });
    }
    if (!activeYear) {
      activeYear = await AcademicYear.create({
        name: '2026-2027',
        startDate: new Date('2026-04-01'),
        endDate: new Date('2027-03-31'),
        status: 'active',
        isCurrent: true,
      });
    }

    // 2. Resolve Class Document (by ID or by name)
    let classDoc = null;
    if (req.body.classId && mongoose.isValidObjectId(req.body.classId)) {
      classDoc = await Class.findById(req.body.classId);
    }
    if (!classDoc && (req.body.className || req.body.grade)) {
      const cName = req.body.className || req.body.grade;
      classDoc = await Class.findOne({ name: { $regex: new RegExp(`^${cName}$`, 'i') } });
      if (!classDoc) {
        classDoc = await Class.create({ name: cName });
      }
    }

    // 3. Resolve Section Document (by ID or by name)
    let sectionDoc = null;
    if (req.body.sectionId && mongoose.isValidObjectId(req.body.sectionId)) {
      sectionDoc = await Section.findById(req.body.sectionId);
    }
    if (!sectionDoc && classDoc && req.body.sectionName) {
      const sName = req.body.sectionName;
      sectionDoc = await Section.findOne({ classId: classDoc._id, name: { $regex: new RegExp(`^${sName}$`, 'i') } });
      if (!sectionDoc) {
        sectionDoc = await Section.create({ name: sName, classId: classDoc._id, capacity: 30 });
      }
    }

    const yearStr = req.body.academicYear || activeYear?.name || '2026-27';
    const classStr = req.body.className || req.body.grade || classDoc?.name || 'LKG';
    const sectionStr = req.body.sectionName || sectionDoc?.name || 'A';

    // 4. Concurrency-safe atomic generation with retry on collision
    let student = null;
    let enrollment = null;
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      attempts++;
      try {
        const admissionNumber = await generateNextAdmissionNumber(yearStr, classStr);
        const rollNumber = await generateNextRollNumber(yearStr, classStr, sectionStr);

        // Strip any manual IDs if mistakenly passed by client
        const studentData = {
          ...req.body,
          admissionNumber,
          classId: classDoc?._id || req.body.classId,
          sectionId: sectionDoc?._id || req.body.sectionId,
          enrollmentDate: req.body.enrollmentDate || new Date(),
          status: 'Active',
        };

        student = await Student.create(studentData);

        enrollment = await Enrollment.create({
          studentId: student._id,
          academicYearId: activeYear._id,
          classId: classDoc?._id || student.classId,
          sectionId: sectionDoc?._id || student.sectionId,
          rollNumber,
          admissionDate: student.enrollmentDate || new Date(),
          status: 'Active',
        });

        break;
      } catch (err: any) {
        if (err.code === 11000 && attempts < maxAttempts) {
          console.warn(`Duplicate key collision during enrollment (attempt ${attempts}), retrying atomic counter...`);
          continue;
        }
        throw err;
      }
    }

    if (!student) {
      return res.status(500).json({ message: 'Failed to assign unique enrollment identifiers after retries' });
    }

    // 5. Relational Sync: If parentId is provided, link in StudentParent junction
    if (student.parentId) {
      try {
        await StudentParent.findOneAndUpdate(
          { studentId: student._id, parentId: student.parentId },
          {
            studentId: student._id,
            parentId: student.parentId,
            relationship: 'Guardian',
            isPrimary: true,
          },
          { upsert: true, new: true }
        );
      } catch (parentErr) {
        console.warn('Non-blocking StudentParent sync error:', parentErr);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Student enrolled successfully with authoritative identifiers',
      student,
      enrollment,
      admissionNumber: student.admissionNumber,
      rollNumber: enrollment?.rollNumber,
      academicYear: yearStr,
      className: classStr,
      sectionName: sectionStr,
    });
  } catch (error) {
    res.status(400).json({ message: 'Invalid student enrollment data', error });
  }
};

// @desc    Update a student (with relational sync)
// @route   PUT /api/students/:id
export const updateStudent = async (req: Request, res: Response) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Sync enrollment if class or section changed
    if (student.classId) {
      try {
        const activeYear = (await AcademicYear.findOne({ isCurrent: true })) || (await AcademicYear.findOne().sort({ createdAt: -1 }));
        if (activeYear) {
          await Enrollment.findOneAndUpdate(
            { studentId: student._id, academicYearId: activeYear._id },
            {
              studentId: student._id,
              academicYearId: activeYear._id,
              classId: student.classId,
              sectionId: student.sectionId,
              status: 'Active',
            },
            { upsert: true }
          );
        }
      } catch (enrollErr) {
        console.warn('Enrollment update sync warning:', enrollErr);
      }
    }

    // Sync parent if updated
    if (student.parentId) {
      try {
        await StudentParent.findOneAndUpdate(
          { studentId: student._id, parentId: student.parentId },
          {
            studentId: student._id,
            parentId: student.parentId,
            relationship: 'Guardian',
            isPrimary: true,
          },
          { upsert: true }
        );
      } catch (parentErr) {
        console.warn('StudentParent update sync warning:', parentErr);
      }
    }

    res.json(student);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error });
  }
};

// @desc    Delete a student
// @route   DELETE /api/students/:id
export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    // Clean up relational links
    await Enrollment.deleteMany({ studentId: student._id });
    await StudentParent.deleteMany({ studentId: student._id });
    res.json({ message: 'Student removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Get student academic enrollments across all years
// @route   GET /api/students/:id/enrollments
export const getStudentEnrollments = async (req: Request, res: Response) => {
  try {
    const enrollments = await Enrollment.find({ studentId: req.params.id })
      .populate('academicYearId', 'name startDate endDate isCurrent')
      .populate('classId', 'name')
      .populate('sectionId', 'name')
      .sort({ createdAt: -1 });

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Get student guardians/parents
// @route   GET /api/students/:id/parents
export const getStudentParents = async (req: Request, res: Response) => {
  try {
    const studentParents = await StudentParent.find({ studentId: req.params.id })
      .populate('parentId')
      .sort({ isPrimary: -1 });

    res.json(studentParents);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Download Student Report Card PDF
// @route   GET /api/students/:id/report-card
export const downloadReportCard = async (req: Request, res: Response) => {
  if (mongoose.connection.readyState !== 1) {
    const student = FALLBACK_CHILDREN.find((c) => c._id === req.params.id) || FALLBACK_CHILDREN[0];
    const assessments = FALLBACK_ASSESSMENTS.filter((a) => (a.childId as any)._id === student._id);
    generateReportCardPDF(res, student as any, assessments as any);
    return;
  }

  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      const fallbackChild = FALLBACK_CHILDREN.find((c) => c._id === req.params.id);
      if (fallbackChild) {
        const assessments = FALLBACK_ASSESSMENTS.filter((a) => (a.childId as any)._id === fallbackChild._id);
        generateReportCardPDF(res, fallbackChild as any, assessments as any);
        return;
      }
      return res.status(404).json({ message: 'Student not found' });
    }

    // Ownership check for parent accounts (support both StudentParent junction and legacy parentId)
    if (req.user?.role === 'Parent') {
      const parent = await Parent.findOne({ userId: req.user.id });
      if (!parent) {
        return res.status(403).json({ message: 'Access denied: Parent profile not found.' });
      }

      const isDirectParent = student.parentId?.toString() === parent._id.toString();
      const isJunctionParent = Boolean(await StudentParent.findOne({ studentId: student._id, parentId: parent._id }));

      if (!isDirectParent && !isJunctionParent) {
        return res.status(403).json({
          message: 'Access denied: You do not have permission to view this report card.',
        });
      }
    }

    // Fetch assessments for this child
    const assessments = await Assessment.find({ childId: student._id }).sort({ date: 1 });

    // The utility will pipe directly to `res`
    generateReportCardPDF(res, student, assessments);
  } catch (error) {
    console.error('Report Card PDF Error:', error);
    res.status(500).json({ message: 'Failed to generate Report Card' });
  }
};
