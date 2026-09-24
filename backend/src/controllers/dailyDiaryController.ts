import { Request, Response } from 'express';
import mongoose from 'mongoose';
import DailyDiary from '../models/DailyDiary';
import Student from '../models/Student';
import Parent from '../models/Parent';
import StudentParent from '../models/StudentParent';
import User from '../models/User';
import Notification from '../models/Notification';
import { emitToClass, emitToUser, emitToRole } from '../socket';

// @desc    Get today's daily diary for child/class
// @route   GET /api/daily-diary/today
export const getTodayDailyDiary = async (req: Request, res: Response) => {
  try {
    const { childId } = req.query;
    let targetClassId: any;
    let targetSectionId: any;

    if (childId && mongoose.Types.ObjectId.isValid(childId as string)) {
      const student = await Student.findById(childId as string).select('classId sectionId');
      if (student) {
        targetClassId = student.classId;
        targetSectionId = student.sectionId;
      }
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const query: Record<string, any> = {
      date: { $gte: todayStart, $lt: todayEnd },
    };

    if (childId && mongoose.Types.ObjectId.isValid(childId as string)) {
      query.$or = [
        { studentId: new mongoose.Types.ObjectId(childId as string) },
        ...(targetClassId ? [{ classId: targetClassId }] : []),
      ];
    } else if (targetClassId) {
      query.classId = targetClassId;
    }

    const diary = await DailyDiary.findOne(query)
      .populate('teacherId', 'firstName lastName')
      .sort({ updatedAt: -1 });

    if (!diary) {
      return res.json({
        recorded: false,
        message: "No daily diary entry posted yet for today.",
      });
    }

    res.json(diary);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving daily diary', error });
  }
};

// @desc    Get all daily diaries for a class/date
// @route   GET /api/daily-diary
export const getDailyDiaries = async (req: Request, res: Response) => {
  try {
    const { date, grade, childId } = req.query;
    let query: Record<string, any> = {};

    if (childId && mongoose.Types.ObjectId.isValid(childId as string)) {
      const student = await Student.findById(childId as string).select('classId sectionId');
      if (student) {
        query.$or = [
          { studentId: new mongoose.Types.ObjectId(childId as string) },
          ...(student.classId ? [{ classId: student.classId }] : []),
        ];
      }
    } else if (req.user?.role === 'Parent') {
      const parent = await Parent.findOne({ userId: req.user.id });
      if (parent) {
        const linked = await StudentParent.find({ parentId: parent._id }).select('studentId');
        const direct = await Student.find({ parentId: parent._id }).select('_id');
        const studentIds = [...new Set([...linked.map((r) => r.studentId), ...direct.map((d) => d._id)])];
        query.studentId = { $in: studentIds };
      }
    }

    if (date) {
      const queryDate = new Date(date as string);
      const nextDay = new Date(queryDate);
      nextDay.setDate(queryDate.getDate() + 1);
      query.date = { $gte: queryDate, $lt: nextDay };
    }

    const diaries = await DailyDiary.find(query)
      .populate('studentId', 'firstName lastName')
      .populate('teacherId', 'firstName lastName')
      .sort({ date: -1 })
      .limit(30);

    res.json(diaries);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error fetching diaries', error });
  }
};

// @desc    Create or Update a daily diary (Teacher Portal)
// @route   POST /api/daily-diary
export const saveDailyDiary = async (req: Request, res: Response) => {
  try {
    const {
      studentId,
      classId,
      sectionId,
      className,
      sectionName,
      date,
      todayLearning,
      todayActivity,
      homework,
      teacherNote,
      teacherName: rawTeacherName,
      meals,
      napTime,
      mood,
      activities,
      notes,
    } = req.body;

    const teacherId = req.user?.id;
    let teacherName = rawTeacherName || 'Teacher';

    if (teacherId && mongoose.Types.ObjectId.isValid(teacherId)) {
      const u = await User.findById(teacherId).select('firstName lastName');
      if (u) {
        teacherName = `${u.firstName || ''} ${u.lastName || ''}`.trim() || teacherName;
      }
    }

    const recordDate = date ? new Date(date) : new Date();
    recordDate.setHours(0, 0, 0, 0);

    const filter: Record<string, any> = { date: recordDate };
    if (studentId && mongoose.Types.ObjectId.isValid(studentId)) {
      filter.studentId = new mongoose.Types.ObjectId(studentId);
    } else if (classId && mongoose.Types.ObjectId.isValid(classId)) {
      filter.classId = new mongoose.Types.ObjectId(classId);
      if (sectionId && mongoose.Types.ObjectId.isValid(sectionId)) {
        filter.sectionId = new mongoose.Types.ObjectId(sectionId);
      }
    }

    const diary = await DailyDiary.findOneAndUpdate(
      filter,
      {
        studentId: studentId && mongoose.Types.ObjectId.isValid(studentId) ? new mongoose.Types.ObjectId(studentId) : undefined,
        classId: classId && mongoose.Types.ObjectId.isValid(classId) ? new mongoose.Types.ObjectId(classId) : undefined,
        sectionId: sectionId && mongoose.Types.ObjectId.isValid(sectionId) ? new mongoose.Types.ObjectId(sectionId) : undefined,
        className: className || 'Class',
        sectionName: sectionName || 'A',
        date: recordDate,
        todayLearning: todayLearning || '',
        todayActivity: todayActivity || '',
        homework: homework || '',
        teacherNote: teacherNote || '',
        teacherName,
        teacherId: teacherId && mongoose.Types.ObjectId.isValid(teacherId) ? new mongoose.Types.ObjectId(teacherId) : undefined,
        meals,
        napTime,
        mood: mood || 'Happy',
        activities: Array.isArray(activities) ? activities : todayActivity ? [todayActivity] : [],
        notes: notes || teacherNote || '',
      },
      { new: true, upsert: true }
    );

    // Notify parents in target class / student
    try {
      let queryStudent: any = {};
      if (studentId) queryStudent._id = studentId;
      else if (classId) queryStudent.classId = classId;

      const students = await Student.find(queryStudent).select('parentId _id');
      for (const st of students) {
        if (st.parentId) {
          const p = await Parent.findById(st.parentId).select('userId');
          if (p && p.userId) {
            const notif = await Notification.create({
              recipient: p.userId,
              userId: p.userId,
              studentId: st._id,
              targetRole: 'Parent',
              title: "Today's Daily Diary",
              message: `Daily Diary update: ${todayLearning || 'New classroom updates are available.'}`,
              type: 'diary',
              priority: 'normal',
              link: '/parent/diary',
              metadata: {
                diaryId: diary._id,
                date: recordDate,
                teacherName,
              },
            });
            emitToUser(p.userId.toString(), 'notification:new', notif);
          }
        }
      }
    } catch (notifErr) {}

    if (classId) {
      emitToClass(classId.toString(), 'diary:published', diary);
    }
    emitToRole('Admin', 'diary:published', diary);

    res.status(200).json({
      success: true,
      message: 'Daily diary published and parents notified!',
      diary,
    });
  } catch (error) {
    console.error('Save diary error:', error);
    res.status(400).json({ success: false, message: 'Invalid diary data', error });
  }
};
