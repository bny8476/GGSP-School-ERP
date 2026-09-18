"use client";

import React from "react";
import PremiumCard from "./PremiumCard";

export interface EmptyStateCardProps {
  icon?: React.ComponentType<{ className?: string }>;
  iconEmoji?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyStateCard({
  icon: Icon,
  iconEmoji,
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}: EmptyStateCardProps) {
  return (
    <PremiumCard className={`p-8 sm:p-12 text-center flex flex-col items-center justify-center ${className}`}>
      <div className="w-16 h-16 rounded-[20px] bg-blue-50 dark:bg-blue-950/40 text-[#3157D5] dark:text-blue-400 flex items-center justify-center text-2xl shadow-xs mb-4">
        {Icon ? <Icon className="w-8 h-8" /> : <span>{iconEmoji || "📚"}</span>}
      </div>

      <h3 className="font-black text-lg text-slate-800 dark:text-white leading-tight">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 max-w-md mt-1.5 leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-5 px-5 py-2.5 rounded-xl bg-[#3157D5] hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 cursor-pointer transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </PremiumCard>
  );
}
