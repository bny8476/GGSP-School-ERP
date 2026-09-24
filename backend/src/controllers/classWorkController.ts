import { Request, Response } from 'express';
import mongoose from 'mongoose';
import ClassWork from '../models/ClassWork';
import Student from '../models/Student';
import Parent from '../models/Parent';
import User from '../models/User';
import ClassModel from '../models/Class';
import SectionModel from '../models/Section';
import Notification from '../models/Notification';
import { emitToClass, emitToRole, emitToUser } from '../socket';

// @desc    Get today's class work (for child or class)
// @route   GET /api/classwork/today
export const getTodayClassWork = async (req: Request, res: Response) => {
  try {
    const childId = req.query.childId as string;
    let targetClassId = req.query.classId as string;
    let targetSectionId = req.query.sectionId as string;

    if (childId && mongoose.Types.ObjectId.isValid(childId)) {
      const student = await Student.findById(childId).select('classId sectionId');
      if (student && student.classId) {
        targetClassId = String(student.classId);
        if (student.sectionId) targetSectionId = String(student.sectionId);
      }
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const query: Record<string, any> = {
      date: { $gte: todayStart, $lt: todayEnd },
    };

    if (targetClassId && mongoose.Types.ObjectId.isValid(targetClassId)) {
      query.classId = new mongoose.Types.ObjectId(targetClassId);
    }
    if (targetSectionId && mongoose.Types.ObjectId.isValid(targetSectionId)) {
      query.sectionId = new mongoose.Types.ObjectId(targetSectionId);
    }

    const items = await ClassWork.find(query).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error fetching classwork', error });
  }
};

// @desc    Get class work history (with pagination & filters)
// @route   GET /api/classwork
export const getClassWorkHistory = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 30;
    const skip = (page - 1) * limit;

    const query: Record<string, any> = {};
    const { classId, sectionId, subject } = req.query;

    if (classId && mongoose.Types.ObjectId.isValid(classId as string)) {
      query.classId = new mongoose.Types.ObjectId(classId as string);
    }
    if (sectionId && mongoose.Types.ObjectId.isValid(sectionId as string)) {
      query.sectionId = new mongoose.Types.ObjectId(sectionId as string);
    }
    if (subject) {
      query.subject = subject;
    }

    const [items, total] = await Promise.all([
      ClassWork.find(query).sort({ date: -1, createdAt: -1 }).skip(skip).limit(limit),
      ClassWork.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error fetching classwork history', error });
  }
};

// @desc    Publish new class work entry (Teacher Portal)
// @route   POST /api/classwork
export const createClassWork = async (req: Request, res: Response) => {
  try {
    const {
      subject,
      topic,
      whatWasTaught,
      learningObjective,
      classroomActivity,
      worksheetUrl,
      homework,
      teacherRemark,
      photos,
      date,
      classId,
      sectionId,
      className: rawClassName,
      sectionName: rawSectionName,
      teacherName: rawTeacherName,
    } = req.body;

    if (!subject || !whatWasTaught) {
      return res.status(400).json({ success: false, message: 'Subject and whatWasTaught are required' });
    }

    const teacherId = req.user?.id;
    let teacherName = rawTeacherName || 'Teacher';
    if (teacherId && mongoose.Types.ObjectId.isValid(teacherId)) {
      const u = await User.findById(teacherId).select('firstName lastName');
      if (u) {
        teacherName = `${u.firstName || ''} ${u.lastName || ''}`.trim() || teacherName;
      }
    }

    let className = rawClassName;
    let sectionName = rawSectionName;
    let resolvedClassId = classId && mongoose.Types.ObjectId.isValid(classId) ? new mongoose.Types.ObjectId(classId) : undefined;

    if (!resolvedClassId && className) {
      const cDoc = await ClassModel.findOne({ name: new RegExp(`^${className}$`, 'i') });
      if (cDoc) {
        resolvedClassId = cDoc._id as mongoose.Types.ObjectId;
        className = cDoc.name;
      }
    }

    if (!resolvedClassId) {
      const defaultClass = await ClassModel.findOne();
      if (defaultClass) resolvedClassId = defaultClass._id as mongoose.Types.ObjectId;
    }

    const item = await ClassWork.create({
      subject,
      topic,
      whatWasTaught,
      learningObjective,
      classroomActivity,
      worksheetUrl,
      homework,
      teacherRemark,
      photos: Array.isArray(photos) ? photos : photos ? [photos] : [],
      date: date ? new Date(date) : new Date(),
      classId: resolvedClassId,
      sectionId: sectionId && mongoose.Types.ObjectId.isValid(sectionId) ? new mongoose.Types.ObjectId(sectionId) : undefined,
      className: className || 'Class',
      sectionName: sectionName || 'A',
      teacherId: teacherId ? new mongoose.Types.ObjectId(teacherId) : undefined,
      teacherName,
    });

    // Notify parents in target class
    if (resolvedClassId) {
      try {
        const students = await Student.find({ classId: resolvedClassId }).select('parentId _id');
        for (const st of students) {
          if (st.parentId) {
            const p = await Parent.findById(st.parentId).select('userId');
            if (p && p.userId) {
              const notif = await Notification.create({
                recipient: p.userId,
                userId: p.userId,
                studentId: st._id,
                targetRole: 'Parent',
                title: `Today's Classwork: ${subject}`,
                message: `${subject}: ${topic || whatWasTaught.slice(0, 50)}... has been updated.`,
                type: 'classwork',
                priority: 'normal',
                link: '/parent/classwork',
                metadata: {
                  classworkId: item._id,
                  subject,
                  topic,
                  teacherName,
                },
              });
              emitToUser(p.userId.toString(), 'notification:new', notif);
            }
          }
        }
      } catch (notifErr) {}

      emitToClass(resolvedClassId.toString(), 'classwork:published', item);
    }

    emitToRole('Admin', 'classwork:published', item);

    res.status(201).json({
      success: true,
      message: 'Classwork logged and parents updated!',
      classWork: item,
    });
  } catch (error) {
    console.error('Error logging classwork:', error);
    res.status(400).json({ success: false, message: 'Failed to record classwork', error });
  }
};
