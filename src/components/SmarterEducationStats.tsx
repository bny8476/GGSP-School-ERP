"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Fingerprint, CreditCard, FileText, Users, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface CounterProps {
  from?: number;
  to: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  inView: boolean;
}

function AnimatedNumber({
  from = 0,
  to,
  duration = 1.6,
  decimals = 0,
  suffix = "",
  inView,
}: CounterProps) {
  const [value, setValue] = useState(from);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) {
      setValue(to);
      return;
    }

    if (!inView) return;

    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      
      // Smooth easeOutExpo curve
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = from + (to - from) * ease;
      
      setValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setValue(to);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [inView, from, to, duration, prefersReduced]);

  return (
    <span>
      {decimals > 0 ? value.toFixed(decimals) : Math.round(value)}
      {suffix}
    </span>
  );
}

export default function SmarterEducationStats() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });
  const prefersReduced = useReducedMotion();

  const metrics = [
    {
      id: "attendance",
      badge: t("stats.m1_badge", "Reliable"),
      badgeHighlight: true,
      highlightCard: true,
      icon: Fingerprint,
      type: "counter",
      targetNumber: 99.8,
      decimals: 1,
      suffix: "%",
      title: t("stats.m1_title", "Attendance Accuracy"),
      description: t("stats.m1_desc", "Real-time biometric & mobile logs"),
      gradient: "from-[#0050CB]/10 via-[#0050CB]/5 to-transparent",
    },
    {
      id: "fees",
      badge: t("stats.m2_badge", "Automated"),
      badgeHighlight: false,
      highlightCard: false,
      icon: CreditCard,
      type: "counter",
      targetNumber: 100,
      decimals: 0,
      suffix: "%",
      title: t("stats.m2_title", "Paperless Fee Collection"),
      description: t("stats.m2_desc", "Automated receipts & reminders"),
      gradient: "from-blue-500/10 via-sky-500/5 to-transparent",
    },
    {
      id: "reports",
      badge: t("stats.m3_badge", "Instant"),
      badgeHighlight: false,
      highlightCard: false,
      icon: FileText,
      type: "text",
      staticText: t("stats.m3_val", "1-Click"),
      title: t("stats.m3_title", "Report Cards & Timetables"),
      description: t("stats.m3_desc", "Instant generation & export"),
      gradient: "from-[#FF690C]/10 via-[#FF690C]/5 to-transparent",
    },
    {
      id: "portal",
      badge: t("stats.m4_badge", "Always On"),
      badgeHighlight: false,
      highlightCard: false,
      icon: Users,
      type: "text",
      staticText: t("stats.m4_val", "24/7"),
      title: t("stats.m4_title", "Parent Portal Access"),
      description: t("stats.m4_desc", "Mobile diary & live updates"),
      gradient: "from-indigo-500/10 via-blue-500/5 to-transparent",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-20 sm:py-24 bg-gradient-to-b from-[#FAFBFD] via-[#F4F7FC] to-[#FFFFFF] dark:from-[#000a1f] dark:via-[#000E28] dark:to-[#000a1f] overflow-hidden select-none transition-colors duration-200"
      aria-label="Key Performance Metrics and Platform Statistics"
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft Radial Ambient Glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-b from-[#E5EEFF]/80 via-[#0050CB]/5 to-transparent dark:from-[#0050CB]/15 dark:via-transparent rounded-full blur-3xl opacity-70" />

        {/* Subtle Floating Geometry Dots */}
        <div className="absolute top-24 left-12 w-2.5 h-2.5 rounded-full bg-[#0050CB]/30 dark:bg-blue-400/20 blur-[0.5px] hidden lg:block" />
        <div className="absolute top-1/2 right-10 w-3 h-3 rounded-full bg-[#FF690C]/35 dark:bg-[#FF690C]/20 blur-[0.5px] hidden lg:block" />
        
        {/* Minimal Curved Connector Line Right */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-48 h-48 pointer-events-none opacity-25 dark:opacity-10 hidden xl:block">
          <svg viewBox="0 0 200 200" fill="none" className="w-full h-full stroke-blue-400">
            <path d="M200 20 Q120 80 140 180" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="138" cy="165" r="4" fill="#0050CB" />
          </svg>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block with Eyebrow Pill and Typography */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          
          {/* Eyebrow badge with side wings */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-3 mb-4"
          >
            <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#0050CB]/40 dark:to-blue-400/40" />
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#E5EEFF]/80 dark:bg-[#0050CB]/20 backdrop-blur-sm border border-[#0050CB]/20 dark:border-[#0050CB]/40 text-[#0050CB] dark:text-[#E5EEFF] text-xs sm:text-sm font-semibold tracking-wide shadow-sm">
              {t("stats.badge", "Why E.A.S. Academy")}
            </span>
            <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#0050CB]/40 dark:to-blue-400/40" />
          </motion.div>

          {/* Main Section Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-[#000E28] dark:text-white tracking-tight leading-tight"
          >
            {t("stats.title1", "Built for")} <span className="text-[#0050CB] dark:text-[#38BDF8] inline-block">{t("stats.title2", "Smarter Education")}</span>
          </motion.h2>

          {/* Supporting Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-slate-600 dark:text-slate-400 text-sm sm:text-base md:text-lg mt-4 max-w-2xl mx-auto leading-relaxed"
          >
            {t("stats.subtitle", "Powerful tools and intelligent automation to make school management simpler, faster and more efficient — for everyone.")}
          </motion.p>
        </div>

        {/* 4 Metrics Bento Showcase Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6 lg:gap-7">
          {metrics.map((metric, idx) => {
            const Icon = metric.icon;

            return (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: prefersReduced ? 0 : 28 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: prefersReduced ? 0.2 : 0.65,
                  delay: prefersReduced ? 0 : 0.12 * idx,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={
                  prefersReduced
                    ? {}
                    : {
                        y: -6,
                        boxShadow: "0 22px 45px -10px rgba(0, 14, 40, 0.10)",
                        transition: { duration: 0.25, ease: "easeOut" },
                      }
                }
                className={`group relative flex flex-col justify-between rounded-[26px] p-6 sm:p-7 transition-all duration-300 backdrop-blur-md overflow-hidden ${
                  metric.highlightCard
                    ? "bg-white/95 dark:bg-[#001438]/95 border-2 border-[#0050CB] shadow-[0_12px_36px_rgba(0,80,203,0.12)]"
                    : "bg-white/90 dark:bg-[#001233]/90 border border-slate-200/90 dark:border-slate-800 shadow-[0_8px_30px_rgba(0,14,40,0.04)] hover:border-blue-200 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-[#001438]"
                }`}
              >
                {/* Subtle soft gradient highlight accent on bottom corner */}
                <div
                  className={`absolute -bottom-12 -right-12 w-44 h-44 rounded-full bg-gradient-to-tl ${metric.gradient} pointer-events-none blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Subtle Glassmorphism Curved Arc Accent (as visible in screenshot) */}
                <div className="absolute -bottom-16 -right-10 w-44 h-44 rounded-full border border-blue-100/60 dark:border-slate-800/60 bg-blue-50/20 dark:bg-blue-900/10 pointer-events-none" />

                {/* Card Top Row: Minimal Line Icon + Pill Tag */}
                <div className="flex items-center justify-between relative z-10">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
                      metric.highlightCard
                        ? "bg-[#E5EEFF] dark:bg-[#0050CB]/30 text-[#0050CB] dark:text-[#38BDF8] shadow-sm"
                        : "bg-[#E5EEFF]/80 dark:bg-[#0050CB]/20 text-[#0050CB] dark:text-[#38BDF8] group-hover:bg-[#E5EEFF] dark:group-hover:bg-[#0050CB]/30"
                    }`}
                  >
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>

                  <span
                    className={`text-[11px] font-bold px-3 py-1 rounded-full tracking-wide transition-colors ${
                      metric.badgeHighlight
                        ? "bg-[#E5EEFF] dark:bg-[#0050CB]/30 text-[#0050CB] dark:text-[#E5EEFF] border border-[#0050CB]/20 dark:border-[#0050CB]/40"
                        : "bg-slate-100/90 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700 group-hover:bg-[#E5EEFF]/60 dark:group-hover:bg-[#0050CB]/20 group-hover:text-[#0050CB] dark:group-hover:text-[#38BDF8] group-hover:border-blue-200 dark:group-hover:border-blue-500/40"
                    }`}
                  >
                    {metric.badge}
                  </span>
                </div>

                {/* Card Middle: Metric Value + Title + Subtitle */}
                <div className="my-7 relative z-10">
                  <div className="text-4xl sm:text-[44px] lg:text-[46px] font-black text-[#000E28] dark:text-white tracking-tight leading-none">
                    {metric.type === "counter" ? (
                      <AnimatedNumber
                        from={0}
                        to={metric.targetNumber!}
                        decimals={metric.decimals || 0}
                        suffix={metric.suffix || ""}
                        inView={isInView}
                      />
                    ) : (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{
                          duration: 0.5,
                          delay: 0.2 + 0.1 * idx,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="inline-block"
                      >
                        {metric.staticText}
                      </motion.span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-[17px] font-bold text-[#000E28] dark:text-white mt-3.5 tracking-tight group-hover:text-[#0050CB] dark:group-hover:text-[#38BDF8] transition-colors">
                    {metric.title}
                  </h3>

                  <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 font-medium mt-1 leading-relaxed">
                    {metric.description}
                  </p>
                </div>

                {/* Card Bottom: Interactive Circle Action Button */}
                <div className="relative z-10 pt-2 flex items-center">
                  <div className="w-8 h-8 rounded-full border border-slate-200/90 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:border-[#0050CB] group-hover:bg-[#E5EEFF] dark:group-hover:bg-[#0050CB]/25 group-hover:text-[#0050CB] dark:group-hover:text-[#38BDF8] transition-all duration-300">
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
