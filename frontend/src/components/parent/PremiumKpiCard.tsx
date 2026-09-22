"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LucideIcon, ChevronRight } from "lucide-react";

export type KpiColorVariant = "blue" | "pink" | "emerald" | "amber" | "purple";

interface PremiumKpiCardProps {
  title: string;
  value: string | number;
  valueSuffix?: string;
  trend?: string;
  trendPositive?: boolean;
  period?: string;
  icon: LucideIcon;
  colorVariant?: KpiColorVariant;
  progressPercent?: number;
  className?: string;
  href?: string;
  showArrow?: boolean;
}

const COLOR_CONFIGS = {
  blue: {
    outerRing: "from-[#E1EFFF] to-[#C8E0FF]",
    innerDisc: "from-[#2563EB] to-[#0050CB]",
    waveGrad: ["#60A5FA", "#0050CB"],
    arrowColor: "#0050CB",
    chevronColor: "text-blue-400",
    trendColor: "text-[#059669] dark:text-emerald-400",
    bgTint: "to-[#EBF3FF]/70",
    border: "border-blue-100/90",
  },
  pink: {
    outerRing: "from-[#FFE4E6] to-[#FECDD3]",
    innerDisc: "from-[#F43F5E] to-[#E11D48]",
    waveGrad: ["#FB7185", "#E11D48"],
    arrowColor: "#E11D48",
    chevronColor: "text-rose-400",
    trendColor: "text-[#E11D48] dark:text-rose-400",
    bgTint: "to-[#FFF1F5]/70",
    border: "border-rose-100/90",
  },
  emerald: {
    outerRing: "from-[#D1FAE5] to-[#A7F3D0]",
    innerDisc: "from-[#10B981] to-[#059669]",
    waveGrad: ["#34D399", "#059669"],
    arrowColor: "#059669",
    chevronColor: "text-emerald-400",
    trendColor: "text-[#059669] dark:text-emerald-400",
    bgTint: "to-[#E6F9F0]/60",
    border: "border-emerald-100/90",
  },
  amber: {
    outerRing: "from-[#FFEDD5] to-[#FED7AA]",
    innerDisc: "from-[#FB923C] to-[#EA580C]",
    waveGrad: ["#FDBA74", "#EA580C"],
    arrowColor: "#EA580C",
    chevronColor: "text-orange-400",
    trendColor: "text-[#EA580C] dark:text-orange-400",
    bgTint: "to-[#FFF7ED]/70",
    border: "border-amber-100/90",
  },
  purple: {
    outerRing: "from-[#EDE9FE] to-[#DDD6FE]",
    innerDisc: "from-[#8B5CF6] to-[#6D28D9]",
    waveGrad: ["#C084FC", "#7C3AED"],
    arrowColor: "#7C3AED",
    chevronColor: "text-purple-400",
    trendColor: "text-[#7C3AED] dark:text-purple-400",
    bgTint: "to-[#F5F3FF]/70",
    border: "border-purple-100/90",
  },
};

export default function PremiumKpiCard({
  title,
  value,
  valueSuffix,
  trend,
  period = "This Month",
  icon: Icon,
  colorVariant = "blue",
  className = "",
  href = "/parent",
  showArrow = true,
}: PremiumKpiCardProps) {
  const config = COLOR_CONFIGS[colorVariant] || COLOR_CONFIGS.blue;

  return (
    <Link href={href} className="block group h-full">
      <motion.div
        whileHover={{ y: -3, scale: 1.008 }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={`relative overflow-hidden rounded-[24px] p-5 bg-gradient-to-br from-white via-white ${config.bgTint} dark:from-[#07142F] dark:via-[#091838] dark:to-[#0D2452] border ${config.border} dark:border-white/10 shadow-[0_4px_20px_rgba(0,80,203,0.05)] hover:shadow-[0_12px_28px_-6px_rgba(0,80,203,0.14)] transition-all duration-300 min-h-[148px] flex flex-col justify-between ${className}`}
      >


        {/* Row 1: Icon on left, Chevron on right */}
        <div className="relative z-10 flex items-center justify-between">
          <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${config.outerRing} p-[2.5px] shadow-sm flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300`}>
            <div className={`w-full h-full rounded-full bg-gradient-to-b ${config.innerDisc} flex items-center justify-center shadow-inner`}>
              <Icon className="w-5 h-5 text-white stroke-[2.2]" />
            </div>
          </div>
          {showArrow && (
            <ChevronRight className={`w-4 h-4 ${config.chevronColor} group-hover:translate-x-0.5 transition-transform`} />
          )}
        </div>

        {/* Row 2: Metric & Title */}
        <div className="relative z-10 mt-3 min-w-0">
          <div className="text-[28px] sm:text-[32px] font-black text-[#000E28] dark:text-white tracking-tight leading-none font-sans flex items-baseline gap-1">
            <span>{value}</span>
            {valueSuffix && (
              <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
                {valueSuffix}
              </span>
            )}
          </div>
          <div className="text-[14px] sm:text-[15px] font-bold text-[#001D4A] dark:text-blue-100 tracking-tight leading-tight mt-1.5">
            {title}
          </div>
        </div>

        {/* Row 3: Trend footer */}
        <div className="relative z-10 mt-3 pt-0.5 flex items-center justify-between">
          <span className={`inline-flex items-center gap-1 text-[11px] sm:text-[12px] font-extrabold ${config.trendColor} leading-tight`}>
            {trend || period}
          </span>
        </div>
      </motion.div>
    </Link>
  );
}
