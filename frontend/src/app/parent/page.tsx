"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar, BookOpen, Clock, ChevronRight,
  Users, Award, Bell, Zap, CheckCircle2, ChevronDown,
  FileText, ArrowRight, ShieldCheck, TrendingUp, CalendarDays,
  Sparkles, MessageSquare, Phone, CalendarCheck, HelpCircle,
  Megaphone, Star, CheckCheck, UploadCloud, BarChart3, Send,
  Bookmark, Utensils, Palette, Calculator, Bus, Trophy, Heart,
  Camera, User
} from "lucide-react";
import FeePaymentModal from "@/components/parent/FeePaymentModal";
import ReportCardModal from "@/components/parent/ReportCardModal";
import AttendanceKpiCard from "@/components/parent/AttendanceKpiCard";
import PremiumKpiCard from "@/components/parent/PremiumKpiCard";
import ParentKpiRow from "@/components/parent/ParentKpiRow";
import ClassPerformanceCard from "@/components/parent/ClassPerformanceCard";
import TodayScheduleCard from "@/components/parent/TodayScheduleCard";
import QuickActionsCard from "@/components/parent/QuickActionsCard";
import { useParent } from "@/context/ParentContext";

export default function ParentDashboard() {
  const { user, parentProfile, children, selectedChild, selectChild } = useParent();
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const child = selectedChild || children[0] || {
    _id: "c10101010101010101010101",
    firstName: "Aarav",
    lastName: "Sharma",
    grade: "LKG",
    section: "Section A",
    rollNumber: "LKG001",
    studentPhoto: "/aarav-profile-avatar.png",
  };

  return (
    <div className="space-y-4 pb-12 font-sans antialiased text-slate-800 dark:text-slate-100">
      {/* ========================================================
          1. TOP MAIN SECTION (2 COLUMNS):
          LEFT (8 COLS): HERO BANNER + KPIS + (TODAY'S SCHEDULE [7 cols] & QUICK ACTIONS [5 cols])
          RIGHT (4 COLS): MY CHILD CARD + RECENT NOTICES
      ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* LEFT COLUMN (8 COLS / ~67% OF PAGE) */}
        <div className="lg:col-span-8 space-y-4">
          {/* HERO BANNER - GGPS FAMILY PORTAL */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full bg-gradient-to-br from-white/95 via-[#F8FAFF]/90 to-[#EAF2FF]/85 dark:from-[#0B1A3A]/95 dark:via-[#091530]/90 dark:to-[#050E22]/90 backdrop-blur-md rounded-[22px] border border-blue-200/50 dark:border-white/10 relative overflow-hidden shadow-[0_10px_28px_-6px_rgba(0,80,203,0.08),0_0_20px_rgba(59,130,246,0.06)] group min-h-[220px] flex flex-col justify-between"
          >
            {/* Full-bleed Background Artwork with NO white gaps */}
            <div className="absolute inset-0 w-full h-full">
              <Image
                src="/little-steps-clean-hero.png"
                alt="GGPS School Family Portal"
                fill
                priority
                sizes="(max-width: 1200px) 100vw, 900px"
                className="object-cover object-bottom transition-transform duration-700 group-hover:scale-[1.01]"
              />
            </div>

            {/* Left Live Content Overlay */}
            <div className="relative z-10 p-5 sm:p-6 pb-6 flex flex-col justify-between h-full max-w-[65%] sm:max-w-[58%] pointer-events-none">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 dark:bg-[#000E28]/90 backdrop-blur-md border border-blue-200/80 text-[11px] font-extrabold text-[#0050CB] dark:text-blue-200 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                  <span>GGPS FAMILY PORTAL</span>
                </div>

                <h1 className="text-xl sm:text-2xl md:text-[25px] font-black text-[#000E28] tracking-tight leading-tight flex items-center gap-1.5 mt-2">
                  <span>Good Morning, {parentProfile?.motherName?.split(' ')[0] || "Priya"} 👋</span>
                </h1>

                <p className="text-xs sm:text-[13px] font-bold text-[#102A5C] dark:text-blue-100 leading-snug mt-1">
                  Stay connected with your child&apos;s learning journey.
                </p>

                <p className="text-[11px] sm:text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed mt-0.5 hidden sm:block">
                  Track attendance, learning, activities and school updates — all in one place.
                </p>
              </div>

              {/* Child Info Tag & Date */}
              <div className="flex flex-wrap items-center gap-2 mt-3 pt-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/95 dark:bg-[#000E28]/85 backdrop-blur-md border border-blue-200/80 text-[11px] font-bold text-[#0050CB] dark:text-blue-200 shadow-2xs">
                  <span>{child.firstName} {child.lastName}</span>
                  <span className="text-blue-300">•</span>
                  <span>{child.grade}</span>
                  <span className="text-blue-300">•</span>
                  <span>{child.section}</span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/90 dark:bg-[#000E28]/80 backdrop-blur-md border border-slate-200/80 text-[11px] font-bold text-slate-600 dark:text-slate-300 shadow-2xs">
                  <Calendar className="w-3 h-3 text-[#0050CB]" />
                  <span>Monday, 21 September 2026</span>
                </div>
              </div>
            </div>

            {/* Right Bubble Overlay: Play • Learn • Grow */}
            <div className="absolute top-3.5 right-3.5 sm:top-4 sm:right-5 z-10 pointer-events-none">
              <div className="bg-white/95 dark:bg-[#07142F]/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border-2 border-sky-200/80 shadow-md shadow-blue-500/10 text-center">
                <p className="text-[10.5px] sm:text-[11px] font-black text-[#0050CB] leading-tight flex items-center gap-1">
                  Play • Learn • Grow <span className="text-rose-500">♡</span>
                </p>
              </div>
            </div>

            {/* Floating animated sparkles */}
            <motion.div
              animate={{ y: [-3, 3, -3], rotate: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute top-3 left-[46%] pointer-events-none text-yellow-400 drop-shadow-sm select-none text-sm"
            >
              ✨
            </motion.div>
            <motion.div
              animate={{ y: [3, -4, 3], rotate: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute bottom-6 right-[42%] pointer-events-none text-pink-400 select-none text-xs"
            >
              🌸
            </motion.div>
          </motion.div>

          {/* ========================================================
              MY CHILDREN SELECTOR BAR (SECTION 8)
          ======================================================== */}
          <div className="w-full bg-white/95 dark:bg-[#07142F]/95 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 border border-blue-100/90 dark:border-white/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950 text-[#0050CB] flex items-center justify-center font-bold text-xs">
                <Users className="w-3.5 h-3.5 text-[#0050CB]" />
              </div>
              <div>
                <span className="text-xs font-black text-[#000E28] dark:text-white uppercase tracking-wider">
                  My Children ({children.length})
                </span>
                <span className="text-[11px] text-slate-400 ml-1.5 hidden sm:inline">
                  Click to switch active child
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {children.map((c) => {
                const isSelected = (selectedChild?._id || children[0]?._id) === c._id;
                const photo = c.studentPhoto || (c.firstName === "Ananya" ? "/ananya-student.jpg" : "/aarav-profile-avatar.png");
                return (
                  <button
                    key={c._id}
                    onClick={() => selectChild(c._id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-gradient-to-r from-[#0050CB] to-[#2563EB] text-white shadow-md shadow-blue-500/20 ring-2 ring-blue-300 dark:ring-blue-400"
                        : "bg-slate-50 dark:bg-white/5 hover:bg-blue-50/80 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-white/10"
                    }`}
                  >
                    <div className="relative w-5 h-5 rounded-full overflow-hidden border border-white/40 shrink-0">
                      <Image
                        src={photo}
                        alt={c.firstName}
                        fill
                        sizes="20px"
                        className="object-cover"
                      />
                    </div>
                    <span>{c.firstName}</span>
                    <span className="opacity-75 font-normal text-[11px]">({c.grade})</span>
                    <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-black ${
                      isSelected ? "bg-white/20 text-white" : "bg-blue-100 text-[#0050CB]"
                    }`}>
                      {c.attendanceRate || 94}%
                    </span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0 ml-0.5" />}
                  </button>
                );
              })}

              <Link
                href="/parent/children"
                className="text-xs font-bold text-[#0050CB] dark:text-blue-300 hover:underline px-2 py-1 ml-auto sm:ml-1"
              >
                All Children →
              </Link>
            </div>
          </div>

          {/* FIVE PREMIUM KPI CARDS */}
          <ParentKpiRow
            onPayNowClick={() => setIsFeeModalOpen(true)}
            onAssessmentClick={() => setIsReportModalOpen(true)}
          />

          {/* TODAY'S SCHEDULE (~58%) + QUICK ACTIONS (~42%) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
            {/* TODAY'S SCHEDULE (7 COLS = ~58% of row) */}
            <TodayScheduleCard className="md:col-span-7" />

            {/* QUICK ACTIONS (5 COLS = ~42% of row) */}
            <QuickActionsCard
              className="md:col-span-5"
              onViewResults={() => setIsReportModalOpen(true)}
            />
          </div>
        </div>

        {/* RIGHT COLUMN (4 COLS / ~33% OF PAGE) */}
        <div className="lg:col-span-4 space-y-4">
          {/* "MY CHILD" CARD */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full relative overflow-hidden rounded-[26px] p-5 sm:p-6 bg-gradient-to-b from-[#FFFFFF] via-[#F8FBFF] to-[#EDF5FF] dark:from-[#0B1A3A] dark:via-[#081530] dark:to-[#050E22] border border-blue-200/70 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-400/30 shadow-[0_12px_32px_-4px_rgba(0,80,203,0.08),0_4px_16px_rgba(59,130,246,0.06)] hover:shadow-[0_18px_40px_-6px_rgba(0,80,203,0.16)] flex flex-col justify-between space-y-4 group transition-shadow duration-300"
          >
            {/* Subtle Decorative Pastel Watercolor/Botanical Accents */}
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-sky-200/40 via-blue-100/20 to-transparent rounded-full blur-md pointer-events-none select-none" />
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-bl from-purple-200/35 via-pink-100/20 to-transparent rounded-full blur-md pointer-events-none select-none" />
            <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-tr from-blue-200/30 via-indigo-100/10 to-transparent rounded-full blur-md pointer-events-none select-none" />

            {/* Floating Gold Crown in Top-Right Corner */}
            <motion.div
              animate={{ y: [-2, 3, -2], rotate: [8, 14, 8] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
              className="absolute top-3.5 right-4 pointer-events-none select-none drop-shadow-sm z-10"
            >
              <svg width="34" height="28" viewBox="0 0 36 30" fill="none" className="transform rotate-6">
                <path
                  d="M3 10L8 24H28L33 10L23 17L18 4L13 17L3 10Z"
                  fill="url(#goldCrownGrad)"
                  stroke="#F59E0B"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
                <circle cx="3" cy="9" r="2" fill="#FCD34D" />
                <circle cx="18" cy="3" r="2.5" fill="#FCD34D" />
                <circle cx="33" cy="9" r="2" fill="#FCD34D" />
                <defs>
                  <linearGradient id="goldCrownGrad" x1="18" y1="4" x2="18" y2="24" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FDE047" />
                    <stop offset="0.5" stopColor="#F59E0B" />
                    <stop offset="1" stopColor="#D97706" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>

            {/* Subtle Pastel Leaf Accent (Bottom-Right) */}
            <div className="absolute bottom-16 -right-1 pointer-events-none select-none opacity-85 z-0">
              <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
                <path
                  d="M24 6C14 16 10 28 14 38C24 38 36 34 42 24C36 14 28 8 24 6Z"
                  fill="#BEF264"
                  opacity="0.75"
                />
                <path
                  d="M18 36C22 28 30 20 40 14"
                  stroke="#65A30D"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity="0.5"
                />
                <path
                  d="M26 26L32 30"
                  stroke="#65A30D"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity="0.5"
                />
              </svg>
            </div>

            {/* Child Identity Row: Avatar + Name + Grade */}
            <div className="relative z-10 flex items-center gap-4">
              <div className="relative shrink-0">
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.25 }}
                  className="relative w-[76px] h-[76px] rounded-full overflow-hidden border-2 border-white dark:border-white/20 shadow-md shadow-blue-500/10"
                >
                  <Image
                    src={child.studentPhoto || (child.firstName === "Ananya" ? "/ananya-student.jpg" : "/aarav-profile-avatar.png")}
                    alt={`${child.firstName} ${child.lastName}`}
                    fill
                    sizes="76px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </motion.div>

                {/* Blue Camera Button Badge */}
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  title="Update Photo"
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] ring-2 ring-white dark:ring-[#07142F] text-white flex items-center justify-center shadow-md cursor-pointer transition-transform"
                >
                  <Camera className="w-3.5 h-3.5 text-white" />
                </motion.button>
              </div>

              {/* Name and Grade */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl sm:text-[22px] font-black text-[#000E28] dark:text-white tracking-tight leading-tight truncate">
                    {child.firstName} {child.lastName}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-[10px] font-black shrink-0">
                    Active
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
                  {child.grade} - {child.section}
                </p>
              </div>
            </div>

            {/* Three Clean Information Rows with Blue Outline Icons */}
            <div className="relative z-10 space-y-3.5 pt-1">
              <div className="flex items-center gap-3.5 text-sm font-semibold text-slate-700 dark:text-slate-200">
                <div className="w-5 h-5 flex items-center justify-center text-[#0050CB] shrink-0">
                  <Calendar className="w-5 h-5 text-[#0050CB]" />
                </div>
                <span className="leading-tight">DOB : {child.firstName === "Ananya" ? "05 Aug 2017" : "12 Jan 2020"}</span>
              </div>

              <div className="flex items-center gap-3.5 text-sm font-semibold text-slate-700 dark:text-slate-200">
                <div className="w-5 h-5 flex items-center justify-center text-[#0050CB] shrink-0">
                  <User className="w-5 h-5 text-[#0050CB]" />
                </div>
                <span className="leading-tight">Admission No : {child.admissionNumber || (child.firstName === "Ananya" ? "GGPS-2022-042" : "GGPS-2024-089")}</span>
              </div>

              <div className="flex items-center gap-3.5 text-sm font-semibold text-slate-700 dark:text-slate-200">
                <div className="w-5 h-5 flex items-center justify-center text-[#0050CB] shrink-0">
                  <Phone className="w-5 h-5 text-[#0050CB] fill-[#0050CB]" />
                </div>
                <span className="leading-tight">{child.emergencyContact || parentProfile?.fatherContact || "+91 98765 43210"}</span>
              </div>
            </div>

            {/* View Full Profile Premium Pill Button */}
            <div className="relative z-10 pt-1">
              <Link
                href="/parent/children"
                className="group relative w-full py-3 px-6 rounded-full bg-gradient-to-r from-[#4F8DFF] via-[#2563EB] to-[#1D4ED8] hover:from-[#3B82F6] hover:to-[#1E40AF] text-white text-sm font-bold text-center flex items-center justify-center gap-2 shadow-[0_8px_20px_-4px_rgba(37,99,235,0.4)] hover:shadow-[0_12px_28px_-4px_rgba(37,99,235,0.55)] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>View Full Profile</span>
                <span className="group-hover:translate-x-1.5 transition-transform duration-200">
                  →
                </span>
              </Link>
            </div>
          </motion.div>

          {/* RECENT NOTICES CARD */}
          <div className="bg-white/95 dark:bg-[#07142F]/95 backdrop-blur-md rounded-[24px] p-4 sm:p-5 border border-blue-100/80 dark:border-white/10 shadow-[0_8px_30px_rgba(0,80,203,0.04)] flex flex-col justify-between space-y-3 transition-colors">
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-blue-50 dark:border-white/5 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#0050CB] dark:text-blue-300 flex items-center justify-center shadow-2xs border border-blue-100/60 dark:border-white/10 shrink-0">
                  <Bell className="w-4 h-4 text-[#0050CB] dark:text-blue-400" />
                </div>
                <h2 className="text-[15px] sm:text-[16px] font-bold text-[#123B82] dark:text-white tracking-tight whitespace-nowrap">
                  Recent Notices
                </h2>
              </div>
              <Link
                href="/parent/notifications"
                className="text-xs font-bold text-[#0050CB] dark:text-blue-300 hover:underline shrink-0 whitespace-nowrap ml-2"
              >
                View All →
              </Link>
            </div>

            {/* Notices List */}
            <div className="space-y-2 flex-1 flex flex-col justify-between mt-0.5">
              {/* Notice 1 */}
              <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors group cursor-pointer">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 border border-rose-100 dark:border-rose-900/40 flex items-center justify-center shrink-0 shadow-2xs">
                    <Bookmark className="w-3.5 h-3.5 text-rose-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12.5px] sm:text-[13px] font-bold text-slate-900 dark:text-white leading-tight truncate">
                      Parent Teacher Meeting
                    </p>
                    <p className="text-[10.5px] text-slate-400 font-medium">16 Jun 2025</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#FFE4E8] text-[#E11D48] text-[9.5px] font-bold shrink-0 ml-2 shadow-2xs">
                  New
                </span>
              </div>

              {/* Notice 2 */}
              <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors group cursor-pointer">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-500 border border-amber-100 dark:border-amber-900/40 flex items-center justify-center shrink-0 shadow-2xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12.5px] sm:text-[13px] font-bold text-slate-900 dark:text-white leading-tight truncate">
                      Holiday Notice - 20 June 2025
                    </p>
                    <p className="text-[10.5px] text-slate-400 font-medium">10 Jun 2025</p>
                  </div>
                </div>
              </div>

              {/* Notice 3 */}
              <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors group cursor-pointer">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-500 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center shrink-0 shadow-2xs">
                    <Bell className="w-3.5 h-3.5 text-indigo-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12.5px] sm:text-[13px] font-bold text-slate-900 dark:text-white leading-tight truncate">
                      School Annual Day Preparation
                    </p>
                    <p className="text-[10.5px] text-slate-400 font-medium">12 Jun 2025</p>
                  </div>
                </div>
              </div>

              {/* Notice 4 */}
              <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors group cursor-pointer">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 border border-amber-100 dark:border-amber-900/40 flex items-center justify-center shrink-0 shadow-2xs">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12.5px] sm:text-[13px] font-bold text-slate-900 dark:text-white leading-tight truncate">
                      Mid Term Exam Schedule
                    </p>
                    <p className="text-[10.5px] text-slate-400 font-medium">14 Jun 2025</p>
                  </div>
                </div>
              </div>

              {/* Notice 5 */}
              <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors group cursor-pointer">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center shrink-0 shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12.5px] sm:text-[13px] font-bold text-slate-900 dark:text-white leading-tight truncate">
                      Sports Day Uniform Reminder
                    </p>
                    <p className="text-[10.5px] text-slate-400 font-medium">08 Jun 2025</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer status */}
            <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
              <span>5 notices this month</span>
              <span className="font-semibold text-[#0050CB] dark:text-blue-400">All caught up</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          4. ROW 4: CLASS PERFORMANCE | UPCOMING EVENTS | BUS BANNER
      ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
        {/* CLASS PERFORMANCE (1/3) */}
        <ClassPerformanceCard
          onViewDetailsClick={() => setIsReportModalOpen(true)}
        />

        {/* UPCOMING EVENTS (1/3) */}
        <div className="bg-white/95 dark:bg-[#07142F]/95 backdrop-blur-md rounded-[24px] p-4 sm:p-5 border border-blue-100/80 dark:border-white/10 shadow-[0_8px_30px_rgba(0,80,203,0.04)] flex flex-col justify-between space-y-3 transition-colors">
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-blue-50 dark:border-white/5 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#0050CB] dark:text-blue-300 flex items-center justify-center shadow-2xs border border-blue-100/60 dark:border-white/10 shrink-0">
                <Calendar className="w-4 h-4 text-[#0050CB] dark:text-blue-400" />
              </div>
              <h2 className="text-[15px] sm:text-[16px] font-bold text-[#123B82] dark:text-white tracking-tight whitespace-nowrap">
                Upcoming Events
              </h2>
            </div>
            <Link
              href="/parent/events"
              className="text-xs font-bold text-[#0050CB] dark:text-blue-300 hover:underline shrink-0 whitespace-nowrap ml-2"
            >
              View All →
            </Link>
          </div>

          {/* Events List */}
          <div className="space-y-2 flex-1 flex flex-col justify-between mt-0.5">
            {/* Event 1: Fancy Dress Competition */}
            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors group cursor-pointer">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="w-8 h-8 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0 shadow-2xs">
                  <Trophy className="w-4 h-4 text-[#D97706]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[12.5px] sm:text-[13px] font-bold text-[#000E28] dark:text-white leading-tight truncate">
                    Fancy Dress Competition
                  </p>
                  <p className="text-[10.5px] text-slate-400 font-medium">18 Jun 2025</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 shrink-0">
                Campus
              </span>
            </div>

            {/* Event 2: Field Trip - Zoo */}
            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors group cursor-pointer">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="w-8 h-8 rounded-full bg-[#D1FAE5] text-[#059669] flex items-center justify-center shrink-0 shadow-2xs">
                  <Bus className="w-4 h-4 text-[#059669]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[12.5px] sm:text-[13px] font-bold text-[#000E28] dark:text-white leading-tight truncate">
                    Field Trip - Zoo
                  </p>
                  <p className="text-[10.5px] text-slate-400 font-medium">25 Jun 2025</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 shrink-0">
                Trip
              </span>
            </div>

            {/* Event 3: Parent Orientation */}
            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors group cursor-pointer">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="w-8 h-8 rounded-full bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center shrink-0 shadow-2xs">
                  <Users className="w-4 h-4 text-[#7C3AED]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[12.5px] sm:text-[13px] font-bold text-[#000E28] dark:text-white leading-tight truncate">
                    Parent Orientation
                  </p>
                  <p className="text-[10.5px] text-slate-400 font-medium">28 Jun 2025</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 shrink-0">
                Auditorium
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
            <span>3 scheduled this month</span>
            <Link href="/parent/events" className="font-semibold text-[#0050CB] dark:text-blue-400 hover:underline">
              View Calendar →
            </Link>
          </div>
        </div>

        {/* BUS BANNER CARD (1/3) - HIGH RESOLUTION GGPS ARTWORK */}
        <motion.div
          whileHover={{ scale: 1.015 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-[#07142F] rounded-[24px] overflow-hidden border border-blue-100/80 dark:border-white/10 shadow-[0_8px_30px_rgba(0,80,203,0.04)] hover:shadow-[0_12px_36px_rgba(0,80,203,0.1)] relative min-h-[200px] h-full group"
        >
          <Image
            src="/little-steps-bus.png"
            alt="Happy Learning Little Ones - GGPS School Bus"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 500px"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </motion.div>
      </div>

      {/* Modals */}
      <FeePaymentModal
        isOpen={isFeeModalOpen}
        onClose={() => setIsFeeModalOpen(false)}
        childName={`${child.firstName} ${child.lastName}`}
      />

      <ReportCardModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        child={child as any}
      />
    </div>
  );
}
