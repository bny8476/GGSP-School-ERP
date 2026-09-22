"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, ChevronRight, Calendar, Clock, Check, AlertCircle,
  TrendingUp, ChevronDown, ChevronLeft, Lightbulb, ArrowRight,
  ShieldCheck, X, FileText, Send
} from "lucide-react";
import { useParent } from "@/context/ParentContext";

export default function ParentAttendancePage() {
  const { selectedChild, children, selectChild } = useParent();
  const [timeframe, setTimeframe] = useState<"Today" | "This Week" | "This Month" | "Academic Year">("Today");
  const [isReportAbsenceOpen, setIsReportAbsenceOpen] = useState(false);
  const [absenceDate, setAbsenceDate] = useState("2026-09-22");
  const [absenceReason, setAbsenceReason] = useState("Medical / Fever");
  const [absenceNote, setAbsenceNote] = useState("");
  const [absenceStatus, setAbsenceStatus] = useState<"idle" | "success">("idle");

  const child = selectedChild || children[0] || {
    _id: "c10101010101010101010101",
    firstName: "Aarav",
    lastName: "Sharma",
    grade: "LKG",
    section: "Section A",
    rollNumber: "01",
    studentPhoto: "/aarav-hero-student.jpg",
  };

  const handleReportAbsence = (e: React.FormEvent) => {
    e.preventDefault();
    setAbsenceStatus("success");
    setTimeout(() => {
      setIsReportAbsenceOpen(false);
      setAbsenceStatus("idle");
      setAbsenceNote("");
    }, 1500);
  };

  // Interactive Date Selector Options
  const dateOptions = [
    "Friday, 18 September 2026",
    "Thursday, 17 September 2026",
    "Wednesday, 16 September 2026",
    "Tuesday, 15 September 2026",
    "Monday, 14 September 2026",
  ];
  const [currentDateIndex, setCurrentDateIndex] = useState(0);

  // Dynamic datasets based on active timeframe tab
  const timeframeConfig = {
    Today: {
      subtitle: "Hourly session attendance for today",
      kpiRate: "100%",
      kpiTrend: "Present all day",
      daysPresent: "1",
      daysTotal: "All 5 sessions present",
      daysAbsent: "0",
      absentNote: "Zero absences today",
      lateCount: "0",
      lateNote: "On time for all classes",
      highlightTitle: "Perfect Presence!",
      highlightDesc: "Your child has attended 100% of today's scheduled classroom and activity sessions.",
      bars: [
        { date: "09:00 AM", label: "100%", presentH: 100, lateH: 0, absentH: 0 },
        { date: "10:30 AM", label: "100%", presentH: 100, lateH: 0, absentH: 0 },
        { date: "12:00 PM", label: "100%", presentH: 100, lateH: 0, absentH: 0 },
        { date: "01:30 PM", label: "100%", presentH: 100, lateH: 0, absentH: 0 },
        { date: "03:00 PM", label: "100%", presentH: 100, lateH: 0, absentH: 0 },
      ]
    },
    "This Week": {
      subtitle: "Daily attendance for the current school week",
      kpiRate: "96%",
      kpiTrend: "↑ +1.5% this week",
      daysPresent: "4",
      daysTotal: "out of 5 school days",
      daysAbsent: "0",
      absentNote: "Zero unexcused absences",
      lateCount: "1",
      lateNote: "On 18 Sep • 10 mins",
      highlightTitle: "Great Consistency!",
      highlightDesc: "Your child maintained a 96% attendance score across all 5 school days this week.",
      bars: [
        { date: "Mon 14", label: "100%", presentH: 100, lateH: 0, absentH: 0 },
        { date: "Tue 15", label: "92%", presentH: 92, lateH: 0, absentH: 8 },
        { date: "Wed 16", label: "100%", presentH: 96, lateH: 4, absentH: 0 },
        { date: "Thu 17", label: "88%", presentH: 88, lateH: 0, absentH: 12 },
        { date: "Fri 18", label: "100%", presentH: 100, lateH: 0, absentH: 0 },
      ]
    },
    "This Month": {
      subtitle: "Daily attendance for the last 7 days",
      kpiRate: "94%",
      kpiTrend: "↑ +2.4% this month",
      daysPresent: "26",
      daysTotal: "out of 28 school days",
      daysAbsent: "1",
      absentNote: "Needs attention • Fever",
      lateCount: "1",
      lateNote: "On 18 Sep • 10 mins",
      highlightTitle: "Great Job!",
      highlightDesc: "Your child's attendance is 2.4% higher than last month. Keep it up!",
      bars: [
        { date: "12 Sep", label: "100%", presentH: 100, lateH: 0, absentH: 0 },
        { date: "13 Sep", label: "96%", presentH: 96, lateH: 4, absentH: 0 },
        { date: "14 Sep", label: "100%", presentH: 100, lateH: 0, absentH: 0 },
        { date: "15 Sep", label: "92%", presentH: 92, lateH: 0, absentH: 8 },
        { date: "16 Sep", label: "100%", presentH: 96, lateH: 4, absentH: 0 },
        { date: "17 Sep", label: "88%", presentH: 88, lateH: 0, absentH: 12 },
        { date: "18 Sep", label: "92%", presentH: 92, lateH: 8, absentH: 0 },
      ]
    },
    "Academic Year": {
      subtitle: "Monthly attendance distribution for Academic Year 2026-27",
      kpiRate: "95.8%",
      kpiTrend: "↑ +3.2% vs school avg",
      daysPresent: "184",
      daysTotal: "out of 192 term days",
      daysAbsent: "5",
      absentNote: "Approved medical leaves",
      lateCount: "3",
      lateNote: "Average delay: 7 mins",
      highlightTitle: "Honor Roll Standing!",
      highlightDesc: "Annual attendance is currently above 95%, qualifying for Academic Excellence recognition.",
      bars: [
        { date: "Jun", label: "96%", presentH: 96, lateH: 4, absentH: 0 },
        { date: "Jul", label: "94%", presentH: 94, lateH: 0, absentH: 6 },
        { date: "Aug", label: "98%", presentH: 98, lateH: 2, absentH: 0 },
        { date: "Sep", label: "94%", presentH: 92, lateH: 4, absentH: 4 },
        { date: "Oct", label: "97%", presentH: 97, lateH: 3, absentH: 0 },
        { date: "Nov", label: "95%", presentH: 95, lateH: 0, absentH: 5 },
        { date: "Dec", label: "96%", presentH: 96, lateH: 4, absentH: 0 },
        { date: "Jan", label: "98%", presentH: 98, lateH: 2, absentH: 0 },
      ]
    }
  };

  const activeConfig = timeframeConfig[timeframe] || timeframeConfig["This Month"];
  const barChartData = activeConfig.bars;

  // Attendance History matching screenshot
  const historyData = [
    { date: "18 Sep 2026", status: "Present", reason: "-", markedBy: "Class Teacher", isDot: "emerald" },
    { date: "17 Sep 2026", status: "Present", reason: "-", markedBy: "Class Teacher", isDot: "emerald" },
    { date: "16 Sep 2026", status: "Present", reason: "-", markedBy: "Class Teacher", isDot: "emerald" },
    { date: "15 Sep 2026", status: "Absent", reason: "Fever", markedBy: "Class Teacher", isDot: "rose" },
    { date: "14 Sep 2026", status: "Present", reason: "-", markedBy: "Class Teacher", isDot: "emerald" },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* ========================================================
          1. BREADCRUMB
      ======================================================== */}
      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium pt-1">
        <Link href="/parent" className="flex items-center gap-1.5 hover:text-blue-600 text-blue-600 font-semibold transition-colors">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-300" />
        <span className="text-slate-500 font-bold">Attendance</span>
      </div>

      {/* ========================================================
          2. CHILD PROFILE HERO BANNER (EXACT TO REFERENCE)
      ======================================================== */}
      <section className="relative w-full rounded-[24px] sm:rounded-[28px] overflow-hidden border border-blue-200/70 dark:border-white/10 shadow-[0_4px_24px_rgba(0,80,203,0.06)] bg-[#EBF5FF] dark:bg-[#07142F] aspect-[1024/342] min-h-[120px] sm:min-h-[160px] max-h-[280px] group transition-all">
        <Image
          src="/parent-portal-banner.png"
          alt="GGPS Attendance & Academic Growth"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.005]"
        />

        {/* Gradient overlay so text is always readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#000E28]/55 via-[#000E28]/25 to-transparent" />

        {/* Text Overlay — left-aligned */}
        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-9 gap-1.5 sm:gap-2">
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 text-[10px] sm:text-[11px] font-bold text-white tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            Live Attendance Tracker
          </span>

          {/* Main Heading */}
          <h1 className="text-xl sm:text-2xl md:text-[28px] font-black text-white leading-tight tracking-tight drop-shadow-md max-w-[55%] sm:max-w-[50%]">
            Student Attendance
            <br />
            <span className="text-[#A8CBFF]">Overview</span>
          </h1>

          {/* Subtitle */}
          <p className="text-[11px] sm:text-xs text-white/80 font-semibold leading-snug max-w-[48%] sm:max-w-[42%] hidden sm:block">
            Track daily, weekly &amp; monthly attendance records for your child in real time.
          </p>
        </div>
      </section>

      {/* ========================================================
          3. TOP 4 KPI CARDS ROW (EXACT TO REFERENCE SCREENSHOT)
      ======================================================== */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Attendance (Exact matching user screenshot) */}
        <motion.div
          whileHover={{ y: -3, scale: 1.008 }}
          whileTap={{ scale: 0.99 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[24px] p-5 bg-gradient-to-br from-white via-white to-[#EBF3FF]/70 dark:from-[#07142F] dark:via-[#091838] dark:to-[#0D2452] border border-blue-100/90 dark:border-white/10 shadow-[0_4px_20px_rgba(0,80,203,0.05)] hover:shadow-[0_12px_28px_-6px_rgba(0,80,203,0.14)] transition-all duration-300 min-h-[148px] flex flex-col justify-between group cursor-pointer"
        >
          {/* Row 1: Circular Blue Icon on left, Chevron on right */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#E1EFFF] to-[#C8E0FF] dark:from-blue-950/60 dark:to-blue-900/40 p-[2.5px] shadow-sm shadow-blue-500/15 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-full bg-gradient-to-b from-[#2563EB] to-[#0050CB] flex items-center justify-center shadow-inner">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-5 h-5 text-white"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="17" rx="3" fill="currentColor" fillOpacity="0.2" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                  <line x1="8" y1="2" x2="8" y2="5" strokeWidth="2.5" />
                  <line x1="16" y1="2" x2="16" y2="5" strokeWidth="2.5" />
                  <circle cx="8" cy="13" r="1" fill="currentColor" />
                  <circle cx="12" cy="13" r="1" fill="currentColor" />
                  <circle cx="16" cy="13" r="1" fill="currentColor" />
                </svg>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-blue-400 group-hover:translate-x-0.5 transition-transform" />
          </div>

          {/* Row 2: Metric & Title (Exact to reference screenshot) */}
          <div className="relative z-10 mt-3 min-w-0">
            <div className="text-[28px] sm:text-[32px] font-black text-[#000E28] dark:text-white tracking-tight leading-none font-sans">
              {activeConfig.kpiRate}
            </div>
            <div className="text-[15px] sm:text-[16px] font-bold text-[#001D4A] dark:text-blue-100 tracking-tight leading-tight mt-1.5 whitespace-nowrap">
              Attendance
            </div>
          </div>

          {/* Row 3: Trend footer (Exact to reference screenshot) */}
          <div className="relative z-10 mt-3 pt-0.5 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-[11px] sm:text-[12px] font-extrabold text-[#059669] dark:text-emerald-400 leading-tight">
              {activeConfig.kpiTrend}
            </span>
          </div>
        </motion.div>

        {/* Card 2: Days Present */}
        <motion.div
          whileHover={{ y: -3, scale: 1.008 }}
          whileTap={{ scale: 0.99 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[24px] p-5 bg-gradient-to-br from-white via-white to-[#E6F9F0]/60 dark:from-[#07142F] dark:via-[#09221C] dark:to-[#0D382E] border border-emerald-100/90 dark:border-white/10 shadow-[0_4px_20px_rgba(16,185,129,0.05)] hover:shadow-[0_12px_28px_-6px_rgba(16,185,129,0.14)] transition-all duration-300 min-h-[148px] flex flex-col justify-between group cursor-pointer"
        >
          {/* Row 1: Icon on left, Chevron on right */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#D1FAE5] to-[#A7F3D0] dark:from-emerald-950/60 dark:to-emerald-900/40 p-[2.5px] shadow-sm shadow-emerald-500/15 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-full bg-gradient-to-b from-[#10B981] to-[#059669] flex items-center justify-center shadow-inner">
                <Check className="w-5 h-5 text-white stroke-[2.8]" />
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
          </div>

          {/* Row 2: Metric & Title */}
          <div className="relative z-10 mt-3 min-w-0">
            <div className="text-[28px] sm:text-[32px] font-black text-[#000E28] dark:text-white tracking-tight leading-none font-sans">
              {activeConfig.daysPresent}
            </div>
            <div className="text-[15px] sm:text-[16px] font-bold text-[#001D4A] dark:text-emerald-100 tracking-tight leading-tight mt-1.5 whitespace-nowrap">
              Days Present
            </div>
          </div>

          {/* Row 3: Trend footer */}
          <div className="relative z-10 mt-3 pt-0.5 flex items-center justify-between">
            <span className="text-[12px] sm:text-[12.5px] font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">
              {activeConfig.daysTotal}
            </span>
          </div>
        </motion.div>

        {/* Card 3: Days Absent */}
        <motion.div
          whileHover={{ y: -3, scale: 1.008 }}
          whileTap={{ scale: 0.99 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[24px] p-5 bg-gradient-to-br from-white via-white to-[#FFF1F2]/70 dark:from-[#07142F] dark:via-[#220B11] dark:to-[#380E18] border border-rose-100/90 dark:border-white/10 shadow-[0_4px_20px_rgba(244,63,94,0.05)] hover:shadow-[0_12px_28px_-6px_rgba(244,63,94,0.14)] transition-all duration-300 min-h-[148px] flex flex-col justify-between group cursor-pointer"
        >
          {/* Row 1: Icon on left, Chevron on right */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#FFE4E6] to-[#FECDD3] dark:from-rose-950/60 dark:to-rose-900/40 p-[2.5px] shadow-sm shadow-rose-500/15 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-full bg-gradient-to-b from-[#F43F5E] to-[#E11D48] flex items-center justify-center shadow-inner">
                <AlertCircle className="w-5 h-5 text-white stroke-[2.4]" />
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-rose-400 group-hover:translate-x-0.5 transition-transform" />
          </div>

          {/* Row 2: Metric & Title */}
          <div className="relative z-10 mt-3 min-w-0">
            <div className="text-[28px] sm:text-[32px] font-black text-[#000E28] dark:text-white tracking-tight leading-none font-sans">
              {activeConfig.daysAbsent}
            </div>
            <div className="text-[15px] sm:text-[16px] font-bold text-[#001D4A] dark:text-rose-100 tracking-tight leading-tight mt-1.5 whitespace-nowrap">
              {activeConfig.daysAbsent === "1" ? "Day Absent" : "Days Absent"}
            </div>
          </div>

          {/* Row 3: Trend footer */}
          <div className="relative z-10 mt-3 pt-0.5 flex items-center justify-between">
            <span className="text-[12px] sm:text-[12.5px] font-bold text-rose-600 dark:text-rose-400 whitespace-nowrap">
              {activeConfig.absentNote}
            </span>
          </div>
        </motion.div>

        {/* Card 4: Late Arrival */}
        <motion.div
          whileHover={{ y: -3, scale: 1.008 }}
          whileTap={{ scale: 0.99 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[24px] p-5 bg-gradient-to-br from-white via-white to-[#FFFBEB]/70 dark:from-[#07142F] dark:via-[#241705] dark:to-[#382307] border border-amber-100/90 dark:border-white/10 shadow-[0_4px_20px_rgba(245,158,11,0.05)] hover:shadow-[0_12px_28px_-6px_rgba(245,158,11,0.14)] transition-all duration-300 min-h-[148px] flex flex-col justify-between group cursor-pointer"
        >
          {/* Row 1: Icon on left, Chevron on right */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] dark:from-amber-950/60 dark:to-amber-900/40 p-[2.5px] shadow-sm shadow-amber-500/15 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-full bg-gradient-to-b from-[#F59E0B] to-[#D97706] flex items-center justify-center shadow-inner">
                <Clock className="w-5 h-5 text-white stroke-[2.4]" />
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
          </div>

          {/* Row 2: Metric & Title */}
          <div className="relative z-10 mt-3 min-w-0">
            <div className="text-[28px] sm:text-[32px] font-black text-[#000E28] dark:text-white tracking-tight leading-none font-sans">
              {activeConfig.lateCount}
            </div>
            <div className="text-[15px] sm:text-[16px] font-bold text-[#001D4A] dark:text-amber-100 tracking-tight leading-tight mt-1.5 whitespace-nowrap">
              {activeConfig.lateCount === "1" ? "Late Arrival" : "Late Arrivals"}
            </div>
          </div>

          {/* Row 3: Trend footer */}
          <div className="relative z-10 mt-3 pt-0.5 flex items-center justify-between">
            <span className="text-[12px] sm:text-[12.5px] font-bold text-amber-600 dark:text-amber-400 whitespace-nowrap">
              {activeConfig.lateNote}
            </span>
          </div>
        </motion.div>

      </section>

      {/* ========================================================
          4. FILTER BUTTONS & DATE SELECTOR ROW
      ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        {/* Left Segmented Filter */}
        <div className="bg-[#f0f4f9] rounded-full p-1 inline-flex items-center gap-1 border border-slate-200/60 shadow-2xs self-start">
          {(["Today", "This Week", "This Month", "Academic Year"] as const).map((item) => (
            <button
              key={item}
              onClick={() => setTimeframe(item)}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-all ${
                timeframe === item
                  ? "bg-[#1c64f2] text-white shadow-xs"
                  : "text-slate-600 hover:text-[#1c64f2]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Right Date Selector Capsule */}
        <div className="bg-white rounded-full border border-slate-200 px-4 py-2 flex items-center gap-3 text-xs font-bold text-slate-700 shadow-2xs self-start sm:self-auto">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span className="min-w-[180px] text-center">{dateOptions[currentDateIndex]}</span>
          <div className="flex items-center gap-1 text-slate-400 pl-1">
            <button
              onClick={() => setCurrentDateIndex((prev) => Math.min(dateOptions.length - 1, prev + 1))}
              disabled={currentDateIndex === dateOptions.length - 1}
              className="p-1 rounded hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Previous date"
              type="button"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setCurrentDateIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentDateIndex === 0}
              className="p-1 rounded hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Next date"
              type="button"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          5. MAIN LOWER TWO-COLUMN GRID
      ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ================= COLUMN 1: ATTENDANCE OVERVIEW (7-DAY BARS) ================= */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-[0_2px_14px_rgba(0,0,0,0.03)] space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#000e28]">Attendance Overview</h3>
                  <p className="text-xs text-slate-400">{activeConfig.subtitle}</p>
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10b981]" /> Present
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#f43f5e]" /> Absent
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#f59e0b]" /> Late
                </span>
              </div>
            </div>

            {/* 7-Day Stacked Bar Chart */}
            <div className="relative pt-6 pb-2">
              <div className="flex items-end justify-between gap-2 sm:gap-4 h-48 px-2 sm:px-6 relative">
                {/* Horizontal Grid lines */}
                <div className="absolute inset-x-0 top-0 border-b border-dashed border-slate-100 flex items-center justify-start text-[10px] text-slate-400">
                  <span className="bg-white pr-2">100%</span>
                </div>
                <div className="absolute inset-x-0 top-1/4 border-b border-dashed border-slate-100 flex items-center justify-start text-[10px] text-slate-400">
                  <span className="bg-white pr-2">75%</span>
                </div>
                <div className="absolute inset-x-0 top-2/4 border-b border-dashed border-slate-100 flex items-center justify-start text-[10px] text-slate-400">
                  <span className="bg-white pr-2">50%</span>
                </div>
                <div className="absolute inset-x-0 top-3/4 border-b border-dashed border-slate-100 flex items-center justify-start text-[10px] text-slate-400">
                  <span className="bg-white pr-2">25%</span>
                </div>
                <div className="absolute inset-x-0 bottom-0 border-b border-slate-200 flex items-center justify-start text-[10px] text-slate-400">
                  <span className="bg-white pr-2">0%</span>
                </div>

                {/* 7 Stacked Bars */}
                {barChartData.map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full z-10 group/bar">
                    <span className="text-[11px] font-bold text-slate-700 mb-1.5 transition-transform group-hover/bar:scale-110">
                      {item.label}
                    </span>
                    <div
                      className="w-7 sm:w-10 rounded-t-lg overflow-hidden flex flex-col-reverse justify-start bg-slate-100 shadow-2xs transition-all duration-300 group-hover/bar:brightness-105"
                      style={{ height: `${item.label}` }}
                    >
                      {/* Absent Segment (Red) */}
                      {item.absentH > 0 && (
                        <div className="w-full bg-[#f43f5e]" style={{ height: `${item.absentH * 1.5}px` }} />
                      )}
                      {/* Late Segment (Orange) */}
                      {item.lateH > 0 && (
                        <div className="w-full bg-[#f59e0b]" style={{ height: `${item.lateH * 1.5}px` }} />
                      )}
                      {/* Present Segment (Green) */}
                      <div className="w-full bg-[#10b981] flex-1" />
                    </div>
                    <span className="text-[11px] font-medium text-slate-500 mt-2 whitespace-nowrap">
                      {item.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Callout: Dynamic Highlight based on active timeframe */}
          <div className="bg-gradient-to-r from-[#eef6ff] to-[#f4f8fe] rounded-2xl p-4 border border-blue-100/80 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-[#1c64f2] flex items-center justify-center shrink-0">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black text-[#0050cb]">{activeConfig.highlightTitle}</p>
                <p className="text-xs text-slate-600">
                  {activeConfig.highlightDesc}
                </p>
              </div>
            </div>
            <button className="w-8 h-8 rounded-full border border-blue-200 bg-white text-[#1c64f2] flex items-center justify-center hover:bg-blue-50 shadow-2xs transition-colors shrink-0">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ================= COLUMN 2: ATTENDANCE HISTORY ================= */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-[0_2px_14px_rgba(0,0,0,0.03)] space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#000e28]">Attendance History</h3>
                <p className="text-xs text-slate-400">Complete record of your child&rsquo;s attendance</p>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#f8faff] text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-2.5 px-3 rounded-l-xl">Date</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Reason</th>
                    <th className="py-2.5 px-3 rounded-r-xl">Marked By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {historyData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-3 font-semibold text-slate-700">{row.date}</td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1.5 font-bold ${
                          row.status === "Present" ? "text-[#10b981]" : "text-[#f43f5e]"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            row.status === "Present" ? "bg-[#10b981]" : "bg-[#f43f5e]"
                          }`} />
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-500">{row.reason}</td>
                      <td className="py-3 px-3 text-slate-600">{row.markedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer View Full Link */}
            <div className="pt-2 text-right">
              <Link
                href="/parent/attendance"
                className="text-xs font-bold text-[#1c64f2] hover:text-blue-700 transition-colors inline-flex items-center gap-1"
              >
                <span>View Full Attendance History</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Callout: "Need to Report Absence?" */}
          <div className="bg-[#f8f9fe] rounded-2xl p-4 border border-slate-100 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100/70 text-purple-600 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black text-[#000e28]">Need to Report Absence?</p>
                <p className="text-[11px] text-slate-400">If your child will be absent, please inform the school in advance.</p>
              </div>
            </div>
            <button
              onClick={() => setIsReportAbsenceOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#1c64f2] hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all shrink-0 flex items-center gap-1"
            >
              <span>Report Absence</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* ========================================================
          REPORT ABSENCE MODAL DIALOG
      ======================================================== */}
      <AnimatePresence>
        {isReportAbsenceOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#0050cb] flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Report Planned Absence</h3>
                    <p className="text-[11px] text-slate-400">Notify the school registrar &amp; class teacher</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsReportAbsenceOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {absenceStatus === "success" ? (
                <div className="py-8 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">Absence Notified Successfully!</p>
                  <p className="text-xs text-slate-500">The class teacher has been notified of your request.</p>
                </div>
              ) : (
                <form onSubmit={handleReportAbsence} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Student
                    </label>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-[#000e28] flex items-center justify-between">
                      <span>{child.firstName} {child.lastName}</span>
                      <span className="text-[10px] text-blue-600 font-semibold">{child.grade} - {child.section}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Absence Date
                    </label>
                    <input
                      type="date"
                      required
                      value={absenceDate}
                      onChange={(e) => setAbsenceDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Reason for Absence
                    </label>
                    <select
                      value={absenceReason}
                      onChange={(e) => setAbsenceReason(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                    >
                      <option value="Medical / Fever">Medical / Fever</option>
                      <option value="Family Function">Family Function</option>
                      <option value="Travel / Vacation">Travel / Out of Town</option>
                      <option value="Other">Other Personal Reasons</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Doctor note or brief explanation..."
                      value={absenceNote}
                      onChange={(e) => setAbsenceNote(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden resize-none"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-[11px] text-blue-800 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>
                      Absences of 3 or more consecutive days require a medical certificate upon return.
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsReportAbsenceOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#1c64f2] hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20"
                    >
                      Submit Absence
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
