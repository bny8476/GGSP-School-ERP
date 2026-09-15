"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  CalendarHeart, 
  ShieldCheck, 
  Download, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  GraduationCap, 
  UserCheck, 
  WalletCards, 
  FileText, 
  Sparkles, 
  Clock, 
  Utensils, 
  Smile, 
  Moon, 
  Award, 
  ArrowRight, 
  BookOpen, 
  HeartHandshake, 
  Loader2, 
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function PortalDashboard() {
  const [user, setUser] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [diaries, setDiaries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {}
    }
    fetchPortalData();
  }, []);

  const fetchPortalData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      
      // Fetch associated students
      const studentRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students`, { headers });
      if (studentRes.ok) {
        const fetchedStudents = await studentRes.json();
        setStudents(Array.isArray(fetchedStudents) ? fetchedStudents : []);
      }

      // Fetch today's diary
      const today = new Date().toISOString().split('T')[0];
      const diaryRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/daily-diary?date=${today}`, { headers });
      if (diaryRes.ok) {
        const fetchedDiaries = await diaryRes.json();
        setDiaries(Array.isArray(fetchedDiaries) ? fetchedDiaries : []);
      }
    } catch (error) {
      console.error('Failed to fetch portal data', error);
      toast.error('Could not load portal telemetry');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadReport = async (studentId: string, studentName: string) => {
    setIsDownloadingPdf(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students/${studentId}/report-card`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Report card not yet generated for this term');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ReportCard_${studentName.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success(`${studentName}'s report card downloaded!`);
    } catch (err: any) {
      toast.error(err.message || 'Error downloading report card');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#0050CB]/20 border-t-[#0050CB] animate-spin" />
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Loading Parent Portal...</p>
      </div>
    );
  }

  const role = user?.role || 'Parent';
  const parentName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Parent';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-6 sm:space-y-8"
    >
      {/* ========================================================
          1. HERO BANNER (Matches Teacher Dashboard Workspace)
      ======================================================== */}
      <div className="relative overflow-hidden rounded-[28px] sm:rounded-[36px] bg-gradient-to-r from-[#000E28] via-[#002772] to-[#0050CB] p-7 sm:p-9 border border-white/15 shadow-[0_20px_50px_rgba(0,14,40,0.18)] text-white">
        
        {/* Subtle glass reflection highlight along top border */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

        {/* Ambient atmospheric lighting orbs */}
        <div className="absolute -top-24 -right-20 w-80 h-80 bg-[#38BDF8]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-16 w-60 h-60 bg-[#0050CB]/40 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          {/* Left Hero Copy */}
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#38BDF8] text-xs font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#38BDF8] shadow-[0_0_8px_#38BDF8] animate-pulse" />
              <span>Parent Portal • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Welcome back, <span className="text-[#38BDF8] bg-clip-text text-transparent bg-gradient-to-r from-[#38BDF8] via-[#7DD3FC] to-sky-200">{parentName}</span> 👋
            </h1>

            <p className="text-blue-100/90 text-xs sm:text-sm font-normal leading-relaxed">
              Stay connected with your child's daily learning milestones, nutrition, attendance records, and teacher observations in one real-time dashboard.
            </p>
          </div>

          {/* Quick Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/portal/diary"
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#FF690C] to-[#FF7E2E] text-white font-bold text-xs sm:text-sm tracking-wide shadow-[0_8px_20px_rgba(255,105,12,0.4)] hover:shadow-[0_12px_24px_rgba(255,105,12,0.55)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            >
              <CalendarHeart className="w-4 h-4" />
              <span>Daily Diary</span>
            </Link>

            <Link
              href="/portal/finance"
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white font-bold text-xs sm:text-sm shadow-sm hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            >
              <WalletCards className="w-4 h-4" />
              <span>Fee Statements</span>
            </Link>
          </div>

        </div>
      </div>

      {/* ========================================================
          2. KPI SUMMARY METRICS (Matches Teacher Dashboard Grid)
      ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Metric 1: Enrolled Children */}
        <div className="bg-white dark:bg-[#000E28]/60 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl sm:rounded-3xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Enrolled Children
            </span>
            <span className="p-2 rounded-xl bg-[#E5EEFF] dark:bg-[#0050CB]/25 text-[#0050CB] dark:text-[#38BDF8]">
              <GraduationCap className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-[#000E28] dark:text-white">
            {students.length}
          </div>
          <div className="mt-2 text-[11px] font-semibold text-slate-400 dark:text-slate-500">
            {students.length > 0 ? students.map(s => s.firstName).join(', ') : 'No students linked'}
          </div>
        </div>

        {/* Metric 2: Today's Attendance */}
        <div className="bg-white dark:bg-[#000E28]/60 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl sm:rounded-3xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Today's Attendance
            </span>
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <UserCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">
            100%
          </div>
          <div className="mt-2 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Marked Present in Campus</span>
          </div>
        </div>

        {/* Metric 3: Learning Diary Status */}
        <div className="bg-white dark:bg-[#000E28]/60 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl sm:rounded-3xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Today's Diary
            </span>
            <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <CalendarHeart className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-[#000E28] dark:text-white">
            {diaries.length > 0 ? 'Active' : 'Pending'}
          </div>
          <div className="mt-2 text-[11px] font-semibold text-slate-400 dark:text-slate-500">
            {diaries.length > 0 ? 'Logged by class teacher' : 'Awaiting afternoon sync'}
          </div>
        </div>

        {/* Metric 4: Fee Standing */}
        <div className="bg-white dark:bg-[#000E28]/60 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl sm:rounded-3xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Fee Standing
            </span>
            <span className="p-2 rounded-xl bg-[#E5EEFF] dark:bg-[#0050CB]/25 text-[#0050CB] dark:text-[#38BDF8]">
              <WalletCards className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-[#000E28] dark:text-white">
            Cleared
          </div>
          <div className="mt-2 text-[11px] font-semibold text-[#0050CB] dark:text-[#38BDF8] flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>No pending dues</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          3. MAIN STUDENT PROFILES & CLASSROOM DIARY SECTION
      ======================================================== */}
      {students.length === 0 ? (
        <div className="bg-white dark:bg-[#000E28]/60 p-12 sm:p-16 rounded-[32px] border border-slate-200/80 dark:border-slate-800 text-center shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4 ring-8 ring-slate-100/60 dark:ring-slate-800/30">
            <ShieldCheck className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-black text-[#000E28] dark:text-white">No Linked Student Profiles Found</h3>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-2">
            Your parent account is verified, but no student has been linked yet. Please contact the school administration office at <span className="font-bold text-[#0050CB]">admin@easacademy.com</span>.
          </p>
        </div>
      ) : (
        students.map((student) => {
          const diary = diaries.find(d => d.studentId?._id === student._id || d.studentId === student._id);
          const studentInitials = `${student.firstName?.[0] || ''}${student.lastName?.[0] || ''}`.toUpperCase() || 'S';

          return (
            <div key={student._id} className="space-y-6">
              
              {/* Student Header Card */}
              <div className="bg-white dark:bg-[#000E28]/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-gradient-to-tr from-[#0050CB] to-[#38BDF8] text-white flex items-center justify-center text-xl sm:text-2xl font-black shadow-md shrink-0 ring-4 ring-white dark:ring-[#001438]">
                    {studentInitials}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-lg sm:text-2xl font-black text-[#000E28] dark:text-white tracking-tight">
                        {student.firstName} {student.lastName}
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 text-[10px] font-extrabold uppercase tracking-wider">
                        {student.status || 'Active Student'}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Grade: <span className="text-[#0050CB] dark:text-[#38BDF8] font-bold">{student.grade || 'Pre-KG'}</span> • Adm No: <span className="font-mono text-slate-700 dark:text-slate-200">{student.admissionNumber || 'ADM-2026'}</span> • Blood: <span className="font-bold text-slate-700 dark:text-slate-200">{student.bloodGroup || 'O+'}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <button 
                    onClick={() => handleDownloadReport(student._id, `${student.firstName}_${student.lastName}`)}
                    disabled={isDownloadingPdf}
                    className="inline-flex items-center gap-2 h-10 px-4 rounded-xl text-xs font-bold text-[#0050CB] dark:text-[#38BDF8] bg-[#E5EEFF] dark:bg-[#0050CB]/20 hover:bg-[#D4E4FF] transition-colors border border-[#0050CB]/20 cursor-pointer disabled:opacity-50"
                  >
                    {isDownloadingPdf ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                    <span>Report Card</span>
                  </button>

                  <Link
                    href="/portal/diary"
                    className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl text-xs font-bold text-white bg-[#0050CB] hover:bg-[#0041A8] shadow-xs hover:shadow-md transition-all cursor-pointer"
                  >
                    <span>Full Diary</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Two Column Layout: Daily Diary (Left) and Academics & Finance (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* LEFT: Daily Activity & Learning Milestones (8 cols) */}
                <div className="lg:col-span-8 bg-white dark:bg-[#000E28]/60 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 sm:p-7 space-y-6">
                  
                  {/* Diary Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                        <CalendarHeart className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-extrabold text-[#000E28] dark:text-white tracking-tight">
                          Today's Daily Diary
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Classroom meal logs, nap schedule, and developmental exercises.
                        </p>
                      </div>
                    </div>

                    <Link 
                      href="/portal/diary" 
                      className="text-xs font-bold text-[#0050CB] dark:text-[#38BDF8] hover:underline inline-flex items-center gap-1"
                    >
                      <span>Diary History</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>

                  {diary ? (
                    <div className="space-y-6">
                      {/* 4 Quick Telemetry Boxes */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                        {/* Meals */}
                        <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-900/40 text-center">
                          <span className="text-2xl mb-1.5 block">🍽️</span>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 block">
                            Meals
                          </span>
                          <p className="text-xs font-bold text-slate-800 dark:text-white mt-1 truncate">
                            {diary.meals || 'Completed'}
                          </p>
                        </div>

                        {/* Nap / Rest */}
                        <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-900/40 text-center">
                          <span className="text-2xl mb-1.5 block">😴</span>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-800 dark:text-blue-400 block">
                            Nap Time
                          </span>
                          <p className="text-xs font-bold text-slate-800 dark:text-white mt-1 truncate">
                            {diary.napTime || '1.5 Hours'}
                          </p>
                        </div>

                        {/* Mood */}
                        <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/40 text-center">
                          <span className="text-2xl mb-1.5 block">🎨</span>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-400 block">
                            Mood
                          </span>
                          <p className="text-xs font-bold text-slate-800 dark:text-white mt-1 truncate">
                            {diary.mood || 'Cheerful'}
                          </p>
                        </div>

                        {/* Activities */}
                        <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/70 dark:border-purple-900/40 text-center">
                          <span className="text-2xl mb-1.5 block">⭐</span>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-800 dark:text-purple-400 block">
                            Activities
                          </span>
                          <p className="text-xs font-bold text-slate-800 dark:text-white mt-1 truncate">
                            {diary.activities?.length || 4} Tasks
                          </p>
                        </div>
                      </div>

                      {/* Teacher Observations */}
                      {diary.notes && (
                        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-5 sm:p-6 border border-slate-200/70 dark:border-slate-800 relative">
                          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                            Class Teacher Remarks
                          </p>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200 italic leading-relaxed">
                            "{diary.notes}"
                          </p>
                          {diary.teacherId && (
                            <p className="text-xs font-bold text-[#0050CB] dark:text-[#38BDF8] mt-3 text-right">
                              — {diary.teacherId.firstName} {diary.teacherId.lastName} (Lead Instructor)
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-12 px-4 text-center rounded-2xl bg-slate-50/80 dark:bg-slate-900/30 border border-dashed border-slate-200 dark:border-slate-800 space-y-2">
                      <CalendarHeart className="w-10 h-10 text-slate-400 mx-auto" />
                      <h4 className="text-sm font-extrabold text-[#000E28] dark:text-white">
                        No diary update submitted yet today
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                        Class teachers typically post classroom updates and meal logs after lunchtime. Check back soon!
                      </p>
                    </div>
                  )}
                </div>

                {/* RIGHT: Academic Reports & Fee Summaries (4 cols) */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Academic Progress & Report Card */}
                  <div className="bg-white dark:bg-[#000E28]/60 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#0050CB]/10 dark:bg-[#0050CB]/20 text-[#0050CB] dark:text-[#38BDF8] flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-[#000E28] dark:text-white tracking-tight">
                          Term Report Card
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Evaluated developmental milestones
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      Download the official signed term assessment covering cognitive skills, creative expression, and motor development.
                    </p>

                    <button
                      onClick={() => handleDownloadReport(student._id, `${student.firstName}_${student.lastName}`)}
                      disabled={isDownloadingPdf}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#0050CB] via-[#0048BD] to-[#003893] hover:from-[#0059E0] hover:to-[#0042AD] text-white font-bold text-xs shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isDownloadingPdf ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Generating PDF...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Report Card</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Fee Standing & Tuition Status */}
                  <div className="bg-white dark:bg-[#000E28]/60 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                          <WalletCards className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-black text-[#000E28] dark:text-white tracking-tight">
                            Tuition Standing
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Term fee status
                          </p>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 text-[10px] font-extrabold uppercase">
                        Cleared
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex justify-between items-center">
                      <span>Term Balance:</span>
                      <span className="font-extrabold text-[#000E28] dark:text-white">₹0.00</span>
                    </div>

                    <Link
                      href="/portal/finance"
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#000E28] dark:text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 border border-slate-200/70 dark:border-slate-700"
                    >
                      <span>View Fee Statements</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                </div>

              </div>

            </div>
          );
        })
      )}

    </motion.div>
  );
}
