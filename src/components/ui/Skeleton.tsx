"use client";

import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "card";
  width?: string | number;
  height?: string | number;
}

export default function Skeleton({
  className = "",
  variant = "text",
  width,
  height,
}: SkeletonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "circular":
        return "rounded-full";
      case "card":
        return "rounded-2xl";
      case "rectangular":
        return "rounded-xl";
      case "text":
      default:
        return "rounded-md";
    }
  };

  const style: React.CSSProperties = {
    width: width !== undefined ? width : undefined,
    height: height !== undefined ? height : undefined,
  };

  return (
    <div
      style={style}
      className={`relative overflow-hidden bg-slate-200/80 dark:bg-slate-800/80 animate-pulse ${getVariantStyles()} ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent animate-[shimmer_1.8s_infinite]" />
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-[#07152F] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton variant="circular" className="w-12 h-12" />
        <Skeleton variant="rectangular" className="w-16 h-6" />
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" className="w-24 h-8" />
        <Skeleton variant="text" className="w-32 h-4" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-slate-100 dark:border-slate-800/60">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <Skeleton variant="text" className="h-4 w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
}
