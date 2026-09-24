import { Request, Response } from 'express';
import mongoose from 'mongoose';
import TeacherRemark from '../models/TeacherRemark';
import Student from '../models/Student';
import Parent from '../models/Parent';
import StudentParent from '../models/StudentParent';
import Notification from '../models/Notification';
import { emitToUser, emitToRoom } from '../socket';

// @desc    Get remarks for a specific child (Strict Parent Authorization)
// @route   GET /api/teacher-remarks/child/:childId
export const getChildRemarks = async (req: Request, res: Response) => {
  const rawChildId = req.params.childId;
  const childId = Array.isArray(rawChildId) ? rawChildId[0] : rawChildId;

  if (mongoose.connection.readyState !== 1) {
    return res.json([]);
  }

  try {
    // Security verification for Parents
    if (req.user?.role === 'Parent') {
      const parent = await Parent.findOne({ userId: req.user.id });
      if (parent) {
        const linked = await StudentParent.find({ parentId: parent._id }).select('studentId');
        const direct = await Student.find({ parentId: parent._id }).select('_id');
        const allowed = [...new Set([...linked.map((r) => String(r.studentId)), ...direct.map((d) => String(d._id))])];

        if (childId && !allowed.includes(String(childId))) {
          return res.status(403).json({ success: false, message: 'Access denied to this student’s teacher remarks' });
        }
      }
    }

    const query: Record<string, any> = {};
    if (childId && mongoose.Types.ObjectId.isValid(childId)) {
      query.studentId = new mongoose.Types.ObjectId(childId);
    }

    const list = await TeacherRemark.find(query).sort({ date: -1 }).limit(50);
    res.json(list || []);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch teacher remarks', error });
  }
};

// @desc    Create child-specific teacher remark (Teacher Portal)
// @route   POST /api/teacher-remarks
export const createRemark = async (req: Request, res: Response) => {
  try {
    const { studentId, studentName: rawStudentName, content, category, teacherName: rawTeacherName } = req.body;

    if (!studentId || !content) {
      return res.status(400).json({ success: false, message: 'studentId and content are required' });
    }

    const teacherId = req.user?.id;
    let teacherName = rawTeacherName || 'Teacher';
    if (teacherId && mongoose.Types.ObjectId.isValid(teacherId)) {
      try {
        const u = await mongoose.model('User').findById(teacherId).select('firstName lastName');
        if (u) teacherName = `${(u as any).firstName || ''} ${(u as any).lastName || ''}`.trim() || teacherName;
      } catch (err) {}
    }

    let studentName = rawStudentName;
    let parentUserId: mongoose.Types.ObjectId | undefined;

    if (studentId && mongoose.Types.ObjectId.isValid(studentId)) {
      const st = await Student.findById(studentId).select('firstName lastName parentId classId sectionId');
      if (st) {
        if (!studentName) studentName = `${st.firstName} ${st.lastName}`.trim();
        if (st.parentId) {
          const p = await Parent.findById(st.parentId).select('userId');
          if (p && p.userId) parentUserId = p.userId;
        }
        if (!parentUserId) {
          const sp = await StudentParent.findOne({ studentId: st._id }).select('parentId');
          if (sp && sp.parentId) {
            const p = await Parent.findById(sp.parentId).select('userId');
            if (p && p.userId) parentUserId = p.userId;
          }
        }
      }
    }

    const newRemark = await TeacherRemark.create({
      studentId: new mongoose.Types.ObjectId(studentId),
      studentName: studentName || 'Student',
      teacherId: teacherId && mongoose.Types.ObjectId.isValid(teacherId) ? new mongoose.Types.ObjectId(teacherId) : undefined,
      teacherName,
      content,
      category: category || 'Appreciation',
      date: new Date(),
    });

    // Notify Parent if parent user is linked
    if (parentUserId) {
      const notif = await Notification.create({
        recipient: parentUserId,
        userId: parentUserId,
        studentId: new mongoose.Types.ObjectId(studentId),
        targetRole: 'Parent',
        title: 'Teacher Update',
        message: `${teacherName} added a remark for ${studentName || 'your child'}: "${content.slice(0, 60)}${content.length > 60 ? '...' : ''}"`,
        type: 'remark',
        entityType: 'TeacherRemark',
        entityId: newRemark._id,
        priority: 'normal',
        link: '/parent',
        metadata: {
          remarkId: newRemark._id,
          studentId,
          studentName,
          teacherName,
          content,
        },
      });

      emitToUser(String(parentUserId), 'notification:new', notif);
      emitToUser(String(parentUserId), 'remark:added', newRemark);
    }

    emitToRoom(`student:${studentId}`, 'remark:added', newRemark);

    res.status(201).json({
      success: true,
      message: 'Teacher remark sent to parent successfully!',
      remark: newRemark,
    });
  } catch (error) {
    console.error('Error creating teacher remark:', error);
    res.status(400).json({ success: false, message: 'Failed to create teacher remark', error });
  }
};

// @desc    Parent replies to a teacher remark
// @route   POST /api/teacher-remarks/:id/reply
export const replyToRemark = async (req: Request, res: Response) => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    const { reply } = req.body;

    if (!reply || !reply.trim()) {
      return res.status(400).json({ success: false, message: 'Reply message cannot be empty' });
    }

    const remark = await TeacherRemark.findById(id);
    if (!remark) {
      return res.status(404).json({ success: false, message: 'Teacher remark not found' });
    }

    let parentName = 'Parent';
    if (req.user?.id) {
      const p = await Parent.findOne({ userId: req.user.id }).select('fatherName motherName');
      if (p) parentName = p.motherName || p.fatherName || 'Parent';
    }

    remark.parentReply = reply.trim();
    remark.parentRepliedAt = new Date();
    remark.parentName = parentName;
    remark.readByParent = true;
    await remark.save();

    if (remark.teacherId) {
      emitToUser(String(remark.teacherId), 'remark:replied', remark);
    }

    res.json({ success: true, message: 'Reply sent to teacher successfully!', remark });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to reply to teacher remark', error });
  }
};
