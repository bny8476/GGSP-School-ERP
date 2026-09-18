"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Calendar, ArrowRight, CheckCircle2 } from "lucide-react";
import PremiumCard from "./PremiumCard";

export interface HomeworkCardProps {
  id: string;
  subject: string;
  title: string;
  instructions: string;
  assignedDate: string;
  dueDate: string;
  submittedCount: number;
  totalCount: number;
  onReview?: () => void;
  className?: string;
}

export default function HomeworkCard({
  subject,
  title,
  instructions,
  assignedDate,
  dueDate,
  submittedCount,
  totalCount,
  onReview,
  className = "",
}: HomeworkCardProps) {
  const percentage = Math.round((submittedCount / (totalCount || 1)) * 100);

  return (
    <PremiumCard
      variant="interactive"
      className={`p-5 flex flex-col justify-between group ${className}`}
      onClick={onReview}
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-[14px] bg-amber-50 dark:bg-amber-950/50 text-[#F79009] flex items-center justify-center shadow-2xs group-hover:rotate-3 transition-transform shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                {subject}
              </span>
              <h4 className="font-bold text-sm sm:text-base text-slate-800 dark:text-white leading-tight group-hover:text-[#3157D5] dark:group-hover:text-blue-400 transition-colors">
                {title}
              </h4>
            </div>
          </div>

          <span className="px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[10px] font-bold shrink-0">
            Due {dueDate}
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 line-clamp-2 leading-relaxed">
          {instructions}
        </p>

        {/* Submissions Progress Bar */}
        <div className="mt-3.5 space-y-1.5">
          <div className="flex justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            <span>Submissions: {submittedCount} / {totalCount}</span>
            <span className="text-[#12B76A] font-bold">{percentage}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="h-full bg-[#F79009] rounded-full"
            />
          </div>
        </div>
      </div>

      <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5 text-[11px]">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Assigned: {assignedDate}</span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onReview?.();
          }}
          className="text-xs font-bold text-[#3157D5] dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer group-hover:translate-x-0.5 transition-transform"
        >
          <span>Review Work</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </PremiumCard>
  );
}
