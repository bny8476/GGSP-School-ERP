"use client";

import React, { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

export interface AnimatedHeadingProps {
  title: string;
  highlightWords?: string[];
  subtitle?: string;
  badge?: string;
  badgeIcon?: React.ReactNode;
  align?: "left" | "center" | "right";
  size?: "display" | "h1" | "h2" | "h3";
  className?: string;
  underlineHighlight?: boolean;
}

export default function AnimatedHeading({
  title,
  highlightWords = [],
  subtitle,
  badge,
  badgeIcon,
  align = "center",
  size = "h2",
  className = "",
  underlineHighlight = true,
}: AnimatedHeadingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });
  const prefersReduced = useReducedMotion();

  const alignmentClasses = {
    left: "text-left items-start",
    center: "text-center items-center mx-auto",
    right: "text-right items-end ml-auto",
  }[align];

  const sizeClasses = {
    display: "text-4xl sm:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.12]",
    h1: "text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.18]",
    h2: "text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-[1.22]",
    h3: "text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight leading-[1.28]",
  }[size];

  // Words breakdown for staggered reveal
  const words = title.split(" ");

  if (prefersReduced) {
    return (
      <div className={`flex flex-col ${alignmentClasses} ${className}`}>
        {badge && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E5EEFF] dark:bg-[#0050CB]/20 text-[#0050CB] dark:text-[#38BDF8] text-xs font-bold mb-3">
            {badgeIcon}
            <span>{badge}</span>
          </div>
        )}
        <h2 className={`${sizeClasses} text-[#000E28] dark:text-white mb-3`}>
          {words.map((word, i) => {
            const isHighlight = highlightWords.some(
              (hw) => hw.toLowerCase() === word.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()
            );
            return (
              <span
                key={i}
                className={isHighlight ? "text-[#0050CB] dark:text-[#38BDF8]" : ""}
              >
                {word}{" "}
              </span>
            );
          })}
        </h2>
        {subtitle && (
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`flex flex-col ${alignmentClasses} ${className}`}>
      {/* Optional Badge */}
      {badge && (
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.95 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E5EEFF] dark:bg-[#0050CB]/20 border border-blue-200/60 dark:border-[#0050CB]/40 text-[#0050CB] dark:text-[#38BDF8] text-xs font-bold mb-3 shadow-2xs"
        >
          {badgeIcon}
          <span>{badge}</span>
        </motion.div>
      )}

      {/* Heading Title with Word Reveal */}
      <h2 className={`${sizeClasses} text-[#000E28] dark:text-white mb-3`}>
        {words.map((word, i) => {
          const cleanWord = word.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
          const isHighlight = highlightWords.some((hw) => hw.toLowerCase() === cleanWord);

          return (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 18 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: 0.08 + i * 0.035,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="inline-block mr-[0.26em] relative"
            >
              {isHighlight ? (
                <span className="relative inline-block text-[#0050CB] dark:text-[#38BDF8]">
                  <span className="text-gradient-animated">{word}</span>
                  {underlineHighlight && (
                    <motion.svg
                      initial={{ pathLength: 0 }}
                      animate={isInView ? { pathLength: 1 } : {}}
                      transition={{ duration: 0.8, delay: 0.35 + i * 0.035, ease: "easeOut" }}
                      className="absolute -bottom-1 left-0 w-full h-2 text-[#0050CB] dark:text-[#38BDF8] pointer-events-none"
                      viewBox="0 0 100 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M2 6 Q 50 1, 98 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    </motion.svg>
                  )}
                </span>
              ) : (
                word
              )}
            </motion.span>
          );
        })}
      </h2>

      {/* Subtitle with Fade & Slide */}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
