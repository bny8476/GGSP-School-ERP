"use client";

import React from "react";
import { motion, useScroll, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ScrollProgressProps extends HTMLMotionProps<"div"> {}

export const ScrollProgress = React.forwardRef<
  HTMLDivElement,
  ScrollProgressProps
>(({ className, ...props }, ref) => {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      ref={ref}
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-1 origin-left bg-gradient-to-r from-[#0050CB] via-[#38BDF8] to-[#FF690C] shadow-xs",
        className
      )}
      style={{
        scaleX: scrollYProgress,
      }}
      {...props}
    />
  );
});

ScrollProgress.displayName = "ScrollProgress";
export default ScrollProgress;
