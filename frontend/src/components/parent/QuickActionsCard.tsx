"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Zap,
  CalendarCheck,
  FileEdit,
  UploadCloud,
  BarChart3,
  Send,
  UserCheck,
  ArrowRight,
} from "lucide-react";

export interface QuickActionItem {
  id: string;
  title: string;
  subtitle: string;
  href?: string;
  onClick?: () => void;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  bgClass: string;
  hoverBgClass: string;
  borderClass: string;
  iconBgClass: string;
  iconColor: string;
  arrowColor: string;
  glowColor: string;
  badge?: string;
}

interface QuickActionsCardProps {
  className?: string;
  onViewResults?: () => void;
  onContactTeacher?: () => void;
}

export default function QuickActionsCard({
  className = "",
  onViewResults,
  onContactTeacher,
}: QuickActionsCardProps) {
  const shouldReduceMotion = useReducedMotion();

  const actions: QuickActionItem[] = useMemo(
    () => [
      {
        id: "attendance",
        title: "View Attendance",
        subtitle: "Track attendance",
        href: "/parent/attendance",
        icon: CalendarCheck,
        accentColor: "#0050CB",
        bgClass: "bg-[#EEF5FF] dark:bg-[#0A1A3B]",
        hoverBgClass: "hover:bg-[#E3EFFE] dark:hover:bg-[#0E234E]",
        borderClass: "border-[#D8E8FF] dark:border-blue-900/40",
        iconBgClass: "bg-white/95 dark:bg-blue-950/70 text-[#0050CB]",
        iconColor: "text-[#0050CB]",
        arrowColor: "text-[#0050CB]",
        glowColor: "rgba(0, 80, 203, 0.12)",
      },
      {
        id: "assignments",
        title: "Assignments",
        subtitle: "Pending assignments",
        href: "/parent/homework",
        icon: FileEdit,
        accentColor: "#7C3AED",
        bgClass: "bg-[#F7F0FF] dark:bg-[#1A1033]",
        hoverBgClass: "hover:bg-[#EFE6FF] dark:hover:bg-[#231545]",
        borderClass: "border-[#EBDCFF] dark:border-purple-900/40",
        iconBgClass: "bg-white/95 dark:bg-purple-950/70 text-[#7C3AED]",
        iconColor: "text-[#7C3AED]",
        arrowColor: "text-[#7C3AED]",
        glowColor: "rgba(124, 58, 237, 0.12)",
      },
      {
        id: "documents",
        title: "Upload Documents",
        subtitle: "School documents",
        href: "/parent/documents",
        icon: UploadCloud,
        accentColor: "#0D9488",
        bgClass: "bg-[#EEFAF5] dark:bg-[#082218]",
        hoverBgClass: "hover:bg-[#E2F6EE] dark:hover:bg-[#0D2F22]",
        borderClass: "border-[#D5F2E4] dark:border-emerald-900/40",
        iconBgClass: "bg-white/95 dark:bg-emerald-950/70 text-[#0D9488]",
        iconColor: "text-[#0D9488]",
        arrowColor: "text-[#0D9488]",
        glowColor: "rgba(13, 148, 136, 0.12)",
      },
      {
        id: "results",
        title: "View Results",
        subtitle: "Academic results",
        onClick: onViewResults,
        href: onViewResults ? undefined : "/parent/progress",
        icon: BarChart3,
        accentColor: "#E11D48",
        bgClass: "bg-[#FFF0F5] dark:bg-[#2B0C1A]",
        hoverBgClass: "hover:bg-[#FFE4EE] dark:hover:bg-[#381123]",
        borderClass: "border-[#FEDCE8] dark:border-rose-900/40",
        iconBgClass: "bg-white/95 dark:bg-rose-950/70 text-[#E11D48]",
        iconColor: "text-[#E11D48]",
        arrowColor: "text-[#E11D48]",
        glowColor: "rgba(225, 29, 72, 0.12)",
      },
      {
        id: "messages",
        title: "Send Message",
        subtitle: "Message teacher",
        href: "/parent/messages",
        icon: Send,
        accentColor: "#6366F1",
        bgClass: "bg-[#F2F1FF] dark:bg-[#121433]",
        hoverBgClass: "hover:bg-[#E8E6FF] dark:hover:bg-[#181B44]",
        borderClass: "border-[#E3E0FF] dark:border-indigo-900/40",
        iconBgClass: "bg-white/95 dark:bg-indigo-950/70 text-[#6366F1]",
        iconColor: "text-[#6366F1]",
        arrowColor: "text-[#6366F1]",
        glowColor: "rgba(99, 102, 241, 0.12)",
      },
      {
        id: "teacher",
        title: "Contact Teacher",
        subtitle: "Connect with teacher",
        onClick: onContactTeacher,
        href: onContactTeacher ? undefined : "/parent/messages",
        icon: UserCheck,
        accentColor: "#D97706",
        bgClass: "bg-[#FFF6ED] dark:bg-[#281507]",
        hoverBgClass: "hover:bg-[#FFEEDC] dark:hover:bg-[#351D0B]",
        borderClass: "border-[#FDE5D2] dark:border-amber-900/40",
        iconBgClass: "bg-white/95 dark:bg-amber-950/70 text-[#D97706]",
        iconColor: "text-[#D97706]",
        arrowColor: "text-[#D97706]",
        glowColor: "rgba(217, 119, 6, 0.12)",
      },
    ],
    [onViewResults, onContactTeacher]
  );

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" as const }}
      className={`bg-white/95 dark:bg-[#07142F]/95 backdrop-blur-md rounded-[24px] p-4 sm:p-5 border border-[#E7EDF7] dark:border-white/10 shadow-[0_8px_30px_rgba(0,80,203,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] flex flex-col justify-between relative overflow-hidden transition-colors ${className}`}
    >
      {/* Extremely subtle ambient glow on top corner */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />

      {/* Background Decorative Abstract Shapes (3-5% opacity) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.035] dark:opacity-[0.02]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="qa-grid-dots"
            x="0"
            y="0"
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1.5" fill="#0050CB" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#qa-grid-dots)" />
      </svg>

      {/* HEADER */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-white/5 relative z-10">
        <div className="flex items-center gap-2">
          {/* Lightning Bolt in circular blue container with ambient glow */}
          <div className="relative flex items-center justify-center">
            <div className="absolute -inset-1 bg-[#0050CB]/15 rounded-full blur-[3px]" />
            <div className="w-8 h-8 rounded-full bg-[#EBF2FF] dark:bg-[#0E2757] border border-blue-200/70 dark:border-blue-700/40 flex items-center justify-center text-[#0050CB] relative shadow-2xs">
              <Zap className="w-4 h-4 fill-[#0050CB] text-[#0050CB]" />
            </div>
          </div>
          <h2 className="text-[17px] sm:text-[18px] font-bold text-[#102A5C] dark:text-white tracking-tight">
            Quick Actions
          </h2>
        </div>

        {/* Subtle Contextual Count Badge */}
        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#EEF5FF] dark:bg-white/5 text-[#0050CB] dark:text-blue-300 border border-blue-100/80 dark:border-white/10 shadow-2xs">
          6 actions
        </span>
      </div>

      {/* 2-COLUMN × 3-ROW ACTION GRID */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 flex-1 content-between mt-3 relative z-10">
        {actions.map((item, idx) => {
          const Icon = item.icon;

          const content = (
            <div className="flex flex-col h-full justify-between">
              {/* Top Row: Icon + Arrow */}
              <div className="flex items-center justify-between">
                {/* Visual Icon in subtle rounded glass card */}
                <div
                  className={`w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-[11px] ${item.iconBgClass} border border-white/60 dark:border-white/10 shadow-[0_2px_5px_rgba(0,0,0,0.03)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200`}
                >
                  <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform" />
                </div>

                {/* Right Arrow matching reference */}
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center ${item.arrowColor} opacity-70 group-hover:opacity-100 transition-opacity`}
                >
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>

              {/* Bottom: Title (Full text, clean spacing, no truncation) */}
              <div className="text-left mt-2">
                <span className="block text-[12px] sm:text-[12.5px] font-bold text-[#102A5C] dark:text-white leading-tight group-hover:text-[#0050CB] dark:group-hover:text-blue-300 transition-colors">
                  {item.title}
                </span>
              </div>
            </div>
          );

          const sharedClasses = `p-2.5 sm:p-3 rounded-[16px] ${item.bgClass} ${item.hoverBgClass} border ${item.borderClass} transition-all duration-200 ease-out flex flex-col justify-between group shadow-[0_2px_6px_rgba(0,0,0,0.02),inset_0_1px_1px_rgba(255,255,255,0.8)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)] hover:-translate-y-[2px] hover:shadow-[0_6px_16px_-3px_rgba(0,0,0,0.08)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0050CB] focus-visible:ring-offset-2 relative overflow-hidden min-h-[76px] sm:min-h-[82px]`;

          const tileVariants = {
            initial: { opacity: 0, y: 8, scale: 0.96 },
            animate: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                delay: shouldReduceMotion ? 0 : idx * 0.05,
                duration: 0.3,
                ease: "easeOut" as const,
              },
            },
          };

          return (
            <motion.div
              key={item.id}
              variants={tileVariants}
              initial="initial"
              animate="animate"
              className="flex"
            >
              {item.href ? (
                <Link
                  href={item.href}
                  className={`w-full ${sharedClasses}`}
                  aria-label={`${item.title} - ${item.subtitle}`}
                >
                  {content}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={item.onClick}
                  className={`w-full text-left cursor-pointer ${sharedClasses}`}
                  aria-label={`${item.title} - ${item.subtitle}`}
                >
                  {content}
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
