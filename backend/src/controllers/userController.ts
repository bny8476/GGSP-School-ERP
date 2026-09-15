import { Request, Response } from 'express';
import User from '../models/User';
import Role from '../models/Role';
import bcrypt from 'bcryptjs';

// @desc    Get all staff/users
// @route   GET /api/users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const userRole = req.user?.role;
    const isFullAccess = ['Admin', 'SuperAdmin', 'Principal'].includes(userRole || '');

    let query = User.find()
      .populate('role', 'name')
      .populate('teachingAssignments.classId', 'name')
      .populate('teachingAssignments.subjectId', 'name');

    if (!isFullAccess) {
      query = query.select('-passwordHash -salary -performanceNotes -qualification -experienceYears');
    } else {
      query = query.select('-passwordHash');
    }

    const users = await query;
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a staff member
// @route   POST /api/users
export const createUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, roleName, salary, designation, joinDate, qualification, experienceYears, performanceNotes, teachingAssignments } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Find or create role
    let role = await Role.findOne({ name: roleName || 'Teacher' });
    if (!role) {
      role = await Role.create({ name: roleName || 'Teacher', permissions: [] });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      firstName,
      lastName,
      email,
      passwordHash,
      role: role._id,
      salary,
      designation,
      qualification,
      experienceYears,
      performanceNotes,
      teachingAssignments,
      joinDate: joinDate ? new Date(joinDate) : undefined,
    });

    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  } catch (error) {
    res.status(400).json({ message: 'Invalid user data', error });
  }
};

// @desc    Update a user
// @route   PUT /api/users/:id
export const updateUser = async (req: Request, res: Response) => {
  try {
    const isSelf = req.user?.id === req.params.id;
    const isAdmin = req.user?.role === 'Admin' || req.user?.role === 'SuperAdmin';
    
    if (!isSelf && !isAdmin) {
      return res.status(403).json({ message: 'User not authorized to update this profile' });
    }

    const { firstName, lastName, email, phoneNumber, roleName, isActive, salary, designation, joinDate, qualification, experienceYears, performanceNotes, teachingAssignments } = req.body;
    
    // Everyone can update basic profile info
    const updates: Record<string, unknown> = { firstName, lastName, email };
    if (phoneNumber !== undefined) updates.phoneNumber = phoneNumber;
    if (designation !== undefined) updates.designation = designation;
    if (qualification !== undefined) updates.qualification = qualification;
    if (experienceYears !== undefined) updates.experienceYears = experienceYears;
    if (performanceNotes !== undefined) updates.performanceNotes = performanceNotes;
    
    // Only Admin/SuperAdmin can change roles and active status
    if (isAdmin) {
      if (isActive !== undefined) updates.isActive = isActive;
      if (roleName) {
        let role = await Role.findOne({ name: roleName });
        if (!role) role = await Role.create({ name: roleName, permissions: [] });
        updates.role = role._id;
      }
      if (salary !== undefined) updates.salary = salary;
      if (joinDate !== undefined) updates.joinDate = new Date(joinDate);
      if (teachingAssignments !== undefined) updates.teachingAssignments = teachingAssignments;
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true })
      .populate('role', 'name')
      .populate('teachingAssignments.classId', 'name')
      .populate('teachingAssignments.subjectId', 'name');
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error });
  }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
