"use client";

import React from "react";
import { motion } from "framer-motion";
import PremiumCard from "./PremiumCard";

export interface ProgressCardProps {
  title: string;
  subtitle?: string;
  items: Array<{
    label: string;
    percentage: number;
    valueText?: string;
    color?: "blue" | "emerald" | "amber" | "rose" | "purple";
  }>;
  className?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const barColors = {
  blue: "bg-[#3157D5]",
  emerald: "bg-[#12B76A]",
  amber: "bg-[#F79009]",
  rose: "bg-[#F04438]",
  purple: "bg-[#7C5CFC]",
};

export default function ProgressCard({
  title,
  subtitle,
  items,
  className = "",
  action,
}: ProgressCardProps) {
  return (
    <PremiumCard className={`p-5 sm:p-6 ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <h4 className="font-bold text-sm sm:text-base text-slate-800 dark:text-white">{title}</h4>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        {action && (
          <button
            onClick={action.onClick}
            className="text-xs font-bold text-[#3157D5] dark:text-blue-400 hover:underline cursor-pointer"
          >
            {action.label}
          </button>
        )}
      </div>

      <div className="pt-4 space-y-3.5">
        {items.map((item, i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-200">{item.label}</span>
              <span className="text-slate-500 dark:text-slate-400">
                {item.valueText || `${item.percentage}%`}
              </span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(item.percentage, 100)}%` }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
                className={`h-full ${barColors[item.color || "blue"]} rounded-full`}
              />
            </div>
          </div>
        ))}
      </div>
    </PremiumCard>
  );
}

export function ProgressRingCard({
  title,
  subtitle,
  percentage,
  label = "Present",
  detail = "26 of 28 Children",
  className = "",
  onViewDetails,
}: {
  title: string;
  subtitle?: string;
  percentage: number;
  label?: string;
  detail?: string;
  className?: string;
  onViewDetails?: () => void;
}) {
  return (
    <PremiumCard className={`p-5 flex flex-col justify-between ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <h4 className="font-bold text-sm text-slate-800 dark:text-white">{title}</h4>
          {subtitle && <p className="text-[11px] text-slate-400">{subtitle}</p>}
        </div>
        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="text-[11px] font-bold text-[#3157D5] dark:text-blue-400 hover:underline cursor-pointer"
          >
            View Details →
          </button>
        )}
      </div>

      <div className="flex items-center justify-between pt-4">
        {/* Animated Circular Progress Ring */}
        <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-100 dark:text-slate-800 stroke-current"
              strokeWidth="3.4"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <motion.path
              className="text-[#12B76A] stroke-current"
              strokeWidth="3.4"
              strokeLinecap="round"
              fill="none"
              initial={{ strokeDasharray: "0, 100" }}
              animate={{ strokeDasharray: `${percentage}, 100` }}
              transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute text-center leading-none">
            <span className="text-base font-black text-slate-800 dark:text-white block">
              {percentage}%
            </span>
            <span className="text-[9px] font-bold text-[#12B76A] uppercase block mt-0.5">
              {label}
            </span>
          </div>
        </div>

        <div className="flex-1 ml-4 space-y-1 text-xs">
          <span className="font-bold text-slate-800 dark:text-white block">{detail}</span>
          <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[11px]">
            <span>✓</span>
            <span>Optimal Classroom Attendance</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            Updated live from today&apos;s morning roll call register.
          </p>
        </div>
      </div>
    </PremiumCard>
  );
}
