import { Request, Response } from 'express';
import Student from '../models/Student';
import Parent from '../models/Parent';
import Assessment from '../models/Assessment';
import Enrollment from '../models/Enrollment';
import StudentParent from '../models/StudentParent';
import AcademicYear from '../models/AcademicYear';
import { generateReportCardPDF } from '../utils/pdfGenerator';

// @desc    Get all students
// @route   GET /api/students
export const getStudents = async (req: Request, res: Response) => {
  try {
    let query: Record<string, unknown> = {};

    if (req.user?.role === 'Parent') {
      const parent = await Parent.findOne({ userId: req.user.id });
      if (!parent) {
        return res.json([]);
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
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a student (with relational Enrollment and StudentParent sync)
// @route   POST /api/students
export const createStudent = async (req: Request, res: Response) => {
  try {
    const student = await Student.create(req.body);

    // 1. Relational Sync: If classId is provided, create/link active Enrollment
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
              admissionDate: student.enrollmentDate || new Date(),
              status: 'Active',
            },
            { upsert: true, new: true }
          );
        }
      } catch (enrollmentErr) {
        console.warn('Non-blocking enrollment sync error:', enrollmentErr);
      }
    }

    // 2. Relational Sync: If parentId is provided, link in StudentParent junction
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

    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: 'Invalid student data', error });
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
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
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
