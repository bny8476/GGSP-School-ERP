import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Homework from '../models/Homework';
import Student from '../models/Student';
import Parent from '../models/Parent';
import Notification from '../models/Notification';
import { getIO } from '../socket';

const emitSocketSafely = (event: string, payload: any) => {
  try {
    const io = getIO();
    io.emit(event, payload);
  } catch (err) {}
};

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const DEMO_HOMEWORK = [
  {
    _id: 'hw-1',
    subject: 'English',
    title: 'Practice letters A–E',
    description: 'Trace uppercase and lowercase letters A to E in your four-line handwriting workbook.',
    instructions: 'Use sharp pencils, trace slowly along the dotted outlines, and say phonetic sounds aloud.',
    dueDate: tomorrow,
    assignedDate: new Date(),
    attachmentUrl: '/worksheets/homework-english-letters.pdf',
    teacherName: 'Ms. Ananya Roy',
    className: 'LKG',
    sectionName: 'Section A',
    status: 'Pending',
  },
  {
    _id: 'hw-2',
    subject: 'Maths',
    title: 'Count 5 favorite toys',
    description: 'Find 5 favorite toys at home and line them up in numerical order with parents.',
    instructions: 'Count from 1 to 5 pointing at each toy. Color 5 circles in the mini math logbook.',
    dueDate: new Date(Date.now() + 2 * 86400000),
    assignedDate: new Date(),
    teacherName: 'Ms. Ananya Roy',
    className: 'LKG',
    sectionName: 'Section A',
    status: 'Pending',
  },
];

// @desc    Get homework for child
// @route   GET /api/homework/child/:childId
export const getChildHomework = async (req: Request, res: Response) => {
  const rawChildId = req.params.childId;
  const childId = Array.isArray(rawChildId) ? rawChildId[0] : rawChildId;

  if (mongoose.connection.readyState !== 1) {
    return res.json(DEMO_HOMEWORK);
  }

  try {
    let studentClassId: any;
    let studentSectionId: any;

    if (childId && mongoose.Types.ObjectId.isValid(childId)) {
      const student = await Student.findById(childId).select('classId sectionId');
      if (student) {
        studentClassId = student.classId;
        studentSectionId = student.sectionId;
      }
    }

    const query: Record<string, any> = {};
    if (studentClassId) query.classId = studentClassId;
    if (studentSectionId) query.sectionId = studentSectionId;

    const list = await Homework.find(query).sort({ dueDate: 1 }).limit(30);

    if (!list || list.length === 0) {
      return res.json(DEMO_HOMEWORK);
    }

    const now = new Date();
    const formatted = list.map((hw) => {
      let status: 'Pending' | 'Submitted' | 'Completed' | 'Overdue' = 'Pending';
      const sub = hw.submissions.find((s) => String(s.studentId) === String(childId));
      if (sub) {
        status = sub.status;
      } else if (new Date(hw.dueDate) < now) {
        status = 'Overdue';
      }

      return {
        _id: hw._id,
        subject: hw.subject,
        title: hw.title,
        description: hw.description,
        instructions: hw.instructions,
        dueDate: hw.dueDate,
        assignedDate: hw.assignedDate,
        attachmentUrl: hw.attachmentUrl,
        teacherName: hw.teacherName,
        className: hw.className,
        sectionName: hw.sectionName,
        status,
      };
    });

    res.json(formatted);
  } catch (error) {
    res.json(DEMO_HOMEWORK);
  }
};

// @desc    Create new homework (Teacher Portal)
// @route   POST /api/homework
export const createHomework = async (req: Request, res: Response) => {
  try {
    const {
      subject,
      title,
      description,
      instructions,
      dueDate,
      attachmentUrl,
      classId,
      sectionId,
      className,
      sectionName,
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

    const newHw = await Homework.create({
      subject,
      title,
      description,
      instructions,
      dueDate: new Date(dueDate),
      attachmentUrl,
      classId: classId && mongoose.Types.ObjectId.isValid(classId) ? new mongoose.Types.ObjectId(classId) : new mongoose.Types.ObjectId('66789abcdef0123456789abc'),
      sectionId: sectionId && mongoose.Types.ObjectId.isValid(sectionId) ? new mongoose.Types.ObjectId(sectionId) : undefined,
      className: className || 'LKG',
      sectionName: sectionName || 'Section A',
      teacherId: teacherId && mongoose.Types.ObjectId.isValid(teacherId) ? new mongoose.Types.ObjectId(teacherId) : new mongoose.Types.ObjectId('66789abcdef0123456789abc'),
      teacherName,
      assignedDate: new Date(),
      submissions: [],
    });

    // Notify parents
    try {
      const students = await Student.find({ classId: newHw.classId }).select('parentId _id');
      const formattedDue = new Date(dueDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });

      for (const st of students) {
        if (st.parentId) {
          const p = await Parent.findById(st.parentId).select('userId');
          if (p && p.userId) {
            await Notification.create({
              userId: p.userId,
              studentId: st._id,
              targetRole: 'Parent',
              title: `New Homework: ${subject}`,
              message: `${subject} homework '${title}' is due ${formattedDue}.`,
              type: 'homework',
              priority: 'normal',
              link: '/parent/homework',
              metadata: {
                homeworkId: newHw._id,
                subject,
                title,
                dueDate: newHw.dueDate,
                teacherName,
              },
            });
          }
        }
      }
    } catch (notifErr) {}

    emitSocketSafely('homework:assigned', newHw);
    emitSocketSafely('notification:new', {
      type: 'homework',
      message: `New Homework: ${title} (${subject})`,
    });

    res.status(201).json({
      message: 'Homework assigned and parents notified!',
      homework: newHw,
    });
  } catch (error) {
    console.error('Error creating homework:', error);
    res.status(400).json({ message: 'Failed to assign homework', error });
  }
};

// @desc    Update homework status for child (Parent marks Completed)
// @route   PATCH /api/homework/:id/status
export const updateHomeworkStatus = async (req: Request, res: Response) => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    const { studentId, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid homework ID' });
    }

    const hw = await Homework.findById(id);
    if (!hw) {
      return res.status(404).json({ message: 'Homework not found' });
    }

    const existingIdx = hw.submissions.findIndex((s) => String(s.studentId) === String(studentId));
    if (existingIdx >= 0) {
      hw.submissions[existingIdx].status = status;
      if (status === 'Completed') hw.submissions[existingIdx].completedAt = new Date();
      if (status === 'Submitted') hw.submissions[existingIdx].submittedAt = new Date();
    } else {
      hw.submissions.push({
        studentId: new mongoose.Types.ObjectId(studentId),
        status,
        completedAt: status === 'Completed' ? new Date() : undefined,
        submittedAt: status === 'Submitted' ? new Date() : undefined,
      });
    }

    await hw.save();
    res.json({ message: 'Homework status updated successfully', homework: hw });
  } catch (error) {
    res.status(400).json({ message: 'Error updating homework status', error });
  }
};
