"use client";

import React, { useState } from "react";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  Award, 
  FileText, 
  Check, 
  X, 
  Sparkles, 
  Users, 
  Settings, 
  Heart,
  ChevronDown
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface EventItem {
  id: string;
  title: string;
  type: "Event" | "Exam" | "Reminder" | "Meeting" | "Holiday";
  date: string;
  time: string;
  location: string;
  badgeColor: string;
  badgeBg: string;
}

export default function AcademicCalendarPage() {
  const [currentView, setCurrentView] = useState<"Month" | "Week" | "Day">("Month");
  const [selectedDay, setSelectedDay] = useState<number>(24);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedEventModal, setSelectedEventModal] = useState<any | null>(null);

  // Form State for Add Event
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventType, setNewEventType] = useState("Event");
  const [newEventDate, setNewEventDate] = useState("2026-09-24");
  const [newEventTime, setNewEventTime] = useState("10:00 AM - 12:00 PM");
  const [newEventLocation, setNewEventLocation] = useState("Main Campus, Auditorium");

  const upcomingEvents: EventItem[] = [
    {
      id: "ev-1",
      title: "Student Council Leadership",
      type: "Event",
      date: "SEP 24",
      time: "10:00 AM - 12:00 PM",
      location: "Main Campus, Auditorium",
      badgeColor: "text-[#059669]",
      badgeBg: "bg-[#ECFDF5]"
    },
    {
      id: "ev-2",
      title: "Grade 10 Mathematics Mid-Term Assessment",
      type: "Exam",
      date: "SEP 25",
      time: "10:00 AM - 01:00 PM",
      location: "Examination Hall A & B",
      badgeColor: "text-[#7C3AED]",
      badgeBg: "bg-[#F3E8FF]"
    },
    {
      id: "ev-3",
      title: "Inter-School Sports Track Trials & Athletic Heats",
      type: "Event",
      date: "SEP 28",
      time: "08:30 AM - 03:00 PM",
      location: "Olympic Athletic Ground",
      badgeColor: "text-[#2563EB]",
      badgeBg: "bg-[#EFF6FF]"
    },
    {
      id: "ev-4",
      title: "Term 1 Tuition Fee Reconciliation Deadline",
      type: "Reminder",
      date: "OCT 02",
      time: "All Day",
      location: "Accounts Dept. & Online Portal",
      badgeColor: "text-[#E11D48]",
      badgeBg: "bg-[#FFF1F2]"
    },
    {
      id: "ev-5",
      title: "Annual Day Celebration",
      type: "Event",
      date: "OCT 05",
      time: "09:00 AM - 05:00 PM",
      location: "School Ground",
      badgeColor: "text-[#2563EB]",
      badgeBg: "bg-[#EFF6FF]"
    }
  ];

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) {
      toast.error("Please enter an event title");
      return;
    }
    toast.success(`Event "${newEventTitle}" added successfully!`);
    setShowAddModal(false);
    setNewEventTitle("");
  };

  return (
    <div className="space-y-6 font-saas pb-8">
      {/* 1. TOP HERO ROW (Left Hero Card + Right KPI Card) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Hero Card */}
        <div className="lg:col-span-7 xl:col-span-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#EFF5FF] via-[#F4F8FF] to-[#E5EEFF] border border-blue-100/90 p-6 md:p-7 shadow-xs flex flex-col justify-between">
          {/* Decorative Campus Backdrop Overlay */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-25 lg:opacity-35 pointer-events-none overflow-hidden flex items-center justify-end">
            <img 
              src="/admin-hero-campus.jpg" 
              alt="Campus visual" 
              className="h-full w-full object-cover object-left mask-[linear-gradient(to_left,black,transparent)]"
            />
          </div>

          <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0050CB] to-[#2563EB] flex items-center justify-center text-white shadow-lg shadow-[#0050CB]/25 shrink-0">
                <CalendarIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-black text-[#000E28] tracking-tight">
                  Academic Calendar
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  View and manage academic schedule, events, holidays and important dates.
                </p>
                <p className="text-xs sm:text-sm text-slate-500 italic font-serif mt-2 tracking-wide">
                  Plan Today &nbsp;•&nbsp; Build Tomorrow
                </p>
              </div>
            </div>

            {/* Floating Tag */}
            <div className="self-end mr-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs border border-blue-100 text-xs font-bold text-[#0050CB] shadow-xs">
                Learning Never Stops ✍️
              </span>
            </div>
          </div>
        </div>

        {/* Right KPI & Academic Year Card */}
        <div className="lg:col-span-5 xl:col-span-4 rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] border border-blue-200/80 text-[#0050CB] flex items-center justify-center shrink-0">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-[#000E28] leading-tight">
                  September 2026
                </h2>
                <p className="text-[11px] text-slate-400 font-medium leading-tight mt-0.5">
                  Current Academic Year<br />2025 - 2026
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="bg-[#0050CB] hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-full shadow-sm flex items-center gap-1.5 transition-all cursor-pointer hover:shadow-md hover:scale-102"
            >
              <Plus className="w-4 h-4" />
              <span>Add Event</span>
            </button>
          </div>

          {/* 4 Stat Metric Badges */}
          <div className="grid grid-cols-4 gap-2.5 mt-5">
            {/* Total Events */}
            <div className="bg-[#EFF6FF] border border-blue-100/80 rounded-xl p-2.5 text-center flex flex-col items-center justify-center">
              <CalendarIcon className="w-4 h-4 text-[#0050CB]" />
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mt-1 truncate w-full">
                Total Events
              </span>
              <span className="text-xl font-black text-slate-900 mt-0.5">5</span>
            </div>

            {/* Completed */}
            <div className="bg-[#ECFDF5] border border-emerald-100/80 rounded-xl p-2.5 text-center flex flex-col items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-[#059669]" />
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mt-1 truncate w-full">
                Completed
              </span>
              <span className="text-xl font-black text-slate-900 mt-0.5">4</span>
            </div>

            {/* Upcoming */}
            <div className="bg-[#FFF7ED] border border-amber-100/80 rounded-xl p-2.5 text-center flex flex-col items-center justify-center">
              <Clock className="w-4 h-4 text-[#D97706]" />
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mt-1 truncate w-full">
                Upcoming
              </span>
              <span className="text-xl font-black text-slate-900 mt-0.5">12</span>
            </div>

            {/* Holidays */}
            <div className="bg-[#FFF1F2] border border-rose-100/80 rounded-xl p-2.5 text-center flex flex-col items-center justify-center">
              <Heart className="w-4 h-4 text-[#E11D48]" />
              <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider mt-1 truncate w-full">
                Holidays
              </span>
              <span className="text-xl font-black text-slate-900 mt-0.5">3</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN SECTION (Calendar Grid 68% + Right Column 32%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Monthly Calendar View */}
        <div className="lg:col-span-8 space-y-3">
          {/* Calendar Navigation Bar */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toast("Navigating to August 2026")}
                className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 text-slate-600 cursor-pointer shadow-2xs transition-colors"
                title="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => toast("Navigating to October 2026")}
                className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 text-slate-600 cursor-pointer shadow-2xs transition-colors"
                title="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <h2 className="text-lg font-bold text-[#000E28] ml-2">
                September 2026
              </h2>
            </div>

            {/* View Switcher Pill */}
            <div className="bg-slate-100 p-0.5 rounded-full flex items-center border border-slate-200/80">
              <button
                type="button"
                onClick={() => setCurrentView("Month")}
                className={`px-4 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  currentView === "Month"
                    ? "bg-[#0050CB] text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Month
              </button>
              <button
                type="button"
                onClick={() => setCurrentView("Week")}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  currentView === "Week"
                    ? "bg-[#0050CB] text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Week
              </button>
              <button
                type="button"
                onClick={() => setCurrentView("Day")}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  currentView === "Day"
                    ? "bg-[#0050CB] text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Day
              </button>
            </div>
          </div>

          {/* Calendar Table Grid */}
          <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 border-b border-slate-200/80 bg-slate-50/70 text-center py-2.5">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-xs font-bold text-slate-600">
                  {day}
                </div>
              ))}
            </div>

            {/* Grid Cells (5 Weeks x 7 Days) */}
            <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 text-xs">
              {/* Row 1 */}
              {/* 30 (Last Month) */}
              <div className="min-h-[92px] p-2 bg-slate-50/30">
                <span className="text-slate-300 font-semibold">30</span>
                <span className="text-[10px] text-slate-300 font-normal ml-1">• (Last Month)</span>
              </div>
              {/* 31 (Last Month) */}
              <div className="min-h-[92px] p-2 bg-slate-50/30">
                <span className="text-slate-300 font-semibold">31</span>
                <span className="text-[10px] text-slate-300 font-normal ml-1">• (Last Month)</span>
              </div>
              {/* Sep 1 */}
              <div 
                onClick={() => setSelectedDay(1)}
                className={`min-h-[92px] p-2 hover:bg-blue-50/20 cursor-pointer transition-colors ${selectedDay === 1 ? 'bg-blue-50/30' : ''}`}
              >
                <span className="font-semibold text-slate-700">1</span>
                <div className="mt-1 px-1.5 py-0.5 rounded-md bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] text-[10px] font-semibold truncate">
                  👤 Teacher Meeting
                </div>
              </div>
              {/* Sep 2 */}
              <div 
                onClick={() => setSelectedDay(2)}
                className={`min-h-[92px] p-2 hover:bg-blue-50/20 cursor-pointer transition-colors ${selectedDay === 2 ? 'bg-blue-50/30' : ''}`}
              >
                <span className="font-semibold text-slate-700">2</span>
                <div className="mt-1 px-1.5 py-0.5 rounded-md bg-[#F3E8FF] text-[#7C3AED] border border-[#DDD6FE] text-[10px] font-semibold truncate">
                  🎉 Holiday <span className="font-normal opacity-90">(Ganesh Chaturthi)</span>
                </div>
              </div>
              {/* Sep 3 */}
              <div 
                onClick={() => setSelectedDay(3)}
                className={`min-h-[92px] p-2 hover:bg-blue-50/20 cursor-pointer transition-colors ${selectedDay === 3 ? 'bg-blue-50/30' : ''}`}
              >
                <span className="font-semibold text-slate-700">3</span>
              </div>
              {/* Sep 4 */}
              <div 
                onClick={() => setSelectedDay(4)}
                className={`min-h-[92px] p-2 hover:bg-blue-50/20 cursor-pointer transition-colors ${selectedDay === 4 ? 'bg-blue-50/30' : ''}`}
              >
                <span className="font-semibold text-slate-700">4</span>
                <div className="mt-1 px-1.5 py-0.5 rounded-md bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] text-[10px] font-semibold truncate">
                  📝 Class Test <span className="font-normal opacity-90">(Grade 6-8)</span>
                </div>
              </div>
              {/* Sep 5 */}
              <div 
                onClick={() => setSelectedDay(5)}
                className={`min-h-[92px] p-2 hover:bg-blue-50/20 cursor-pointer transition-colors ${selectedDay === 5 ? 'bg-blue-50/30' : ''}`}
              >
                <span className="font-semibold text-slate-700">5</span>
              </div>

              {/* Row 2 */}
              {/* Sep 6 */}
              <div 
                onClick={() => setSelectedDay(6)}
                className={`min-h-[92px] p-2 hover:bg-blue-50/20 cursor-pointer transition-colors ${selectedDay === 6 ? 'bg-blue-50/30' : ''}`}
              >
                <span className="font-semibold text-slate-700">6</span>
              </div>
              {/* Sep 7 */}
              <div 
                onClick={() => setSelectedDay(7)}
                className={`min-h-[92px] p-2 hover:bg-blue-50/20 cursor-pointer transition-colors ${selectedDay === 7 ? 'bg-blue-50/30' : ''}`}
              >
                <span className="font-semibold text-slate-700">7</span>
                <div className="mt-1 px-1.5 py-0.5 rounded-md bg-[#FFF1F2] text-[#E11D48] border border-[#FECDD3] text-[10px] font-semibold truncate">
                  👥 Parent Teacher Meeting
                </div>
              </div>
              {/* Sep 8 */}
              <div 
                onClick={() => setSelectedDay(8)}
                className={`min-h-[92px] p-2 hover:bg-blue-50/20 cursor-pointer transition-colors ${selectedDay === 8 ? 'bg-blue-50/30' : ''}`}
              >
                <span className="font-semibold text-slate-700">8</span>
              </div>
              {/* Sep 9 */}
              <div 
                onClick={() => setSelectedDay(9)}
                className={`min-h-[92px] p-2 hover:bg-blue-50/20 cursor-pointer transition-colors ${selectedDay === 9 ? 'bg-blue-50/30' : ''}`}
              >
                <span className="font-semibold text-slate-700">9</span>
                <div className="mt-1 px-1.5 py-0.5 rounded-md bg-[#FFF7ED] text-[#EA580C] border border-[#FED7AA] text-[10px] font-semibold truncate">
                  🏆 Sports Day <span className="font-normal opacity-90">(Grade 1-5)</span>
                </div>
              </div>
              {/* Sep 10 */}
              <div 
                onClick={() => setSelectedDay(10)}
                className={`min-h-[92px] p-2 hover:bg-blue-50/20 cursor-pointer transition-colors ${selectedDay === 10 ? 'bg-blue-50/30' : ''}`}
              >
                <span className="font-semibold text-slate-700">10</span>
              </div>
              {/* Sep 11 */}
              <div 
                onClick={() => setSelectedDay(11)}
                className={`min-h-[92px] p-2 hover:bg-blue-50/20 cursor-pointer transition-colors ${selectedDay === 11 ? 'bg-blue-50/30' : ''}`}
              >
                <span className="font-semibold text-slate-700">11</span>
                <div className="mt-1 px-1.5 py-0.5 rounded-md bg-[#F0FDFA] text-[#0D9488] border border-[#99F6E4] text-[10px] font-semibold truncate">
                  🔬 Science Exhibition
                </div>
              </div>
              {/* Sep 12 */}
              <div 
                onClick={() => setSelectedDay(12)}
                className={`min-h-[92px] p-2 hover:bg-blue-50/20 cursor-pointer transition-colors ${selectedDay === 12 ? 'bg-blue-50/30' : ''}`}
              >
                <span className="font-semibold text-slate-700">12</span>
              </div>

              {/* Row 3 */}
              {/* Sep 13 */}
              <div 
                onClick={() => setSelectedDay(13)}
                className={`min-h-[92px] p-2 hover:bg-blue-50/20 cursor-pointer transition-colors ${selectedDay === 13 ? 'bg-blue-50/30' : ''}`}
              >
                <span className="font-semibold text-slate-700">13</span>
              </div>
              {/* Sep 14 */}
              <div 
                onClick={() => setSelectedDay(14)}
                className={`min-h-[92px] p-2 hover:bg-blue-50/20 cursor-pointer transition-colors ${selectedDay === 14 ? 'bg-blue-50/30' : ''}`}
              >
                <span className="font-semibold text-slate-700">14</span>
                <div className="mt-1 px-1.5 py-0.5 rounded-md bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] text-[10px] font-semibold truncate">
                  📝 Unit Test <span className="font-normal opacity-90">(Grade 9-10)</span>
                </div>
              </div>
              {/* Sep 15 */}
              <div 
                onClick={() => setSelectedDay(15)}
                className={`min-h-[92px] p-2 hover:bg-blue-50/20 cursor-pointer transition-colors ${selectedDay === 15 ? 'bg-blue-50/30' : ''}`}
              >
                <span className="font-semibold text-slate-700">15</span>
              </div>
              {/* Sep 16 */}
              <div 
                onClick={() => setSelectedDay(16)}
                className={`min-h-[92px] p-2 hover:bg-blue-50/20 cursor-pointer transition-colors ${selectedDay === 16 ? 'bg-blue-50/30' : ''}`}
              >
                <span className="font-semibold text-slate-700">16</span>
                <div className="mt-1 px-1.5 py-0.5 rounded-md bg-[#F3E8FF] text-[#7C3AED] border border-[#DDD6FE] text-[10px] font-semibold truncate">
                  👥 Workshop <span className="font-normal opacity-90">(Teachers)</span>
                </div>
              </div>
              {/* Sep 17 */}
              <div 
                onClick={() => setSelectedDay(17)}
                className={`min-h-[92px] p-2 hover:bg-blue-50/20 cursor-pointer transition-colors ${selectedDay === 17 ? 'bg-blue-50/30' : ''}`}
              >
                <span className="font-semibold text-slate-700">17</span>
              </div>
              {/* Sep 18 */}
              <div 
                onClick={() => setSelectedDay(18)}
                className={`min-h-[92px] p-2 hover:bg-blue-50/20 cursor-pointer transition-colors ${selectedDay === 18 ? 'bg-blue-50/30' : ''}`}
              >
                <span className="font-semibold text-slate-700">18</span>
                <div className="mt-1 px-1.5 py-0.5 rounded-md bg-[#FFF1F2] text-[#E11D48] border border-[#FECDD3] text-[10px] font-semibold truncate">
                  💳 Fee Due Date
                </div>
              </div>
              {/* Sep 19 */}
              <div 
                onClick={() => setSelectedDay(19)}
                className={`min-h-[92px] p-2 hover:bg-blue-50/20 cursor-pointer transition-colors ${selectedDay === 19 ? 'bg-blue-50/30' : ''}`}
              >
                <span className="font-semibold text-slate-700">19</span>
              </div>

              {/* Row 4 */}
              {/* Sep 20 */}
              <div 
                onClick={() => setSelectedDay(20)}
                className={`min-h-[92px] p-2 hover:bg-blue-50/20 cursor-pointer transition-colors ${selectedDay === 20 ? 'bg-blue-50/30' : ''}`}
              >
                <span className="font-semibold text-slate-700">20</span>
                <div className="mt-1 px-1.5 py-0.5 rounded-md bg-[#E0F2FE] text-[#0284C7] border border-[#BAE6FD] text-[10px] font-semibold truncate">
                  🎉 Holiday <span className="font-normal opacity-90">(Dussehra)</span>
                </div>
              </div>
              {/* Sep 21 */}
              <div 
                onClick={() => setSelectedDay(21)}
                className={`min-h-[92px] p-2 hover:bg-blue-50/20 cursor-pointer transition-colors ${selectedDay === 21 ? 'bg-blue-50/30' : ''}`}
              >
                <span className="font-semibold text-slate-700">21</span>
              </div>
              {/* Sep 22 */}
              <div 
                onClick={() => setSelectedDay(22)}
                className={`min-h-[92px] p-2 hover:bg-blue-50/20 cursor-pointer transition-colors ${selectedDay === 22 ? 'bg-blue-50/30' : ''}`}
              >
                <span className="font-semibold text-slate-700">22</span>
                <div className="mt-1 px-1.5 py-0.5 rounded-md bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] text-[10px] font-semibold truncate">
                  👥 PTM Meeting
                </div>
              </div>
              {/* Sep 23 */}
              <div 
                onClick={() => setSelectedDay(23)}
                className={`min-h-[92px] p-2 hover:bg-blue-50/20 cursor-pointer transition-colors ${selectedDay === 23 ? 'bg-blue-50/30' : ''}`}
              >
                <span className="font-semibold text-slate-700">23</span>
              </div>
              {/* Sep 24 (ACTIVE DAY - Selected in screenshot) */}
              <div 
                onClick={() => setSelectedDay(24)}
                className="min-h-[92px] p-2 bg-blue-50/40 border-2 border-[#0050CB]/40 rounded-lg cursor-pointer transition-all shadow-2xs"
              >
                <div className="flex items-center">
                  <span className="w-6 h-6 rounded-full bg-[#0050CB] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    24
                  </span>
                </div>
                <div className="mt-1.5 px-2 py-1 rounded-md bg-[#000E28] text-white text-[10px] font-bold shadow-xs truncate block">
                  👥 Student Council <span className="font-normal opacity-90">(10:00 AM)</span>
                </div>
              </div>
              {/* Sep 25 */}
              <div 
                onClick={() => setSelectedDay(25)}
                className={`min-h-[92px] p-2 hover:bg-blue-50/20 cursor-pointer transition-colors ${selectedDay === 25 ? 'bg-blue-50/30' : ''}`}
              >
                <span className="font-semibold text-slate-700">25</span>
              </div>
              {/* Sep 26 */}
              <div 
                onClick={() => setSelectedDay(26)}
                className={`min-h-[92px] p-2 hover:bg-blue-50/20 cursor-pointer transition-colors ${selectedDay === 26 ? 'bg-blue-50/30' : ''}`}
              >
                <span className="font-semibold text-slate-700">26</span>
              </div>

              {/* Row 5 */}
              {/* Sep 27 */}
              <div 
                onClick={() => setSelectedDay(27)}
                className={`min-h-[92px] p-2 hover:bg-blue-50/20 cursor-pointer transition-colors ${selectedDay === 27 ? 'bg-blue-50/30' : ''}`}
              >
                <span className="font-semibold text-slate-700">27</span>
              </div>
              {/* Sep 28 */}
              <div 
                onClick={() => setSelectedDay(28)}
                className={`min-h-[92px] p-2 hover:bg-blue-50/20 cursor-pointer transition-colors ${selectedDay === 28 ? 'bg-blue-50/30' : ''}`}
              >
                <span className="font-semibold text-slate-700">28</span>
                <div className="mt-1 px-1.5 py-0.5 rounded-md bg-[#F3E8FF] text-[#7C3AED] border border-[#DDD6FE] text-[10px] font-semibold truncate">
                  📐 Maths Olympiad <span className="font-normal opacity-90">(Grade 5-8)</span>
                </div>
              </div>
              {/* Sep 29 */}
              <div 
                onClick={() => setSelectedDay(29)}
                className={`min-h-[92px] p-2 hover:bg-blue-50/20 cursor-pointer transition-colors ${selectedDay === 29 ? 'bg-blue-50/30' : ''}`}
              >
                <span className="font-semibold text-slate-700">29</span>
              </div>
              {/* Sep 30 */}
              <div 
                onClick={() => setSelectedDay(30)}
                className={`min-h-[92px] p-2 hover:bg-blue-50/20 cursor-pointer transition-colors ${selectedDay === 30 ? 'bg-blue-50/30' : ''}`}
              >
                <span className="font-semibold text-slate-700">30</span>
                <div className="mt-1 px-1.5 py-0.5 rounded-md bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A] text-[10px] font-semibold truncate">
                  🎭 Cultural Event <span className="font-normal opacity-90">(4:00 PM)</span>
                </div>
              </div>
              {/* Oct 1 */}
              <div className="min-h-[92px] p-2 bg-slate-50/30">
                <span className="text-slate-300 font-semibold">1</span>
              </div>
              {/* Oct 2 */}
              <div className="min-h-[92px] p-2 bg-slate-50/30">
                <span className="text-slate-300 font-semibold">2</span>
              </div>
              {/* Oct 3 */}
              <div className="min-h-[92px] p-2 bg-slate-50/30">
                <span className="text-slate-300 font-semibold">3</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Upcoming Events & Quick Actions */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card 1: Upcoming Events & Exams */}
          <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-[#000E28]">
                Upcoming Events & Exams
              </h3>
              <button
                type="button"
                onClick={() => toast("Displaying all 17 scheduled institutional events")}
                className="text-xs font-semibold text-[#0050CB] hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            {/* Event List */}
            <div className="divide-y divide-slate-100">
              {upcomingEvents.map((ev) => (
                <div 
                  key={ev.id}
                  onClick={() => setSelectedEventModal(ev)}
                  className="py-3 flex items-center justify-between group hover:bg-slate-50/80 -mx-2 px-2 rounded-xl transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Date Pill Box */}
                    <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] border border-blue-100 text-center flex flex-col items-center justify-center shrink-0">
                      <span className="text-[9px] font-bold text-[#0050CB] uppercase tracking-wider leading-none">
                        {ev.date.split(" ")[0]}
                      </span>
                      <span className="text-base font-black text-slate-900 leading-tight mt-0.5">
                        {ev.date.split(" ")[1]}
                      </span>
                    </div>

                    {/* Event Details */}
                    <div className="min-w-0 pr-2">
                      <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-[#0050CB] transition-colors">
                        {ev.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1 truncate">
                        <span>🕒</span> {ev.time}
                      </p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 truncate">
                        <span>📍</span> {ev.location}
                      </p>
                    </div>
                  </div>

                  {/* Badge & Arrow */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ev.badgeBg} ${ev.badgeColor}`}>
                      {ev.type}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: ⚡ Quick Actions */}
          <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs">
            <h3 className="text-xs font-bold text-[#000E28] mb-3 flex items-center gap-1.5">
              <span>⚡</span> Quick Actions
            </h3>

            <div className="grid grid-cols-3 gap-2.5">
              {/* 1. Add Event */}
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="bg-[#EFF6FF] hover:bg-blue-100/70 border border-blue-100/70 rounded-xl p-3 flex flex-col items-center justify-center gap-1.5 text-center transition-all cursor-pointer group hover:scale-102"
              >
                <div className="w-8 h-8 rounded-lg bg-[#0050CB] text-white flex items-center justify-center shadow-xs">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-slate-800">Add Event</span>
              </button>

              {/* 2. Add Holiday */}
              <button
                type="button"
                onClick={() => {
                  setNewEventType("Holiday");
                  setShowAddModal(true);
                }}
                className="bg-[#FAF5FF] hover:bg-purple-100/70 border border-purple-100/70 rounded-xl p-3 flex flex-col items-center justify-center gap-1.5 text-center transition-all cursor-pointer group hover:scale-102"
              >
                <div className="w-8 h-8 rounded-lg bg-[#7C3AED] text-white flex items-center justify-center shadow-xs">
                  <Heart className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-slate-800">Add Holiday</span>
              </button>

              {/* 3. View Timetable */}
              <Link
                href="/dashboard/academic?tab=timetable"
                className="bg-[#F0FDF4] hover:bg-emerald-100/70 border border-emerald-100/70 rounded-xl p-3 flex flex-col items-center justify-center gap-1.5 text-center transition-all cursor-pointer group hover:scale-102"
              >
                <div className="w-8 h-8 rounded-lg bg-[#059669] text-white flex items-center justify-center shadow-xs">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-slate-800">View Timetable</span>
              </Link>

              {/* 4. Manage Exams */}
              <Link
                href="/dashboard/online-exams"
                className="bg-[#FFF7ED] hover:bg-orange-100/70 border border-orange-100/70 rounded-xl p-3 flex flex-col items-center justify-center gap-1.5 text-center transition-all cursor-pointer group hover:scale-102"
              >
                <div className="w-8 h-8 rounded-lg bg-[#EA580C] text-white flex items-center justify-center shadow-xs">
                  <Award className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-slate-800">Manage Exams</span>
              </Link>

              {/* 5. Academic Reports */}
              <Link
                href="/dashboard/reports?tab=academic"
                className="bg-[#FFF1F2] hover:bg-rose-100/70 border border-rose-100/70 rounded-xl p-3 flex flex-col items-center justify-center gap-1.5 text-center transition-all cursor-pointer group hover:scale-102"
              >
                <div className="w-8 h-8 rounded-lg bg-[#E11D48] text-white flex items-center justify-center shadow-xs">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-slate-800">Academic Reports</span>
              </Link>

              {/* 6. Settings */}
              <Link
                href="/dashboard/settings"
                className="bg-[#F8FAFC] hover:bg-slate-200/70 border border-slate-200/70 rounded-xl p-3 flex flex-col items-center justify-center gap-1.5 text-center transition-all cursor-pointer group hover:scale-102"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-700 text-white flex items-center justify-center shadow-xs">
                  <Settings className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-slate-800">Settings</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM SECTION: Class Schedule (50%) + Academic Overview (50%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Today's Class Schedule */}
        <div className="lg:col-span-6 rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-[#000E28] flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-[#0050CB]" />
              Today's Class Schedule
            </h3>
            <Link
              href="/dashboard/academic?tab=timetable"
              className="text-xs font-semibold text-[#0050CB] hover:underline cursor-pointer"
            >
              View All
            </Link>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {/* Class 1 */}
            <div className="py-2.5 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium w-36">08:00 AM - 09:00 AM</span>
              <span className="font-bold text-slate-800 flex-1 px-3">Mathematics</span>
              <span className="text-slate-500 font-medium px-3">Class 6 - A</span>
              <span className="bg-[#ECFDF5] text-[#059669] font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                Ongoing
              </span>
            </div>

            {/* Class 2 */}
            <div className="py-2.5 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium w-36">09:15 AM - 10:15 AM</span>
              <span className="font-bold text-slate-800 flex-1 px-3">English</span>
              <span className="text-slate-500 font-medium px-3">Class 6 - A</span>
              <span className="bg-[#EFF6FF] text-[#2563EB] font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                Upcoming
              </span>
            </div>

            {/* Class 3 */}
            <div className="py-2.5 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium w-36">10:30 AM - 11:30 AM</span>
              <span className="font-bold text-slate-800 flex-1 px-3">Science</span>
              <span className="text-slate-500 font-medium px-3">Class 6 - A</span>
              <span className="bg-slate-100 text-slate-500 font-semibold text-[10px] px-2.5 py-0.5 rounded-full">
                Not Started
              </span>
            </div>

            {/* Class 4 */}
            <div className="py-2.5 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium w-36">11:45 AM - 12:45 PM</span>
              <span className="font-bold text-slate-800 flex-1 px-3">Social Studies</span>
              <span className="text-slate-500 font-medium px-3">Class 6 - A</span>
              <span className="bg-slate-100 text-slate-500 font-semibold text-[10px] px-2.5 py-0.5 rounded-full">
                Not Started
              </span>
            </div>
          </div>
        </div>

        {/* Right: Academic Overview */}
        <div className="lg:col-span-6 rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-[#000E28] flex items-center gap-2">
              <span>📊</span> Academic Overview
            </h3>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200 text-xs text-slate-600 bg-white font-medium cursor-pointer">
              <span>This Month</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>
          </div>

          {/* 4 Circular Indicators Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-center">
            {/* Gauge 1: Classes Conducted (84%) */}
            <div className="flex flex-col items-center">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    stroke="#E2E8F0"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    stroke="#059669"
                    strokeWidth="4"
                    strokeDasharray="163"
                    strokeDashoffset={163 - (163 * 84) / 100}
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                <span className="absolute text-xs font-black text-slate-900">84%</span>
              </div>
              <span className="text-[11px] font-bold text-slate-700 mt-2">Classes Conducted</span>
              <span className="text-[11px] text-slate-400 font-semibold">20 / 24</span>
            </div>

            {/* Gauge 2: Attendance Rate (72%) */}
            <div className="flex flex-col items-center">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    stroke="#E2E8F0"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    stroke="#0050CB"
                    strokeWidth="4"
                    strokeDasharray="163"
                    strokeDashoffset={163 - (163 * 72) / 100}
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                <span className="absolute text-xs font-black text-slate-900">72%</span>
              </div>
              <span className="text-[11px] font-bold text-slate-700 mt-2">Attendance Rate</span>
              <span className="text-[11px] text-slate-400 font-semibold">1,248 / 1,730</span>
            </div>

            {/* Gauge 3: Holidays (12) */}
            <div className="flex flex-col items-center">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-[#FAF5FF] border-2 border-[#7C3AED]/40 flex flex-col items-center justify-center text-[#7C3AED]">
                  <span className="text-base font-black leading-none">12</span>
                </div>
              </div>
              <span className="text-[11px] font-bold text-slate-700 mt-2">Holidays</span>
              <span className="text-[11px] text-slate-400 font-semibold">This Month</span>
            </div>

            {/* Gauge 4: Events (6) */}
            <div className="flex flex-col items-center">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-[#FFF7ED] border-2 border-[#EA580C]/40 flex flex-col items-center justify-center text-[#EA580C]">
                  <span className="text-base font-black leading-none">6</span>
                </div>
              </div>
              <span className="text-[11px] font-bold text-slate-700 mt-2">Events</span>
              <span className="text-[11px] text-slate-400 font-semibold">This Month</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. FOOTER */}
      <footer className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
        <p>GGPS School ERP © 2026. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Designed for a better learning experience <span>🤍</span>
        </p>
      </footer>

      {/* 5. ADD EVENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[#000E28]/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0050CB] text-white flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-[#000E28]">Add Academic Event</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="e.g. Science Fair / PTM Meeting / Sports Day"
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0050CB]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Event Type
                  </label>
                  <select
                    value={newEventType}
                    onChange={(e) => setNewEventType(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0050CB]"
                  >
                    <option value="Event">Event</option>
                    <option value="Exam">Exam / Assessment</option>
                    <option value="Meeting">Meeting / PTM</option>
                    <option value="Holiday">School Holiday</option>
                    <option value="Reminder">Administrative Reminder</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0050CB]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    placeholder="10:00 AM - 12:00 PM"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0050CB]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={newEventLocation}
                    onChange={(e) => setNewEventLocation(e.target.value)}
                    placeholder="Auditorium / Ground"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0050CB]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0050CB] hover:bg-blue-700 text-white shadow-sm cursor-pointer"
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. EVENT DETAILS MODAL */}
      {selectedEventModal && (
        <div className="fixed inset-0 bg-[#000E28]/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${selectedEventModal.badgeBg} ${selectedEventModal.badgeColor}`}>
                {selectedEventModal.type}
              </span>
              <button
                type="button"
                onClick={() => setSelectedEventModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-base font-bold text-[#000E28] mb-3">
              {selectedEventModal.title}
            </h3>

            <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-blue-600" />
                <span>Date: <strong>{selectedEventModal.date}, 2026</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Time: <strong>{selectedEventModal.time}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Venue: <strong>{selectedEventModal.location}</strong></span>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedEventModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0050CB] text-white hover:bg-blue-700 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
