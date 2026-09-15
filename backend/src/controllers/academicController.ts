import { Request, Response } from 'express';
import Subject from '../models/Subject';
import TimeTable from '../models/TimeTable';

// --- SUBJECTS ---

// @desc    Get all subjects
// @route   GET /api/academic/subjects
export const getSubjects = async (req: Request, res: Response) => {
  try {
    const subjects = await Subject.find().sort({ name: 1 });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Create a subject
// @route   POST /api/academic/subjects
export const createSubject = async (req: Request, res: Response) => {
  try {
    const { name, description, colorCode } = req.body;
    const subject = await Subject.create({ name, description, colorCode });
    res.status(201).json(subject);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data or duplicate subject name', error });
  }
};

// @desc    Delete a subject
// @route   DELETE /api/academic/subjects/:id
// @access  Private (Admin, SuperAdmin, Principal, Teacher)
export const deleteSubject = async (req: Request, res: Response) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    res.json({ message: 'Subject removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// --- TIMETABLES WITH CONFLICT DETECTION ---

// @desc    Get timetables for a specific class
// @route   GET /api/academic/timetables/:classId
export const getTimeTables = async (req: Request, res: Response) => {
  try {
    const timetables = await TimeTable.find({ classId: req.params.classId })
      .populate('periods.subjectId')
      .populate('periods.teacherId', 'firstName lastName');
    res.json(timetables);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Save/Update timetable for a specific class and day with conflict detection
// @route   POST /api/academic/timetables
export const saveTimeTable = async (req: Request, res: Response) => {
  try {
    const { classId, dayOfWeek, periods } = req.body;

    if (!classId || !dayOfWeek || !Array.isArray(periods)) {
      return res.status(400).json({ message: 'Missing required fields: classId, dayOfWeek, and periods array' });
    }

    // Timetable Conflict Detection Engine
    // Check if any specified teacher is already booked in ANOTHER class for the same dayOfWeek and matching period times
    const existingOtherTables = await TimeTable.find({
      dayOfWeek,
      classId: { $ne: classId },
    }).populate('periods.teacherId', 'firstName lastName');

    for (const period of periods) {
      if (!period.teacherId) continue;
      const teacherIdStr = String(period.teacherId);

      for (const otherTable of existingOtherTables) {
        for (const otherPeriod of otherTable.periods) {
          if (!otherPeriod.teacherId) continue;
          const otherTeacherIdStr = String(
            typeof otherPeriod.teacherId === 'object' && otherPeriod.teacherId !== null
              ? (otherPeriod.teacherId as any)._id
              : otherPeriod.teacherId
          );

          if (teacherIdStr === otherTeacherIdStr) {
            // Check time slot overlap
            if (
              (period.startTime >= otherPeriod.startTime && period.startTime < otherPeriod.endTime) ||
              (period.endTime > otherPeriod.startTime && period.endTime <= otherPeriod.endTime) ||
              (period.startTime <= otherPeriod.startTime && period.endTime >= otherPeriod.endTime)
            ) {
              const teacherName =
                typeof otherPeriod.teacherId === 'object' && otherPeriod.teacherId !== null
                  ? `${(otherPeriod.teacherId as any).firstName} ${(otherPeriod.teacherId as any).lastName}`
                  : 'Teacher';
              return res.status(409).json({
                message: `Timetable Conflict: ${teacherName} is already assigned to another class on ${dayOfWeek} from ${otherPeriod.startTime} to ${otherPeriod.endTime}.`,
              });
            }
          }
        }
      }
    }

    let timetable = await TimeTable.findOne({ classId, dayOfWeek });

    if (timetable) {
      timetable.periods = periods;
      await timetable.save();
    } else {
      timetable = await TimeTable.create({ classId, dayOfWeek, periods });
    }

    // Return populated timetable
    const populated = await TimeTable.findById(timetable._id)
      .populate('periods.subjectId')
      .populate('periods.teacherId', 'firstName lastName');

    res.status(200).json(populated);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data or conflict error', error });
  }
};
