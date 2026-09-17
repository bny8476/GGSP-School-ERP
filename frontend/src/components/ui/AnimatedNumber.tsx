"use client";

import React, { useEffect, useState, useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";

export interface AnimatedNumberProps {
  from?: number;
  to: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  formatter?: (val: number) => string;
  className?: string;
}

export default function AnimatedNumber({
  from = 0,
  to,
  duration = 1.4,
  decimals = 0,
  prefix = "",
  suffix = "",
  formatter,
  className = "",
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });
  const prefersReduced = useReducedMotion();
  const [current, setCurrent] = useState(from);

  useEffect(() => {
    if (prefersReduced) {
      setCurrent(to);
      return;
    }

    if (!isInView) return;

    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);

      // Smooth ease-out exponential curve: 1 - 2^(-10 * progress)
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const val = from + (to - from) * ease;

      setCurrent(val);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCurrent(to);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isInView, from, to, duration, prefersReduced]);

  const formatNumber = (val: number): string => {
    if (formatter) return formatter(val);
    const fixed = val.toFixed(decimals);
    const parts = fixed.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };

  return (
    <span ref={ref} className={`tabular-nums font-data ${className}`}>
      {prefix}
      {formatNumber(current)}
      {suffix}
    </span>
  );
}
