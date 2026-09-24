import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Attendance from '../models/Attendance';
import StudentAttendance from '../models/StudentAttendance';
import Student from '../models/Student';
import Parent from '../models/Parent';
import StudentParent from '../models/StudentParent';
import User from '../models/User';
import Notification from '../models/Notification';
import ClassModel from '../models/Class';
import SectionModel from '../models/Section';
import { emitToClass, emitToUser, emitToRole } from '../socket';

// Helper to get parent user ID for a student
async function getParentUserIdForStudent(studentId: mongoose.Types.ObjectId): Promise<mongoose.Types.ObjectId | undefined> {
  const student = await Student.findById(studentId).select('parentId');
  if (student?.parentId) {
    const parent = await Parent.findById(student.parentId).select('userId');
    if (parent?.userId) return parent.userId;
  }

  const sp = await StudentParent.findOne({ studentId }).select('parentId');
  if (sp?.parentId) {
    const parent = await Parent.findById(sp.parentId).select('userId');
    if (parent?.userId) return parent.userId;
  }
  return undefined;
}

// @desc    Get attendance records for a specific date, class, or child
// @route   GET /api/attendance
export const getAttendance = async (req: Request, res: Response) => {
  try {
    const { date, entityType, childId, studentId, classId, sectionId } = req.query;
    let query: Record<string, any> = {};

    if (date) {
      const queryDate = new Date(date as string);
      const nextDay = new Date(queryDate);
      nextDay.setDate(queryDate.getDate() + 1);

      query.date = {
        $gte: queryDate,
        $lt: nextDay,
      };
    }

    const targetStudentId = (childId || studentId) as string;

    // Role-based filtering for Parents
    if (req.user?.role === 'Parent') {
      const parent = await Parent.findOne({ userId: req.user.id });
      if (!parent) {
        return res.json([]);
      }
      const linkedRecords = await StudentParent.find({ parentId: parent._id }).select('studentId');
      const linkedStudentIds = linkedRecords.map((r) => r.studentId.toString());
      const directStudents = await Student.find({ parentId: parent._id }).select('_id');
      const allStudentIds = [...new Set([...linkedStudentIds, ...directStudents.map((s) => s._id.toString())])];

      if (targetStudentId && !allStudentIds.includes(targetStudentId)) {
        return res.status(403).json({ success: false, message: 'Forbidden: You do not have permission to view this student.' });
      }

      query.studentId = targetStudentId
        ? new mongoose.Types.ObjectId(targetStudentId)
        : { $in: allStudentIds.map((id) => new mongoose.Types.ObjectId(id)) };
    } else {
      if (targetStudentId && mongoose.Types.ObjectId.isValid(targetStudentId)) {
        query.studentId = new mongoose.Types.ObjectId(targetStudentId);
      }
      if (classId && mongoose.Types.ObjectId.isValid(classId as string)) {
        query.classId = new mongoose.Types.ObjectId(classId as string);
      }
      if (sectionId && mongoose.Types.ObjectId.isValid(sectionId as string)) {
        query.sectionId = new mongoose.Types.ObjectId(sectionId as string);
      }
    }

    const records = await StudentAttendance.find(query)
      .populate('studentId', 'firstName lastName grade admissionNumber studentId')
      .populate('markedBy', 'firstName lastName')
      .sort({ date: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error fetching attendance', error });
  }
};

// @desc    Get today's attendance for a child
// @route   GET /api/attendance/today
export const getTodayAttendance = async (req: Request, res: Response) => {
  const childId = (req.query.childId || req.query.studentId) as string;

  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const query: Record<string, any> = {
      date: { $gte: todayStart, $lt: todayEnd },
    };

    if (childId && mongoose.Types.ObjectId.isValid(childId)) {
      query.studentId = new mongoose.Types.ObjectId(childId);
    }

    // Role-based authorization for Parents
    if (req.user?.role === 'Parent') {
      const parent = await Parent.findOne({ userId: req.user.id });
      if (parent) {
        const linkedRecords = await StudentParent.find({ parentId: parent._id }).select('studentId');
        const linkedStudentIds = linkedRecords.map((r) => String(r.studentId));
        const directStudents = await Student.find({ parentId: parent._id }).select('_id');
        const allStudentIds = [...new Set([...linkedStudentIds, ...directStudents.map((s) => String(s._id))])];

        if (childId && !allStudentIds.includes(childId)) {
          return res.status(403).json({ success: false, message: 'Access denied to this student record' });
        }
        if (!childId && allStudentIds.length > 0) {
          query.studentId = { $in: allStudentIds.map((id) => new mongoose.Types.ObjectId(id)) };
        }
      }
    }

    const record = await StudentAttendance.findOne(query)
      .populate('studentId', 'firstName lastName admissionNumber rollNumber grade studentId')
      .populate('markedBy', 'firstName lastName')
      .sort({ updatedAt: -1 });

    if (!record) {
      return res.json({
        recorded: false,
        status: 'Not Marked',
        date: new Date(),
        message: "Today's roll call has not been completed yet.",
      });
    }

    res.json({
      recorded: true,
      _id: record._id,
      studentId: record.studentId,
      studentName: record.studentName,
      academicYear: record.academicYear,
      className: record.className,
      sectionName: record.sectionName,
      date: record.date,
      status: record.status,
      checkInTime: record.checkInTime,
      absenceReason: record.absenceReason,
      teacherRemark: record.teacherRemark || record.remarks,
      teacherName: record.teacherName,
      timestamp: record.updatedAt || record.createdAt,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving today attendance', error });
  }
};

// @desc    Mark attendance (Teacher submits roll-call for class)
// @route   POST /api/attendance
export const markAttendance = async (req: Request, res: Response) => {
  try {
    const {
      date: rawDate,
      classId,
      sectionId,
      className: rawClassName,
      sectionName: rawSectionName,
      academicYear: rawAcademicYear,
      records,
    } = req.body;

    const markedById = req.user?.id;
    let teacherName = req.body.teacherName || 'Teacher';

    if (markedById && mongoose.Types.ObjectId.isValid(markedById)) {
      const u = await User.findById(markedById).select('firstName lastName');
      if (u) {
        teacherName = `${u.firstName || ''} ${u.lastName || ''}`.trim() || teacherName;
      }
    }

    if (!records || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ success: false, message: 'Records array is required and must not be empty' });
    }

    const recordDate = rawDate ? new Date(rawDate) : new Date();
    recordDate.setHours(0, 0, 0, 0);

    // Resolve class and section names
    let className = rawClassName;
    let sectionName = rawSectionName;
    if (classId && mongoose.Types.ObjectId.isValid(classId) && !className) {
      const cDoc = await ClassModel.findById(classId).select('name');
      if (cDoc) className = cDoc.name;
    }
    if (sectionId && mongoose.Types.ObjectId.isValid(sectionId) && !sectionName) {
      const sDoc = await SectionModel.findById(sectionId).select('name');
      if (sDoc) sectionName = sDoc.name;
    }

    const academicYear = rawAcademicYear || '2026-2027';
    const savedRecords: any[] = [];

    for (const record of records) {
      const studentId = record.studentId || record.entityId;
      if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
        continue;
      }

      const status = record.status || 'Present';
      const remarks = record.teacherRemark || record.remarks || '';
      const absenceReason = record.absenceReason || undefined;

      // 1. Fetch student info for real class/section and name if missing
      const studentDoc = await Student.findById(studentId).select('firstName lastName classId sectionId grade');
      if (!studentDoc) continue;

      const studentName = record.studentName || `${studentDoc.firstName} ${studentDoc.lastName}`.trim();
      const resolvedClassId = classId || studentDoc.classId;
      const resolvedSectionId = sectionId || studentDoc.sectionId;

      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const checkInTime = record.checkInTime || (status === 'Present' || status === 'Late' ? nowTime : undefined);

      // 2. Concurrency-safe atomic upsert in StudentAttendance
      const studentAttendanceDoc = await StudentAttendance.findOneAndUpdate(
        { studentId: new mongoose.Types.ObjectId(studentId), date: recordDate },
        {
          studentId: new mongoose.Types.ObjectId(studentId),
          studentName,
          classId: resolvedClassId,
          className: className || studentDoc.grade || 'Class',
          sectionId: resolvedSectionId,
          sectionName: sectionName || 'A',
          academicYear,
          date: recordDate,
          status,
          checkInTime: status === 'Late' || status === 'Present' ? checkInTime : undefined,
          absenceReason: status === 'Absent' ? absenceReason : undefined,
          teacherRemark: remarks,
          teacherId: markedById ? new mongoose.Types.ObjectId(markedById) : undefined,
          teacherName,
          markedBy: markedById ? new mongoose.Types.ObjectId(markedById) : undefined,
          remarks,
        },
        { upsert: true, new: true }
      );
      savedRecords.push(studentAttendanceDoc);

      // 3. Automated Parent Notification Trigger
      const parentUserId = await getParentUserIdForStudent(new mongoose.Types.ObjectId(studentId));
      const formattedDate = recordDate.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      if (parentUserId) {
        if (status === 'Absent') {
          const reasonClause = absenceReason ? ` Reason: ${absenceReason}.` : ' Please contact the school if this absence was unexpected.';
          const absenceMsg = `${studentName} was marked absent today (${formattedDate}).${reasonClause}`;

          const notif = await Notification.create({
            recipient: parentUserId,
            userId: parentUserId,
            studentId: new mongoose.Types.ObjectId(studentId),
            targetRole: 'Parent',
            title: 'Attendance Notice: Absent',
            message: absenceMsg,
            type: 'attendance',
            priority: 'high',
            link: '/parent/attendance',
            metadata: {
              studentId,
              status: 'Absent',
              date: recordDate,
              absenceReason,
              teacherName,
            },
          });

          emitToUser(parentUserId.toString(), 'notification:new', notif);
          emitToUser(parentUserId.toString(), 'attendance:updated', { studentId, status: 'Absent', date: recordDate });
        } else if (status === 'Late') {
          const lateMsg = `${studentName} arrived at ${checkInTime || 'School'} (Late).`;
          const notif = await Notification.create({
            recipient: parentUserId,
            userId: parentUserId,
            studentId: new mongoose.Types.ObjectId(studentId),
            targetRole: 'Parent',
            title: 'Late Arrival Notice',
            message: lateMsg,
            type: 'attendance',
            priority: 'normal',
            link: '/parent/attendance',
            metadata: {
              studentId,
              status: 'Late',
              arrivalTime: checkInTime,
              date: recordDate,
            },
          });

          emitToUser(parentUserId.toString(), 'notification:new', notif);
          emitToUser(parentUserId.toString(), 'attendance:updated', { studentId, status: 'Late', date: recordDate });
        } else if (status === 'Present') {
          emitToUser(parentUserId.toString(), 'attendance:updated', { studentId, status: 'Present', date: recordDate, checkInTime });
        }
        emitToUser(parentUserId.toString(), 'attendance:marked', {
          records: [studentAttendanceDoc],
          studentId,
          status,
          date: recordDate,
        });
      }

      // 4. Legacy Attendance Upsert for backwards compatibility
      await Attendance.findOneAndUpdate(
        { date: recordDate, entityId: new mongoose.Types.ObjectId(studentId), entityType: 'Student' },
        {
          $set: {
            status: status === 'Excused' ? 'Absent' : status,
            remarks: absenceReason ? `${absenceReason}${remarks ? ` - ${remarks}` : ''}` : remarks,
            markedBy: markedById ? new mongoose.Types.ObjectId(markedById) : undefined,
          },
        },
        { upsert: true }
      );
    }

    // 5. Scoped Real-Time Broadcast to Class
    if (classId) {
      emitToClass(classId.toString(), 'attendance:marked', {
        classId,
        sectionId,
        className,
        sectionName,
        date: recordDate,
        count: savedRecords.length,
      });
    }
    emitToRole('Admin', 'attendance:updated', { date: recordDate, count: savedRecords.length });

    res.status(200).json({
      success: true,
      message: 'Attendance register submitted & parents updated!',
      count: savedRecords.length,
      records: savedRecords,
    });
  } catch (error) {
    console.error('Attendance submit error:', error);
    res.status(400).json({ success: false, message: 'Failed to mark attendance', error });
  }
};
