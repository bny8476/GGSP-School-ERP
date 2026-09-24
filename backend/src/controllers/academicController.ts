import { Request, Response } from 'express';
import mongoose from 'mongoose';
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
    res.status(500).json({ success: false, message: 'Server Error', error });
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
    res.status(400).json({ success: false, message: 'Invalid data or duplicate subject name', error });
  }
};

// @desc    Delete a subject
// @route   DELETE /api/academic/subjects/:id
// @access  Private (Admin, SuperAdmin, Principal, Teacher)
export const deleteSubject = async (req: Request, res: Response) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });
    res.json({ success: true, message: 'Subject removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error });
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
    res.status(500).json({ success: false, message: 'Server Error', error });
  }
};

// @desc    Save/Update timetable for a specific class and day with conflict detection
// @route   POST /api/academic/timetables
export const saveTimeTable = async (req: Request, res: Response) => {
  try {
    const { classId, dayOfWeek, periods } = req.body;

    if (!classId || !dayOfWeek || !Array.isArray(periods)) {
      return res.status(400).json({ success: false, message: 'Missing required fields: classId, dayOfWeek, and periods array' });
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
                success: false,
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
    res.status(400).json({ success: false, message: 'Invalid data or conflict error', error });
  }
};

// @desc    Get today's schedule for child or class
// @route   GET /api/academic/timetables/today
export const getTodaySchedule = async (req: Request, res: Response) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json([]);
  }

  try {
    const { childId, classId } = req.query;
    let targetClassId = classId as string;

    if (childId && mongoose.Types.ObjectId.isValid(childId as string)) {
      const student = await mongoose.model('Student').findById(childId).select('classId sectionId');
      if (student && student.classId) {
        targetClassId = String(student.classId);
      }
    }

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
    const currentDay = days[new Date().getDay()];
    // If weekend, show Monday schedule
    const searchDay = currentDay === 'Sunday' || currentDay === 'Saturday' ? 'Monday' : currentDay;

    const query: Record<string, any> = { dayOfWeek: searchDay };
    if (targetClassId && mongoose.Types.ObjectId.isValid(targetClassId)) {
      query.classId = new mongoose.Types.ObjectId(targetClassId);
    }

    const timetable = await TimeTable.findOne(query)
      .populate('periods.subjectId', 'name code colorCode')
      .populate('periods.teacherId', 'firstName lastName');

    if (!timetable || !timetable.periods || timetable.periods.length === 0) {
      return res.json([]);
    }

    const periods = timetable.periods.map((p: any, idx: number) => {
      const subjectName = p.subjectId?.name || 'Class';
      const isLunch = subjectName.toLowerCase().includes('lunch');
      const isActivity = subjectName.toLowerCase().includes('art') || subjectName.toLowerCase().includes('story') || subjectName.toLowerCase().includes('rhyme') || subjectName.toLowerCase().includes('craft');

      return {
        id: `p-${idx + 1}`,
        periodNumber: idx + 1,
        subject: subjectName,
        startTime: p.startTime,
        endTime: p.endTime,
        timeString: `${p.startTime} – ${p.endTime}`,
        type: isLunch ? 'LUNCH' : isActivity ? 'ACTIVITY' : 'CLASS',
        room: p.room || 'Classroom',
        teacherName: p.teacherId ? `${p.teacherId.firstName || ''} ${p.teacherId.lastName || ''}`.trim() : 'Teacher',
      };
    });

    res.json(periods);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch today schedule', error });
  }
};
