import { Request, Response } from 'express';
import mongoose from 'mongoose';
import ClassroomActivity from '../models/ClassroomActivity';
import Notification from '../models/Notification';
import Student from '../models/Student';
import Parent from '../models/Parent';
import User from '../models/User';
import ClassModel from '../models/Class';
import { emitToClass, emitToRole, emitToUser } from '../socket';

// @desc    Get today's classroom activities
// @route   GET /api/activities/today
export const getTodayActivities = async (req: Request, res: Response) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const query: Record<string, any> = {
      date: { $gte: todayStart, $lt: todayEnd },
    };

    const { classId, sectionId, childId } = req.query;
    if (classId && mongoose.Types.ObjectId.isValid(classId as string)) {
      query.classId = new mongoose.Types.ObjectId(classId as string);
    }
    if (sectionId && mongoose.Types.ObjectId.isValid(sectionId as string)) {
      query.sectionId = new mongoose.Types.ObjectId(sectionId as string);
    }
    if (childId && mongoose.Types.ObjectId.isValid(childId as string)) {
      const student = await Student.findById(childId as string).select('classId sectionId');
      if (student && student.classId) {
        query.classId = student.classId;
      }
    }

    const items = await ClassroomActivity.find(query).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error fetching activities', error });
  }
};

// @desc    Get all classroom activities (with pagination/filters)
// @route   GET /api/activities
export const getAllActivities = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 30;
    const skip = (page - 1) * limit;

    const query: Record<string, any> = {};
    const { classId, sectionId, category } = req.query;

    if (classId && mongoose.Types.ObjectId.isValid(classId as string)) {
      query.classId = new mongoose.Types.ObjectId(classId as string);
    }
    if (sectionId && mongoose.Types.ObjectId.isValid(sectionId as string)) {
      query.sectionId = new mongoose.Types.ObjectId(sectionId as string);
    }
    if (category) {
      query.category = category;
    }

    const [activities, total] = await Promise.all([
      ClassroomActivity.find(query).sort({ date: -1, createdAt: -1 }).skip(skip).limit(limit),
      ClassroomActivity.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: activities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error fetching activities', error });
  }
};

// @desc    Publish new classroom activity (Teacher Portal)
// @route   POST /api/activities
export const createActivity = async (req: Request, res: Response) => {
  try {
    const {
      category,
      title,
      description,
      icon,
      photos,
      date,
      classId,
      sectionId,
      className: rawClassName,
      sectionName: rawSectionName,
      teacherName: rawTeacherName,
    } = req.body;

    if (!category || !title) {
      return res.status(400).json({ success: false, message: 'Category and title are required' });
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

    const activity = await ClassroomActivity.create({
      category,
      title,
      description,
      icon: icon || '🎨',
      photos: Array.isArray(photos) ? photos : photos ? [photos] : [],
      date: date ? new Date(date) : new Date(),
      classId: resolvedClassId,
      sectionId: sectionId && mongoose.Types.ObjectId.isValid(sectionId) ? new mongoose.Types.ObjectId(sectionId) : undefined,
      className: className || 'Class',
      sectionName: sectionName || 'A',
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
                title: `New Classroom Activity: ${title}`,
                message: `Ms./Mr. ${teacherName} posted a new activity (${category}): '${title}'.`,
                type: 'activity',
                priority: 'normal',
                link: '/parent/activities',
                metadata: {
                  activityId: activity._id,
                  category,
                  title,
                  teacherName,
                },
              });
              emitToUser(p.userId.toString(), 'notification:new', notif);
            }
          }
        }
      } catch (notifErr) {}

      emitToClass(resolvedClassId.toString(), 'activity:published', activity);
    }

    emitToRole('Admin', 'activity:published', activity);

    res.status(201).json({
      success: true,
      message: 'Classroom activity published successfully!',
      activity,
    });
  } catch (error) {
    console.error('Error creating activity:', error);
    res.status(400).json({ success: false, message: 'Failed to create activity', error });
  }
};
