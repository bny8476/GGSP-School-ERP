"use client";

import React, { useRef } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";

export type RevealVariant = 
  | "fadeUp" 
  | "fadeDown" 
  | "fadeLeft" 
  | "fadeRight" 
  | "blurReveal" 
  | "scaleReveal" 
  | "wordReveal";

export interface TextRevealProps {
  children: React.ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  className?: string;
  as?: React.ElementType;
  once?: boolean;
}

export default function TextReveal({
  children,
  variant = "fadeUp",
  delay = 0,
  duration = 0.6,
  className = "",
  as: Tag = "div",
  once = true,
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-40px" });
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    const Component = Tag as any;
    return <Component className={className}>{children}</Component>;
  }

  const variantsMap: Record<RevealVariant, Variants> = {
    fadeUp: {
      hidden: { opacity: 0, y: 24 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration, delay, ease: [0.16, 1, 0.3, 1] },
      },
    },
    fadeDown: {
      hidden: { opacity: 0, y: -20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration, delay, ease: [0.16, 1, 0.3, 1] },
      },
    },
    fadeLeft: {
      hidden: { opacity: 0, x: 28 },
      visible: {
        opacity: 1,
        x: 0,
        transition: { duration, delay, ease: [0.16, 1, 0.3, 1] },
      },
    },
    fadeRight: {
      hidden: { opacity: 0, x: -28 },
      visible: {
        opacity: 1,
        x: 0,
        transition: { duration, delay, ease: [0.16, 1, 0.3, 1] },
      },
    },
    blurReveal: {
      hidden: { opacity: 0, filter: "blur(8px)", y: 12 },
      visible: {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        transition: { duration: duration * 1.1, delay, ease: [0.16, 1, 0.3, 1] },
      },
    },
    scaleReveal: {
      hidden: { opacity: 0, scale: 0.94 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: { duration, delay, ease: [0.16, 1, 0.3, 1] },
      },
    },
    wordReveal: {
      hidden: { opacity: 0, y: 16 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration, delay, ease: [0.16, 1, 0.3, 1] },
      },
    },
  };

  const MotionComponent = (motion as any)[typeof Tag === "string" ? Tag : "div"] || motion.div;

  return (
    <MotionComponent
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variantsMap[variant]}
      className={className}
    >
      {children}
    </MotionComponent>
  );
}
