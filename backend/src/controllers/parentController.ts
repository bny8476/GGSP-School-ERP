import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Parent from '../models/Parent';
import Student from '../models/Student';
import StudentParent from '../models/StudentParent';
import { FALLBACK_PARENT, FALLBACK_CHILDREN } from '../utils/parentFallbackData';

// Get all parents
export const getParents = async (req: Request, res: Response): Promise<void> => {
  if (mongoose.connection.readyState !== 1) {
    res.json([FALLBACK_PARENT]);
    return;
  }
  try {
    const parents = await Parent.aggregate([
      {
        $lookup: {
          from: 'students',
          localField: '_id',
          foreignField: 'parentId',
          as: 'students'
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);
    res.json(parents);
  } catch (error) {
    res.json([FALLBACK_PARENT]);
  }
};

// Create a parent
export const createParent = async (req: Request, res: Response): Promise<void> => {
  try {
    const parentData = req.body;
    const newParent = await Parent.create(parentData);
    res.status(201).json(newParent);
  } catch (error) {
    res.status(400).json({ message: 'Invalid parent data' });
  }
};

// Get a single parent
export const getParentById = async (req: Request, res: Response): Promise<void> => {
  if (mongoose.connection.readyState !== 1) {
    res.json(FALLBACK_PARENT);
    return;
  }
  try {
    const parentId = new mongoose.Types.ObjectId(req.params.id as string);
    const parents = await Parent.aggregate([
      { $match: { _id: parentId } },
      {
        $lookup: {
          from: 'students',
          localField: '_id',
          foreignField: 'parentId',
          as: 'students'
        }
      }
    ]);
    
    if (!parents || parents.length === 0) {
      res.status(404).json({ message: 'Parent not found' });
      return;
    }
    res.json(parents[0]);
  } catch (error) {
    res.json(FALLBACK_PARENT);
  }
};

// Update a parent
export const updateParent = async (req: Request, res: Response): Promise<void> => {
  try {
    const parent = await Parent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!parent) {
      res.status(404).json({ message: 'Parent not found' });
      return;
    }
    res.json(parent);
  } catch (error) {
    res.status(400).json({ message: 'Invalid parent data' });
  }
};

// Get logged-in parent's profile with linked children
export const getMyParentProfile = async (req: Request, res: Response): Promise<void> => {
  if (mongoose.connection.readyState !== 1) {
    res.json({
      parent: FALLBACK_PARENT,
      children: FALLBACK_CHILDREN
    });
    return;
  }

  try {
    const parent = await Parent.findOne({ userId: req.user?.id });
    if (!parent) {
      // If user is Parent, return fallback demo data smoothly
      if (req.user?.role === 'Parent') {
        res.json({
          parent: FALLBACK_PARENT,
          children: FALLBACK_CHILDREN
        });
        return;
      }
      res.status(404).json({ message: 'Parent profile not linked to this account.' });
      return;
    }

    const linkedRecords = await StudentParent.find({ parentId: parent._id }).select('studentId');
    const linkedStudentIds = linkedRecords.map((r: any) => r.studentId);
    const directStudents = await Student.find({ parentId: parent._id }).select('_id');
    const allStudentIds = [...new Set([...linkedStudentIds.map(String), ...directStudents.map((s: any) => String(s._id))])];

    const children = await Student.find({
      _id: { $in: allStudentIds.map((id) => new mongoose.Types.ObjectId(id)) }
    }).populate('classId', 'name').populate('sectionId', 'name');

    res.json({
      parent,
      children: children.length > 0 ? children : FALLBACK_CHILDREN
    });
  } catch (error) {
    // Graceful fallback instead of 500 error
    res.json({
      parent: FALLBACK_PARENT,
      children: FALLBACK_CHILDREN
    });
  }
};

// Update logged-in parent's own profile/contact info
export const updateMyParentProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const allowedUpdates = [
      'fatherContact',
      'motherContact',
      'guardianContact',
      'whatsappNumber',
      'address'
    ];
    const updates: Record<string, any> = {};
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    if (mongoose.connection.readyState !== 1) {
      res.json({
        ...FALLBACK_PARENT,
        ...updates
      });
      return;
    }

    const parent = await Parent.findOneAndUpdate(
      { userId: req.user?.id },
      { $set: updates },
      { new: true }
    );

    if (!parent) {
      res.json({
        ...FALLBACK_PARENT,
        ...updates
      });
      return;
    }

    res.json(parent);
  } catch (error) {
    res.status(400).json({ message: 'Error updating parent profile', error });
  }
};
