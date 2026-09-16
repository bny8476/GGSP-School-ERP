"use client";

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, useInView, useReducedMotion, AnimatePresence } from 'framer-motion';
import ModernAcademicExcellence from '@/components/ModernAcademicExcellence';
import CtaBanner from '@/components/CtaBanner';
import { useLanguage } from '@/context/LanguageContext';
import { ScrollProgress } from "@/registry/magicui/scroll-progress";
import { 
  ArrowRight, 
  Play, 
  Users, 
  UserCheck, 
  Settings, 
  Smile, 
  CreditCard, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight,
  GraduationCap,
  Lock,
  Headphones,
  Check,
  Star,
  Award,
  BookOpen,
  TrendingUp,
  Heart,
  X,
  Plus,
  Minus,
  Zap,
  Globe
} from 'lucide-react';

// Animated Counter Component for Smooth Number Roll-Up on Scroll
function AnimatedCount({ 
  from = 0, 
  to, 
  decimals = 0, 
  suffix = "", 
  prefix = "",
  duration = 2.0 
}: { 
  from?: number; 
  to: number; 
  decimals?: number; 
  suffix?: string; 
  prefix?: string;
  duration?: number; 
}) {
  const [val, setVal] = useState(from);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) {
      setVal(to);
      return;
    }
    if (!isInView) return;

    let start: number | null = null;
    let animId: number;

    const step = (now: number) => {
      if (!start) start = now;
      const progress = Math.min((now - start) / (duration * 1000), 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setVal(from + (to - from) * ease);

      if (progress < 1) {
        animId = requestAnimationFrame(step);
      } else {
        setVal(to);
      }
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [isInView, from, to, duration, prefersReduced]);

  return (
    <span ref={ref}>
      {prefix}
      {decimals > 0 ? val.toFixed(decimals) : Math.round(val).toLocaleString()}
      {suffix}
    </span>
  );
}

// Spring Zoom-In Scroll Animation Variant Generator
const springZoomIn = {
  hidden: { opacity: 0, scale: 0.85, y: 35 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 14,
      delay: i * 0.08
    }
  })
};

export default function Home() {
  const { t } = useLanguage();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Mouse Spotlight Position State
  const [mousePos, setMousePos] = useState({ x: -500, y: -500 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Scroll reference for hero parallax effects
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const yDoodles = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const yHeroImage = useTransform(scrollYProgress, [0, 1], [0, 30]);

  // Testimonials Auto-rotate timer
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const testimonials = [
    {
      quote: "E.A.S. Academy has made our school operations so much easier. The platform is intuitive, reliable and excellent support team!",
      name: "Priya Sharma",
      role: "Principal, Sunrise Public School",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
    },
    {
      quote: "As a parent, I can easily track my child's progress, attendance and school activities. It gives me great peace of mind.",
      name: "Rajesh Kumar",
      role: "Parent",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
    },
    {
      quote: "The system is simple, powerful and saves us so much time. It's truly a complete solution for modern schools.",
      name: "Anjali Verma",
      role: "Teacher",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
    }
  ];

  const faqs = [
    {
      q: "How fast can our school onboard with E.A.S. Academy?",
      a: "Our automated data importer lets you import student rosters, staff lists, and fee schedules in under 30 minutes with dedicated 24/7 migration support."
    },
    {
      q: "Does E.A.S. Academy support WhatsApp & SMS notifications?",
      a: "Yes! Instant automated WhatsApp alerts and SMS notifications are sent to parents for attendance logs, fee receipts, exam report cards, and urgent notices."
    },
    {
      q: "Is student data encrypted and secure?",
      a: "Absolutely. We enforce bank-grade AES-256 encryption, role-based access control, biometric verification, and automated daily cloud backups."
    },
    {
      q: "Can parents pay school fees online through the portal?",
      a: "Yes, our paperless fee module integrates with UPI, Credit/Debit cards, Net Banking, and auto-generated QR receipts with instant payment confirmation."
    }
  ];

  const marqueeItems = [
    "⚡ Biometric Attendance Sync",
    "📄 1-Click Report Card Generator",
    "📱 Parent Mobile Diary App",
    "💳 Paperless Instant Fee Collection",
    "🤖 AI Examination Paper Creator",
    "🔒 Bank-Grade Role Security",
    "🚀 99.9% Uptime Guarantee",
    "💬 Real-Time WhatsApp Alerts"
  ];

  return (
    <div 
      ref={heroRef} 
      onMouseMove={handleMouseMove}
      className="relative min-h-screen bg-gradient-to-b from-[#F2F7FE] via-white to-[#F6F9FE] dark:from-[#000a1f] dark:via-[#000E28] dark:to-[#000a1f] overflow-hidden transition-colors duration-200"
    >
      
      {/* Interactive Cursor Spotlight Glow */}
      <div 
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(550px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 80, 203, 0.07), transparent 70%)`
        }}
      />

      {/* Magic UI Animated Scroll Progress Bar below fixed navbar */}
      <ScrollProgress className="top-20 z-40" />
      
      {/* Dynamic Animated Ambient Background Glow Orbs */}
      <motion.div 
        animate={{ 
          x: [0, 30, -20, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.08, 0.95, 1]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-1/4 w-[650px] h-[650px] bg-blue-200/40 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" 
      />
      <motion.div 
        animate={{ 
          x: [0, -40, 20, 0],
          y: [0, 30, -20, 0],
          scale: [1, 0.92, 1.05, 1]
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[600px] right-10 w-[550px] h-[550px] bg-sky-100/60 dark:bg-blue-900/10 rounded-full blur-3xl pointer-events-none -z-10" 
      />

      {/* ========================================== */}
      {/* 1. HERO SECTION WITH PHOTO COLLAGE & DOODLES */}
      {/* ========================================== */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-12 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: Hero Copy & CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col items-start text-left z-10"
          >
            {/* Tagline Pill */}
            <motion.div 
              whileHover={{ scale: 1.04 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E5EEFF] dark:bg-[#0050CB]/20 border border-blue-200/60 dark:border-[#0050CB]/40 text-[#0050CB] dark:text-[#38BDF8] text-xs sm:text-sm font-bold mb-5 shadow-2xs cursor-default"
            >
              <Sparkles className="w-4 h-4 text-[#0050CB] animate-pulse" />
              <span>{t('hero.badge', 'Modern School Management for a Brighter Tomorrow')}</span>
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.12] mb-6 text-[#000E28] dark:text-white">
              Empowering<br />
              Every Child's<br />
              <span className="relative inline-block text-[#0050CB] dark:text-[#38BDF8]">
                Potential
                {/* Curved underline swoosh under Potential */}
                <svg className="absolute -bottom-2 left-0 w-full h-3.5 text-[#0050CB] dark:text-[#38BDF8]" viewBox="0 0 160 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <motion.path 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
                    d="M2 12 Q 80 2, 158 10" 
                    stroke="currentColor" 
                    strokeWidth="4" 
                    strokeLinecap="round" 
                  />
                </svg>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-lg mb-8 font-normal">
              {t('hero.subtitle', 'E.A.S. Academy brings together students, parents, teachers and administrators with a powerful, easy-to-use school management system.')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 w-full mb-8">
              {/* Primary Pill Button with Shimmer Sweep */}
              <Link
                href="/admissions"
                className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#0050CB] hover:bg-[#0041A8] text-white font-bold text-base shadow-lg shadow-[#0050CB]/30 transition-all duration-300 hover:scale-[1.04] active:scale-95 overflow-hidden"
              >
                <span className="relative z-10">{t('nav.enrollNow', 'Enroll Now')}</span>
                <ArrowRight className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.4} />
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              </Link>

              {/* Secondary Outline Pill Button with Pulsing Play Ring */}
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(true)}
                className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-white dark:bg-slate-900 hover:bg-[#E5EEFF] dark:hover:bg-slate-800 border-2 border-blue-200 dark:border-slate-700 hover:border-[#0050CB] text-[#0050CB] dark:text-[#38BDF8] font-bold text-base transition-all duration-300 hover:scale-[1.04] active:scale-95 shadow-2xs cursor-pointer"
              >
                <div className="relative w-6 h-6 rounded-full bg-[#0050CB] text-white flex items-center justify-center text-[10px]">
                  <span className="absolute inset-0 rounded-full bg-[#0050CB] opacity-75 animate-ping group-hover:animate-none" />
                  <Play className="w-2.5 h-2.5 fill-current ml-0.5 relative z-10" />
                </div>
                <span>{t('hero.watchVideo', 'Watch Video')}</span>
              </button>
            </div>

            {/* Trust Micro-Badges Row */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <motion.div whileHover={{ y: -2 }} className="flex items-center gap-1.5 cursor-default">
                <div className="w-5.5 h-5.5 rounded-full bg-[#E5EEFF] dark:bg-[#0050CB]/20 flex items-center justify-center text-[#0050CB]">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <span>Safe & Secure Platform</span>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} className="flex items-center gap-1.5 cursor-default">
                <div className="w-5.5 h-5.5 rounded-full bg-[#E5EEFF] dark:bg-[#0050CB]/20 flex items-center justify-center text-[#0050CB]">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Easy to Use for Everyone</span>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} className="flex items-center gap-1.5 cursor-default">
                <div className="w-5.5 h-5.5 rounded-full bg-[#E5EEFF] dark:bg-[#0050CB]/20 flex items-center justify-center text-[#0050CB]">
                  <Headphones className="w-3.5 h-3.5" />
                </div>
                <span>24/7 Support Always Here</span>
              </motion.div>
            </div>

          </motion.div>

          {/* RIGHT COLUMN: Photo Collage Grid + Vector Doodles (Zoom-In Reveal) */}
          <motion.div 
            style={{ y: yHeroImage }}
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.75, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 relative flex items-center justify-center mt-6 lg:mt-0"
          >
            
            {/* Wavy Blob Container Background holding Collage Cards */}
            <div className="relative w-full max-w-[620px] aspect-[1.1/1] bg-gradient-to-tr from-sky-100/70 via-blue-50/60 to-blue-100/70 dark:from-blue-950/40 dark:via-[#001438]/50 dark:to-sky-950/30 rounded-[44px] p-6 border border-white/60 dark:border-slate-800 shadow-xl overflow-hidden flex items-center justify-center">
              
              {/* Central Main Student Girl Photo (Zoom-In) */}
              <motion.div 
                custom={1}
                variants={springZoomIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ scale: 1.03 }}
                className="absolute right-4 bottom-0 w-[270px] sm:w-[320px] h-[360px] sm:h-[420px] rounded-[32px] overflow-hidden shadow-2xl border-4 border-white dark:border-[#001438] z-20 cursor-pointer transition-transform"
              >
                <Image
                  src="/hero-girl-student.png"
                  alt="Student at E.A.S. Academy"
                  fill
                  priority
                  className="object-cover object-top"
                />
              </motion.div>

              {/* Top-Left Photo Card: School Campus */}
              <motion.div 
                custom={2}
                variants={springZoomIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ scale: 1.06, rotate: -2 }}
                className="absolute left-6 top-6 w-[180px] sm:w-[210px] h-[130px] sm:h-[150px] rounded-2xl overflow-hidden shadow-lg border-3 border-white dark:border-[#001438] z-10 cursor-pointer transition-transform"
              >
                <Image
                  src="/school-campus.jpg"
                  alt="School Campus"
                  fill
                  className="object-cover"
                />
              </motion.div>

              {/* Top-Right Photo Card: Classroom Boy Writing + Animated Crown Doodle */}
              <motion.div 
                custom={3}
                variants={springZoomIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ scale: 1.06, rotate: 2 }}
                className="absolute right-6 top-6 w-[130px] sm:w-[150px] h-[100px] sm:h-[120px] rounded-2xl overflow-hidden shadow-lg border-3 border-white dark:border-[#001438] z-10 cursor-pointer transition-transform"
              >
                <Image
                  src="/student-raising-hand.png"
                  alt="Classroom Student"
                  fill
                  className="object-cover object-top"
                />
                {/* Crown Doodle over student head with subtle bob float */}
                <motion.div 
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-1 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
                >
                  <svg width="28" height="20" viewBox="0 0 30 22" fill="none">
                    <path d="M2 18 L6 6 L15 14 L24 6 L28 18 Z" stroke="#FBBF24" strokeWidth="2.5" fill="#FEF08A" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="6" cy="4" r="2" fill="#FBBF24" />
                    <circle cx="15" cy="11" r="2" fill="#FBBF24" />
                    <circle cx="24" cy="4" r="2" fill="#FBBF24" />
                  </svg>
                </motion.div>
              </motion.div>

              {/* Bottom-Left Photo Card: Student Studying */}
              <motion.div 
                custom={4}
                variants={springZoomIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ scale: 1.06, rotate: -2 }}
                className="absolute left-6 bottom-8 w-[160px] sm:w-[185px] h-[110px] sm:h-[130px] rounded-2xl overflow-hidden shadow-lg border-3 border-white dark:border-[#001438] z-10 cursor-pointer transition-transform"
              >
                <Image
                  src="/mother-daughter-study.png"
                  alt="Home Learning"
                  fill
                  className="object-cover"
                />
              </motion.div>

              {/* Bottom-Right Yellow Sticky Note Box: Interactive Tilt Doodle */}
              <motion.div 
                custom={5}
                variants={springZoomIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ scale: 1.1, rotate: 0 }}
                className="absolute right-4 bottom-6 bg-[#FEF08A] text-slate-800 rounded-2xl p-4 shadow-xl border-2 border-yellow-200 rotate-[4deg] z-30 max-w-[140px] text-center cursor-pointer transition-transform"
              >
                <p className="font-sans italic font-bold text-slate-800 text-sm leading-snug">
                  Learn<br />Grow<br />Achieve
                </p>
                <div className="flex justify-center gap-1 text-amber-600 mt-1">
                  <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>♡</motion.span>
                  <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, delay: 0.3, repeat: Infinity }}>♡</motion.span>
                </div>
              </motion.div>

              {/* CONTINUOUS ANIMATED VECTOR DOODLES */}
              <motion.div style={{ y: yDoodles }} className="absolute inset-0 pointer-events-none z-30">
                {/* Yellow Smiling Sun Doodle with Continuous Spin */}
                <div className="absolute top-2 left-2 sm:left-4">
                  <motion.svg 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    width="60" 
                    height="60" 
                    viewBox="0 0 100 100" 
                    fill="none"
                  >
                    <circle cx="50" cy="50" r="22" stroke="#FBBF24" strokeWidth="4" fill="#FEF08A" fillOpacity="0.4" />
                    <line x1="50" y1="12" x2="50" y2="2" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" />
                    <line x1="50" y1="88" x2="50" y2="98" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" />
                    <line x1="12" y1="50" x2="2" y2="50" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" />
                    <line x1="88" y1="50" x2="98" y2="50" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" />
                    <circle cx="43" cy="45" r="2.5" fill="#B45309" />
                    <circle cx="57" cy="45" r="2.5" fill="#B45309" />
                    <path d="M42 56 Q50 63 58 56" stroke="#B45309" strokeWidth="3" strokeLinecap="round" fill="none" />
                  </motion.svg>
                </div>

                {/* Blue Paper Airplane with Floating Motion */}
                <motion.div 
                  animate={{ y: [0, -12, 0], x: [0, 8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-2 left-[44%]"
                >
                  <svg width="120" height="60" viewBox="0 0 160 80" fill="none">
                    <path d="M10 65 Q 40 15, 90 35 T 125 25" stroke="#3B82F6" strokeWidth="2.5" strokeDasharray="4 5" strokeLinecap="round" fill="none" />
                    <g transform="translate(120, 10) rotate(-10)">
                      <polygon points="0,20 30,0 20,30 10,22" fill="#60A5FA" />
                      <polygon points="0,20 30,0 12,18" fill="#3B82F6" />
                    </g>
                  </svg>
                </motion.div>
              </motion.div>

            </div>

          </motion.div>

        </div>
      </section>

      {/* ========================================== */}
      {/* INFINITE ANIMATED TICKER MARQUEE RIBBON */}
      {/* ========================================== */}
      <div className="w-full bg-[#0050CB] text-white py-3.5 overflow-hidden select-none shadow-md border-y border-blue-400/30">
        <motion.div 
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap gap-12 font-bold text-sm tracking-wide"
        >
          {[...marqueeItems, ...marqueeItems].map((item, idx) => (
            <span key={idx} className="inline-flex items-center gap-2">
              <span>{item}</span>
              <span className="w-2 h-2 rounded-full bg-blue-300 opacity-60 ml-4" />
            </span>
          ))}
        </motion.div>
      </div>

      {/* ========================================== */}
      {/* 2. HIGHLIGHT KEY METRICS CONTAINER (BAR) */}
      {/* ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          custom={0}
          variants={springZoomIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-[#E5EEFF]/80 dark:bg-[#001438]/80 backdrop-blur-md border border-[#0050CB]/15 dark:border-[#0050CB]/30 rounded-[32px] p-6 sm:p-9 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 divide-y sm:divide-y-0 lg:divide-x divide-blue-200/60 dark:divide-slate-800">
            
            {/* Metric 1 */}
            <motion.div whileHover={{ scale: 1.03 }} className="flex items-start gap-4 lg:px-6 first:pl-0 cursor-default">
              <div className="w-12 h-12 rounded-full bg-white dark:bg-[#0050CB]/30 text-[#0050CB] dark:text-[#38BDF8] flex items-center justify-center shrink-0 shadow-xs">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="text-3xl font-black text-[#000E28] dark:text-white tracking-tight leading-none mb-1.5">
                  <AnimatedCount to={99.8} decimals={1} suffix="%" />
                </div>
                <h4 className="text-sm font-bold text-[#000E28] dark:text-white mb-1">
                  Attendance Accuracy
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Real-time biometric & mobile logs
                </p>
              </div>
            </motion.div>

            {/* Metric 2 */}
            <motion.div whileHover={{ scale: 1.03 }} className="flex items-start gap-4 lg:px-6 pt-6 sm:pt-0 cursor-default">
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-xs">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <div className="text-3xl font-black text-[#000E28] dark:text-white tracking-tight leading-none mb-1.5">
                  <AnimatedCount to={100} decimals={0} suffix="%" />
                </div>
                <h4 className="text-sm font-bold text-[#000E28] dark:text-white mb-1">
                  Paperless Fee Collection
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Automated receipts & reminders
                </p>
              </div>
            </motion.div>

            {/* Metric 3 */}
            <motion.div whileHover={{ scale: 1.03 }} className="flex items-start gap-4 lg:px-6 pt-6 lg:pt-0 cursor-default">
              <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 shadow-xs">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="text-3xl font-black text-[#000E28] dark:text-white tracking-tight leading-none mb-1.5">
                  1-Click
                </div>
                <h4 className="text-sm font-bold text-[#000E28] dark:text-white mb-1">
                  Report Cards & Timetables
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Instant generation & export
                </p>
              </div>
            </motion.div>

            {/* Metric 4 */}
            <motion.div whileHover={{ scale: 1.03 }} className="flex items-start gap-4 lg:px-6 pt-6 lg:pt-0 last:pr-0 cursor-default">
              <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#FF690C] flex items-center justify-center shrink-0 shadow-xs">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="text-3xl font-black text-[#000E28] dark:text-white tracking-tight leading-none mb-1.5">
                  24/7
                </div>
                <h4 className="text-sm font-bold text-[#000E28] dark:text-white mb-1">
                  Parent Portal Access
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Mobile diary & live updates
                </p>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </section>

      {/* ========================================== */}
      {/* 3. "WHY E.A.S. ACADEMY" SECTION */}
      {/* ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Copy & Features List */}
          <motion.div 
            custom={0}
            variants={springZoomIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-5"
          >
            <div className="inline-flex items-center gap-2 text-[#0050CB] dark:text-[#38BDF8] text-xs font-bold uppercase tracking-wider mb-3">
              <span>WHY E.A.S. ACADEMY</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-black text-[#000E28] dark:text-white tracking-tight leading-tight mb-5">
              A Smarter Way to Manage Your School
            </h2>

            <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed mb-8">
              From admissions to academic performance, E.A.S. Academy simplifies every process, so you can focus on what truly matters — your students.
            </p>

            {/* Checkmark Features List */}
            <div className="space-y-4 mb-9">
              {[
                'Streamlined school operations',
                'Better parent engagement',
                'Improved student outcomes',
                'Secure & reliable platform'
              ].map((item, idx) => (
                <motion.div 
                  key={idx} 
                  whileHover={{ x: 6 }}
                  className="flex items-center gap-3 cursor-default"
                >
                  <div className="w-5 h-5 rounded-full bg-[#0050CB] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                  </div>
                  <span className="text-slate-700 dark:text-slate-200 font-bold text-sm sm:text-base">
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>

            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#000E28] hover:bg-[#001438] text-white font-bold text-base shadow-md transition-all duration-300 hover:scale-105"
            >
              <span>Explore Features</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>

          {/* Right Photo & Persona Cards Grid (Zoom-In Reveal) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Top Wide Card: Students Banner + Happy Students Card */}
            <motion.div 
              custom={1}
              variants={springZoomIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="sm:col-span-2 relative h-56 rounded-3xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800 cursor-pointer transition-transform"
            >
              <Image
                src="/hero-kids-banner.png"
                alt="Happy Students"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20" />
              
              {/* Happy Students Floating Overlay */}
              <motion.div 
                whileHover={{ scale: 1.06 }}
                className="absolute right-6 top-6 bottom-6 bg-[#FFFBEB] text-slate-800 rounded-2xl p-5 shadow-xl max-w-[170px] flex flex-col justify-center border border-amber-200"
              >
                <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-2">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-base mb-1">Happy Students</h4>
                <p className="text-xs text-slate-600 font-medium">Confident learners, bright futures.</p>
              </motion.div>
            </motion.div>

            {/* Bottom Left Card: Active Parents */}
            <motion.div 
              custom={2}
              variants={springZoomIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ scale: 1.04, y: -4 }}
              className="bg-[#E6F9F0] dark:bg-emerald-950/30 rounded-3xl p-6 border border-emerald-200/60 dark:border-emerald-900/40 shadow-sm flex flex-col justify-between cursor-pointer transition-transform"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-lg mb-1">Active Parents</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">Stay connected, be involved.</p>
              </div>
            </motion.div>

            {/* Bottom Center Photo Card + Dedicated Teachers Card */}
            <motion.div 
              custom={3}
              variants={springZoomIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ scale: 1.04, y: -4 }}
              className="relative h-44 rounded-3xl overflow-hidden shadow-md border border-slate-100 dark:border-slate-800 cursor-pointer transition-transform"
            >
              <Image
                src="/mother-daughter-study.png"
                alt="Mother Daughter Study"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0050CB]/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h4 className="font-extrabold text-base">Dedicated Teachers</h4>
                <p className="text-[11px] text-blue-100">Better tools, greater impact.</p>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* ========================================== */}
      {/* 4. "OUR SOLUTIONS" SECTION */}
      {/* ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 relative">
          <div className="inline-flex items-center gap-2 text-[#0050CB] dark:text-[#38BDF8] text-xs font-bold uppercase tracking-wider mb-2">
            <span>OUR SOLUTIONS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#000E28] dark:text-white tracking-tight mb-4">
            Everything Your School Needs
          </h2>

          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Powerful features designed to make school management simple, smart and efficient — for everyone.
          </p>

          {/* Doodle Arrow Text on Right */}
          <motion.div 
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-4 right-0 hidden xl:flex items-center gap-2 text-sky-500 font-sans italic text-sm rotate-[-8deg] pointer-events-none"
          >
            <span>Built for<br />Modern Schools</span>
            <svg width="40" height="40" viewBox="0 0 50 50" fill="none">
              <path d="M10 10 Q 30 5, 40 35 M 40 35 L 30 30 M 40 35 L 45 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </svg>
          </motion.div>
        </div>

        {/* 3 Solution Cards Grid (Zoom-In Entrance) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          
          {/* Solution 1: Intelligent Operations */}
          <motion.div
            custom={1}
            variants={springZoomIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="bg-white dark:bg-[#001438] rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-[0_10px_35px_rgba(0,14,40,0.04)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="w-13 h-13 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center mb-6 shadow-2xs group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-[#000E28] dark:text-white mb-3 group-hover:text-[#0050CB] dark:group-hover:text-[#38BDF8] transition-colors">
                Intelligent Operations
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 font-normal">
                Automate class scheduling, admissions workflows, transport management, and staff payroll with zero paperwork.
              </p>
            </div>
            <Link href="/admissions" className="inline-flex items-center gap-2 text-xs font-bold text-[#0050CB] dark:text-[#38BDF8] group-hover:underline">
              <span>Learn More</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Solution 2: Performance & Rubrics */}
          <motion.div
            custom={2}
            variants={springZoomIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="bg-white dark:bg-[#001438] rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-[0_10px_35px_rgba(0,14,40,0.04)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="w-13 h-13 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center mb-6 shadow-2xs group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-[#000E28] dark:text-white mb-3 group-hover:text-[#0050CB] dark:group-hover:text-[#38BDF8] transition-colors">
                Performance & Rubrics
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 font-normal">
                Track cognitive, motor, and academic milestones with teacher grading, rubrics, and automated report cards.
              </p>
            </div>
            <Link href="/admissions" className="inline-flex items-center gap-2 text-xs font-bold text-[#0050CB] dark:text-[#38BDF8] group-hover:underline">
              <span>Learn More</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Solution 3: Secure & Connected */}
          <motion.div
            custom={3}
            variants={springZoomIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="bg-white dark:bg-[#001438] rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-[0_10px_35px_rgba(0,14,40,0.04)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="w-13 h-13 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-[#0050CB] flex items-center justify-center mb-6 shadow-2xs group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-[#000E28] dark:text-white mb-3 group-hover:text-[#0050CB] dark:group-hover:text-[#38BDF8] transition-colors">
                Secure & Connected
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 font-normal">
                Role-based access control for Admins, Teachers, and Parents; instant announcements, WhatsApp updates, real-time alerts.
              </p>
            </div>
            <Link href="/admissions" className="inline-flex items-center gap-2 text-xs font-bold text-[#0050CB] dark:text-[#38BDF8] group-hover:underline">
              <span>Learn More</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

        </div>
      </section>

      {/* ========================================== */}
      {/* 5. "OUR IMPACT" SECTION */}
      {/* ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Student Photo + Floating Pill */}
          <motion.div
            custom={1}
            variants={springZoomIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="lg:col-span-5 relative h-[360px] rounded-3xl overflow-hidden shadow-xl border-4 border-white dark:border-[#001438] cursor-pointer transition-transform"
          >
            <Image
              src="/student-raising-hand.png"
              alt="Student raising hand"
              fill
              className="object-cover object-top"
            />
            {/* Floating Pill Badge */}
            <motion.div 
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-6 left-6 bg-white dark:bg-[#001438] rounded-full px-5 py-2.5 shadow-lg border border-slate-100 dark:border-slate-800 flex items-center gap-2"
            >
              <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs">
                😊
              </span>
              <span className="text-xs font-extrabold text-[#000E28] dark:text-white">
                Small Steps Big Dreams
              </span>
            </motion.div>
          </motion.div>

          {/* Right Column: Title + Impact Stats */}
          <motion.div
            custom={2}
            variants={springZoomIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <div className="inline-flex items-center gap-2 text-[#0050CB] dark:text-[#38BDF8] text-xs font-bold uppercase tracking-wider mb-3">
              <span>OUR IMPACT</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-black text-[#000E28] dark:text-white tracking-tight leading-tight mb-4">
              Real Growth. Lasting Success.
            </h2>

            <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed mb-10">
              We're proud to support schools in building a better future through technology, trust and innovation.
            </p>

            {/* 3 Impact Numbers Grid */}
            <div className="grid grid-cols-3 gap-6 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div>
                <div className="text-3xl sm:text-4xl font-black text-[#000E28] dark:text-white tracking-tight leading-none mb-2">
                  <AnimatedCount to={500} suffix="+" />
                </div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Schools Trusted
                </div>
              </div>

              <div>
                <div className="text-3xl sm:text-4xl font-black text-[#000E28] dark:text-white tracking-tight leading-none mb-2">
                  <AnimatedCount to={50000} suffix="+" />
                </div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Students Enrolled
                </div>
              </div>

              <div>
                <div className="text-3xl sm:text-4xl font-black text-[#000E28] dark:text-white tracking-tight leading-none mb-2">
                  <AnimatedCount to={99.9} decimals={1} suffix="%" />
                </div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  System Uptime
                </div>
              </div>
            </div>

          </motion.div>

        </div>
      </section>

      {/* ========================================== */}
      {/* 6. "WHAT SCHOOLS SAY" TESTIMONIALS SECTION */}
      {/* ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-[#0050CB] dark:text-[#38BDF8] text-xs font-bold uppercase tracking-wider mb-2">
            <span>WHAT SCHOOLS SAY</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#000E28] dark:text-white tracking-tight mb-4">
            Trusted by Educators, Loved by Parents
          </h2>
        </div>

        {/* 3 Interactive Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {testimonials.map((item, idx) => (
            <motion.div
              key={idx}
              custom={idx + 1}
              variants={springZoomIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => setActiveTestimonial(idx)}
              className={`rounded-3xl p-7 border transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                activeTestimonial === idx
                  ? "bg-white dark:bg-[#001438] border-[#0050CB] shadow-xl ring-2 ring-[#0050CB]/20"
                  : "bg-white/80 dark:bg-[#001438]/80 border-slate-100 dark:border-slate-800 shadow-xs hover:shadow-md"
              }`}
            >
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6 font-medium italic">
                "{item.quote}"
              </p>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-[#0050CB]/20"
                    src={item.image}
                    alt={item.name}
                  />
                  <div>
                    <h4 className="font-extrabold text-sm text-[#000E28] dark:text-white">{item.name}</h4>
                    <p className="text-[11px] text-slate-400 font-medium">{item.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 text-amber-400 text-xs">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Interactive Slider Pagination Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveTestimonial(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeTestimonial === idx ? "w-8 bg-[#0050CB]" : "w-2.5 bg-slate-300 dark:bg-slate-700"
              }`}
            />
          ))}
        </div>
      </section>

      {/* ========================================== */}
      {/* INTERACTIVE FAQ ACCORDION SECTION */}
      {/* ========================================== */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <span className="text-[#0050CB] dark:text-[#38BDF8] text-xs font-bold uppercase tracking-wider block mb-2">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#000E28] dark:text-white tracking-tight">
            Got Questions? We Have Answers.
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="bg-white dark:bg-[#001438] rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-2xs"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left font-extrabold text-base text-[#000E28] dark:text-white hover:text-[#0050CB] dark:hover:text-[#38BDF8] transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-300 ${
                  openFaq === idx ? "bg-[#0050CB] text-white rotate-180" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                }`}>
                  <ChevronRight className="w-4 h-4 rotate-90" />
                </div>
              </button>

              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal border-t border-slate-100 dark:border-slate-800/80 pt-3">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========================================== */}
      {/* 7. BOTTOM CTA BANNER */}
      {/* ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-10">
        <motion.div
          custom={0}
          variants={springZoomIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          whileHover={{ scale: 1.01 }}
          className="relative bg-gradient-to-r from-[#000E28] via-[#0050CB] to-[#001438] text-white rounded-[36px] p-8 sm:p-12 overflow-hidden shadow-2xl transition-transform"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Content */}
            <div className="lg:col-span-8">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-200 mb-2">
                READY TO GET STARTED?
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">
                Join E.A.S. Academy Today
              </h2>

              <p className="text-blue-100 text-base sm:text-lg max-w-xl mb-8 font-normal">
                Give your school the tools it needs to grow, succeed and make a lasting impact.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/admissions"
                  className="group relative inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-[#0050CB] hover:bg-blue-50 font-bold text-base shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden"
                >
                  <span className="relative z-10">Apply for Admission</span>
                  <ArrowRight className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-base transition-all duration-300 hover:scale-105"
                >
                  <span>Admin Sign In</span>
                </Link>
              </div>
            </div>

            {/* Right Graphic: Book Stack Illustration + Doodle Text */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center relative hidden lg:flex">
              <div className="space-y-1.5 transform rotate-[-6deg]">
                <div className="w-44 h-5 bg-amber-400 rounded-sm shadow-md" />
                <div className="w-48 h-6 bg-[#FF690C] rounded-sm shadow-md" />
                <div className="w-52 h-6 bg-sky-400 rounded-sm shadow-md" />
              </div>
              <div className="mt-4 text-center font-sans italic text-sm font-bold text-blue-200">
                Better<br />Education<br />Brighter<br />Future ♡
              </div>
            </div>

          </div>
        </motion.div>
      </section>

      {/* ========================================== */}
      {/* 8. VIDEO MODAL / LIGHTBOX */}
      {/* ========================================== */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-4xl bg-white dark:bg-[#001438] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 p-6"
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#E5EEFF] text-[#0050CB] flex items-center justify-center">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
                <h3 className="text-lg font-black text-[#000E28] dark:text-white">E.A.S. Academy Overview</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Placeholder Frame */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gradient-to-tr from-[#000E28] to-[#0050CB] flex flex-col items-center justify-center text-white p-8">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-4 animate-pulse">
                <Play className="w-10 h-10 fill-current ml-1" />
              </div>
              <h4 className="text-2xl font-black mb-2 text-center">Interactive ERP Tour Video</h4>
              <p className="text-blue-100 text-sm max-w-md text-center">
                Discover how E.A.S. Academy automates admissions, fee collection, student attendance, and report cards.
              </p>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
