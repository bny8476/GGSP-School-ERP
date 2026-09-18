"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import PremiumCard from "./PremiumCard";

export type ActionCardColor = "blue" | "purple" | "amber" | "rose" | "teal" | "indigo" | "emerald";

export interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: ActionCardColor;
  onClick: () => void;
  className?: string;
  badge?: string;
}

const colorThemes: Record<
  ActionCardColor,
  {
    iconBg: string;
    iconColor: string;
    hoverBg: string;
    accentColor: string;
  }
> = {
  blue: {
    iconBg: "bg-blue-50 dark:bg-blue-950/60",
    iconColor: "text-[#3157D5] dark:text-blue-400",
    hoverBg: "hover:bg-blue-50/50 dark:hover:bg-blue-950/20",
    accentColor: "text-[#3157D5]",
  },
  purple: {
    iconBg: "bg-purple-50 dark:bg-purple-950/60",
    iconColor: "text-[#7C5CFC] dark:text-purple-400",
    hoverBg: "hover:bg-purple-50/50 dark:hover:bg-purple-950/20",
    accentColor: "text-[#7C5CFC]",
  },
  amber: {
    iconBg: "bg-amber-50 dark:bg-amber-950/60",
    iconColor: "text-[#F79009] dark:text-amber-400",
    hoverBg: "hover:bg-amber-50/50 dark:hover:bg-amber-950/20",
    accentColor: "text-[#F79009]",
  },
  rose: {
    iconBg: "bg-rose-50 dark:bg-rose-950/60",
    iconColor: "text-[#F04438] dark:text-rose-400",
    hoverBg: "hover:bg-rose-50/50 dark:hover:bg-rose-950/20",
    accentColor: "text-[#F04438]",
  },
  teal: {
    iconBg: "bg-teal-50 dark:bg-teal-950/60",
    iconColor: "text-[#0D9488] dark:text-teal-400",
    hoverBg: "hover:bg-teal-50/50 dark:hover:bg-teal-950/20",
    accentColor: "text-[#0D9488]",
  },
  indigo: {
    iconBg: "bg-indigo-50 dark:bg-indigo-950/60",
    iconColor: "text-[#6366F1] dark:text-indigo-400",
    hoverBg: "hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20",
    accentColor: "text-[#6366F1]",
  },
  emerald: {
    iconBg: "bg-emerald-50 dark:bg-emerald-950/60",
    iconColor: "text-[#12B76A] dark:text-emerald-400",
    hoverBg: "hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20",
    accentColor: "text-[#12B76A]",
  },
};

export default function ActionCard({
  title,
  description,
  icon: Icon,
  color = "blue",
  onClick,
  className = "",
  badge,
}: ActionCardProps) {
  const theme = colorThemes[color];

  return (
    <PremiumCard
      variant="interactive"
      onClick={onClick}
      className={`p-4 sm:p-5 flex flex-col justify-between h-32 group ${theme.hoverBg} ${className}`}
    >
      <div className="flex items-start justify-between">
        <motion.div
          className={`w-10 h-10 rounded-[14px] ${theme.iconBg} ${theme.iconColor} flex items-center justify-center shadow-2xs shrink-0 group-hover:-translate-y-0.5 group-hover:rotate-3 transition-transform duration-200`}
        >
          <Icon className="w-5 h-5" />
        </motion.div>

        <div className="flex items-center gap-1.5">
          {badge && (
            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold">
              {badge}
            </span>
          )}
          <motion.div
            className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
          </motion.div>
        </div>
      </div>

      <div className="pt-2">
        <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-white leading-tight block group-hover:text-[#3157D5] dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h4>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 line-clamp-1 mt-0.5">
          {description}
        </p>
      </div>
    </PremiumCard>
  );
}
