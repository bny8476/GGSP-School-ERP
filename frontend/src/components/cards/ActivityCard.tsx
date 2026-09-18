"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Sparkles } from "lucide-react";
import PremiumCard from "./PremiumCard";

export interface ActivityCardProps {
  id: string;
  title: string;
  domain: string;
  materials?: string;
  date?: string;
  time?: string;
  image?: string;
  icon?: string;
  status?: "Completed" | "In Progress" | "Scheduled";
  onSchedule?: () => void;
  className?: string;
}

export default function ActivityCard({
  title,
  domain,
  materials,
  date = "Today",
  time = "10:00 AM",
  image,
  icon = "🎨",
  status = "Scheduled",
  onSchedule,
  className = "",
}: ActivityCardProps) {
  return (
    <PremiumCard
      variant="interactive"
      className={`p-5 flex flex-col justify-between group ${className}`}
      onClick={onSchedule}
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          {image ? (
            <div className="w-14 h-14 rounded-[16px] overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
              <motion.img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.35 }}
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-[14px] bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-xl shrink-0 shadow-2xs group-hover:rotate-3 transition-transform">
              {icon}
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-[#7C5CFC] dark:text-purple-300 text-[10px] font-bold">
              {domain}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              status === "Completed"
                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                : status === "In Progress"
                ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
            }`}>
              {status}
            </span>
          </div>
        </div>

        <div className="mt-3.5">
          <h4 className="font-bold text-sm sm:text-base text-slate-800 dark:text-white leading-snug group-hover:text-[#3157D5] dark:group-hover:text-blue-400 transition-colors">
            {title}
          </h4>

          {materials && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 line-clamp-2">
              <span className="font-semibold text-slate-500 dark:text-slate-400">Materials: </span>
              {materials}
            </p>
          )}
        </div>
      </div>

      <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5 font-medium">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{date} • {time}</span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSchedule?.();
          }}
          className="text-xs font-bold text-[#3157D5] dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer group-hover:translate-x-0.5 transition-transform"
        >
          <span>Schedule</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </PremiumCard>
  );
}
