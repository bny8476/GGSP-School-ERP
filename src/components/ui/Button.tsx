"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-3.5 py-1.5 text-xs rounded-full gap-1.5 font-bold",
    md: "px-5 py-2.5 text-sm rounded-full gap-2 font-bold",
    lg: "px-7 py-3.5 text-base rounded-full gap-2.5 font-bold",
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      "bg-[#0050CB] hover:bg-[#0041A8] text-white shadow-md shadow-[#0050CB]/25 border border-transparent",
    secondary:
      "bg-[#FF690C] hover:bg-[#E55B05] text-white shadow-md shadow-[#FF690C]/25 border border-transparent",
    outline:
      "bg-white dark:bg-slate-900 hover:bg-[#E5EEFF] dark:hover:bg-slate-800 text-[#0050CB] dark:text-[#38BDF8] border-2 border-blue-200 dark:border-slate-700 hover:border-[#0050CB]",
    ghost:
      "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-transparent",
    danger:
      "bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 border border-transparent",
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      disabled={isDisabled}
      className={`group relative inline-flex items-center justify-center transition-all duration-200 select-none cursor-pointer btn-interactive active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0 transition-transform group-hover:-translate-x-0.5">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && (
        <span className="shrink-0 transition-transform group-hover:translate-x-1">{rightIcon}</span>
      )}
    </button>
  );
}
