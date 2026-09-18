import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Attendance from '../models/Attendance';
import StudentAttendance from '../models/StudentAttendance';
import EmployeeAttendance from '../models/EmployeeAttendance';
import Student from '../models/Student';
import Parent from '../models/Parent';
import StudentParent from '../models/StudentParent';
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

    // Role-based filtering for Parents (query both StudentParent and direct parentId)
    if (req.user?.role === 'Parent') {
      const parent = await Parent.findOne({ userId: req.user.id });
      if (!parent) {
        return res.json([]);
      }
      const linkedRecords = await StudentParent.find({ parentId: parent._id }).select('studentId');
      const linkedStudentIds = linkedRecords.map((r) => r.studentId);
      const directStudents = await Student.find({ parentId: parent._id }).select('_id');
      const allStudentIds = [...new Set([...linkedStudentIds.map(String), ...directStudents.map((s) => String(s._id))])];

      query.entityId = { $in: allStudentIds.map((id) => new mongoose.Types.ObjectId(id)) };
      query.entityType = 'Student';
    }

    const attendance = await Attendance.find(query)
      .populate('entityId', 'firstName lastName grade name classId sectionId')
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

    // Upsert each record into legacy Attendance
    const legacyOperations = records.map((record) => {
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

    await Attendance.bulkWrite(legacyOperations);

    // Non-blocking Relational Sync into domain collections
    try {
      for (const record of records) {
        const recordDate = new Date(record.date);
        recordDate.setHours(0, 0, 0, 0);

        if (record.entityType === 'Student') {
          const studentDoc = await Student.findById(record.entityId).select('classId sectionId');
          if (studentDoc && studentDoc.classId) {
            await StudentAttendance.findOneAndUpdate(
              { studentId: record.entityId, date: recordDate },
              {
                studentId: record.entityId,
                classId: studentDoc.classId,
                sectionId: studentDoc.sectionId,
                date: recordDate,
                status: record.status,
                remarks: record.remarks,
                markedBy: markedById ? new mongoose.Types.ObjectId(markedById) : undefined,
              },
              { upsert: true }
            );
          }
        } else if (record.entityType === 'User') {
          await EmployeeAttendance.findOneAndUpdate(
            { userId: record.entityId, date: recordDate },
            {
              userId: record.entityId,
              date: recordDate,
              status: record.status,
              remarks: record.remarks,
              markedBy: markedById ? new mongoose.Types.ObjectId(markedById) : undefined,
            },
            { upsert: true }
          );
        }
      }
    } catch (domainSyncErr) {
      console.warn('Domain attendance sync warning:', domainSyncErr);
    }

    res.status(200).json({ message: 'Attendance marked successfully' });
  } catch (error) {
    console.error('Attendance error:', error);
    res.status(400).json({ message: 'Failed to mark attendance', error });
  }
};
