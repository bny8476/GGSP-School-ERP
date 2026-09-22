"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function CtaBanner() {
  const { t } = useLanguage();
  const bannerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(bannerRef, { once: true, margin: "-80px" });
  const prefersReduced = useReducedMotion();

  return (
    <section
      ref={bannerRef}
      className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 sm:pb-32 select-none"
      aria-label="Call to Action: Transform your school today"
    >
      {/* Outer Banner Card */}
      <motion.div
        initial={{ opacity: 0, y: prefersReduced ? 0 : 35 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{
          duration: prefersReduced ? 0.2 : 0.75,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="relative overflow-hidden rounded-[32px] sm:rounded-[40px] bg-gradient-to-r from-[#000E28] via-[#002772] to-[#0050CB] p-8 sm:p-12 lg:p-16 border border-white/15 shadow-[0_25px_65px_-12px_rgba(0,14,40,0.5),0_0_50px_rgba(0,80,203,0.15)]"
      >
        {/* Subtle glass reflection highlight along top border */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

        {/* Ambient atmospheric lighting effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          
          {/* Slow pulsing cyan/sky atmospheric orb (Right Side) */}
          <motion.div
            animate={
              prefersReduced
                ? {}
                : {
                    scale: [1, 1.15, 1],
                    opacity: [0.35, 0.5, 0.35],
                  }
            }
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-24 -right-20 w-[480px] h-[480px] bg-gradient-to-bl from-[#38BDF8]/40 via-[#0050CB]/20 to-transparent rounded-full blur-3xl pointer-events-none"
          />

          {/* Soft ambient orb on left side */}
          <div className="absolute -bottom-28 -left-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Left-bottom soft glowing arc (as seen in screenshot) */}
          <div className="absolute -bottom-16 -left-12 w-60 h-60 rounded-full bg-gradient-to-tr from-[#38BDF8]/30 to-transparent border border-white/10 blur-[1px] pointer-events-none opacity-70" />



          {/* Subtle Graduation Cap & Connecting Node Line (Far Right Background) */}
          <div className="absolute top-6 right-8 sm:right-16 w-56 h-56 pointer-events-none opacity-20 hidden lg:block">
            <svg viewBox="0 0 200 200" fill="none" className="w-full h-full stroke-white">
              {/* Graduation Cap Wireframe */}
              <polygon points="100,30 170,60 100,90 30,60" strokeWidth="1.8" fill="none" />
              <polygon points="45,67 100,95 155,67" strokeWidth="1.6" fill="none" />
              <path d="M70,80 C70,80 70,115 100,118 C130,115 130,80 130,80" strokeWidth="1.6" fill="none" />
              <path d="M100,60 Q145,65 148,85 L148,105" strokeWidth="1.6" strokeLinecap="round" fill="none" />
              <circle cx="148" cy="107" r="3" fill="#FFFFFF" />
            </svg>
          </div>

          {/* Connecting Curved Light Beam with Glowing Node */}
          <div className="absolute bottom-6 right-28 w-44 h-44 pointer-events-none opacity-30 hidden lg:block">
            <svg viewBox="0 0 160 160" fill="none" className="w-full h-full stroke-sky-300">
              <path d="M0 120 Q60 110 120 40" strokeWidth="1.2" strokeDasharray="3 3" />
              <circle cx="120" cy="40" r="3.5" fill="#38BDF8" className="animate-pulse" />
            </svg>
          </div>

        </div>

        {/* Content Layout: Left Message + Right Action Buttons */}
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">
          
          {/* Left Column: Eyebrow + Headline + Description */}
          <div className="space-y-4 max-w-xl text-center lg:text-left">
            
            {/* Eyebrow Label */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-[#38BDF8] shadow-[0_0_8px_#38BDF8] animate-pulse" />
              <span className="text-[11px] sm:text-xs font-bold tracking-widest text-[#38BDF8] uppercase">
                {t("cta.badge", "BUILT FOR THE FUTURE OF EDUCATION")}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black text-white tracking-tight leading-[1.12]"
            >
              {t("cta.title1", "Transform your")}{" "}
              <span className="text-[#38BDF8] bg-clip-text text-transparent bg-gradient-to-r from-[#38BDF8] via-[#7DD3FC] to-sky-200 inline-block">
                {t("cta.title2", "school today")}
              </span>
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-blue-100/90 text-sm sm:text-base md:text-[17px] leading-relaxed font-normal"
            >
              {t("cta.subtitle", "Join hundreds of forward-thinking institutions using GGPS School to elevate their educational standard.")}
            </motion.p>
          </div>

          {/* Right Column: CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto"
          >
            {/* Primary Action Button: Apply for Admission */}
            <Link
              href="/admissions"
              className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-[#FF690C] to-[#FF7E2E] text-white font-bold text-base tracking-wide shadow-[0_10px_28px_rgba(255,105,12,0.45)] hover:shadow-[0_14px_34px_rgba(255,105,12,0.6)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            >
              <span>{t("cta.apply", "Apply for Admission")}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            {/* Secondary Action Button: Admin Sign In */}
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white font-bold text-base tracking-wide shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            >
              {t("cta.signIn", "Admin Sign In")}
            </Link>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
}
