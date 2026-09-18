"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  User,
  Phone,
  ArrowRight,
  Check,
} from "lucide-react";

export interface StudentCardProps {
  id?: string | number;
  rollNo: string;
  name: string;
  photo: string;
  status: "Present" | "Absent" | "Late" | string;
  age?: string;
  gender?: "Male" | "Female" | string;
  parentLabel?: string;
  parentName: string;
  phone: string;
  attendanceRate: number;
  classNameLabel?: string;
  theme?: "rose" | "blue";
  onViewProfile: () => void;
  onMenuClick?: () => void;
  className?: string;
}

export default function StudentCard({
  rollNo,
  name,
  photo,
  status = "Present",
  gender = "Female",
  parentLabel = "Father",
  parentName,
  phone,
  attendanceRate = 92,
  classNameLabel = "LKG - Section A",
  theme,
  onViewProfile,
  className = "",
}: StudentCardProps) {
  // Auto-select theme (rose for female / blue for male) or use explicit theme
  const cardTheme = theme || (gender === "Female" ? "rose" : "blue");
  const isRose = cardTheme === "rose";

  // Formatted 2-digit roll number (e.g., "1" -> "01")
  const formattedRoll = String(rollNo).padStart(2, "0");

  // Gauge calculations (Radius = 22, Circumference = ~138.23)
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (Math.min(attendanceRate, 100) / 100) * circumference;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden rounded-[32px] bg-white dark:bg-[#111827] ${
        isRose
          ? "border border-[#FFE4EC] dark:border-rose-950/50 shadow-[0_10px_35px_rgba(244,114,182,0.08)]"
          : "border border-[#D0E2FF] dark:border-blue-950/50 shadow-[0_10px_35px_rgba(37,99,235,0.08)]"
      } p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 ${className}`}
    >
      {/* ========================================================================= */}
      {/* TOP SECTION: STUDENT SQUIRCLE PHOTO + RIGHT INFO (CAP, STATUS, GAUGE, ROLL) */}
      {/* ========================================================================= */}
      <div className="flex items-start gap-4 relative z-10">
        {/* 1. Student Photo Squircle with colored border ring & verified green check */}
        <div className="relative shrink-0">
          <div
            className={`w-24 h-24 sm:w-28 sm:h-28 p-1 rounded-[26px] ${
              isRose
                ? "bg-gradient-to-tr from-[#FFD5DC] to-[#FCA5A5]"
                : "bg-gradient-to-tr from-[#BFDBFE] to-[#93C5FD]"
            } shadow-xs`}
          >
            <img
              src={photo}
              alt={name}
              className="w-full h-full object-cover rounded-[22px]"
            />
          </div>

          {/* Verified Green Tick Badge */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#10B981] text-white flex items-center justify-center ring-2 ring-white dark:ring-[#111827] shadow-sm">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        </div>

        {/* 2. Right Info Block */}
        <div className="flex-1 min-w-0 flex flex-col justify-between h-24 sm:h-28">
          {/* Top Row: Graduation Cap Icon + Status Badge */}
          <div className="flex items-center justify-between gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                isRose
                  ? "bg-[#FFF0F3] dark:bg-rose-950/40 text-[#E11D48] dark:text-rose-300"
                  : "bg-[#EFF6FF] dark:bg-blue-950/40 text-[#2563EB] dark:text-blue-300"
              }`}
            >
              <GraduationCap className="w-4 h-4 stroke-[2.2]" />
            </div>

            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 shadow-2xs ${
                isRose
                  ? "bg-[#FFF1F2] text-[#BE123C] dark:bg-rose-950/40 dark:text-rose-300 border border-[#FFE4E6] dark:border-rose-800/50"
                  : "bg-[#EFF6FF] text-[#1D4ED8] dark:bg-blue-950/40 dark:text-blue-300 border border-[#DBEAFE] dark:border-blue-800/50"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  status === "Present"
                    ? isRose
                      ? "bg-[#10B981]"
                      : "bg-[#2563EB]"
                    : "bg-rose-500"
                }`}
              />
              <span>{status}</span>
            </span>
          </div>

          {/* Middle Row: Circular Attendance / Rating Progress Ring */}
          <div className="flex justify-end pr-2">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 54 54">
                {/* Background Ring */}
                <circle
                  cx="27"
                  cy="27"
                  r={radius}
                  className={isRose ? "text-[#FFE4E6] dark:text-slate-800" : "text-[#DBEAFE] dark:text-slate-800"}
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="none"
                />
                {/* Progress Arc */}
                <circle
                  cx="27"
                  cy="27"
                  r={radius}
                  className={isRose ? "text-[#FB7185]" : "text-[#2563EB]"}
                  strokeWidth="4"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-xs font-black text-[#0A1B39] dark:text-white leading-none">
                  {attendanceRate}%
                </span>
                <span className="text-[8px] font-bold text-slate-400 dark:text-slate-400 mt-0.5">
                  Rated
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Row: Roll Number & Section Tag */}
          <div className="flex items-center justify-between pt-0.5">
            <div className="text-xs">
              <span className="font-serif italic text-slate-500 dark:text-slate-400">Roll: </span>
              <span className="font-black text-sm text-[#0A1B39] dark:text-white">
                {formattedRoll}
              </span>
            </div>

            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isRose
                  ? "bg-[#FFF1F2] text-[#E11D48] dark:bg-rose-950/40 dark:text-rose-300"
                  : "bg-[#EFF6FF] text-[#2563EB] dark:bg-blue-950/40 dark:text-blue-300"
              }`}
            >
              {classNameLabel}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MIDDLE SECTION: PARENT & CONTACT INFORMATION CONTAINER                    */}
      {/* ========================================================================= */}
      <div
        className={`mt-4 rounded-2xl p-3 sm:p-3.5 grid grid-cols-2 divide-x ${
          isRose
            ? "bg-[#FFF8F9] dark:bg-rose-950/20 border border-[#FFE4EC] dark:border-rose-900/30 divide-[#FFE4EC] dark:divide-rose-900/30"
            : "bg-[#F8FAFC] dark:bg-blue-950/20 border border-[#DCE7F5] dark:border-blue-900/30 divide-[#DCE7F5] dark:divide-blue-900/30"
        } relative z-10`}
      >
        {/* Parent Details */}
        <div className="pr-2">
          <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-400 font-medium">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>{parentLabel}:</span>
          </div>
          <span className="font-bold text-xs sm:text-[13px] text-[#0A1B39] dark:text-white block mt-1 truncate">
            {parentName}
          </span>
        </div>

        {/* Contact Details */}
        <div className="pl-3">
          <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-400 font-medium">
            <Phone className="w-3.5 h-3.5 text-slate-400" />
            <span>Contact:</span>
          </div>
          <span className="font-bold text-xs sm:text-[13px] text-[#0A1B39] dark:text-white block mt-1 truncate">
            {phone}
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BOTTOM ACTION: FULL-WIDTH PILL GRADIENT BUTTON                            */}
      {/* ========================================================================= */}
      <div className="mt-4 relative z-10">
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={(e) => {
            e.stopPropagation();
            onViewProfile();
          }}
          className={`w-full py-2.5 px-4 rounded-full text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all ${
            isRose
              ? "bg-gradient-to-r from-[#DF747E] via-[#E88E96] to-[#EFA6A9] shadow-rose-300/30 hover:brightness-105"
              : "bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#6366F1] shadow-blue-500/25 hover:brightness-105"
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>View Profile</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </motion.button>
      </div>

      {/* ========================================================================= */}
      {/* BOTTOM BACKGROUND: ORGANIC CURVED WAVES + BOTANICAL LEAF TWIG             */}
      {/* ========================================================================= */}
      <svg
        className="absolute -bottom-1 -right-1 w-32 h-24 sm:w-40 sm:h-28 pointer-events-none z-0 select-none overflow-visible"
        viewBox="0 0 160 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft billowy background wave */}
        <path
          d="M20 110 C50 75 90 70 120 60 C140 54 152 40 160 20 V110 H20 Z"
          fill={isRose ? "rgba(255, 241, 242, 0.85)" : "rgba(239, 246, 255, 0.85)"}
        />
        {/* Foreground curved wave */}
        <path
          d="M60 110 C85 85 115 80 135 72 C148 68 155 58 160 45 V110 H60 Z"
          fill={isRose ? "rgba(255, 228, 230, 0.75)" : "rgba(219, 234, 254, 0.75)"}
        />

        {/* Botanical Leaves Branch in Bottom Right */}
        <g transform="translate(100, 35) rotate(-10)">
          {/* Stem */}
          <path
            d="M 5 65 Q 22 35 42 10"
            stroke={isRose ? "#D4A373" : "#3B82F6"}
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
          {/* Leaf 1 (Top) */}
          <path
            d="M 42 10 C 47 2 56 6 54 13 C 51 18 43 14 42 10 Z"
            fill={isRose ? "#D4A373" : "#3B82F6"}
          />
          {/* Leaf 2 (Right) */}
          <path
            d="M 33 28 C 42 24 49 32 44 37 C 39 40 34 33 33 28 Z"
            fill={isRose ? "#D4A373" : "#3B82F6"}
          />
          {/* Leaf 3 (Left) */}
          <path
            d="M 22 46 C 13 40 11 50 17 54 C 22 57 24 50 22 46 Z"
            fill={isRose ? "#D4A373" : "#3B82F6"}
          />
        </g>
      </svg>
    </motion.div>
  );
}
