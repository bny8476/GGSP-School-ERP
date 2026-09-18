"use client";

import React from "react";
import { Bell, Clock, ArrowRight, Check } from "lucide-react";
import PremiumCard from "./PremiumCard";

export interface NotificationCardProps {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead?: boolean;
  category?: "Urgent" | "Notice" | "Event" | "Academic";
  onMarkAsRead?: () => void;
  onClick?: () => void;
  className?: string;
}

export default function NotificationCard({
  title,
  message,
  timestamp,
  isRead = false,
  category = "Notice",
  onMarkAsRead,
  onClick,
  className = "",
}: NotificationCardProps) {
  const categoryBadges = {
    Urgent: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800/50",
    Notice: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800/50",
    Event: "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-800/50",
    Academic: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50",
  }[category];

  return (
    <PremiumCard
      variant="interactive"
      className={`p-4 sm:p-5 flex items-start justify-between gap-3 group ${
        !isRead ? "bg-blue-50/20 dark:bg-blue-950/10 border-blue-200/60 dark:border-blue-900/40" : ""
      } ${className}`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3 min-w-0 flex-1">
        <div className="w-10 h-10 rounded-[14px] bg-blue-50 dark:bg-blue-950/50 text-[#3157D5] dark:text-blue-400 flex items-center justify-center shadow-2xs shrink-0 mt-0.5">
          <Bell className="w-5 h-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {!isRead && (
              <span className="w-2 h-2 rounded-full bg-[#3157D5] shrink-0" title="Unread" />
            )}
            <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-white leading-tight truncate">
              {title}
            </h4>
            <span className={`px-2 py-0.2 rounded-md text-[10px] font-bold border ${categoryBadges}`}>
              {category}
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
            {message}
          </p>

          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-2 font-medium">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{timestamp}</span>
          </div>
        </div>
      </div>

      <div className="shrink-0 flex items-center gap-2">
        {!isRead && onMarkAsRead && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            title="Mark as Read"
          >
            <Check className="w-4 h-4" />
          </button>
        )}
      </div>
    </PremiumCard>
  );
}
