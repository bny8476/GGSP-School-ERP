import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Parent from '../models/Parent';
import Student from '../models/Student';
import StudentParent from '../models/StudentParent';

// Get all parents (Admin / Staff)
export const getParents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, page, limit } = req.query;
    let query: Record<string, any> = {};

    if (search) {
      const searchRegex = new RegExp(String(search).trim(), 'i');
      query.$or = [
        { fatherName: searchRegex },
        { motherName: searchRegex },
        { guardianName: searchRegex },
        { primaryEmail: searchRegex },
        { fatherContact: searchRegex },
      ];
    }

    if (page) {
      const pageNum = Math.max(1, Number(page));
      const limitNum = Math.max(1, Math.min(100, Number(limit) || 20));
      const skip = (pageNum - 1) * limitNum;

      const [parents, total] = await Promise.all([
        Parent.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
        Parent.countDocuments(query),
      ]);

      res.json({
        success: true,
        data: parents,
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      });
      return;
    }

    const parents = await Parent.find(query).sort({ createdAt: -1 }).limit(100);
    res.json(parents);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving parents', error });
  }
};

// Create a parent
export const createParent = async (req: Request, res: Response): Promise<void> => {
  try {
    const newParent = await Parent.create(req.body);
    res.status(201).json({ success: true, parent: newParent });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid parent data', error });
  }
};

// Get a single parent
export const getParentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawId = req.params.id;
    const parentId = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!parentId || !mongoose.Types.ObjectId.isValid(parentId)) {
      res.status(400).json({ success: false, message: 'Invalid parent ID format' });
      return;
    }

    const parent = await Parent.findById(parentId);
    if (!parent) {
      res.status(404).json({ success: false, message: 'Parent not found' });
      return;
    }

    const linkedRecords = await StudentParent.find({ parentId: parent._id }).select('studentId');
    const linkedStudentIds = linkedRecords.map((r) => r.studentId);
    const directStudents = await Student.find({ parentId: parent._id }).select('_id');
    const allStudentIds = [...new Set([...linkedStudentIds.map(String), ...directStudents.map((s) => String(s._id))])];

    const children = await Student.find({
      _id: { $in: allStudentIds.map((id) => new mongoose.Types.ObjectId(id)) },
    }).populate('classId', 'name').populate('sectionId', 'name');

    res.json({
      success: true,
      parent,
      students: children,
      children,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving parent', error });
  }
};

// Update a parent
export const updateParent = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawId = req.params.id;
    const parentId = Array.isArray(rawId) ? rawId[0] : rawId;
    const parent = await Parent.findByIdAndUpdate(parentId, req.body, { new: true, runValidators: true });
    if (!parent) {
      res.status(404).json({ success: false, message: 'Parent not found' });
      return;
    }
    res.json(parent);
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid parent data', error });
  }
};

// Get logged-in parent's profile with real linked children
export const getMyParentProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    let parent = await Parent.findOne({ userId: req.user.id });

    // If parent record doesn't exist yet for this user, attempt auto-create
    if (!parent) {
      const user = await mongoose.model('User').findById(req.user.id);
      if (user) {
        parent = await Parent.create({
          userId: user._id,
          fatherName: `${user.firstName} ${user.lastName}`,
          motherName: 'Mother',
          primaryEmail: user.email,
          address: 'Registered Address',
          fatherContact: user.phoneNumber || '',
        });
      }
    }

    if (!parent) {
      res.status(404).json({ success: false, message: 'Parent profile not linked to this account.' });
      return;
    }

    const linkedRecords = await StudentParent.find({ parentId: parent._id }).select('studentId');
    const linkedStudentIds = linkedRecords.map((r) => r.studentId);
    const directStudents = await Student.find({ parentId: parent._id }).select('_id');
    const allStudentIds = [...new Set([...linkedStudentIds.map(String), ...directStudents.map((s) => String(s._id))])];

    const children = await Student.find({
      _id: { $in: allStudentIds.map((id) => new mongoose.Types.ObjectId(id)) },
    })
      .populate('classId', 'name')
      .populate('sectionId', 'name');

    res.json({
      success: true,
      parent,
      children,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving parent profile', error });
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
      'address',
    ];
    const updates: Record<string, any> = {};
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const parent = await Parent.findOneAndUpdate(
      { userId: req.user?.id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!parent) {
      res.status(404).json({ success: false, message: 'Parent profile not found' });
      return;
    }

    res.json(parent);
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error updating parent profile', error });
  }
};
