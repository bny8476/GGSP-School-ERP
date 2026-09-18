"use client";

import React, { useRef, useState, useCallback } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

export type CardVariant = "default" | "featured" | "glass" | "interactive" | "bordered";

export interface PremiumCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  variant?: CardVariant;
  className?: string;
  spotlightColor?: string;
  hoverElevation?: boolean;
  clickable?: boolean;
  accentColor?: "blue" | "emerald" | "amber" | "rose" | "purple" | "indigo";
}

export default function PremiumCard({
  children,
  variant = "default",
  className = "",
  spotlightColor = "rgba(49, 87, 213, 0.07)",
  hoverElevation = true,
  clickable = false,
  accentColor,
  onClick,
  ...props
}: PremiumCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const getVariantStyles = () => {
    switch (variant) {
      case "featured":
        return "bg-gradient-to-br from-[#F8FAFF] via-[#F0F4FF] to-[#E9EFFD] dark:from-[#111A33] dark:via-[#0F172A] dark:to-[#0B132B] border-[#D6E0F5] dark:border-blue-500/20 shadow-[0_10px_35px_rgba(49,87,213,0.08)]";
      case "glass":
        return "bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgba(15,23,42,0.06)]";
      case "interactive":
        return "bg-white dark:bg-[#111827] border-[#E7EAF0] dark:border-slate-800/80 shadow-[0_8px_30px_rgba(15,23,42,0.04)] hover:border-blue-300 dark:hover:border-blue-500/30 hover:shadow-[0_16px_36px_rgba(49,87,213,0.10)] cursor-pointer";
      case "bordered":
        const borderColors = {
          blue: "border-l-4 border-l-[#3157D5]",
          emerald: "border-l-4 border-l-[#12B76A]",
          amber: "border-l-4 border-l-[#F79009]",
          rose: "border-l-4 border-l-[#F04438]",
          purple: "border-l-4 border-l-[#7C5CFC]",
          indigo: "border-l-4 border-l-[#6366F1]",
        };
        const accent = accentColor ? borderColors[accentColor] : "border-l-4 border-l-[#3157D5]";
        return `bg-white dark:bg-[#111827] border-[#E7EAF0] dark:border-slate-800/80 ${accent} shadow-[0_8px_30px_rgba(15,23,42,0.04)]`;
      case "default":
      default:
        return "bg-white dark:bg-[#111827] border-[#E7EAF0] dark:border-slate-800/80 shadow-[0_8px_30px_rgba(15,23,42,0.04)]";
    }
  };

  const isInteractive = clickable || variant === "interactive" || Boolean(onClick);

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={hoverElevation ? { y: -3 } : undefined}
      whileTap={isInteractive ? { scale: 0.985 } : undefined}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      className={`relative rounded-[20px] p-5 sm:p-6 border overflow-hidden transition-colors ${getVariantStyles()} ${
        isInteractive ? "cursor-pointer select-none" : ""
      } ${className}`}
      {...props}
    >
      {/* Subtle Cursor-Following Radial Spotlight Glow */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-0"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(350px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 55%)`,
        }}
      />
      <div className="relative z-10 w-full h-full">{children}</div>
    </motion.div>
  );
}

export function CardHeader({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80 gap-3 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3 className={`font-bold text-base text-slate-800 dark:text-white leading-tight ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={`text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal ${className}`}>
      {children}
    </p>
  );
}

export function CardBody({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`pt-4 ${className}`}>{children}</div>;
}

export function CardFooter({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs ${className}`}>
      {children}
    </div>
  );
}
