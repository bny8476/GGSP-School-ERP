"use client";

import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import AnimatedNumber from '@/components/ui/AnimatedNumber';

export interface AdminStatCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
    isNeutral?: boolean;
    period?: string;
  };
  supportingText?: string;
  variant?: 'blue' | 'emerald' | 'orange' | 'indigo' | 'purple' | 'rose';
  progress?: number; // 0 - 100
  footerLabel?: string;
  footerValue?: string;
}

export default function AdminStatCard({
  label,
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  icon: Icon,
  trend,
  supportingText,
  variant = 'blue',
  progress,
  footerLabel,
  footerValue,
}: AdminStatCardProps) {
  const getTheme = () => {
    switch (variant) {
      case 'emerald':
        return {
          iconBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/40',
          accent: 'text-emerald-600 dark:text-emerald-400',
          progressColor: 'bg-emerald-500',
          trendPos: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50',
        };
      case 'orange':
        return {
          iconBg: 'bg-[#FF690C]/10 text-[#FF690C] border-[#FF690C]/30',
          accent: 'text-[#FF690C]',
          progressColor: 'bg-[#FF690C]',
          trendPos: 'text-[#FF690C] bg-[#FF690C]/10',
        };
      case 'indigo':
        return {
          iconBg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200/60 dark:border-indigo-800/40',
          accent: 'text-indigo-600 dark:text-indigo-400',
          progressColor: 'bg-indigo-600',
          trendPos: 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50',
        };
      case 'purple':
        return {
          iconBg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-200/60 dark:border-purple-800/40',
          accent: 'text-purple-600 dark:text-purple-400',
          progressColor: 'bg-purple-600',
          trendPos: 'text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50',
        };
      case 'rose':
        return {
          iconBg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200/60 dark:border-rose-800/40',
          accent: 'text-rose-600 dark:text-rose-400',
          progressColor: 'bg-rose-500',
          trendPos: 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50',
        };
      case 'blue':
      default:
        return {
          iconBg: 'bg-[#E5EEFF] dark:bg-[#0050CB]/20 text-[#0050CB] dark:text-[#E5EEFF] border-[#0050CB]/20 dark:border-[#0050CB]/40',
          accent: 'text-[#0050CB] dark:text-[#2F80ED]',
          progressColor: 'bg-[#0050CB]',
          trendPos: 'text-[#0050CB] dark:text-[#E5EEFF] bg-[#E5EEFF] dark:bg-[#0050CB]/25',
        };
    }
  };

  const theme = getTheme();

  return (
    <div className="group relative bg-white dark:bg-[#07152F] rounded-[22px] p-5 sm:p-6 border border-[#E6EAF2] dark:border-slate-800 shadow-[0_4px_20px_rgba(0,14,40,0.03)] hover:shadow-[0_12px_32px_rgba(0,80,203,0.08)] hover:-translate-y-1 hover:border-[#0050CB]/30 dark:hover:border-[#0050CB]/50 transition-all duration-300 flex flex-col justify-between h-full">
      <div>
        {/* Top Header Row: Icon + Label */}
        <div className="flex items-center justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-11 h-11 rounded-2xl ${theme.iconBg} border flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-200`}
            >
              <Icon className="w-5 h-5" strokeWidth={2.2} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wide uppercase">
                {label}
              </p>
              {supportingText && (
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  {supportingText}
                </p>
              )}
            </div>
          </div>

          {trend && (
            <div
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black tracking-tight ${
                trend.isNeutral
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  : trend.isPositive !== false
                  ? theme.trendPos
                  : 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400'
              }`}
            >
              {trend.isNeutral ? (
                <Minus className="w-3 h-3" />
              ) : trend.isPositive !== false ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              <span>{trend.value}</span>
            </div>
          )}
        </div>

        {/* Large Number & Trend */}
        <div className="flex items-baseline justify-between mt-2">
          <h3 className="text-3xl sm:text-4xl font-black text-[#000E28] dark:text-white tracking-tight font-saas">
            {prefix}
            <AnimatedNumber to={value} decimals={decimals} />
            {suffix}
          </h3>
        </div>

        {/* Optional Progress Bar */}
        {typeof progress === 'number' && (
          <div className="mt-3.5 space-y-1">
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${theme.progressColor} rounded-full transition-all duration-700 ease-out`}
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer Meta Row */}
      {(footerLabel || footerValue || trend?.period) && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>{footerLabel || trend?.period || 'Updated just now'}</span>
          <span className="font-bold text-[#000E28] dark:text-slate-200">
            {footerValue || 'Live Sync'}
          </span>
        </div>
      )}
    </div>
  );
}
