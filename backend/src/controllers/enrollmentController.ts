import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Enrollment from '../models/Enrollment';
import Student from '../models/Student';
import Class from '../models/Class';
import Section from '../models/Section';
import AcademicYear from '../models/AcademicYear';
import { generateNextRollNumber } from '../services/sequenceService';

// @desc    Get all enrollments with filtering and search
// @route   GET /api/enrollment
export const getEnrollments = async (req: Request, res: Response) => {
  try {
    const { academicYearId, classId, sectionId, status, search, page = 1, limit = 50 } = req.query;

    const query: any = {};

    if (academicYearId) {
      query.academicYearId = academicYearId;
    } else {
      // Default to active academic year if not provided
      const activeYear = await AcademicYear.findOne({ isCurrent: true });
      if (activeYear) query.academicYearId = activeYear._id;
    }

    if (classId) query.classId = classId;
    if (sectionId) query.sectionId = sectionId;
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    let enrollments = await Enrollment.find(query)
      .populate('studentId', 'firstName lastName admissionNumber rollNumber gender email phone avatar profilePicture status')
      .populate('classId', 'name')
      .populate('sectionId', 'name capacity')
      .populate('academicYearId', 'name isCurrent')
      .sort({ 'classId': 1, 'sectionId': 1, 'rollNumber': 1 })
      .skip(skip)
      .limit(Number(limit));

    // Optional text search filter
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      enrollments = enrollments.filter((item: any) => {
        const student = item.studentId;
        if (!student) return false;
        const name = `${student.firstName || ''} ${student.lastName || ''}`.toLowerCase();
        const adm = (student.admissionNumber || '').toLowerCase();
        const roll = (item.rollNumber || student.rollNumber || '').toLowerCase();
        return name.includes(q) || adm.includes(q) || roll.includes(q);
      });
    }

    const total = await Enrollment.countDocuments(query);

    res.json({
      success: true,
      data: enrollments,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch enrollments', error });
  }
};

// @desc    Assign or reassign student to class/section
// @route   POST /api/enrollment/assign
export const assignEnrollment = async (req: Request, res: Response) => {
  try {
    const { studentId, academicYearId, classId, sectionId, rollNumber, remarks } = req.body;

    if (!studentId || !classId) {
      return res.status(400).json({ success: false, message: 'Student ID and Class ID are required' });
    }

    let resolvedYearId = academicYearId;
    if (!resolvedYearId) {
      const activeYear = (await AcademicYear.findOne({ isCurrent: true })) || (await AcademicYear.findOne().sort({ createdAt: -1 }));
      if (!activeYear) {
        return res.status(400).json({ success: false, message: 'No academic year found' });
      }
      resolvedYearId = activeYear._id;
    }

    // Check section capacity if section is selected
    if (sectionId) {
      const section = await Section.findById(sectionId);
      if (section) {
        const currentCount = await Enrollment.countDocuments({
          sectionId,
          academicYearId: resolvedYearId,
          status: 'Active',
          studentId: { $ne: studentId }
        });
        if (currentCount >= section.capacity) {
          return res.status(400).json({
            success: false,
            message: `Section ${section.name} has reached maximum capacity of ${section.capacity} students`
          });
        }
      }
    }

    let finalRollNumber = rollNumber;
    if (!finalRollNumber) {
      const [cDoc, sDoc, yDoc] = await Promise.all([
        Class.findById(classId),
        sectionId ? Section.findById(sectionId) : null,
        AcademicYear.findById(resolvedYearId)
      ]);
      finalRollNumber = await generateNextRollNumber(
        yDoc?.name || '2026-27',
        cDoc?.name || 'Pre-KG',
        sDoc?.name || 'A'
      );
    }

    const enrollment = await Enrollment.findOneAndUpdate(
      { studentId, academicYearId: resolvedYearId },
      {
        studentId,
        academicYearId: resolvedYearId,
        classId,
        sectionId: sectionId || undefined,
        rollNumber: finalRollNumber,
        status: 'Active',
        remarks: remarks || undefined,
      },
      { upsert: true, new: true, runValidators: true }
    );

    // Sync student record with current class and section
    await Student.findByIdAndUpdate(studentId, {
      classId,
      sectionId: sectionId || undefined,
      rollNumber: finalRollNumber,
    });

    const populated = await Enrollment.findById(enrollment._id)
      .populate('studentId', 'firstName lastName admissionNumber rollNumber')
      .populate('classId', 'name')
      .populate('sectionId', 'name capacity')
      .populate('academicYearId', 'name');

    res.json({ success: true, message: 'Student successfully assigned', data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to assign enrollment', error });
  }
};

// @desc    Bulk roll-over / promotion of students
// @route   POST /api/enrollment/bulk-rollover
export const bulkRollover = async (req: Request, res: Response) => {
  try {
    const { studentIds, targetAcademicYearId, targetClassId, targetSectionId, remarks } = req.body;

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Please select at least one student' });
    }

    if (!targetAcademicYearId || !targetClassId) {
      return res.status(400).json({ success: false, message: 'Target academic year and class are required' });
    }

    const [cDoc, sDoc, yDoc] = await Promise.all([
      Class.findById(targetClassId),
      targetSectionId ? Section.findById(targetSectionId) : null,
      AcademicYear.findById(targetAcademicYearId)
    ]);

    const results = [];
    const errors = [];

    for (const sId of studentIds) {
      try {
        const student = await Student.findById(sId);
        if (!student) {
          errors.push({ studentId: sId, error: 'Student not found' });
          continue;
        }

        // Mark existing enrollment as promoted
        await Enrollment.findOneAndUpdate(
          { studentId: sId, status: 'Active' },
          { status: 'Promoted' }
        );

        const rollNumber = await generateNextRollNumber(
          yDoc?.name || '2026-27',
          cDoc?.name || 'Pre-KG',
          sDoc?.name || 'A'
        );

        const newEnrollment = await Enrollment.create({
          studentId: sId,
          academicYearId: targetAcademicYearId,
          classId: targetClassId,
          sectionId: targetSectionId || undefined,
          rollNumber,
          admissionDate: new Date(),
          status: 'Active',
          remarks: remarks || 'Academic year rollover promotion',
        });

        await Student.findByIdAndUpdate(sId, {
          classId: targetClassId,
          sectionId: targetSectionId || undefined,
          rollNumber,
        });

        results.push(newEnrollment);
      } catch (err: any) {
        errors.push({ studentId: sId, error: err.message });
      }
    }

    res.json({
      success: true,
      message: `Successfully processed ${results.length} student promotions`,
      promotedCount: results.length,
      errorsCount: errors.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to process bulk roll-over', error });
  }
};

// @desc    Get section capacities and seat utilization
// @route   GET /api/enrollment/capacity
export const getSectionCapacities = async (req: Request, res: Response) => {
  try {
    const { academicYearId } = req.query;

    let yearId = academicYearId;
    if (!yearId) {
      const activeYear = await AcademicYear.findOne({ isCurrent: true });
      if (activeYear) yearId = activeYear._id;
    }

    const classes = await Class.find().sort({ name: 1 });
    const sections = await Section.find().populate('classId', 'name').sort({ name: 1 });

    const report = [];

    for (const sec of sections) {
      const enrolledCount = await Enrollment.countDocuments({
        sectionId: sec._id,
        ...(yearId ? { academicYearId: yearId } : {}),
        status: 'Active'
      });

      const capacity = sec.capacity || 30;
      const available = Math.max(0, capacity - enrolledCount);
      const utilizationRate = capacity > 0 ? Math.round((enrolledCount / capacity) * 100) : 0;

      let status = 'Available';
      if (enrolledCount >= capacity) {
        status = 'Full';
      } else if (utilizationRate >= 85) {
        status = 'Near Capacity';
      }

      report.push({
        sectionId: sec._id,
        sectionName: sec.name,
        classId: sec.classId?._id || sec.classId,
        className: (sec.classId as any)?.name || 'Unassigned',
        capacity,
        enrolledCount,
        availableSeats: available,
        utilizationRate,
        status,
      });
    }

    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch section capacities', error });
  }
};

// @desc    Update section capacity limit
// @route   PUT /api/enrollment/capacity/:sectionId
export const updateSectionCapacity = async (req: Request, res: Response) => {
  try {
    const { sectionId } = req.params;
    const { capacity } = req.body;

    if (!capacity || Number(capacity) < 1) {
      return res.status(400).json({ success: false, message: 'Capacity must be at least 1' });
    }

    const section = await Section.findByIdAndUpdate(
      sectionId,
      { capacity: Number(capacity) },
      { new: true }
    );

    if (!section) {
      return res.status(404).json({ success: false, message: 'Section not found' });
    }

    res.json({ success: true, message: 'Section capacity updated successfully', data: section });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update section capacity', error });
  }
};
