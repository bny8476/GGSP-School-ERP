"use client";

import React, { useState } from "react";
import { CheckCircle2, Clock, HelpCircle, Award, Play, Plus, BookOpen } from "lucide-react";
import EmergencyBanner from "@/components/ui/EmergencyBanner";

export default function OnlineExamsPage() {
  const [exams, setExams] = useState([
    { id: 1, title: "Grade 10 Physics Assessment - Motion & Forces", duration: "45 Minutes", totalQuestions: 30, passingScore: "70%", status: "Active" },
    { id: 2, title: "Mathematics Algebra Mid-Term Quiz", duration: "60 Minutes", totalQuestions: 40, passingScore: "65%", status: "Scheduled" },
    { id: 3, title: "English Grammar & Comprehension Test", duration: "30 Minutes", totalQuestions: 25, passingScore: "75%", status: "Completed" },
  ]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <EmergencyBanner />

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-[#000E28] dark:text-white flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-[#0050CB] dark:text-[#38BDF8]" />
            Online Examination Engine & Question Bank
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm font-medium">
            Configure computerized tests, MCQ question banks, auto-grading, and anti-cheating timers.
          </p>
        </div>

        <button className="px-5 py-2.5 bg-[#0050CB] hover:bg-[#0041A8] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>Create Online Exam</span>
        </button>
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {exams.map((exam) => (
          <div
            key={exam.id}
            className="bg-white dark:bg-[#000E28] border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                  exam.status === 'Active' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}>
                  {exam.status}
                </span>
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {exam.duration}
                </span>
              </div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-snug">{exam.title}</h3>
              <div className="flex items-center gap-4 text-xs text-slate-500 font-semibold">
                <span className="flex items-center gap-1"><HelpCircle className="w-3.5 h-3.5 text-[#0050CB]" /> {exam.totalQuestions} Questions</span>
                <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-amber-500" /> Pass: {exam.passingScore}</span>
              </div>
            </div>

            <button className="w-full py-2.5 bg-[#E5EEFF] hover:bg-[#0050CB] text-[#0050CB] hover:text-white dark:bg-[#0050CB]/20 dark:text-[#38BDF8] dark:hover:bg-[#0050CB] dark:hover:text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer">
              <Play className="w-4 h-4" />
              <span>{exam.status === 'Active' ? 'Launch Exam Portal' : 'View Test Details'}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
