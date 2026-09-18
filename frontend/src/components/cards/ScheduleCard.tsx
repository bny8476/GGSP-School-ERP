"use client";

import React from "react";
import { Check, Clock } from "lucide-react";
import PremiumCard from "./PremiumCard";

export interface ScheduleCardProps {
  time: string;
  title: string;
  room?: string;
  status: "Completed" | "In Progress" | "Upcoming";
  description?: string;
  iconText?: string;
  color?: "blue" | "emerald" | "amber" | "purple";
  onClick?: () => void;
  className?: string;
}

export default function ScheduleCard({
  time,
  title,
  room,
  status,
  description,
  iconText,
  color = "blue",
  onClick,
  className = "",
}: ScheduleCardProps) {
  const statusBadges = {
    Completed: {
      bg: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50",
      indicator: <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />,
      text: "Completed",
    },
    "In Progress": {
      bg: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/50",
      indicator: <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />,
      text: "In Progress",
    },
    Upcoming: {
      bg: "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700",
      indicator: <Clock className="w-3 h-3 text-slate-400" />,
      text: "Upcoming",
    },
  }[status];

  return (
    <PremiumCard
      variant="bordered"
      accentColor={color}
      clickable={Boolean(onClick)}
      onClick={onClick}
      className={`p-3.5 sm:p-4 flex items-center justify-between gap-3 ${className}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {iconText && (
          <div className="w-9 h-9 rounded-[12px] bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-base shrink-0 shadow-2xs">
            {iconText}
          </div>
        )}

        <div className="truncate">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-white truncate">
              {title}
            </h4>
            <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold border flex items-center gap-1 ${statusBadges.bg}`}>
              {statusBadges.indicator}
              <span>{statusBadges.text}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
            <span className="font-semibold text-slate-500 dark:text-slate-300">{time}</span>
            {room && (
              <>
                <span>•</span>
                <span className="truncate">{room}</span>
              </>
            )}
            {description && (
              <>
                <span>•</span>
                <span className="truncate hidden sm:inline">{description}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </PremiumCard>
  );
}
