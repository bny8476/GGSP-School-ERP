import { Request, Response } from 'express';
import mongoose from 'mongoose';
import ClassroomActivity from '../models/ClassroomActivity';
import Notification from '../models/Notification';
import Student from '../models/Student';
import Parent from '../models/Parent';
import { getIO } from '../socket';

const emitSocketSafely = (event: string, payload: any) => {
  try {
    const io = getIO();
    io.emit(event, payload);
  } catch (err) {}
};

const DEMO_ACTIVITIES = [
  {
    _id: 'act-1',
    category: 'Art & Craft',
    title: 'Rainbow Drawing Activity',
    description: 'Children dipped sponge rollers into vibrant watercolor paints to create radiant rainbow arches and fluffy cotton cloud textures.',
    icon: '🎨',
    photos: ['https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&auto=format&fit=crop'],
    teacherName: 'Ms. Ananya Roy',
    date: new Date(),
    className: 'LKG',
    sectionName: 'Section A',
  },
  {
    _id: 'act-2',
    category: 'Story Time',
    title: 'The Little Seed',
    description: 'An engaging interactive puppet theater narration illustrating plant life cycles, sunlight, rain, and blooming flowers.',
    icon: '📚',
    photos: ['https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600&auto=format&fit=crop'],
    teacherName: 'Ms. Ananya Roy',
    date: new Date(),
    className: 'LKG',
    sectionName: 'Section A',
  },
  {
    _id: 'act-3',
    category: 'Rhymes',
    title: 'Twinkle Twinkle Little Star',
    description: 'Musical rhythm session featuring handheld star wands, clapping beats, and melodic vocal singing in unison.',
    icon: '🎵',
    photos: ['https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop'],
    teacherName: 'Ms. Ananya Roy',
    date: new Date(),
    className: 'LKG',
    sectionName: 'Section A',
  },
];

// @desc    Get today's classroom activities
// @route   GET /api/activities/today
export const getTodayActivities = async (req: Request, res: Response) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json(DEMO_ACTIVITIES);
  }

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
    if (!items || items.length === 0) {
      return res.json(DEMO_ACTIVITIES);
    }

    res.json(items);
  } catch (error) {
    res.json(DEMO_ACTIVITIES);
  }
};

// @desc    Publish new classroom activity (Teacher Portal)
// @route   POST /api/activities
export const createActivity = async (req: Request, res: Response) => {
  try {
    const {
      classId,
      sectionId,
      className,
      sectionName,
      title,
      category,
      description,
      icon,
      photos,
      date,
      teacherName: rawTeacherName,
    } = req.body;

    const teacherId = req.user?.id;
    let teacherName = rawTeacherName || 'Ms. Ananya Roy';
    if (teacherId && mongoose.Types.ObjectId.isValid(teacherId)) {
      try {
        const u = await mongoose.model('User').findById(teacherId).select('firstName lastName');
        if (u) teacherName = `${(u as any).firstName || ''} ${(u as any).lastName || ''}`.trim() || teacherName;
      } catch (err) {}
    }

    // Default icon map
    const iconMap: Record<string, string> = {
      'Art & Craft': '🎨',
      'Story Time': '📚',
      'Rhymes': '🎵',
      'Drawing': '✏️',
      'Writing': '📝',
      'Games': '🎲',
      'Songs': '🎶',
      'Worksheets': '📋',
      'Outdoor Activity': '⚽',
      'Classroom Celebration': '🎉',
    };

    const newActivity = await ClassroomActivity.create({
      classId: classId && mongoose.Types.ObjectId.isValid(classId) ? new mongoose.Types.ObjectId(classId) : new mongoose.Types.ObjectId('66789abcdef0123456789abc'),
      sectionId: sectionId && mongoose.Types.ObjectId.isValid(sectionId) ? new mongoose.Types.ObjectId(sectionId) : undefined,
      className: className || 'LKG',
      sectionName: sectionName || 'Section A',
      title,
      category: category || 'Art & Craft',
      description,
      icon: icon || iconMap[category] || '✨',
      photos: Array.isArray(photos) ? photos : [],
      teacherId: teacherId && mongoose.Types.ObjectId.isValid(teacherId) ? new mongoose.Types.ObjectId(teacherId) : undefined,
      teacherName,
      date: date ? new Date(date) : new Date(),
    });

    // Notify parents
    try {
      let queryStudent: any = {};
      if (classId && mongoose.Types.ObjectId.isValid(classId)) {
        queryStudent.classId = new mongoose.Types.ObjectId(classId);
      }
      const students = await Student.find(queryStudent).select('parentId _id');
      for (const st of students) {
        if (st.parentId) {
          const p = await Parent.findById(st.parentId).select('userId');
          if (p && p.userId) {
            await Notification.create({
              userId: p.userId,
              studentId: st._id,
              targetRole: 'Parent',
              title: `New Activity: ${title}`,
              message: `${category} activity published: "${title}"`,
              type: 'activity',
              priority: 'normal',
              link: '/parent/activities',
              metadata: {
                activityId: newActivity._id,
                category,
                title,
                teacherName,
              },
            });
          }
        }
      }
    } catch (notifErr) {}

    emitSocketSafely('activity:published', newActivity);
    emitSocketSafely('notification:new', {
      type: 'activity',
      message: `New activity published: ${title}`,
    });

    res.status(201).json({
      message: 'Classroom activity published successfully!',
      activity: newActivity,
    });
  } catch (error) {
    console.error('Error creating activity:', error);
    res.status(400).json({ message: 'Failed to create activity', error });
  }
};

// @desc    Get all activities history
// @route   GET /api/activities
export const getAllActivities = async (req: Request, res: Response) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json(DEMO_ACTIVITIES);
  }
  try {
    const list = await ClassroomActivity.find({}).sort({ date: -1 }).limit(60);
    res.json(list.length > 0 ? list : DEMO_ACTIVITIES);
  } catch (err) {
    res.json(DEMO_ACTIVITIES);
  }
};
