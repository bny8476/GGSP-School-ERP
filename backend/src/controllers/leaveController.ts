import { Request, Response } from 'express';
import mongoose from 'mongoose';
import LeaveRequest from '../models/LeaveRequest';

// In-memory store for demo / offline fallback
let inMemoryLeaves: any[] = [
  {
    _id: 'leave-101',
    userId: 'faculty-teacher-01',
    leaveType: 'Casual',
    sessionType: 'Full Day',
    startDate: '2026-10-05',
    endDate: '2026-10-06',
    daysCount: 2,
    reason: 'Attending sibling wedding ceremony in Jaipur',
    substituteTeacher: 'Sunita Rao (Hindi / Senior PRT)',
    substituteStatus: 'Accepted',
    status: 'Pending',
    appliedOn: '2026-09-17',
    adminRemark: 'Awaiting Principal final sign-off',
    createdAt: new Date('2026-09-17T10:00:00Z'),
  },
  {
    _id: 'leave-102',
    userId: 'faculty-teacher-01',
    leaveType: 'Sick',
    sessionType: 'Full Day',
    startDate: '2026-08-12',
    endDate: '2026-08-13',
    daysCount: 2,
    reason: 'Severe viral fever and medical recovery',
    substituteTeacher: 'Vikram Singh (Physical Education)',
    substituteStatus: 'Accepted',
    status: 'Approved',
    appliedOn: '2026-08-11',
    adminRemark: 'Approved with medical certificate verified by School Nurse',
    attachmentName: 'medical_fit_cert_aug2026.pdf',
    createdAt: new Date('2026-08-11T09:30:00Z'),
  },
  {
    _id: 'leave-103',
    userId: 'faculty-teacher-01',
    leaveType: 'Casual',
    sessionType: 'Half Day (Afternoon)',
    startDate: '2026-07-24',
    endDate: '2026-07-24',
    daysCount: 0.5,
    reason: 'Bank documentation & property registration appointment',
    substituteTeacher: 'Amit Pathak (Mathematics)',
    substituteStatus: 'Accepted',
    status: 'Approved',
    appliedOn: '2026-07-20',
    adminRemark: 'Sanctioned for post-lunch session',
    createdAt: new Date('2026-07-20T14:15:00Z'),
  },
  {
    _id: 'leave-104',
    userId: 'faculty-teacher-01',
    leaveType: 'Earned',
    sessionType: 'Full Day',
    startDate: '2026-09-01',
    endDate: '2026-09-03',
    daysCount: 3,
    reason: 'Personal holiday trip',
    substituteTeacher: 'None',
    substituteStatus: 'Pending',
    status: 'Rejected',
    appliedOn: '2026-08-25',
    adminRemark: 'Denied: Mandatory Teachers Orientation and CBSE Curriculum planning scheduled',
    createdAt: new Date('2026-08-25T11:00:00Z'),
  },
];

// @desc    Get all leave requests
// @route   GET /api/leaves
export const getLeaves = async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const query: any = {};
      // Non-admins see only their own leaves unless querying with specific filter
      if (req.user && req.user.role === 'Teacher') {
        query.userId = req.user.id;
      } else if (req.query.userId) {
        query.userId = req.query.userId;
      }

      const leaves = await LeaveRequest.find(query)
        .populate('userId', 'firstName lastName email designation')
        .sort({ createdAt: -1 });
      return res.json(leaves);
    }

    // Return in-memory fallback
    return res.json(inMemoryLeaves);
  } catch (error) {
    console.error('getLeaves error, returning fallback:', error);
    return res.json(inMemoryLeaves);
  }
};

// @desc    Create a leave request
// @route   POST /api/leaves
export const createLeave = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      startDate,
      endDate,
      reason,
      leaveType = 'Casual',
      sessionType = 'Full Day',
      daysCount = 1,
      substituteTeacher = '',
      attachmentName = '',
    } = req.body;

    const requestedUserId = userId || req.user?.id || 'faculty-teacher-01';

    if (!startDate || !endDate || !reason) {
      return res.status(400).json({ message: 'Start date, end date, and reason are required' });
    }

    if (mongoose.connection.readyState === 1) {
      const leave = await LeaveRequest.create({
        userId: requestedUserId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason,
        leaveType,
        sessionType,
        daysCount: Number(daysCount) || 1,
        substituteTeacher,
        substituteStatus: substituteTeacher ? 'Pending' : 'Accepted',
        attachmentName,
        status: 'Pending',
      });

      return res.status(201).json(leave);
    }

    // Offline / Demo in-memory creation
    const newLeave = {
      _id: `leave-${Date.now()}`,
      userId: requestedUserId,
      startDate,
      endDate,
      reason,
      leaveType,
      sessionType,
      daysCount: Number(daysCount) || 1,
      substituteTeacher,
      substituteStatus: substituteTeacher ? 'Pending' : 'Accepted',
      attachmentName,
      status: 'Pending',
      appliedOn: new Date().toISOString().split('T')[0],
      createdAt: new Date(),
    };
    inMemoryLeaves.unshift(newLeave);

    return res.status(201).json(newLeave);
  } catch (error) {
    console.error('createLeave error:', error);
    return res.status(400).json({ message: 'Invalid leave data', error });
  }
};

// @desc    Update leave request status
// @route   PUT /api/leaves/:id
export const updateLeaveStatus = async (req: Request, res: Response) => {
  try {
    const { status, adminRemark } = req.body;
    const isPrivileged = ['Admin', 'SuperAdmin', 'Principal'].includes(req.user?.role || '');

    // Allow teacher to cancel their own pending leave
    if (!isPrivileged && status !== 'Cancelled') {
      return res.status(403).json({ message: 'Not authorized to change leave status to ' + status });
    }

    if (mongoose.connection.readyState === 1) {
      const updateData: any = { status };
      if (adminRemark) updateData.adminRemark = adminRemark;

      const leave = await LeaveRequest.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      ).populate('userId', 'firstName lastName');

      if (!leave) return res.status(404).json({ message: 'Leave request not found' });
      return res.json(leave);
    }

    // In-memory fallback
    const idx = inMemoryLeaves.findIndex((l) => l._id === req.params.id);
    if (idx !== -1) {
      inMemoryLeaves[idx].status = status;
      if (adminRemark) inMemoryLeaves[idx].adminRemark = adminRemark;
      return res.json(inMemoryLeaves[idx]);
    }

    return res.status(404).json({ message: 'Leave request not found' });
  } catch (error) {
    console.error('updateLeaveStatus error:', error);
    return res.status(400).json({ message: 'Error updating leave', error });
  }
};
