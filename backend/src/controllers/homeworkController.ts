import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Homework from '../models/Homework';
import Student from '../models/Student';
import Parent from '../models/Parent';
import User from '../models/User';
import ClassModel from '../models/Class';
import SectionModel from '../models/Section';
import Notification from '../models/Notification';
import { emitToClass, emitToUser, emitToRole } from '../socket';

// @desc    Get homework for child or class
// @route   GET /api/homework/child/:childId / GET /api/homework
export const getChildHomework = async (req: Request, res: Response) => {
  try {
    const rawChildId = req.params.childId || req.query.childId;
    const childId = Array.isArray(rawChildId) ? rawChildId[0] : rawChildId;

    let studentClassId: any;
    let studentSectionId: any;

    if (childId && mongoose.Types.ObjectId.isValid(childId as string)) {
      const student = await Student.findById(childId as string).select('classId sectionId');
      if (student) {
        studentClassId = student.classId;
        studentSectionId = student.sectionId;
      }
    }

    const query: Record<string, any> = {};
    if (studentClassId) query.classId = studentClassId;
    if (studentSectionId) query.sectionId = studentSectionId;

    const list = await Homework.find(query).sort({ dueDate: 1 }).limit(50);

    const now = new Date();
    const formatted = list.map((hw) => {
      let status: 'Pending' | 'Submitted' | 'Completed' | 'Overdue' = 'Pending';
      if (childId) {
        const sub = hw.submissions.find((s) => String(s.studentId) === String(childId));
        if (sub) {
          status = sub.status;
        } else if (new Date(hw.dueDate) < now) {
          status = 'Overdue';
        }
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
    res.status(500).json({ success: false, message: 'Server Error fetching homework', error });
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
      className: rawClassName,
      sectionName: rawSectionName,
      teacherName: rawTeacherName,
    } = req.body;

    if (!subject || !title || !dueDate) {
      return res.status(400).json({ success: false, message: 'Subject, title, and due date are required' });
    }

    const teacherId = req.user?.id;
    let teacherName = rawTeacherName || 'Teacher';
    if (teacherId && mongoose.Types.ObjectId.isValid(teacherId)) {
      const u = await User.findById(teacherId).select('firstName lastName');
      if (u) {
        teacherName = `${u.firstName || ''} ${u.lastName || ''}`.trim() || teacherName;
      }
    }

    // Resolve class and section names
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

    const newHw = await Homework.create({
      subject,
      title,
      description,
      instructions,
      dueDate: new Date(dueDate),
      attachmentUrl,
      classId: resolvedClassId,
      sectionId: sectionId && mongoose.Types.ObjectId.isValid(sectionId) ? new mongoose.Types.ObjectId(sectionId) : undefined,
      className: className || 'Class',
      sectionName: sectionName || 'A',
      teacherId: teacherId ? new mongoose.Types.ObjectId(teacherId) : undefined,
      teacherName,
      assignedDate: new Date(),
      submissions: [],
    });

    // Notify parents in target class
    if (resolvedClassId) {
      try {
        const students = await Student.find({ classId: resolvedClassId }).select('parentId _id');
        const formattedDue = new Date(dueDate).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });

        for (const st of students) {
          if (st.parentId) {
            const p = await Parent.findById(st.parentId).select('userId');
            if (p && p.userId) {
              const notif = await Notification.create({
                recipient: p.userId,
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
              emitToUser(p.userId.toString(), 'notification:new', notif);
            }
          }
        }
      } catch (notifErr) {}

      emitToClass(resolvedClassId.toString(), 'homework:published', newHw);
    }

    emitToRole('Admin', 'homework:published', newHw);

    res.status(201).json({
      success: true,
      message: 'Homework assigned and parents notified!',
      homework: newHw,
    });
  } catch (error) {
    console.error('Error creating homework:', error);
    res.status(400).json({ success: false, message: 'Failed to assign homework', error });
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
      return res.status(400).json({ success: false, message: 'Invalid homework ID' });
    }

    const hw = await Homework.findById(id);
    if (!hw) {
      return res.status(404).json({ success: false, message: 'Homework not found' });
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
    res.json({ success: true, message: 'Homework status updated successfully', homework: hw });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error updating homework status', error });
  }
};
