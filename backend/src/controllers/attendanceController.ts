import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Attendance from '../models/Attendance';
import { getIO } from '../socket';

// @desc    Get attendance records for a specific date
// @route   GET /api/attendance
export const getAttendance = async (req: Request, res: Response) => {
  try {
    const { date, entityType } = req.query;
    let query: Record<string, unknown> = {};
    
    if (date) {
      // Create date range for the specific day
      const queryDate = new Date(date as string);
      const nextDay = new Date(queryDate);
      nextDay.setDate(queryDate.getDate() + 1);
      
      query.date = {
        $gte: queryDate,
        $lt: nextDay
      };
    }
    
    if (entityType) {
      query.entityType = entityType;
    }

    // Role-based filtering for Parents
    if (req.user?.role === 'Parent') {
      const Student = require('../models/Student').default;
      const students = await Student.find({ parentId: req.user.id });
      const studentIds = students.map((s: { _id: mongoose.Types.ObjectId }) => s._id);
      query.entityId = { $in: studentIds };
      query.entityType = 'Student';
    }

    const attendance = await Attendance.find(query)
      .populate('entityId', 'firstName lastName grade name') // Works dynamically
      .populate('markedBy', 'firstName lastName');
      
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Mark attendance (bulk or single)
// @route   POST /api/attendance
export const markAttendance = async (req: Request, res: Response) => {
  try {
    const { records } = req.body; // Expecting array of { date, entityType, entityId, status, remarks }
    const markedById = req.user?.id; // From auth middleware

    if (!records || !Array.isArray(records)) {
      return res.status(400).json({ message: 'Records must be an array' });
    }

    // Upsert each record (update if exists for that day, else insert)
    const operations = records.map((record) => {
      // Normalize date to start of day
      const recordDate = new Date(record.date);
      recordDate.setHours(0, 0, 0, 0);

      return {
        updateOne: {
          filter: { 
            date: recordDate, 
            entityId: record.entityId, 
            entityType: record.entityType 
          },
          update: { 
            $set: { 
              status: record.status, 
              remarks: record.remarks,
              markedBy: markedById ? new mongoose.Types.ObjectId(markedById) : undefined
            } 
          },
          upsert: true
        }
      };
    });

    await Attendance.bulkWrite(operations);

    res.status(200).json({ message: 'Attendance marked successfully' });
  } catch (error) {
    console.error('Attendance error:', error);
    res.status(400).json({ message: 'Failed to mark attendance', error });
  }
};
