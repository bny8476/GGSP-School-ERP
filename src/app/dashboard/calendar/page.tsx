"use client";

import React, { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, Tag } from "lucide-react";
import EmergencyBanner from "@/components/ui/EmergencyBanner";

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState("September 2026");

  const events = [
    { id: 1, title: "Mid-Term Mathematics Exam", date: "Sep 18, 2026", type: "Exam", color: "bg-rose-500" },
    { id: 2, title: "Annual Sports Meet 2026", date: "Sep 22, 2026", type: "Event", color: "bg-[#0050CB]" },
    { id: 3, title: "Parent-Teacher Association Meeting", date: "Sep 25, 2026", type: "Meeting", color: "bg-[#FF690C]" },
    { id: 4, title: "Q3 Tuition Fee Due Date", date: "Sep 30, 2026", type: "Deadline", color: "bg-emerald-500" },
  ];

  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <EmergencyBanner />

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-[#000E28] dark:text-white flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-[#0050CB] dark:text-[#38BDF8]" />
            School Academic Calendar & Events
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm font-medium">
            Schedule of classes, examinations, holidays, sports days, and fee deadlines.
          </p>
        </div>

        <button className="px-5 py-2.5 bg-[#0050CB] hover:bg-[#0041A8] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>Add Academic Event</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Calendar View */}
        <div className="lg:col-span-8 bg-white dark:bg-[#000E28] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">{currentMonth}</h2>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors cursor-pointer">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors cursor-pointer">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 text-center text-xs font-black text-slate-400 uppercase tracking-wider">
            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {daysInMonth.map((day) => {
              const isToday = day === 15;
              const hasEvent = day === 18 || day === 22 || day === 25 || day === 30;

              return (
                <div
                  key={day}
                  className={`min-h-[72px] p-2 rounded-2xl border flex flex-col justify-between transition-all cursor-pointer ${
                    isToday
                      ? "bg-[#E5EEFF] dark:bg-[#0050CB]/20 border-[#0050CB] text-[#0050CB] dark:text-[#38BDF8] font-black shadow-xs"
                      : "border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <span className="text-xs font-bold">{day}</span>
                  {hasEvent && (
                    <div className="w-2 h-2 rounded-full bg-[#FF690C] mx-auto animate-pulse" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events Column */}
        <div className="lg:col-span-4 bg-white dark:bg-[#000E28] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#0050CB]" />
            Upcoming Academic Schedule
          </h3>

          <div className="space-y-3">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Tag className="w-3 h-3 text-[#0050CB]" /> {ev.type}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">{ev.date}</span>
                </div>
                <h4 className="font-extrabold text-xs text-slate-800 dark:text-white">{ev.title}</h4>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
