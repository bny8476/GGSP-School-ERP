"use client";

import React from "react";
import { FolderOpen, Plus } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  title = "No records found",
  description = "There are no records to display at this moment.",
  icon,
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white/70 dark:bg-[#07152F]/70 backdrop-blur-md rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-[#E5EEFF] dark:bg-[#0757D5]/20 text-[#0757D5] dark:text-[#2F80ED] flex items-center justify-center mb-4 shadow-xs">
        {icon || <FolderOpen className="w-8 h-8" />}
      </div>

      <h3 className="text-lg font-extrabold text-[#07152F] dark:text-white tracking-tight mb-1.5">
        {title}
      </h3>

      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0757D5] hover:bg-[#1469E8] text-white text-xs font-bold shadow-md shadow-[#0757D5]/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}
