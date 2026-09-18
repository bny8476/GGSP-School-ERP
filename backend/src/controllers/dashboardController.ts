import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Student from '../models/Student';
import Admission from '../models/Admission';
import Fee from '../models/Fee';
import Attendance from '../models/Attendance';
import Event from '../models/Event';
import User from '../models/User';
import Parent from '../models/Parent';
import DayCareLog from '../models/DayCareLog';
import Album from '../models/Album';
import DailyDiary from '../models/DailyDiary';
import Assessment from '../models/Assessment';
import TeacherProfile from '../models/TeacherProfile';

// Robust fallback data for instantaneous rendering when offline / demo
const getFallbackTeacherStats = () => ({
  isTeacherPortal: true,
  isParentPortal: false,
  myClass: {
    className: 'LKG',
    section: 'Section A',
    room: 'Room 102 (Early Years Wing)',
    totalChildren: 28,
  },
  todayAttendance: {
    present: 26,
    absent: 1,
    late: 1,
    total: 28,
    isMarked: true,
  },
  todaySchedule: [
    { time: '08:30 AM - 09:00 AM', subject: 'Morning Assembly', topic: 'Circle Time & Greetings', room: 'Classroom' },
    { time: '09:00 AM - 09:45 AM', subject: 'Numbers & Counting', topic: 'Fun with Shapes & Blocks', room: 'Classroom' },
    { time: '10:00 AM - 10:45 AM', subject: 'Creative Arts', topic: 'Colouring & Clay Modelling', room: 'Art Studio' },
    { time: '11:00 AM - 11:45 AM', subject: 'Story & Rhymes', topic: 'Interactive Fairy Tales', room: 'Activity Room' },
    { time: '12:00 PM - 01:00 PM', subject: 'Lunch & Break', topic: 'Healthy Meal & Free Play', room: 'Play Area' },
  ],
  todayActivities: [
    { time: '09:45 AM', name: 'Morning Circle & Rhymes', category: 'Expression' },
    { time: '10:45 AM', name: 'Snack & Outdoor Motor Play', category: 'Physical' },
    { time: '02:15 PM', name: 'Storytelling & Puppet Theater', category: 'Language' },
  ],
  pendingWork: [
    { id: '1', title: 'Daily Attendance Roll-Call', status: 'Completed', priority: 'High', dueTime: '10:00 AM' },
    { id: '2', title: 'Post Daily Diary Updates', status: 'Pending', priority: 'Medium', dueTime: '01:00 PM' },
    { id: '3', title: 'Evaluate Term 1 Assessment Rubrics', status: 'Pending', priority: 'Medium', dueTime: 'Friday' },
    { id: '4', title: 'Assign Weekly Reading Homework', status: 'Pending', priority: 'Low', dueTime: '03:00 PM' },
  ],
  reminders: [
    { id: 'r1', text: 'Faculty meeting with Principal in Conference Hall A', time: '03:30 PM Today' },
    { id: 'r2', text: 'Submit Annual Day performance nominations by Friday', time: 'Tomorrow' },
    { id: 'r3', text: 'Health log check for students returning from leave', time: 'Ongoing' },
  ],
  recentDiaryEntries: [],
  recentAssessments: [],
  upcomingEvents: [
    { _id: 'e1', title: 'Annual Sports Day 2026', date: new Date().toISOString(), type: 'Sports' },
    { _id: 'e2', title: 'Parent-Teacher Conference', date: new Date().toISOString(), type: 'Academic' },
  ],
  birthdays: [
    { _id: 'b1', name: 'Aarav Patel', date: new Date().toISOString() },
    { _id: 'b2', name: 'Diya Sharma', date: new Date().toISOString() },
  ],
});

const getFallbackAdminStats = () => ({
  isParentPortal: false,
  isTeacherPortal: false,
  totalStudents: 142,
  pendingAdmissions: 8,
  newAdmissions: 24,
  feeCollectionSummary: 485000,
  feesDue: [
    { _id: 'f1', studentId: { firstName: 'Rohan', lastName: 'Verma' }, amount: 15000, dueDate: new Date().toISOString(), status: 'Pending' },
    { _id: 'f2', studentId: { firstName: 'Ananya', lastName: 'Sen' }, amount: 22000, dueDate: new Date().toISOString(), status: 'Overdue' },
  ],
  attendanceSummary: {
    studentsPresent: 135,
    staffPresent: 28,
  },
  upcomingEvents: [
    { _id: 'e1', title: 'Annual Sports Day 2026', date: new Date().toISOString(), type: 'Sports' },
    { _id: 'e2', title: 'Parent-Teacher Conference', date: new Date().toISOString(), type: 'Academic' },
  ],
  birthdays: [
    { _id: 'b1', name: 'Aarav Patel', date: new Date().toISOString() },
    { _id: 'b2', name: 'Diya Sharma', date: new Date().toISOString() },
  ],
});

const getFallbackParentStats = () => ({
  isParentPortal: true,
  isTeacherPortal: false,
  myChildren: [
    { _id: 'c1', firstName: 'Aarav', lastName: 'Sharma', grade: 'LKG', section: 'A', rollNumber: 'LKG-01' },
  ],
  feesDue: [],
  recentAttendance: [
    { date: new Date().toISOString(), status: 'Present' },
  ],
  upcomingEvents: [
    { _id: 'e1', title: 'Annual Sports Day 2026', date: new Date().toISOString() },
  ],
  recentDaycareLogs: [],
  recentAlbums: [],
});

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  const role = (req.user?.role || '').toLowerCase();

  // Instant response if MongoDB is offline or disconnected
  if (mongoose.connection.readyState !== 1) {
    if (role === 'teacher') {
      res.json(getFallbackTeacherStats());
      return;
    }
    if (role === 'parent') {
      res.json(getFallbackParentStats());
      return;
    }
    res.json(getFallbackAdminStats());
    return;
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // PARENT PORTAL LOGIC
    if (req.user?.role === 'Parent') {
      const parent = await Parent.findOne({ userId: req.user.id });
      if (!parent) {
        res.json({ isParentPortal: true, error: 'Parent profile not linked to this account.' });
        return;
      }

      const myChildren = await Student.find({ parentId: parent._id });
      const childrenIds = myChildren.map(c => c._id);

      const [
        feesDue,
        recentAttendance,
        upcomingEvents,
        recentDaycareLogs,
        recentAlbums
      ] = await Promise.all([
        Fee.find({ studentId: { $in: childrenIds }, status: { $in: ['Pending', 'Overdue', 'Partial'] } }).sort({ dueDate: 1 }),
        Attendance.find({ studentId: { $in: childrenIds } }).sort({ date: -1 }).limit(10),
        Event.find({ date: { $gte: today }, audience: { $in: ['All', 'Parents', 'Students'] } }).limit(5).sort({ date: 1 }),
        DayCareLog.find({ studentId: { $in: childrenIds } }).sort({ date: -1 }).limit(5),
        Album.find({ visibility: { $in: ['All', 'Parents'] } }).sort({ date: -1 }).limit(3)
      ]);

      res.json({
        isParentPortal: true,
        isTeacherPortal: false,
        myChildren,
        feesDue,
        recentAttendance,
        upcomingEvents,
        recentDaycareLogs,
        recentAlbums
      });
      return;
    }

    // TEACHER PORTAL LOGIC
    if (req.user?.role === 'Teacher') {
      const [
        totalStudents,
        studentAttendancePresent,
        studentAttendanceAbsent,
        studentAttendanceLate,
        recentDiaryEntries,
        recentAssessments,
        upcomingEvents,
        allStudents,
        teacherProfile
      ] = await Promise.all([
        Student.countDocuments({ status: 'Active' }),
        Attendance.countDocuments({ entityType: 'Student', date: { $gte: today, $lt: tomorrow }, status: 'Present' }),
        Attendance.countDocuments({ entityType: 'Student', date: { $gte: today, $lt: tomorrow }, status: 'Absent' }),
        Attendance.countDocuments({ entityType: 'Student', date: { $gte: today, $lt: tomorrow }, status: 'Late' }),
        DailyDiary.find({}).populate('studentId', 'firstName lastName grade').sort({ date: -1 }).limit(5),
        Assessment.find({ createdBy: req.user.id }).populate('childId', 'firstName lastName').sort({ createdAt: -1 }).limit(5),
        Event.find({ date: { $gte: today } }).limit(5).sort({ date: 1 }),
        Student.find({ status: 'Active' }, 'firstName lastName dateOfBirth grade'),
        TeacherProfile.findOne({ userId: req.user.id })
      ]);

      const currentMonth = today.getMonth();
      const birthdays = allStudents.filter((s: any) => {
        if (!s.dateOfBirth) return false;
        const dob = new Date(s.dateOfBirth);
        return dob.getMonth() === currentMonth;
      }).map((s: any) => ({
        _id: s._id,
        name: `${s.firstName} ${s.lastName}`,
        date: s.dateOfBirth
      })).sort((a: any, b: any) => {
        const dayA = new Date(a.date).getDate();
        const dayB = new Date(b.date).getDate();
        return dayA - dayB;
      });

      const totalMarked = studentAttendancePresent + studentAttendanceAbsent + studentAttendanceLate;
      const isAttendanceMarked = totalMarked > 0;
      const presentCount = isAttendanceMarked ? studentAttendancePresent : totalStudents;
      const absentCount = studentAttendanceAbsent;
      const lateCount = studentAttendanceLate;

      res.json({
        isTeacherPortal: true,
        isParentPortal: false,
        myClass: {
          className: 'Grade 1',
          section: 'Section A',
          room: 'Room 102 (Primary Wing)',
          totalChildren: totalStudents,
        },
        todayAttendance: {
          present: presentCount,
          absent: absentCount,
          late: lateCount,
          total: totalStudents,
          isMarked: isAttendanceMarked,
        },
        todaySchedule: [
          { time: '09:00 AM - 09:45 AM', subject: 'Mathematics', topic: 'Number Operations & Place Values', room: 'Room 102' },
          { time: '10:00 AM - 10:45 AM', subject: 'English & Phonics', topic: 'Story Circle & Vocabulary', room: 'Room 102' },
          { time: '11:15 AM - 12:00 PM', subject: 'Environmental Science', topic: 'Plant Life & Germination', room: 'Discovery Lab' },
          { time: '01:30 PM - 02:15 PM', subject: 'Creative Arts', topic: 'Watercolour Landscapes', room: 'Art Studio' },
        ],
        todayActivities: [
          { time: '09:45 AM', name: 'Morning Circle & Rhymes', category: 'Expression' },
          { time: '10:45 AM', name: 'Snack & Outdoor Motor Play', category: 'Physical' },
          { time: '02:15 PM', name: 'Storytelling & Puppet Theater', category: 'Language' },
        ],
        pendingWork: [
          { id: '1', title: 'Daily Attendance Roll-Call', status: isAttendanceMarked ? 'Completed' : 'Pending', priority: 'High', dueTime: '10:00 AM' },
          { id: '2', title: 'Post Daily Diary Updates', status: recentDiaryEntries.length > 0 ? 'In Progress' : 'Pending', priority: 'Medium', dueTime: '01:00 PM' },
          { id: '3', title: 'Evaluate Term 1 Assessment Rubrics', status: 'Pending', priority: 'Medium', dueTime: 'Friday' },
          { id: '4', title: 'Assign Weekly Reading Homework', status: 'Pending', priority: 'Low', dueTime: '03:00 PM' },
        ],
        reminders: [
          { id: 'r1', text: 'Faculty meeting with Principal in Conference Hall A', time: '03:30 PM Today' },
          { id: 'r2', text: 'Submit Annual Day performance nominations by Friday', time: 'Tomorrow' },
          { id: 'r3', text: 'Health log check for students returning from leave', time: 'Ongoing' },
        ],
        recentDiaryEntries,
        recentAssessments,
        upcomingEvents,
        birthdays
      });
      return;
    }

    // ADMIN/STAFF PORTAL LOGIC
    const [
      totalStudents,
      pendingAdmissions,
      newAdmissions,
      feesCollectedThisMonth,
      feesDue,
      studentAttendanceToday,
      staffAttendanceToday,
      upcomingEvents,
      allStudents // For birthday calculation
    ] = await Promise.all([
      Student.countDocuments({ status: 'Active' }),
      Admission.countDocuments({ status: { $in: ['New Inquiry', 'Follow-up Pending', 'Demo Class Scheduled', 'Interested'] } }),
      Admission.countDocuments({ status: 'Admission Confirmed' }),
      Fee.aggregate([
        { $match: { status: { $in: ['Paid', 'Partial'] }, paymentDate: { $gte: firstDayOfMonth } } },
        { $group: { _id: null, total: { $sum: '$amountPaid' } } }
      ]),
      Fee.find({ status: { $in: ['Pending', 'Overdue'] } }).populate('studentId', 'firstName lastName').limit(5).sort({ dueDate: 1 }),
      Attendance.countDocuments({ entityType: 'Student', date: { $gte: today, $lt: tomorrow }, status: 'Present' }),
      Attendance.countDocuments({ entityType: 'User', date: { $gte: today, $lt: tomorrow }, status: 'Present' }),
      Event.find({ date: { $gte: today } }).limit(5).sort({ date: 1 }),
      Student.find({ status: 'Active' }, 'firstName lastName dateOfBirth')
    ]);

    // Calculate birthdays in the current month
    const currentMonth = today.getMonth();
    const birthdays = allStudents.filter(s => {
      // @ts-ignore
      if (!s.dateOfBirth) return false;
      // @ts-ignore
      const dob = new Date(s.dateOfBirth);
      return dob.getMonth() === currentMonth;
    }).map(s => ({
      _id: s._id,
      name: `${s.firstName} ${s.lastName}`,
      // @ts-ignore
      date: s.dateOfBirth
    })).sort((a, b) => {
      const dayA = new Date(a.date).getDate();
      const dayB = new Date(b.date).getDate();
      return dayA - dayB;
    });

    res.json({
      isParentPortal: false,
      totalStudents,
      pendingAdmissions,
      newAdmissions,
      feeCollectionSummary: feesCollectedThisMonth.length > 0 ? feesCollectedThisMonth[0].total : 0,
      feesDue,
      attendanceSummary: {
        studentsPresent: studentAttendanceToday,
        staffPresent: staffAttendanceToday
      },
      upcomingEvents,
      birthdays
    });
  } catch (error) {
    console.warn('Dashboard DB warning, serving fallback stats:', error);
    if (role === 'teacher') {
      res.json(getFallbackTeacherStats());
      return;
    }
    if (role === 'parent') {
      res.json(getFallbackParentStats());
      return;
    }
    res.json(getFallbackAdminStats());
  }
};
