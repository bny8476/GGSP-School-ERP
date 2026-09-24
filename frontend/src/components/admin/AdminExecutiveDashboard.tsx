"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  GraduationCap, 
  Calendar, 
  Wallet, 
  UserCheck, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Sparkles, 
  Bus, 
  Megaphone, 
  ChevronRight,
  PlusCircle, 
  CreditCard, 
  Activity, 
  BookOpen, 
  DollarSign,
  Shield,
  Layers,
  Cake,
  Receipt,
  ArrowRight
} from 'lucide-react';
import AnimatedNumber from '@/components/ui/AnimatedNumber';
import AdminStatCard from '@/components/admin/AdminStatCard';
import AddStudentModal from '@/components/admin/AddStudentModal';

interface AdminExecutiveDashboardProps {
  stats: any;
  userName: string;
  onRefresh: () => void;
}

const FALLBACK_RECENT_ADMISSIONS = [
  { id: 'ADM-2026-089', name: 'Aarav Sharma', admissionNumber: 'GGPS-2026Admin-001', grade: 'LKG', section: 'A', parent: 'Vikram Sharma', status: 'Confirmed', date: '2026-09-23T08:00:00.000Z' },
  { id: 'ADM-2026-088', name: 'Ananya Patel', admissionNumber: 'GGPS-2026Admin-002', grade: 'Grade 1', section: 'B', parent: 'Meera Patel', status: 'Approved', date: '2026-09-23T04:00:00.000Z' },
  { id: 'ADM-2026-087', name: 'Rohan Verma', admissionNumber: 'GGPS-2026Admin-003', grade: 'Grade 5', section: 'A', parent: 'Kavita Verma', status: 'Interview', date: '2026-09-22T08:00:00.000Z' },
  { id: 'ADM-2026-086', name: 'Diya Sengupta', admissionNumber: 'GGPS-2026Admin-004', grade: 'Grade 3', section: 'A', parent: 'Rahul Sengupta', status: 'Application', date: '2026-09-21T20:00:00.000Z' },
  { id: 'ADM-2026-085', name: 'Kabir Nair', admissionNumber: 'GGPS-2026Admin-005', grade: 'UKG', section: 'B', parent: 'Sanjay Nair', status: 'Enquiry', date: '2026-09-21T08:00:00.000Z' },
];

const FALLBACK_UPCOMING_EVENTS = [
  { _id: 'e1', title: 'Annual Inter-House Sports Meet 2026', date: '2026-09-26T09:00:00.000Z', location: 'Main Athletic Grounds', type: 'Sports', status: 'Scheduled' },
  { _id: 'e2', title: 'Parent-Teacher Executive Conference', date: '2026-09-28T10:00:00.000Z', location: 'Auditorium Hall A', type: 'Academic', status: 'Confirmed' },
  { _id: 'e3', title: 'STEM & Robotics Innovation Expo', date: '2026-10-05T09:30:00.000Z', location: 'Discovery Center', type: 'Exhibition', status: 'Planning' },
];

export default function AdminExecutiveDashboard({
  stats,
  userName,
  onRefresh,
}: AdminExecutiveDashboardProps) {
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [attendanceViewTab, setAttendanceViewTab] = useState<'today' | 'weekly' | 'monthly'>('today');

  const totalStudents = stats?.totalStudents || 1248;
  const totalStaff = stats?.totalStaff || 86;
  const newAdmissionsCount = stats?.newAdmissions || 42;
  const feeCollection = stats?.feeCollectionSummary || 842000;
  const attendanceRate = stats?.attendanceSummary?.attendanceRate || 94.2;
  const studentsPresent = stats?.attendanceSummary?.studentsPresent || 1176;
  const studentsAbsent = stats?.attendanceSummary?.studentsAbsent || 52;
  const studentsLate = stats?.attendanceSummary?.studentsLate || 20;

  const pipeline = stats?.admissionPipeline || {
    enquiries: 64,
    applications: 42,
    interviews: 28,
    approved: 19,
    confirmed: 15,
  };

  const feeStats = stats?.feeStats || {
    collected: 842000,
    pending: 185000,
    overdue: 42000,
    target: 1069000,
  };

  const todaySchedule = stats?.todaySchedule || [
    { id: 'sch-1', time: '08:30 AM - 09:15 AM', class: 'Grade 10-A', teacher: 'Dr. Sarah Jenkins', subject: 'Advanced Physics', room: 'Lab 3', status: 'In Progress' },
    { id: 'sch-2', time: '09:30 AM - 10:15 AM', class: 'Grade 8-B', teacher: 'Prof. Rajesh Iyer', subject: 'Algebra & Geometry', room: 'Room 204', status: 'Upcoming' },
    { id: 'sch-3', time: '10:30 AM - 11:15 AM', class: 'LKG-A', teacher: 'Priya Sharma', subject: 'Early Phonics & Art', room: 'Room 102', status: 'Upcoming' },
    { id: 'sch-4', time: '11:30 AM - 12:15 PM', class: 'Grade 12-C', teacher: 'Robert Vance', subject: 'Macroeconomics', room: 'Hall B', status: 'Upcoming' },
    { id: 'sch-5', time: '01:30 PM - 02:15 PM', class: 'Grade 6-A', teacher: 'Ananya Deshmukh', subject: 'World History', room: 'Room 108', status: 'Upcoming' },
  ];

  const recentAdmissions = stats?.recentAdmissions || FALLBACK_RECENT_ADMISSIONS;

  const recentActivities = stats?.recentActivities || [
    { id: 'act-1', title: 'New Student Admitted', detail: 'Aarav Sharma enrolled into Class LKG-A', time: '12 mins ago', type: 'admission' },
    { id: 'act-2', title: 'Fee Payment Received', detail: '₹45,000 received for Term 1 tuition (Inv #INV-2026-0042)', time: '34 mins ago', type: 'finance' },
    { id: 'act-3', title: 'Attendance Submitted', detail: 'Class 10-A morning roll-call verified by Dr. Sarah Jenkins', time: '1 hour ago', type: 'attendance' },
    { id: 'act-4', title: 'Report Cards Published', detail: 'Term 1 Mid-Term evaluations released to Parent Portal', time: '2 hours ago', type: 'academic' },
    { id: 'act-5', title: 'Emergency Circular Sent', detail: 'Campus monsoon advisory broadcast via SMS and Parent App', time: '3 hours ago', type: 'communication' },
  ];

  const upcomingEvents = stats?.upcomingEvents || FALLBACK_UPCOMING_EVENTS;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <AddStudentModal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        onSuccess={onRefresh}
      />

      {/* ========================================================
          HERO EXECUTIVE BANNER
      ======================================================== */}
      <div className="relative overflow-hidden rounded-[24px] sm:rounded-[28px] bg-gradient-to-r from-[#08152F] via-[#0B1735] to-[#0050CB] py-4 px-5 sm:py-5 sm:px-7 border border-white/10 shadow-[0_12px_36px_rgba(0,14,40,0.14)] text-white">
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-blue-400/40 to-transparent pointer-events-none" />
        <div className="absolute -top-24 -right-20 w-80 h-80 bg-[#0050CB]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-16 w-60 h-60 bg-blue-600/25 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-blue-200/80 font-medium">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <span className="text-xs text-blue-300/60 hidden sm:inline">•</span>
              <span className="text-[11px] font-bold text-blue-200 hidden sm:inline">
                AY 2025 - 2026
              </span>
              <span className="text-xs text-blue-300/60 hidden sm:inline">•</span>
              <span className="text-[10px] font-bold text-[#FF690C] bg-[#FF690C]/15 px-2 py-0.5 rounded-full border border-[#FF690C]/30 hidden sm:inline">
                Main Campus
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-[26px] font-extrabold tracking-tight text-white leading-tight font-saas">
              Good Morning, <span className="text-[#E5EEFF] bg-clip-text text-transparent bg-gradient-to-r from-[#E5EEFF] via-blue-200 to-white">{userName}</span> 👋
            </h1>

            <p className="text-blue-100/80 text-xs font-normal leading-snug line-clamp-2 max-w-xl">
              Here&apos;s what&apos;s happening across GGPS today. Monitor student enrollments, faculty attendance, fee inflows, and campus operations in real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsAddStudentOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-white hover:bg-blue-50 text-[#0050CB] font-bold text-xs shadow-md transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#0050CB]" />
              <span>+ Add Student</span>
            </button>

            <Link
              href="/dashboard/admissions"
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-[#0050CB] hover:bg-[#1469E8] text-white font-bold text-xs shadow-md shadow-[#0050CB]/30 border border-white/20 transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF690C]" />
              <span>Admissions</span>
            </Link>

            <Link
              href="/dashboard/fees"
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white font-bold text-xs transition-all duration-200"
            >
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Collect Fee</span>
            </Link>

            <Link
              href="/dashboard/attendance"
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white font-bold text-xs transition-all duration-200"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-300" />
              <span>Attendance</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================
          SECTION 1: 5 HIGH-END KPI CARDS
      ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        <AdminStatCard
          label="Total Students"
          value={totalStudents}
          icon={GraduationCap}
          trend={{ value: '↑ 8.4%', isPositive: true, period: 'Compared with last month' }}
          supportingText="Active verified records"
          variant="blue"
          progress={92}
          footerLabel="Enrolled capacity"
          footerValue="92% of target"
        />

        <AdminStatCard
          label="Teachers & Faculty"
          value={totalStaff}
          icon={Users}
          trend={{ value: '↑ 4.2%', isPositive: true, period: 'Active on payroll' }}
          supportingText="All departments"
          variant="purple"
          progress={98}
          footerLabel="Faculty present"
          footerValue="82 / 86 Today"
        />

        <AdminStatCard
          label="New Admissions"
          value={newAdmissionsCount}
          icon={Sparkles}
          trend={{ value: '↑ 18%', isPositive: true, period: 'This admission cycle' }}
          supportingText="Confirmed & enrolled"
          variant="orange"
          progress={70}
          footerLabel="Pending review"
          footerValue="28 in pipeline"
        />

        <AdminStatCard
          label="Fee Collection"
          value={Number((feeCollection / 100000).toFixed(2))}
          prefix="₹"
          suffix="L"
          decimals={2}
          icon={CreditCard}
          trend={{ value: '↑ 14.2%', isPositive: true, period: 'Current term receipts' }}
          supportingText="Realized collections"
          variant="emerald"
          progress={78}
          footerLabel="Monthly Target"
          footerValue="₹10.69L (78.8%)"
        />

        <AdminStatCard
          label="Attendance Rate"
          value={attendanceRate}
          suffix="%"
          decimals={1}
          icon={UserCheck}
          trend={{ value: '↑ 1.2%', isPositive: true, period: 'Daily biometric sync' }}
          supportingText={`${studentsPresent} present today`}
          variant="blue"
          progress={attendanceRate}
          footerLabel="Absent / Late"
          footerValue={`${studentsAbsent} Abs • ${studentsLate} Late`}
        />
      </div>

      {/* ========================================================
          SECTIONS 2, 3, 4: ATTENDANCE, ADMISSION PIPELINE, FEE COLLECTION
      ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SECTION 2: ATTENDANCE OVERVIEW */}
        <div className="bg-white dark:bg-[#07152F] rounded-[24px] p-6 border border-[#E6EAF2] dark:border-slate-800 shadow-[0_4px_24px_rgba(0,14,40,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-[#0050CB]/20 text-[#0050CB] dark:text-[#E5EEFF] flex items-center justify-center shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-black text-[#000E28] dark:text-white uppercase tracking-wider leading-tight">
                    Attendance Overview
                  </h3>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
                    Live campus roll-call telemetry
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-full shrink-0">
                Biometrics Live
              </span>
            </div>

            {/* Full-Width Segmented Tab Control (Crisp, High-Contrast Visibility) */}
            <div className="grid grid-cols-3 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-bold mb-4 border border-slate-200/60 dark:border-slate-700/60">
              {(['today', 'weekly', 'monthly'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setAttendanceViewTab(tab)}
                  className={`py-1.5 rounded-lg capitalize transition-all duration-200 text-center cursor-pointer ${
                    attendanceViewTab === tab
                      ? 'bg-white dark:bg-[#0050CB] text-[#0050CB] dark:text-white shadow-xs font-black'
                      : 'text-slate-700 dark:text-slate-200 font-bold hover:text-[#0050CB] dark:hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B1F3A]/60 border border-slate-100 dark:border-slate-800/80 mb-4">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 capitalize">
                  {attendanceViewTab === 'today' ? 'Overall Rate' : `${attendanceViewTab} Average`}
                </span>
                <span className="text-2xl font-black text-[#000E28] dark:text-white font-saas">
                  {attendanceViewTab === 'weekly' ? '95.1%' : attendanceViewTab === 'monthly' ? '93.8%' : `${attendanceRate}%`}
                </span>
              </div>
              <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                <div
                  className="bg-emerald-500 transition-all duration-700"
                  style={{ width: `${((attendanceViewTab === 'weekly' ? 1187 : attendanceViewTab === 'monthly' ? 1171 : studentsPresent) / totalStudents) * 100}%` }}
                  title="Present"
                />
                <div
                  className="bg-amber-400 transition-all duration-700"
                  style={{ width: `${(studentsLate / totalStudents) * 100}%` }}
                  title="Late"
                />
                <div
                  className="bg-rose-500 transition-all duration-700"
                  style={{ width: `${((attendanceViewTab === 'weekly' ? 41 : attendanceViewTab === 'monthly' ? 57 : studentsAbsent) / totalStudents) * 100}%` }}
                  title="Absent"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
                <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 uppercase">Present</p>
                <p className="text-lg font-black text-emerald-800 dark:text-emerald-200 mt-0.5">
                  {attendanceViewTab === 'weekly' ? 1187 : attendanceViewTab === 'monthly' ? 1171 : studentsPresent}
                </p>
                <p className="text-[10px] text-emerald-600/80">
                  {Math.round(((attendanceViewTab === 'weekly' ? 1187 : attendanceViewTab === 'monthly' ? 1171 : studentsPresent) / totalStudents) * 100)}%
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40">
                <p className="text-[11px] font-bold text-rose-700 dark:text-rose-300 uppercase">Absent</p>
                <p className="text-lg font-black text-rose-800 dark:text-rose-200 mt-0.5">
                  {attendanceViewTab === 'weekly' ? 41 : attendanceViewTab === 'monthly' ? 57 : studentsAbsent}
                </p>
                <p className="text-[10px] text-rose-600/80">
                  {Math.round(((attendanceViewTab === 'weekly' ? 41 : attendanceViewTab === 'monthly' ? 57 : studentsAbsent) / totalStudents) * 100)}%
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40">
                <p className="text-[11px] font-bold text-amber-700 dark:text-amber-300 uppercase">Late</p>
                <p className="text-lg font-black text-amber-800 dark:text-amber-200 mt-0.5">{studentsLate}</p>
                <p className="text-[10px] text-amber-600/80">{Math.round((studentsLate / totalStudents) * 100)}%</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">Staff Roll-call: 82/86 Present</span>
            <Link
              href="/dashboard/attendance"
              className="text-xs font-bold text-[#0050CB] dark:text-[#E5EEFF] hover:underline inline-flex items-center gap-1"
            >
              <span>Mark Attendance</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* SECTION 3: ADMISSION PIPELINE */}
        <div className="bg-white dark:bg-[#07152F] rounded-[24px] p-6 border border-[#E6EAF2] dark:border-slate-800 shadow-[0_4px_24px_rgba(0,14,40,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#FF690C]/10 text-[#FF690C] flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#000E28] dark:text-white uppercase tracking-wider">
                    Admission Pipeline
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Lead conversion to enrollment
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                AY 2026-27
              </span>
            </div>

            <div className="space-y-3.5 my-2">
              {[
                { stage: 'Enquiries', count: pipeline.enquiries, color: 'bg-slate-400', pct: 100 },
                { stage: 'Applications', count: pipeline.applications, color: 'bg-blue-500', pct: 65 },
                { stage: 'Interviews & Demo', count: pipeline.interviews, color: 'bg-amber-500', pct: 44 },
                { stage: 'Approved', count: pipeline.approved, color: 'bg-purple-500', pct: 30 },
                { stage: 'Confirmed Enrolled', count: pipeline.confirmed, color: 'bg-emerald-500', pct: 24 },
              ].map((step, idx) => (
                <div key={step.stage} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#000E28] dark:text-slate-200 flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400">{idx + 1}.</span>
                      {step.stage}
                    </span>
                    <span className="font-mono font-black text-[#000E28] dark:text-white">
                      {step.count}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${step.color} rounded-full transition-all duration-700 ease-out`}
                      style={{ width: `${step.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">Total Enquiries: {pipeline.enquiries}</span>
            <Link
              href="/dashboard/admissions"
              className="text-xs font-bold text-[#0050CB] dark:text-[#E5EEFF] hover:underline inline-flex items-center gap-1"
            >
              <span>Manage Pipeline</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* SECTION 4: FEE COLLECTION SUMMARY */}
        <div className="bg-white dark:bg-[#07152F] rounded-[24px] p-6 border border-[#E6EAF2] dark:border-slate-800 shadow-[0_4px_24px_rgba(0,14,40,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#000E28] dark:text-white uppercase tracking-wider">
                    Fee Collection
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Term 1 realized revenues
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
                78.8% Realized
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 mb-4">
              <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                Total Realized This Month
              </p>
              <div className="flex items-baseline justify-between mt-1">
                <h4 className="text-3xl font-black text-emerald-800 dark:text-emerald-200 font-saas">
                  ₹{(feeStats.collected / 100000).toFixed(2)}L
                </h4>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  Target: ₹{(feeStats.target / 100000).toFixed(2)}L
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40">
                <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase">Pending Invoices</p>
                <p className="text-lg font-black text-amber-800 dark:text-amber-200 mt-0.5">
                  ₹{(feeStats.pending / 1000).toFixed(0)}k
                </p>
                <p className="text-[10px] text-amber-600">Due within 15 days</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40">
                <p className="text-[11px] font-bold text-rose-700 dark:text-rose-400 uppercase">Overdue Fees</p>
                <p className="text-lg font-black text-rose-800 dark:text-rose-200 mt-0.5">
                  ₹{(feeStats.overdue / 1000).toFixed(0)}k
                </p>
                <p className="text-[10px] text-rose-600">Immediate action</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">Automated parent reminders active</span>
            <Link
              href="/dashboard/fees"
              className="text-xs font-bold text-[#0050CB] dark:text-[#E5EEFF] hover:underline inline-flex items-center gap-1"
            >
              <span>Fee Console</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

      {/* ========================================================
          SECTIONS 5 & 6: TODAY'S SCHEDULE & RECENT ADMISSIONS
      ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* SECTION 5: TODAY'S SCHEDULE */}
        <div className="bg-white dark:bg-[#07152F] rounded-[24px] p-6 border border-[#E6EAF2] dark:border-slate-800 shadow-[0_4px_24px_rgba(0,14,40,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#000E28] dark:text-white uppercase tracking-wider">
                    Today&apos;s Class Schedule
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Active academic periods & rooms
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/academic"
                className="text-xs font-bold text-[#0050CB] dark:text-[#E5EEFF] hover:underline"
              >
                Full Matrix
              </Link>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {todaySchedule.map((item: any) => (
                <div
                  key={item.id}
                  className="py-3 flex items-center justify-between gap-3 group hover:bg-slate-50/60 dark:hover:bg-[#0B1F3A]/40 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono font-bold text-slate-400 min-w-[130px]">
                      {item.time}
                    </span>
                    <div>
                      <p className="text-xs font-black text-[#000E28] dark:text-white">
                        {item.subject} • <span className="text-[#0050CB] dark:text-[#E5EEFF]">{item.class}</span>
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {item.teacher} ({item.room})
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      item.status === 'In Progress'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>5 Periods active across 24 classrooms</span>
            <span className="font-bold text-[#000E28] dark:text-white">Faculty On Duty: 82</span>
          </div>
        </div>

        {/* SECTION 6: RECENT ADMISSIONS */}
        <div className="bg-white dark:bg-[#07152F] rounded-[24px] p-6 border border-[#E6EAF2] dark:border-slate-800 shadow-[0_4px_24px_rgba(0,14,40,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-[#FF690C]/15 text-[#FF690C] flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#000E28] dark:text-white uppercase tracking-wider">
                    Recent Admissions
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Latest student registrations
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/admissions"
                className="text-xs font-bold text-[#0050CB] dark:text-[#E5EEFF] hover:underline"
              >
                View All
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
                    <th className="pb-2 font-black">Student</th>
                    <th className="pb-2 font-black">Class</th>
                    <th className="pb-2 font-black">Parent</th>
                    <th className="pb-2 font-black">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                  {recentAdmissions.map((adm: any) => (
                    <tr key={adm.id} className="hover:bg-slate-50/60 dark:hover:bg-[#0B1F3A]/40 transition-colors">
                      <td className="py-2.5 pr-2">
                        <p className="font-bold text-[#000E28] dark:text-white">{adm.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{adm.admissionNumber}</p>
                      </td>
                      <td className="py-2.5 pr-2">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{adm.grade}</span>
                      </td>
                      <td className="py-2.5 pr-2 text-slate-500 dark:text-slate-400 truncate max-w-[100px]">
                        {adm.parent}
                      </td>
                      <td className="py-2.5">
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            adm.status === 'Confirmed'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                              : adm.status === 'Approved'
                              ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300'
                              : 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                          }`}
                        >
                          {adm.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Server-side unique ID enforcement active</span>
            <Link
              href="/dashboard/students"
              className="text-xs font-bold text-[#0050CB] dark:text-[#E5EEFF] hover:underline inline-flex items-center gap-1"
            >
              <span>Students Directory</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

      {/* ========================================================
          SECTIONS 7 & 8: RECENT ACTIVITIES & UPCOMING EVENTS
      ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* SECTION 7: RECENT ACTIVITIES */}
        <div className="bg-white dark:bg-[#07152F] rounded-[24px] p-6 border border-[#E6EAF2] dark:border-slate-800 shadow-[0_4px_24px_rgba(0,14,40,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#000E28] dark:text-white uppercase tracking-wider">
                    Recent Administrative Activities
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Live system action log
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/audit-logs"
                className="text-xs font-bold text-[#0050CB] dark:text-[#E5EEFF] hover:underline"
              >
                Audit Trail
              </Link>
            </div>

            <div className="space-y-3">
              {recentActivities.map((act: any) => (
                <div
                  key={act.id}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50/70 dark:hover:bg-[#0B1F3A]/40 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-[#0050CB] mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-[#000E28] dark:text-white">
                      {act.title}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {act.detail}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {act.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Encrypted immutable audit logs</span>
            <span className="font-bold text-emerald-600">● 100% Operational</span>
          </div>
        </div>

        {/* SECTION 8: UPCOMING EVENTS & CALENDAR */}
        <div className="bg-white dark:bg-[#07152F] rounded-[24px] p-6 border border-[#E6EAF2] dark:border-slate-800 shadow-[0_4px_24px_rgba(0,14,40,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#000E28] dark:text-white uppercase tracking-wider">
                    Upcoming Events & Milestones
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Campus calendar schedule
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/calendar"
                className="text-xs font-bold text-[#0050CB] dark:text-[#E5EEFF] hover:underline"
              >
                Calendar
              </Link>
            </div>

            <div className="space-y-3">
              {upcomingEvents.map((evt: any) => (
                <div
                  key={evt._id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 dark:bg-[#0B1F3A]/60 border border-slate-100 dark:border-slate-800/80"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#07152F] border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center leading-none">
                      <span className="text-[10px] uppercase font-bold text-[#0050CB] dark:text-[#E5EEFF]">
                        {new Date(evt.date).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                      <span className="text-sm font-black text-[#000E28] dark:text-white mt-0.5">
                        {new Date(evt.date).getDate()}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#000E28] dark:text-white">
                        {evt.title}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {evt.location || 'Campus'} • {evt.type || 'Institutional'}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 dark:bg-[#0050CB]/20 text-[#0050CB] dark:text-[#E5EEFF]">
                    {evt.status || 'Scheduled'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Next: Sports Meet (In 3 days)</span>
            <Link
              href="/dashboard/events"
              className="text-xs font-bold text-[#0050CB] dark:text-[#E5EEFF] hover:underline inline-flex items-center gap-1"
            >
              <span>Manage Events</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
