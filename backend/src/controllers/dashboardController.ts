import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Student from '../models/Student';
import Admission from '../models/Admission';
import Fee from '../models/Fee';
import Attendance from '../models/Attendance';
import Event from '../models/Event';
import User from '../models/User';
import Parent from '../models/Parent';
import StudentParent from '../models/StudentParent';
import DayCareLog from '../models/DayCareLog';
import Album from '../models/Album';
import DailyDiary from '../models/DailyDiary';
import Assessment from '../models/Assessment';
import TimeTable from '../models/TimeTable';
import AuditLog from '../models/AuditLog';

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  const role = (req.user?.role || '').toLowerCase();

  if (mongoose.connection.readyState !== 1) {
    res.json({
      isParentPortal: role === 'parent',
      isTeacherPortal: role === 'teacher',
      message: 'Database unavailable',
    });
    return;
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // ==========================================
    // PARENT PORTAL LOGIC
    // ==========================================
    if (req.user?.role === 'Parent') {
      const parent = await Parent.findOne({ userId: req.user.id });
      if (!parent) {
        res.json({
          isParentPortal: true,
          isTeacherPortal: false,
          myChildren: [],
          feesDue: [],
          recentAttendance: [],
          upcomingEvents: [],
          recentDaycareLogs: [],
          recentAlbums: [],
        });
        return;
      }

      const linkedRecords = await StudentParent.find({ parentId: parent._id }).select('studentId');
      const linkedStudentIds = linkedRecords.map((r) => r.studentId);
      const directStudents = await Student.find({ parentId: parent._id }).select('_id');
      const childrenIds = [...new Set([...linkedStudentIds.map(String), ...directStudents.map((s) => String(s._id))])].map(
        (id) => new mongoose.Types.ObjectId(id)
      );

      const [myChildren, feesDue, recentAttendance, upcomingEvents, recentDaycareLogs, recentAlbums] =
        await Promise.all([
          Student.find({ _id: { $in: childrenIds } }).sort({ firstName: 1 }),
          Fee.find({
            studentId: { $in: childrenIds },
            status: { $in: ['Pending', 'Overdue', 'Partial'] },
          }).sort({ dueDate: 1 }),
          Attendance.find({ studentId: { $in: childrenIds } }).sort({ date: -1 }).limit(10),
          Event.find({ date: { $gte: today }, audience: { $in: ['All', 'Parents'] } }).limit(5).sort({ date: 1 }),
          DayCareLog.find({ studentId: { $in: childrenIds } }).sort({ date: -1 }).limit(5),
          Album.find({ visibility: { $in: ['All', 'Parents'] } }).sort({ date: -1 }).limit(5),
        ]);

      res.json({
        isParentPortal: true,
        isTeacherPortal: false,
        myChildren,
        feesDue,
        recentAttendance,
        upcomingEvents,
        recentDaycareLogs,
        recentAlbums,
      });
      return;
    }

    // ==========================================
    // TEACHER PORTAL LOGIC
    // ==========================================
    if (req.user?.role === 'Teacher') {
      const teacherId = req.user.id;
      const days: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday')[] = [
        'Monday', // Sunday fallback
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Monday', // Saturday fallback
      ];
      const todayDayOfWeek = days[today.getDay()] || 'Monday';

      const [
        totalStudents,
        studentAttendancePresent,
        studentAttendanceAbsent,
        studentAttendanceLate,
        recentDiaryEntries,
        recentAssessments,
        upcomingEvents,
        teacherTimetables,
      ] = await Promise.all([
        Student.countDocuments({ status: 'Active' }),
        Attendance.countDocuments({ entityType: 'Student', date: { $gte: today, $lt: tomorrow }, status: 'Present' }),
        Attendance.countDocuments({ entityType: 'Student', date: { $gte: today, $lt: tomorrow }, status: 'Absent' }),
        Attendance.countDocuments({ entityType: 'Student', date: { $gte: today, $lt: tomorrow }, status: 'Late' }),
        DailyDiary.find({}).populate('studentId', 'firstName lastName grade').sort({ date: -1 }).limit(5),
        Assessment.find({ createdBy: teacherId }).populate('childId', 'firstName lastName grade').sort({ createdAt: -1 }).limit(5),
        Event.find({ date: { $gte: today } }).limit(5).sort({ date: 1 }),
        TimeTable.find({ dayOfWeek: todayDayOfWeek, 'periods.teacherId': teacherId })
          .populate('periods.subjectId', 'name')
          .populate('classId', 'name')
          .lean(),
      ]);

      const totalMarked = studentAttendancePresent + studentAttendanceAbsent + studentAttendanceLate;
      const isAttendanceMarked = totalMarked > 0;

      // Extract teacher's today schedule
      const todaySchedule: any[] = [];
      for (const tt of (teacherTimetables as any[])) {
        for (const p of tt.periods || []) {
          if (String(p.teacherId) === String(teacherId)) {
            todaySchedule.push({
              time: `${p.startTime} - ${p.endTime}`,
              subject: p.subjectId?.name || 'Class',
              room: p.room || 'Classroom',
              className: tt.classId?.name || 'Assigned Class',
            });
          }
        }
      }

      res.json({
        isTeacherPortal: true,
        isParentPortal: false,
        myClass: {
          className: 'Assigned Classes',
          totalChildren: totalStudents,
        },
        todayAttendance: {
          present: studentAttendancePresent,
          absent: studentAttendanceAbsent,
          late: studentAttendanceLate,
          total: totalStudents,
          isMarked: isAttendanceMarked,
        },
        todaySchedule,
        todayActivities: [],
        pendingWork: [
          {
            id: '1',
            title: 'Daily Attendance Roll-Call',
            status: isAttendanceMarked ? 'Completed' : 'Pending',
            priority: 'High',
          },
          {
            id: '2',
            title: 'Post Daily Diary Updates',
            status: recentDiaryEntries.length > 0 ? 'Completed' : 'Pending',
            priority: 'Medium',
          },
        ],
        reminders: [],
        recentDiaryEntries,
        recentAssessments,
        upcomingEvents,
        birthdays: [],
      });
      return;
    }

    // ==========================================
    // ADMIN / PRINCIPAL / STAFF PORTAL LOGIC
    // ==========================================
    const [
      totalStudents,
      totalStaff,
      pendingAdmissions,
      newAdmissions,
      admissionInquiries,
      admissionInterviews,
      admissionsApproved,
      feesCollectedAggregation,
      feesPendingAggregation,
      feesOverdueAggregation,
      feesPendingList,
      studentAttendancePresent,
      studentAttendanceAbsent,
      studentAttendanceLate,
      staffAttendanceToday,
      upcomingEvents,
      recentAdmissionsList,
      allStudentsWithDob,
      recentAuditLogs,
    ] = await Promise.all([
      Student.countDocuments({ status: 'Active' }),
      User.countDocuments({ role: { $in: ['Teacher', 'Staff', 'Accountant', 'Admin', 'Principal', 'HR', 'Receptionist'] }, isDeleted: { $ne: true } }),
      Admission.countDocuments({ status: { $in: ['Application Submitted', 'Interview Scheduled', 'In Review', 'Follow-up Pending', 'Interested', 'Under Review'] } }),
      Admission.countDocuments({ status: { $in: ['Approved', 'Admission Confirmed'] } }),
      Admission.countDocuments({ status: { $in: ['New Inquiry', 'Enquiry Submitted', 'Enquiry'] } }),
      Admission.countDocuments({ status: { $in: ['Demo Class Scheduled', 'Interview Scheduled', 'Interview'] } }),
      Admission.countDocuments({ status: { $in: ['Approved', 'Accepted'] } }),
      Fee.aggregate([
        { $match: { status: { $in: ['Paid', 'Partial'] } } },
        { $group: { _id: null, total: { $sum: '$amountPaid' } } },
      ]),
      Fee.aggregate([
        { $match: { status: { $in: ['Pending', 'Partial'] } } },
        { $group: { _id: null, total: { $sum: { $subtract: ['$amount', { $ifNull: ['$amountPaid', 0] }] } } } },
      ]),
      Fee.aggregate([
        { $match: { status: 'Overdue' } },
        { $group: { _id: null, total: { $sum: { $subtract: ['$amount', { $ifNull: ['$amountPaid', 0] }] } } } },
      ]),
      Fee.find({ status: { $in: ['Pending', 'Overdue'] } })
        .populate('studentId', 'firstName lastName grade studentId rollNumber')
        .limit(10)
        .sort({ dueDate: 1 }),
      Attendance.countDocuments({ entityType: 'Student', date: { $gte: today, $lt: tomorrow }, status: 'Present' }),
      Attendance.countDocuments({ entityType: 'Student', date: { $gte: today, $lt: tomorrow }, status: 'Absent' }),
      Attendance.countDocuments({ entityType: 'Student', date: { $gte: today, $lt: tomorrow }, status: 'Late' }),
      Attendance.countDocuments({ entityType: 'User', date: { $gte: today, $lt: tomorrow }, status: 'Present' }),
      Event.find({ date: { $gte: today } }).limit(5).sort({ date: 1 }),
      Admission.find({}).sort({ createdAt: -1 }).limit(10),
      Student.find({ status: 'Active', dateOfBirth: { $exists: true, $ne: null } }).select('firstName lastName dateOfBirth grade studentId'),
      AuditLog.find({}).sort({ timestamp: -1 }).limit(10),
    ]);

    // Calculate birthdays in the current month
    const currentMonth = today.getMonth();
    const birthdays = allStudentsWithDob
      .filter((s: any) => {
        if (!s.dateOfBirth) return false;
        const dob = new Date(s.dateOfBirth);
        return dob.getMonth() === currentMonth;
      })
      .map((s: any) => ({
        _id: s._id,
        name: `${s.firstName} ${s.lastName}`.trim(),
        date: s.dateOfBirth,
        grade: s.grade,
      }))
      .sort((a, b) => new Date(a.date).getDate() - new Date(b.date).getDate())
      .slice(0, 10);

    const totalCollected = feesCollectedAggregation.length > 0 ? feesCollectedAggregation[0].total : 0;
    const totalPending = feesPendingAggregation.length > 0 ? feesPendingAggregation[0].total : 0;
    const totalOverdue = feesOverdueAggregation.length > 0 ? feesOverdueAggregation[0].total : 0;
    const totalTarget = totalCollected + totalPending + totalOverdue;

    const totalMarkedAttendance = studentAttendancePresent + studentAttendanceAbsent + studentAttendanceLate;
    const attendanceRate =
      totalMarkedAttendance > 0
        ? Number(((studentAttendancePresent / totalMarkedAttendance) * 100).toFixed(1))
        : 0;

    // Transform recent activities from audit logs or admissions
    const recentActivities = recentAuditLogs.map((log: any) => ({
      id: log._id.toString(),
      title: log.action || 'System Action',
      detail: `${log.entity || ''} ${log.entityId ? `#${String(log.entityId).slice(-4)}` : ''}`.trim(),
      time: log.timestamp || log.createdAt,
      type: (log.entity || 'general').toLowerCase(),
    }));

    res.json({
      isParentPortal: false,
      isTeacherPortal: false,
      totalStudents,
      totalStaff,
      pendingAdmissions,
      newAdmissions,
      feeCollectionSummary: totalCollected,
      feeStats: {
        collected: totalCollected,
        pending: totalPending,
        overdue: totalOverdue,
        target: totalTarget,
      },
      feesDue: feesPendingList,
      attendanceSummary: {
        studentsPresent: studentAttendancePresent,
        studentsAbsent: studentAttendanceAbsent,
        studentsLate: studentAttendanceLate,
        attendanceRate,
        staffPresent: staffAttendanceToday,
        staffTotal: totalStaff,
      },
      admissionPipeline: {
        enquiries: admissionInquiries,
        applications: pendingAdmissions,
        interviews: admissionInterviews,
        approved: admissionsApproved,
        confirmed: newAdmissions,
      },
      todaySchedule: [],
      recentAdmissions: recentAdmissionsList.map((a: any) => ({
        id: a._id.toString(),
        name: `${a.childFirstName} ${a.childLastName}`.trim(),
        admissionNumber: a.applicationNumber || `GGPS-ADM-${a._id.toString().slice(-4)}`,
        grade: a.gradeAppliedFor || 'LKG',
        parent: a.parentName,
        status: a.status,
        date: a.createdAt || new Date().toISOString(),
      })),
      recentActivities,
      upcomingEvents,
      birthdays,
    });
  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({ success: false, message: 'Failed to calculate dashboard statistics', error });
  }
};
