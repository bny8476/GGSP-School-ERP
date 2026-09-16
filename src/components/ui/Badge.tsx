"use client";

import React from "react";

export type BadgeStatus = 
  | "active" 
  | "inactive" 
  | "pending" 
  | "approved" 
  | "rejected" 
  | "completed" 
  | "upcoming" 
  | "paid" 
  | "unpaid" 
  | "present" 
  | "absent" 
  | "live" 
  | "primary" 
  | "neutral";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: BadgeStatus;
  children: React.ReactNode;
  icon?: React.ReactNode;
  showDot?: boolean;
  className?: string;
}

export default function Badge({
  status = "neutral",
  children,
  icon,
  showDot = false,
  className = "",
  ...props
}: BadgeProps) {
  const statusStyles: Record<BadgeStatus, { bg: string; text: string; dot: string }> = {
    active: {
      bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-800/50",
      text: "text-emerald-700 dark:text-emerald-400",
      dot: "bg-emerald-500",
    },
    present: {
      bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-800/50",
      text: "text-emerald-700 dark:text-emerald-400",
      dot: "bg-emerald-500",
    },
    approved: {
      bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-800/50",
      text: "text-emerald-700 dark:text-emerald-400",
      dot: "bg-emerald-500",
    },
    completed: {
      bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-800/50",
      text: "text-emerald-700 dark:text-emerald-400",
      dot: "bg-emerald-500",
    },
    paid: {
      bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-800/50",
      text: "text-emerald-700 dark:text-emerald-400",
      dot: "bg-emerald-500",
    },
    pending: {
      bg: "bg-amber-50 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-800/50",
      text: "text-amber-700 dark:text-amber-400",
      dot: "bg-amber-500",
    },
    upcoming: {
      bg: "bg-amber-50 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-800/50",
      text: "text-amber-700 dark:text-amber-400",
      dot: "bg-amber-500",
    },
    inactive: {
      bg: "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700",
      text: "text-slate-600 dark:text-slate-400",
      dot: "bg-slate-400",
    },
    rejected: {
      bg: "bg-rose-50 dark:bg-rose-950/40 border-rose-200/60 dark:border-rose-800/50",
      text: "text-rose-700 dark:text-rose-400",
      dot: "bg-rose-500",
    },
    unpaid: {
      bg: "bg-rose-50 dark:bg-rose-950/40 border-rose-200/60 dark:border-rose-800/50",
      text: "text-rose-700 dark:text-rose-400",
      dot: "bg-rose-500",
    },
    absent: {
      bg: "bg-rose-50 dark:bg-rose-950/40 border-rose-200/60 dark:border-rose-800/50",
      text: "text-rose-700 dark:text-rose-400",
      dot: "bg-rose-500",
    },
    live: {
      bg: "bg-sky-50 dark:bg-sky-950/40 border-sky-200/60 dark:border-sky-800/50",
      text: "text-sky-700 dark:text-sky-400",
      dot: "bg-sky-500 animate-pulse",
    },
    primary: {
      bg: "bg-[#E5EEFF] dark:bg-[#0050CB]/20 border-blue-200/60 dark:border-[#0050CB]/40",
      text: "text-[#0050CB] dark:text-[#38BDF8]",
      dot: "bg-[#0050CB] dark:bg-[#38BDF8]",
    },
    neutral: {
      bg: "bg-slate-100/90 dark:bg-slate-800/90 border-slate-200 dark:border-slate-700",
      text: "text-slate-700 dark:text-slate-300",
      dot: "bg-slate-400",
    },
  };

  const current = statusStyles[status] || statusStyles.neutral;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border transition-colors duration-150 ${current.bg} ${current.text} ${className}`}
      {...props}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${current.dot}`} />}
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
    </span>
  );
}
