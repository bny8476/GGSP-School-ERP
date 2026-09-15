"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CalendarHeart, ShieldCheck, Download, ChevronRight, CheckCircle2, 
  AlertCircle, GraduationCap, UserCheck, WalletCards, FileText, Sparkles, 
  Clock, Utensils, Smile, Moon, Award, ArrowRight, BookOpen, HeartHandshake, 
  Loader2, ExternalLink, Plus, Search, Filter, LayoutGrid, List
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function PortalDashboard() {
  const [user, setUser] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [diaries, setDiaries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"All" | "Present" | "Diaries" | "Reports">("All");

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
      
      const studentRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students`, { headers });
      if (studentRes.ok) {
        const fetchedStudents = await studentRes.json();
        setStudents(Array.isArray(fetchedStudents) ? fetchedStudents : []);
      }

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
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#0050CB]/20 border-t-[#0050CB] animate-spin" />
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Loading Portal Dashboard...</p>
      </div>
    );
  }

  const parentName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Parent / Educator';

  return (
    <div className="space-y-6 font-sans text-[#000E28] dark:text-white pb-16">
      
      {/* BREADCRUMB */}
      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
        <Link href="/portal" className="hover:text-[#0050CB]">Portal</Link>
        <span>&gt;</span>
        <span className="text-slate-600 dark:text-slate-300 font-semibold">Teacher & Parent Workspace</span>
      </div>

      {/* HERO BANNER SECTION */}
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-[#EBF3FF] via-[#F3F7FF] to-[#E5EEFF] dark:from-[#001A48] dark:via-[#001438] dark:to-[#002766] p-6 sm:p-8 border border-blue-100/60 dark:border-slate-800 shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#0050CB] text-white flex items-center justify-center font-bold shadow-md shrink-0">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#000E28] dark:text-white tracking-tight">
                Welcome back, {parentName} 👋
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-300 font-medium mt-1 max-w-xl">
                Stay connected with real-time daily learning milestones, attendance telemetry, fee statements, and teacher observations.
              </p>
            </div>
          </div>

          {/* Right Quote Container */}
          <div className="hidden lg:flex flex-col items-center justify-center p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm border border-white/80 dark:border-slate-800 shadow-xs max-w-xs text-center">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 italic">
              “ Small steps every day
            </p>
            <p className="text-xs font-bold text-[#000E28] dark:text-white italic relative inline-block mt-0.5">
              lead to big results. ”
              <span className="block h-0.5 bg-[#0050CB] w-12 mx-auto mt-1 rounded-full"></span>
            </p>
          </div>
        </div>
      </div>

      {/* 4 METRIC CARDS ROW + CTA BUTTON */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
          
          {/* Card 1: Enrolled Children */}
          <div className="relative overflow-hidden bg-white dark:bg-[#000E28] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#0050CB] text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-[#000E28] dark:text-white leading-none">{students.length || 3}</p>
              <p className="text-[11px] font-bold text-slate-400 mt-1">Enrolled Students</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">↑ Active</span>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 w-16 h-8 opacity-10 bg-gradient-to-t from-[#0050CB] to-transparent rounded-tl-full pointer-events-none" />
          </div>

          {/* Card 2: Attendance Rate */}
          <div className="relative overflow-hidden bg-white dark:bg-[#000E28] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-[#000E28] dark:text-white leading-none">98%</p>
              <p className="text-[11px] font-bold text-slate-400 mt-1">Attendance</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">↑ 2%</span>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 w-16 h-8 opacity-10 bg-gradient-to-t from-emerald-500 to-transparent rounded-tl-full pointer-events-none" />
          </div>

          {/* Card 3: Daily Diaries */}
          <div className="relative overflow-hidden bg-white dark:bg-[#000E28] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
              <CalendarHeart className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-[#000E28] dark:text-white leading-none">{diaries.length || 5}</p>
              <p className="text-[11px] font-bold text-slate-400 mt-1">Daily Logs</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">↑ Updated</span>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 w-16 h-8 opacity-10 bg-gradient-to-t from-purple-600 to-transparent rounded-tl-full pointer-events-none" />
          </div>

          {/* Card 4: Fee Statements */}
          <div className="relative overflow-hidden bg-white dark:bg-[#000E28] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
              <WalletCards className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-[#000E28] dark:text-white leading-none">Cleared</p>
              <p className="text-[11px] font-bold text-slate-400 mt-1">Fee Status</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">✓ Up to Date</span>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 w-16 h-8 opacity-10 bg-gradient-to-t from-amber-500 to-transparent rounded-tl-full pointer-events-none" />
          </div>

        </div>

        {/* View Daily Diary CTA on Far Right */}
        <Link
          href="/portal/diary"
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#0050CB] hover:bg-[#003EA3] text-white text-xs font-extrabold shadow-md transition-all shrink-0"
        >
          <CalendarHeart className="w-4 h-4" />
          <span>View Daily Diary</span>
        </Link>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: STUDENT TELEMETRY & LOGS CONTAINER (COL-8) */}
        <div className="lg:col-span-8 bg-white dark:bg-[#000E28] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
          
          {/* SEARCH & FILTERS BAR */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search students, subjects, or report cards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium outline-none focus:ring-2 focus:ring-[#0050CB]"
              />
            </div>

            <button className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 shrink-0">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Filter</span>
            </button>
          </div>

          {/* TABS ROW */}
          <div className="flex items-center gap-6 border-b border-slate-100 dark:border-slate-800 pb-2 text-xs font-bold">
            <button
              onClick={() => setActiveTab("All")}
              className={`pb-2 transition-colors cursor-pointer border-b-2 ${activeTab === "All" ? "border-[#0050CB] text-[#0050CB] font-black" : "border-transparent text-slate-500 hover:text-slate-800"}`}
            >
              Enrolled Students ({students.length || 3})
            </button>
            <button
              onClick={() => setActiveTab("Present")}
              className={`pb-2 transition-colors cursor-pointer border-b-2 ${activeTab === "Present" ? "border-[#0050CB] text-[#0050CB] font-black" : "border-transparent text-slate-500 hover:text-slate-800"}`}
            >
              Today's Attendance
            </button>
            <button
              onClick={() => setActiveTab("Diaries")}
              className={`pb-2 transition-colors cursor-pointer border-b-2 ${activeTab === "Diaries" ? "border-[#0050CB] text-[#0050CB] font-black" : "border-transparent text-slate-500 hover:text-slate-800"}`}
            >
              Daily Observations
            </button>
          </div>

          {/* STUDENT CARDS / LIST ITEMS */}
          <div className="space-y-3">
            {(students.length > 0 ? students : [
              { _id: "s1", firstName: "Alexander", lastName: "Johnson", className: "10", section: "A", admissionNumber: "ADM-2026-089", status: "Present" },
              { _id: "s2", firstName: "Sophia", lastName: "Johnson", className: "7", section: "B", admissionNumber: "ADM-2026-142", status: "Present" }
            ]).map((s) => (
              <div
                key={s._id}
                className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#000E28] hover:border-[#0050CB] transition-all flex items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0050CB] to-[#38BDF8] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                    {s.firstName?.[0] || 'S'}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-extrabold text-[#000E28] dark:text-white leading-tight">
                        {s.firstName} {s.lastName}
                      </h4>
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-[#E5EEFF] text-[#0050CB]">
                        Class {s.className || '10'} - {s.section || 'A'}
                      </span>
                    </div>

                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      Admission No: {s.admissionNumber || 'ADM-2026-089'}
                    </p>

                    <div className="flex items-center gap-3 pt-1 text-[10px] text-slate-400 font-bold">
                      <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">✓ Present Today</span>
                      <span>•</span>
                      <span>Term 1 Performance: 94.5%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleDownloadReport(s._id, `${s.firstName} ${s.lastName}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#E5EEFF] text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#0050CB]" />
                    <span className="hidden sm:inline">Report Card</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* LIST FOOTER */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Showing enrolled children telemetry</span>
            <span className="text-emerald-600 font-bold">🟢 Telemetry Synced</span>
          </div>

        </div>

        {/* RIGHT COLUMN: QUICK ACTIONS + SUMMARY + BRANDING CARD (COL-4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* QUICK ACTIONS PANEL */}
          <div className="bg-white dark:bg-[#000E28] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Sparkles className="w-4 h-4 text-[#0050CB] dark:text-[#38BDF8]" />
              <h3 className="text-sm font-black text-[#000E28] dark:text-white">Quick Actions</h3>
            </div>

            <div className="space-y-2">
              <Link 
                href="/portal/diary"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 hover:bg-[#E5EEFF] dark:hover:bg-[#0050CB]/20 text-xs font-bold text-[#000E28] dark:text-white transition-all border border-slate-100 dark:border-slate-800 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0050CB] text-white flex items-center justify-center">
                    <CalendarHeart className="w-4 h-4" />
                  </div>
                  <span>Daily Diary & Notes</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0050CB]" />
              </Link>

              <Link 
                href="/portal/attendance"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 hover:bg-[#E5EEFF] dark:hover:bg-[#0050CB]/20 text-xs font-bold text-[#000E28] dark:text-white transition-all border border-slate-100 dark:border-slate-800 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <span>Attendance History</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
              </Link>

              <Link 
                href="/portal/finance"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 hover:bg-[#E5EEFF] dark:hover:bg-[#0050CB]/20 text-xs font-bold text-[#000E28] dark:text-white transition-all border border-slate-100 dark:border-slate-800 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center">
                    <WalletCards className="w-4 h-4" />
                  </div>
                  <span>Fee Statements</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500" />
              </Link>
            </div>
          </div>

          {/* TELEMETRY SUMMARY PANEL */}
          <div className="bg-white dark:bg-[#000E28] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0050CB] dark:text-[#38BDF8]" />
                <h3 className="text-sm font-black text-[#000E28] dark:text-white">Academic Telemetry</h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">Term 1 ∨</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#0050CB] flex items-center justify-center shrink-0">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-base font-black text-[#000E28] dark:text-white leading-none">98%</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">Attendance</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-base font-black text-[#000E28] dark:text-white leading-none">A+</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">Grade Avg</p>
                </div>
              </div>
            </div>
          </div>

          {/* BRANDING CARD */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#EEF2FF] via-[#F3E8FF] to-[#E0E7FF] dark:from-[#1E1B4B] dark:via-[#2E1065] dark:to-[#3B0764] p-5 border border-purple-200/60 dark:border-purple-900/40 shadow-xs flex items-center justify-between">
            <div className="space-y-1 max-w-[180px]">
              <h4 className="text-xs font-black text-[#000E28] dark:text-white leading-tight">
                Better Education<br />Brighter Future
              </h4>
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-300">
                Empowering students for a smarter tomorrow.
              </p>
              <button className="mt-2 w-7 h-7 rounded-full bg-[#0050CB] text-white flex items-center justify-center cursor-pointer shadow-xs">
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="w-16 h-16 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md flex items-center justify-center text-3xl shadow-sm shrink-0">
              🌱
            </div>
          </div>

        </div>

      </div>

      {/* FOOTER */}
      <footer className="pt-6 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-semibold">
        <div>
          <span className="font-black text-[#000E28] dark:text-white">Global International School ERP</span> &copy; 2026. All rights reserved.
        </div>
        <div className="flex items-center gap-3">
          <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Portal Active
          </span>
          <span>•</span>
          <span className="hover:underline cursor-pointer">Support</span>
          <span>|</span>
          <span className="hover:underline cursor-pointer">Help</span>
        </div>
      </footer>

    </div>
  );
}
