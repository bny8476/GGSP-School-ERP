"use client";

import Link from 'next/link';
import Image from 'next/image';
import SmarterEducationStats from '@/components/SmarterEducationStats';
import ModernAcademicExcellence from '@/components/ModernAcademicExcellence';
import CtaBanner from '@/components/CtaBanner';
import { useLanguage } from '@/context/LanguageContext';
import { ScrollProgress } from "@/registry/magicui/scroll-progress";
import { 
  ArrowRight, 
  Calendar, 
  Users, 
  TrendingUp, 
  CalendarCheck, 
  FileText, 
  CreditCard, 
  BarChart3, 
  ChevronRight,
  GraduationCap,
  Shield,
  Heart,
  Award,
  Sparkles
} from 'lucide-react';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#F7FAFE] via-white to-[#F6F9FE] dark:from-[#000a1f] dark:via-[#000E28] dark:to-[#000a1f] overflow-hidden transition-colors duration-200">
      {/* Magic UI Animated Scroll Progress Bar below fixed navbar */}
      <ScrollProgress className="top-20 z-40" />
      
      {/* Decorative blurred background ambient lights */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-200/30 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-40 right-10 w-[500px] h-[500px] bg-sky-100/40 dark:bg-blue-900/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-20 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: Hero Copy & CTAs */}
          <div className="lg:col-span-6 flex flex-col items-start text-left z-10">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E5EEFF] dark:bg-[#0050CB]/20 border border-[#E5EEFF] dark:border-[#0050CB]/40 text-[#0050CB] dark:text-[#E5EEFF] text-xs sm:text-sm font-bold mb-6 shadow-sm">
              <span className="p-1 rounded-full bg-[#0050CB] text-white">
                <GraduationCap className="w-3.5 h-3.5" />
              </span>
              <span>{t('hero.badge', 'Complete School ERP Platform')}</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-black tracking-tight text-[#000E28] dark:text-white leading-[1.12] mb-6">
              {t('hero.title1', 'Smarter School')}<br />
              {t('hero.title2', 'ERP Platform.')}<br />
              <span className="text-[#0050CB] dark:text-[#38BDF8]">
                {t('hero.title3', 'Seamless Operations.')}<br />
                {t('hero.title4', 'Better Learning.')}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-500 dark:text-slate-400 text-base sm:text-[17px] leading-relaxed max-w-lg mb-8 font-normal">
              {t('hero.subtitle', 'An all-in-one School ERP solution designed to automate admissions, fee collections, attendance, examinations, and payroll — connecting administrators, teachers, parents, and students in real time.')}
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center gap-4 w-full mb-10">
              <Link
                href="/admissions"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#0050CB] hover:bg-[#0041A8] text-white font-bold text-base shadow-lg shadow-[#0050CB]/25 transition-all hover:scale-105 active:scale-95"
              >
                <span>{t('nav.enrollNow', 'Enroll Now')}</span>
                <ArrowRight className="w-5 h-5" strokeWidth={2.4} />
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-2.5 overflow-hidden">
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-[#001438] object-cover shadow-sm"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="School Principal"
                />
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-[#001438] object-cover shadow-sm"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Teacher"
                />
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-[#001438] object-cover shadow-sm"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                  alt="Administrator"
                />
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-[#001438] object-cover shadow-sm"
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
                  alt="School Leader"
                />
              </div>

              <div className="text-left">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {t('hero.trustedBy', 'Trusted by 1,000+ schools')}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {t('hero.countries', 'across 20+ countries')}
                </p>
              </div>
            </div>

            {/* Decorative 3D Cube in Lower Left */}
            <div className="relative mt-8 hidden sm:block">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="text-blue-400 opacity-80 animate-pulse">
                <rect x="6" y="6" width="24" height="24" rx="7" transform="rotate(18 18 18)" fill="#818CF8" opacity="0.6" />
                <rect x="8" y="8" width="20" height="20" rx="5" transform="rotate(12 18 18)" fill="#93C5FD" opacity="0.9" />
              </svg>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Visual & Floating UI Cards */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[540px] sm:min-h-[580px] lg:min-h-[620px]">
            
            {/* Halo behind the student */}
            <div className="absolute w-80 sm:w-[420px] h-80 sm:h-[420px] rounded-full bg-blue-100/60 dark:bg-blue-900/30 blur-3xl pointer-events-none" />

            {/* Floating 3D Graduation Cap in Top Right */}
            <div className="absolute top-0 right-2 sm:right-6 z-20 drop-shadow-xl animate-float">
              <svg width="100" height="85" viewBox="0 0 100 85" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Cap diamond */}
                <polygon points="50,15 90,32 50,48 10,32" fill="#000E28" />
                <polygon points="10,32 50,48 50,52 10,36" fill="#00143D" />
                <polygon points="90,32 50,48 50,52 90,36" fill="#000E28" />
                {/* Cap base */}
                <path d="M30,40 C30,40 30,60 50,62 C70,60 70,40 70,40" fill="#0050CB" />
                {/* Orange Button */}
                <circle cx="50" cy="32" r="3.5" fill="#FF690C" />
                {/* Orange Tassel */}
                <path d="M50,32 Q78,35 80,48 L80,58" stroke="#FF690C" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <circle cx="80" cy="59" r="3" fill="#FF690C" />
              </svg>
            </div>

            {/* Student Portrait (Centerpiece) */}
            <div className="relative z-10 w-[290px] sm:w-[350px] lg:w-[380px] h-[440px] sm:h-[500px] lg:h-[540px] rounded-[36px] overflow-hidden shadow-2xl border-4 border-white dark:border-[#001438]">
              <Image
                src="/hero-student.jpg"
                alt="Student at E.A.S. Academy"
                fill
                priority
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* FLOATING CARD 1: Student Attendance (Top Left) */}
            <div className="absolute -left-4 sm:-left-8 lg:-left-12 top-4 sm:top-8 bg-white/95 dark:bg-[#001438]/95 backdrop-blur-md rounded-2xl p-4 shadow-[0_15px_35px_rgba(0,14,40,0.08)] border border-slate-100 dark:border-slate-800 z-30 transition-transform hover:scale-105">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-lg bg-[#E5EEFF] dark:bg-[#0050CB]/25 flex items-center justify-center text-[#0050CB] dark:text-[#38BDF8]">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-[#000E28] dark:text-white">{t('card.attendance', 'Student Attendance')}</span>
              </div>

              <div className="flex items-center gap-4">
                {/* Circular Donut Progress Ring */}
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-100 dark:text-slate-800"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#0050CB] dark:text-[#38BDF8]"
                      strokeDasharray="96, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-xs font-extrabold text-[#000E28] dark:text-white">96%</span>
                </div>

                {/* Stats Breakdown */}
                <div className="space-y-1 text-[11px]">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {t('card.present', 'Present')}
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">482</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      {t('card.absent', 'Absent')}
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">18</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 pt-0.5 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 dark:text-slate-500">{t('card.total', 'Total')}</span>
                    <span className="font-bold text-slate-600 dark:text-slate-300">500</span>
                  </div>
                </div>
              </div>
            </div>

            {/* FLOATING CARD 2: Academic Performance (Mid-Left) */}
            <div className="absolute -left-6 sm:-left-10 lg:-left-16 top-48 sm:top-52 bg-white/95 dark:bg-[#001438]/95 backdrop-blur-md rounded-2xl p-4 shadow-[0_15px_35px_rgba(15,23,42,0.1)] border border-slate-100 dark:border-slate-800 z-30 transition-transform hover:scale-105">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-white">{t('card.performance', 'Academic Performance')}</span>
              </div>

              <div className="flex items-center gap-4">
                {/* Mini Bar Chart */}
                <div className="flex items-end gap-1.5 h-12 w-16 px-1 border-b border-slate-200 dark:border-slate-700">
                  <div className="w-2.5 h-6 bg-sky-400 rounded-t-sm" />
                  <div className="w-2.5 h-8 bg-cyan-400 rounded-t-sm" />
                  <div className="w-2.5 h-12 bg-emerald-400 rounded-t-sm" />
                  <div className="w-2.5 h-10 bg-indigo-500 rounded-t-sm" />
                </div>

                {/* Grade breakdown */}
                <div className="space-y-0.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500 dark:text-slate-400">A+</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">42%</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500 dark:text-slate-400">A</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">38%</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500 dark:text-slate-400">B</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">15%</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500 dark:text-slate-400">C</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">5%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* FLOATING CARD 3: Quick Modules Menu (Top Right) */}
            <div className="absolute -right-2 sm:-right-6 lg:-right-10 top-14 sm:top-18 bg-white/95 dark:bg-[#001438]/95 backdrop-blur-md rounded-2xl p-3.5 shadow-[0_15px_35px_rgba(15,23,42,0.1)] border border-slate-100 dark:border-slate-800 z-30 w-[190px] sm:w-[210px] transition-transform hover:scale-105 hidden sm:block">
              <div className="space-y-2">
                
                {/* Classes & Timetable */}
                <div className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <CalendarCheck className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{t('card.timetable', 'Classes & Timetable')}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>

                {/* Exams & Results */}
                <div className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{t('card.exams', 'Exams & Results')}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>

                {/* Fees & Payments */}
                <div className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center text-rose-600 dark:text-rose-400">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{t('card.fees', 'Fees & Payments')}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>

                {/* Reports & Analytics */}
                <div className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center text-sky-600 dark:text-sky-400">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{t('card.reports', 'Reports & Analytics')}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>

              </div>
            </div>

            {/* FLOATING CARD 4: Active Students (Bottom Right) */}
            <div className="absolute -right-2 sm:-right-4 lg:-right-8 bottom-6 sm:bottom-10 bg-white/95 dark:bg-[#001438]/95 backdrop-blur-md rounded-2xl p-4 shadow-[0_15px_35px_rgba(0,14,40,0.08)] border border-slate-100 dark:border-slate-800 z-30 min-w-[170px] transition-transform hover:scale-105">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#E5EEFF] dark:bg-[#0050CB]/25 flex items-center justify-center text-[#0050CB] dark:text-[#38BDF8]">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{t('card.activeStudents', 'Active Students')}</span>
              </div>

              <div className="text-2xl font-black text-[#000E28] dark:text-white tracking-tight mt-1.5">
                1,248
              </div>

              {/* Trend Badge & Sparkline */}
              <div className="flex items-center justify-between gap-3 mt-1.5">
                <span className="inline-flex items-center text-xs font-bold text-[#FF690C]">
                  ↑ 12%
                </span>
                {/* Orange Sparkline SVG Wave */}
                <svg width="64" height="20" viewBox="0 0 64 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M2 16 Q18 4 32 12 T62 4"
                    stroke="#FF690C"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </div>
            </div>

            {/* Desk details in bottom right corner (Books and Pen Holder) */}
            <div className="absolute -bottom-4 right-0 z-20 flex items-end gap-3 hidden sm:flex">
              {/* Stack of books */}
              <div className="space-y-1">
                <div className="w-28 h-3.5 bg-[#E5EEFF] border border-blue-200 rounded-sm shadow-sm" />
                <div className="w-32 h-4 bg-[#FF690C] rounded-sm shadow-sm" />
                <div className="w-30 h-3.5 bg-[#0050CB] rounded-sm shadow-sm" />
              </div>
              {/* Pen Holder */}
              <div className="w-8 h-10 bg-[#000E28] rounded-t-md relative flex items-center justify-center">
                <div className="absolute -top-3 w-1.5 h-6 bg-[#FF690C] rounded-full rotate-6" />
                <div className="absolute -top-4 w-1.5 h-7 bg-[#0050CB] rounded-full -rotate-12" />
                <div className="absolute -top-3 w-1.5 h-6 bg-[#E5EEFF] rounded-full rotate-12" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Built for Smarter Education - Modern SaaS Statistics Showcase */}
      <SmarterEducationStats />

      {/* Designed for Modern Academic Excellence - Bento SaaS Feature Section */}
      <ModernAcademicExcellence />

      {/* Transform your school today - Premium SaaS CTA Banner */}
      <CtaBanner />

    </div>
  );
}

