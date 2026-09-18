"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  GraduationCap,
  Users,
  Phone,
  ClipboardList,
  Calendar as CalendarIcon,
  X,
  Clock,
  BookOpen,
  Layers,
} from "lucide-react";
import AnimatedNumber from "@/components/ui/AnimatedNumber";

export type StatColor = "purple" | "emerald" | "rose" | "amber" | "blue" | "indigo";

export interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }> | string;
  color?: StatColor;
  trend?: {
    text: string;
    positive?: boolean;
    arrow?: "up-right" | "right" | "none";
  };
  badgeAction?: {
    text: string;
    onClick?: () => void;
  };
  badgeButton?: {
    icon?: string;
    onClick?: () => void;
  };
  subtitle?: string;
  hasSparkline?: boolean;
  progressBar?: {
    percentage: number;
    label?: string;
    statusText?: string;
  };
  footer?: {
    icon?: React.ComponentType<{ className?: string }>;
    label: string;
    action?: () => void;
  };
  onArrowClick?: () => void;
  className?: string;
  onClick?: () => void;
}

const colorThemes: Record<
  StatColor,
  {
    iconBg: string;
    iconColor: string;
    valueColor: string;
    arrowColor: string;
    footerColor: string;
    progressBg: string;
    progressFill: string;
    waves: {
      l1: string;
      l2: string;
      l3: string;
    };
  }
> = {
  purple: {
    iconBg: "bg-[#EEF0FF] dark:bg-purple-950/40",
    iconColor: "text-[#5444E4] dark:text-purple-300",
    valueColor: "text-[#0A1B39] dark:text-white",
    arrowColor: "text-[#5444E4] dark:text-purple-300",
    footerColor: "text-[#5444E4] dark:text-purple-300",
    progressBg: "bg-[#EEF0FF] dark:bg-purple-950/50",
    progressFill: "bg-[#5444E4]",
    waves: {
      l1: "rgba(238, 240, 255, 0.75)",
      l2: "rgba(224, 227, 255, 0.85)",
      l3: "rgba(199, 203, 255, 0.7)",
    },
  },
  emerald: {
    iconBg: "bg-[#E8FAF0] dark:bg-emerald-950/40",
    iconColor: "text-[#027A48] dark:text-emerald-300",
    valueColor: "text-[#027A48] dark:text-emerald-400",
    arrowColor: "text-[#027A48] dark:text-emerald-300",
    footerColor: "text-[#027A48] dark:text-emerald-300",
    progressBg: "bg-[#E8FAF0] dark:bg-emerald-950/50",
    progressFill: "bg-[#027A48]",
    waves: {
      l1: "rgba(232, 250, 240, 0.75)",
      l2: "rgba(209, 250, 223, 0.85)",
      l3: "rgba(166, 244, 197, 0.7)",
    },
  },
  rose: {
    iconBg: "bg-[#FEE4E2] dark:bg-rose-950/40",
    iconColor: "text-[#D92D20] dark:text-rose-300",
    valueColor: "text-[#D92D20] dark:text-rose-400",
    arrowColor: "text-[#D92D20] dark:text-rose-300",
    footerColor: "text-[#D92D20] dark:text-rose-300",
    progressBg: "bg-[#FEE4E2] dark:bg-rose-950/50",
    progressFill: "bg-[#D92D20]",
    waves: {
      l1: "rgba(254, 228, 226, 0.75)",
      l2: "rgba(254, 205, 211, 0.85)",
      l3: "rgba(253, 164, 175, 0.7)",
    },
  },
  amber: {
    iconBg: "bg-[#FEF0C7] dark:bg-amber-950/40",
    iconColor: "text-[#B54708] dark:text-amber-300",
    valueColor: "text-[#B54708] dark:text-amber-400",
    arrowColor: "text-[#B54708] dark:text-amber-300",
    footerColor: "text-[#B54708] dark:text-amber-300",
    progressBg: "bg-[#FEF0C7] dark:bg-amber-950/50",
    progressFill: "bg-[#B54708]",
    waves: {
      l1: "rgba(254, 240, 199, 0.75)",
      l2: "rgba(253, 230, 138, 0.85)",
      l3: "rgba(252, 211, 77, 0.7)",
    },
  },
  blue: {
    iconBg: "bg-[#EFF4FF] dark:bg-blue-950/40",
    iconColor: "text-[#2563EB] dark:text-blue-300",
    valueColor: "text-[#0A1B39] dark:text-white",
    arrowColor: "text-[#2563EB] dark:text-blue-300",
    footerColor: "text-[#2563EB] dark:text-blue-300",
    progressBg: "bg-[#EFF4FF] dark:bg-blue-950/50",
    progressFill: "bg-[#2563EB]",
    waves: {
      l1: "rgba(239, 244, 255, 0.75)",
      l2: "rgba(219, 234, 254, 0.85)",
      l3: "rgba(191, 219, 254, 0.7)",
    },
  },
  indigo: {
    iconBg: "bg-[#EEF2FF] dark:bg-indigo-950/40",
    iconColor: "text-[#4F46E5] dark:text-indigo-300",
    valueColor: "text-[#0A1B39] dark:text-white",
    arrowColor: "text-[#4F46E5] dark:text-indigo-300",
    footerColor: "text-[#4F46E5] dark:text-indigo-300",
    progressBg: "bg-[#EEF2FF] dark:bg-indigo-950/50",
    progressFill: "bg-[#4F46E5]",
    waves: {
      l1: "rgba(238, 242, 255, 0.75)",
      l2: "rgba(224, 231, 255, 0.85)",
      l3: "rgba(199, 210, 254, 0.7)",
    },
  },
};

export default function StatCard({
  label,
  value,
  icon: IconOrString,
  color = "blue",
  trend,
  badgeAction,
  badgeButton,
  subtitle,
  progressBar,
  footer,
  onArrowClick,
  className = "",
  onClick,
}: StatCardProps) {
  const theme = colorThemes[color] || colorThemes.blue;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-[28px] bg-white dark:bg-[#111827] border border-slate-100/90 dark:border-slate-800 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(15,23,42,0.06)] transition-all duration-300 flex flex-col justify-between min-h-[220px] ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      {/* ========================================================================= */}
      {/* 1. TOP HEADER: SQUIRCLE ICON + RIGHT BADGE / BUTTON                       */}
      {/* ========================================================================= */}
      <div className="flex items-center justify-between relative z-10">
        {/* Soft Squircle Icon Box */}
        <motion.div
          whileHover={{ rotate: 3, scale: 1.04 }}
          transition={{ duration: 0.2 }}
          className={`w-14 h-14 rounded-2xl ${theme.iconBg} ${theme.iconColor} flex items-center justify-center shadow-xs shrink-0`}
        >
          {typeof IconOrString === "string" ? (
            <span className="text-2xl">{IconOrString}</span>
          ) : (
            <IconOrString className="w-7 h-7 stroke-[2.2]" />
          )}
        </motion.div>

        {/* Top-Right Badges or Action */}
        {badgeAction && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              badgeAction.onClick?.();
            }}
            className="inline-flex items-center gap-1 px-3.5 py-1 rounded-full bg-[#FEF3F2] dark:bg-rose-950/40 text-[#B42318] dark:text-rose-300 border border-[#FECDCA] dark:border-rose-800/60 text-xs font-bold hover:bg-[#FEE4E2] transition-colors cursor-pointer shadow-xs"
          >
            <span>{badgeAction.text}</span>
          </button>
        )}

        {badgeButton && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              badgeButton.onClick?.();
            }}
            className="w-9 h-9 rounded-2xl bg-[#E8FAF0] dark:bg-emerald-950/50 text-[#027A48] dark:text-emerald-300 flex items-center justify-center font-bold text-sm hover:bg-[#D1FADF] transition-colors cursor-pointer shadow-xs"
          >
            <span>{badgeButton.icon || "↗"}</span>
          </button>
        )}

        {trend && !badgeAction && !badgeButton && (
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border shadow-xs ${
              trend.text === "Priority"
                ? "bg-[#FFFAEB] text-[#B54708] border-[#FEDF89] dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60"
                : "bg-[#ECFDF3] text-[#12B76A] border-[#D1FADF] dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60"
            }`}
          >
            {trend.arrow === "up-right" && <ArrowUpRight className="w-3.5 h-3.5" />}
            <span>{trend.text}</span>
          </span>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. MIDDLE BODY: LABEL + BIG STAT VALUE + SUBTITLE + PROGRESS BAR          */}
      {/* ========================================================================= */}
      <div className="my-3 relative z-10">
        <h3 className="text-[15px] font-bold text-[#0A1B39] dark:text-white tracking-tight">
          {label}
        </h3>

        <div className="my-1">
          {typeof value === "number" ? (
            <AnimatedNumber
              to={value}
              className={`text-4xl sm:text-5xl font-black ${theme.valueColor} tracking-tight leading-none`}
            />
          ) : (
            <span
              className={`text-4xl sm:text-5xl font-black ${theme.valueColor} tracking-tight leading-none block`}
            >
              {value}
            </span>
          )}
        </div>

        {subtitle && (
          <p className="text-xs text-slate-400 dark:text-slate-400 font-medium mt-0.5">
            {subtitle}
          </p>
        )}

        {progressBar && (
          <div className="mt-2.5">
            <div className="h-2 w-full bg-[#E8FAF0] dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progressBar.percentage, 100)}%` }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className={`h-full ${theme.progressFill} rounded-full`}
              />
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. DIVIDER + 4. FOOTER WITH ICON LABEL & CIRCULAR ARROW BUTTON            */}
      {/* ========================================================================= */}
      <div className="relative z-10">
        <div className="w-full border-t border-slate-100 dark:border-slate-800/80 mb-3.5" />

        <div className="flex items-center justify-between">
          {/* Left Footer Label with Icon */}
          <div className={`flex items-center gap-1.5 text-xs font-semibold ${theme.footerColor}`}>
            {footer?.icon && (
              <footer.icon className="w-4 h-4 shrink-0 stroke-[2.2]" />
            )}
            <span>{footer?.label || "View Details"}</span>
          </div>

          {/* Right Circular Arrow Button */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onArrowClick?.();
            }}
            className={`w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-center ${theme.arrowColor} hover:shadow-md transition-all cursor-pointer`}
          >
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </motion.button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. ORGANIC CURVED WAVES (BOTTOM-RIGHT CORNER)                             */}
      {/* ========================================================================= */}
      <svg
        className="absolute -bottom-1 -right-1 w-36 h-32 sm:w-44 sm:h-36 pointer-events-none z-0 select-none"
        viewBox="0 0 160 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Layer 1: Broad soft background billow */}
        <path
          d="M25 140 C45 92 85 80 115 75 C140 70 152 45 160 25 V140 H25 Z"
          fill={theme.waves.l1}
        />
        {/* Layer 2: Mid-tier smooth swell */}
        <path
          d="M65 140 C80 102 108 92 128 88 C144 84 154 68 160 52 V140 H65 Z"
          fill={theme.waves.l2}
        />
        {/* Layer 3: Foreground corner curl */}
        <path
          d="M102 140 C114 118 128 110 142 106 C152 102 158 96 160 90 V140 H102 Z"
          fill={theme.waves.l3}
        />
      </svg>
    </motion.div>
  );
}
