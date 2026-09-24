import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Assessment from '../models/Assessment';
import Parent from '../models/Parent';
import StudentParent from '../models/StudentParent';
import Student from '../models/Student';
import Notification from '../models/Notification';
import { emitToUser, emitToRoom } from '../socket';

// @desc    Get all assessments
// @route   GET /api/assessments
// @access  Private
export const getAssessments = async (req: Request, res: Response) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(200).json([]);
  }

  try {
    let query: Record<string, any> = {};

    if (req.user?.role === 'Parent') {
      const parent = await Parent.findOne({ userId: req.user.id });
      if (!parent) {
        return res.status(200).json([]);
      }

      const linkedRecords = await StudentParent.find({ parentId: parent._id }).select('studentId');
      const linkedStudentIds = linkedRecords.map((r) => r.studentId);
      const directStudents = await Student.find({ parentId: parent._id }).select('_id');
      const allStudentIds = [...new Set([...linkedStudentIds.map(String), ...directStudents.map((s) => String(s._id))])];

      query.childId = { $in: allStudentIds.map((id) => new mongoose.Types.ObjectId(id)) };
    }

    const { childId, grade, term } = req.query;
    if (childId && mongoose.Types.ObjectId.isValid(childId as string)) {
      query.childId = new mongoose.Types.ObjectId(childId as string);
    }
    if (grade) {
      query.grade = grade;
    }
    if (term) {
      query.term = term;
    }

    const assessments = await Assessment.find(query)
      .sort({ date: -1, createdAt: -1 })
      .populate('childId', 'firstName lastName grade studentId rollNumber')
      .populate('createdBy', 'firstName lastName role');

    res.status(200).json(assessments || []);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error fetching assessments', error });
  }
};

// @desc    Create an assessment
// @route   POST /api/assessments
// @access  Private (Teacher/Admin)
export const createAssessment = async (req: Request, res: Response) => {
  try {
    const createdBy = req.user?.id;
    if (!createdBy) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const { childId, subject, score, maxScore, term, remarks, title, overallGrade } = req.body;

    if (!childId) {
      return res.status(400).json({ success: false, message: 'childId is required' });
    }

    const assessment = await Assessment.create({
      childId: new mongoose.Types.ObjectId(childId),
      subject: subject || 'General',
      score: Number(score) || 0,
      maxScore: Number(maxScore) || 100,
      term: term || 'Term 1',
      title: title || `${subject || 'Assessment'} - ${term || 'Term 1'}`,
      overallGrade,
      remarks,
      createdBy: new mongoose.Types.ObjectId(createdBy),
      date: new Date(),
    });

    const populated = await Assessment.findById(assessment._id)
      .populate('childId', 'firstName lastName grade studentId')
      .populate('createdBy', 'firstName lastName');

    // Notify parent if student has a linked parent
    try {
      const student = await Student.findById(childId).select('firstName lastName parentId');
      if (student && student.parentId) {
        const parent = await Parent.findById(student.parentId).select('userId');
        if (parent && parent.userId) {
          const notif = await Notification.create({
            recipient: parent.userId,
            userId: parent.userId,
            studentId: student._id,
            targetRole: 'Parent',
            title: 'New Assessment Result',
            message: `Assessment score published for ${student.firstName}: ${subject} (${score}/${maxScore})`,
            type: 'academic',
            entityType: 'Assessment',
            entityId: assessment._id,
            priority: 'normal',
            link: '/parent',
          });
          emitToUser(String(parent.userId), 'notification:new', notif);
          emitToUser(String(parent.userId), 'assessment:published', populated);
        }
      }
      emitToRoom(`student:${childId}`, 'assessment:published', populated);
    } catch (notifErr) {
      console.warn('Could not dispatch assessment notification:', notifErr);
    }

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid assessment data', error });
  }
};
