"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorState({
  title = "Unable to load data",
  description = "There was a problem retrieving data from the server. Please try again.",
  onRetry,
  className = "",
}: ErrorStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl border border-rose-200/80 dark:border-rose-900/50 ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4 shadow-xs">
        <AlertTriangle className="w-7 h-7" />
      </div>

      <h3 className="text-lg font-extrabold text-rose-950 dark:text-rose-200 tracking-tight mb-1.5">
        {title}
      </h3>

      <p className="text-sm text-rose-700/80 dark:text-rose-300/80 max-w-md mb-6 leading-relaxed">
        {description}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}
