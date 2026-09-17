"use client";

import React, { useState } from "react";
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, Tag, 
  MapPin, ChevronDown, ChevronRight as ChevronRightIcon, Sun, Bus, BookOpen, 
  Megaphone, Users, Award, Shield, FileText, Check, X, Filter, Sparkles, Building2
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState("April 2026");
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [selectedEventType, setSelectedEventType] = useState("All Event Types");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  // New Event State
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("2026-04-18");
  const [eventTime, setEventTime] = useState("09:00 AM - 11:00 AM");
  const [eventType, setEventType] = useState("Event");
  const [eventLocation, setEventLocation] = useState("Main Hall");

  // Sample Upcoming Events
  const upcomingEvents = [
    {
      id: "ev1",
      month: "APR",
      day: "22",
      title: "Annual Sports Meet 2026",
      time: "08:00 AM - 04:00 PM",
      location: "School Ground",
      type: "Event",
      color: "bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400",
      iconBg: "bg-purple-500",
    },
    {
      id: "ev2",
      month: "APR",
      day: "25",
      title: "Parent-Teacher Association Meeting",
      time: "09:00 AM - 11:00 AM",
      location: "Main Hall",
      type: "Meeting",
      color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
      iconBg: "bg-emerald-500",
    },
    {
      id: "ev3",
      month: "APR",
      day: "30",
      title: "Q3 Tuition Fee Due Date",
      time: "All Day",
      location: "Online Payment",
      type: "Deadline",
      color: "bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400",
      iconBg: "bg-purple-600",
    },
    {
      id: "ev4",
      month: "MAY",
      day: "05",
      title: "Science Exhibition",
      time: "10:00 AM - 02:00 PM",
      location: "Science Block",
      type: "Exhibition",
      color: "bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
      iconBg: "bg-amber-500",
    },
  ];

  const handleAddEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    toast.success("Academic event added to calendar!");
    setEventTitle("");
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 font-sans text-[#000E28] dark:text-white pb-16">
      
      {/* BREADCRUMB */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-semibold">
        <Link href="/dashboard" className="hover:text-[#0050CB]">Home</Link>
        <span>&gt;</span>
        <span className="text-[#0050CB] dark:text-[#38BDF8] font-bold">School Calendar</span>
      </div>

      {/* HERO BANNER SECTION */}
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-[#EBF3FF] via-[#F4F8FF] to-[#E5F0FF] dark:from-[#001A48] dark:via-[#001438] dark:to-[#002766] p-6 sm:p-8 border border-blue-100 dark:border-slate-800 shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#0050CB] text-white flex items-center justify-center font-bold shadow-md shrink-0">
              <CalendarIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#000E28] dark:text-white tracking-tight">
                School Calendar
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-300 font-medium mt-1">
                Stay organized with classes, exams, holidays, events and important dates.
              </p>
            </div>
          </div>

          {/* Right Quote Card Graphic */}
          <div className="hidden lg:flex items-center gap-3 p-3.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white dark:border-slate-700 shadow-xs max-w-xs">
            <div className="w-10 h-10 rounded-xl bg-[#0050CB] text-white flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#000E28] dark:text-white italic leading-tight">
                "Education is the passport to a better tomorrow."
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 4 FILTER SELECTOR PILLS + ADD EVENT BUTTON */}
      <div className="bg-white dark:bg-[#000E28] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          
          {/* Campus selector pill */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-[#000E28] dark:text-white shadow-2xs">
            <Building2 className="w-3.5 h-3.5 text-[#0050CB] dark:text-[#38BDF8]" />
            <span>Global International School</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* Academic Year pill */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-[#000E28] dark:text-white shadow-2xs">
            <CalendarIcon className="w-3.5 h-3.5 text-[#0050CB] dark:text-[#38BDF8]" />
            <span>2025 - 2026</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* Class Filter Dropdown */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3.5 py-2 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-[#000E28] dark:text-white outline-none cursor-pointer"
          >
            <option value="All Classes">All Classes</option>
            <option value="Class 10A">Class 10A</option>
            <option value="Class 9B">Class 9B</option>
            <option value="Class 8A">Class 8A</option>
          </select>

          {/* Event Type Filter Dropdown */}
          <select
            value={selectedEventType}
            onChange={(e) => setSelectedEventType(e.target.value)}
            className="px-3.5 py-2 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-[#000E28] dark:text-white outline-none cursor-pointer"
          >
            <option value="All Event Types">All Event Types</option>
            <option value="Exam">Exams</option>
            <option value="Holiday">Holidays</option>
            <option value="Meeting">Meetings</option>
            <option value="Sports">Sports</option>
          </select>
        </div>

        {/* Add Event Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0050CB] hover:bg-[#0041A8] text-white text-xs font-bold shadow-md cursor-pointer transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Event</span>
        </button>
      </div>

      {/* MAIN TWO-COLUMN CALENDAR GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: MONTHLY CALENDAR GRID (COL-8) */}
        <div className="lg:col-span-8 bg-white dark:bg-[#000E28] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
          
          {/* Calendar Header Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setCurrentMonth("March 2026")}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setCurrentMonth("May 2026")}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <h2 className="text-xl font-black text-[#000E28] dark:text-white">
                {currentMonth}
              </h2>

              <button 
                onClick={() => setCurrentMonth("April 2026")}
                className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
              >
                Today
              </button>
            </div>

            {/* View Selector Pills */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-full border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setViewMode("month")}
                className={`px-4 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "month"
                    ? "bg-[#0050CB] text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setViewMode("week")}
                className={`px-4 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "week"
                    ? "bg-[#0050CB] text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setViewMode("day")}
                className={`px-4 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "day"
                    ? "bg-[#0050CB] text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                Day
              </button>
            </div>
          </div>

          {/* DAYS OF WEEK HEADER */}
          <div className="grid grid-cols-7 text-center text-xs font-black text-slate-400 uppercase tracking-wider py-1">
            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
          </div>

          {/* MONTHLY DAYS GRID */}
          <div className="grid grid-cols-7 gap-2">
            
            {/* Prev month days */}
            <div className="min-h-[95px] p-2 rounded-xl border border-slate-100 dark:border-slate-800/40 text-slate-300 dark:text-slate-700 font-bold text-xs">29</div>
            <div className="min-h-[95px] p-2 rounded-xl border border-slate-100 dark:border-slate-800/40 text-slate-300 dark:text-slate-700 font-bold text-xs">30</div>
            <div className="min-h-[95px] p-2 rounded-xl border border-slate-100 dark:border-slate-800/40 text-slate-300 dark:text-slate-700 font-bold text-xs">31</div>

            {/* Day 1 */}
            <div className="min-h-[95px] p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between hover:border-[#0050CB] transition-all">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-[#000E28] dark:text-white">1</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              </div>
              <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-[#0050CB] dark:text-[#38BDF8] text-[10px] font-bold">
                <p className="truncate">Class 10A Mathematics</p>
                <p className="text-[9px] text-blue-500">08:00 AM - 09:45 AM</p>
              </div>
            </div>

            {/* Day 2 */}
            <div className="min-h-[95px] p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-[#000E28] dark:text-white">2</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              </div>
            </div>

            {/* Day 3 */}
            <div className="min-h-[95px] p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between hover:border-pink-500 transition-all">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-[#000E28] dark:text-white">3</span>
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
              </div>
              <div className="p-1.5 rounded-lg bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 text-[10px] font-bold">
                <p className="truncate">🏆 Sports Day</p>
                <p className="text-[9px] text-pink-500">08:00 AM - 12:00 PM</p>
              </div>
            </div>

            {/* Day 4 */}
            <div className="min-h-[95px] p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-[#000E28] dark:text-white">4</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
            </div>

            {/* Day 5 */}
            <div className="min-h-[95px] p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-400">5</span>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              </div>
            </div>

            {/* Day 6 */}
            <div className="min-h-[95px] p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-[#000E28] dark:text-white">6</span>
              </div>
            </div>

            {/* Day 7 */}
            <div className="min-h-[95px] p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between hover:border-emerald-500 transition-all">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-[#000E28] dark:text-white">7</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
                <p className="truncate">👥 Parent Meeting</p>
                <p className="text-[9px] text-emerald-600">10:00 AM - 11:30 AM</p>
              </div>
            </div>

            {/* Day 8 */}
            <div className="min-h-[95px] p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-[#000E28] dark:text-white">8</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              </div>
            </div>

            {/* Day 9 */}
            <div className="min-h-[95px] p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between hover:border-purple-500 transition-all">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-[#000E28] dark:text-white">9</span>
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              </div>
              <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 text-[10px] font-bold">
                <p className="truncate">📝 Science Exam</p>
                <p className="text-[9px] text-purple-600">09:00 AM - 11:00 AM</p>
              </div>
            </div>

            {/* Day 10 */}
            <div className="min-h-[95px] p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-[#000E28] dark:text-white">10</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              </div>
            </div>

            {/* Day 11 */}
            <div className="min-h-[95px] p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-[#000E28] dark:text-white">11</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              </div>
            </div>

            {/* Day 12 */}
            <div className="min-h-[95px] p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between hover:border-amber-500 transition-all">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-[#000E28] dark:text-white">12</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              </div>
              <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 text-[10px] font-bold">
                <p className="truncate">☀️ Holiday (Good Friday)</p>
              </div>
            </div>

            {/* Day 13 */}
            <div className="min-h-[95px] p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-[#000E28] dark:text-white">13</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              </div>
            </div>

            {/* Day 14 */}
            <div className="min-h-[95px] p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between hover:border-cyan-500 transition-all">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-[#000E28] dark:text-white">14</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
              </div>
              <div className="p-1.5 rounded-lg bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-400 text-[10px] font-bold">
                <p className="truncate">🚌 Field Trip</p>
                <p className="text-[9px] text-cyan-600">All Day</p>
              </div>
            </div>

            {/* Day 15 */}
            <div className="min-h-[95px] p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-[#000E28] dark:text-white">15</span>
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              </div>
            </div>

            {/* Day 16 */}
            <div className="min-h-[95px] p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between hover:border-purple-500 transition-all">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-[#000E28] dark:text-white">16</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 text-[10px] font-bold">
                <p className="truncate">👥 Staff Meeting</p>
                <p className="text-[9px] text-purple-600">03:00 PM - 04:00 PM</p>
              </div>
            </div>

            {/* Day 17 */}
            <div className="min-h-[95px] p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-[#000E28] dark:text-white">17</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
            </div>

            {/* Day 18 (ACTIVE SELECTED DAY) */}
            <div className="min-h-[95px] p-2 rounded-xl border-2 border-[#0050CB] bg-[#0050CB]/5 dark:bg-[#0050CB]/20 flex flex-col justify-between shadow-xs">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="w-6 h-6 rounded-full bg-[#0050CB] text-white flex items-center justify-center font-black">
                  18
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              </div>
            </div>

            {/* Day 19 */}
            <div className="min-h-[95px] p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-[#000E28] dark:text-white">19</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              </div>
            </div>

            {/* Day 20 */}
            <div className="min-h-[95px] p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between hover:border-pink-500 transition-all">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-[#000E28] dark:text-white">20</span>
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
              </div>
              <div className="p-1.5 rounded-lg bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-400 text-[10px] font-bold">
                <p className="truncate">📣 Result Publish</p>
                <p className="text-[9px] text-pink-500">10:00 AM</p>
              </div>
            </div>

            {/* Day 21 to 29 */}
            <div className="min-h-[95px] p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-[#000E28] dark:text-white">21</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
            </div>

            <div className="min-h-[95px] p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-[#000E28] dark:text-white">22</span>
              </div>
            </div>

            {/* Day 23 */}
            <div className="min-h-[95px] p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between hover:border-emerald-500 transition-all">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-[#000E28] dark:text-white">23</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
                <p className="truncate">👥 PTM</p>
                <p className="text-[9px] text-emerald-600">09:00 AM - 04:00 PM</p>
              </div>
            </div>

            <div className="min-h-[95px] p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-[#000E28] dark:text-white">24</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
            </div>

            <div className="min-h-[95px] p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-[#000E28] dark:text-white">25</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              </div>
            </div>

            <div className="min-h-[95px] p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-[#000E28] dark:text-white">26</span>
              </div>
            </div>

            {/* Day 27 */}
            <div className="min-h-[95px] p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between hover:border-blue-500 transition-all">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-[#000E28] dark:text-white">27</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              </div>
              <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-[#0050CB] dark:text-[#38BDF8] text-[10px] font-bold">
                <p className="truncate">📖 Library Visit</p>
                <p className="text-[9px] text-blue-500">10:00 AM - 12:00 PM</p>
              </div>
            </div>

            <div className="min-h-[95px] p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-[#000E28] dark:text-white">28</span>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              </div>
            </div>

            <div className="min-h-[95px] p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-[#000E28] dark:text-white">29</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              </div>
            </div>

            {/* Day 30 */}
            <div className="min-h-[95px] p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between hover:border-purple-500 transition-all">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-[#000E28] dark:text-white">30</span>
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              </div>
              <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 text-[10px] font-bold">
                <p className="truncate">📝 Monthly Test</p>
                <p className="text-[9px] text-purple-600">08:00 AM - 10:00 AM</p>
              </div>
            </div>

            {/* Next month days */}
            <div className="min-h-[95px] p-2 rounded-xl border border-slate-100 dark:border-slate-800/40 text-slate-300 dark:text-slate-700 font-bold text-xs">1</div>
            <div className="min-h-[95px] p-2 rounded-xl border border-slate-100 dark:border-slate-800/40 text-slate-300 dark:text-slate-700 font-bold text-xs">2</div>

          </div>

        </div>

        {/* RIGHT COLUMN: UPCOMING EVENTS & QUICK STATS (COL-4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* UPCOMING EVENTS PANEL */}
          <div className="bg-white dark:bg-[#000E28] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-black text-[#000E28] dark:text-white">Upcoming Events</h3>
              <button className="text-xs font-bold text-[#0050CB] dark:text-[#38BDF8] hover:underline flex items-center gap-0.5">
                <span>View All</span>
                <ChevronRightIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {upcomingEvents.map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => setSelectedEvent(ev)}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between hover:border-[#0050CB] transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    {/* Date Block */}
                    <div className="flex flex-col items-center justify-center w-11 h-11 rounded-xl bg-slate-200/70 dark:bg-slate-800 shrink-0">
                      <span className="text-[9px] font-black text-slate-500 uppercase">{ev.month}</span>
                      <span className="text-sm font-black text-[#000E28] dark:text-white leading-none">{ev.day}</span>
                    </div>

                    {/* Content */}
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-black text-[#000E28] dark:text-white group-hover:text-[#0050CB] transition-colors leading-tight">
                        {ev.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {ev.time}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {ev.location}
                      </p>
                    </div>
                  </div>

                  <ChevronRightIcon className="w-4 h-4 text-slate-400 group-hover:text-[#0050CB] shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* QUICK STATS PANEL */}
          <div className="bg-white dark:bg-[#000E28] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Sparkles className="w-4 h-4 text-[#0050CB] dark:text-[#38BDF8]" />
              <h3 className="text-sm font-black text-[#000E28] dark:text-white">Quick Stats</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0050CB] flex items-center justify-center shrink-0">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-base font-black text-[#000E28] dark:text-white leading-none">24</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">Total Events</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-base font-black text-[#000E28] dark:text-white leading-none">12</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">This Month</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-base font-black text-[#000E28] dark:text-white leading-none">5</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">Exams</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-base font-black text-[#000E28] dark:text-white leading-none">8</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">Holidays</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* FOOTER */}
      <footer className="pt-6 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-semibold">
        <div>
          <span className="font-black text-[#000E28] dark:text-white">Global International School ERP</span> &copy; 2026 | All rights reserved.
        </div>
        <div className="flex items-center gap-3">
          <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Portal Active
          </span>
          <span>•</span>
          <span className="hover:underline cursor-pointer">Support</span>
          <span>|</span>
          <span className="hover:underline cursor-pointer">Help</span>
        </div>
      </footer>

      {/* ADD EVENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#000E28] w-full max-w-md p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-base font-black text-[#000E28] dark:text-white">Add Academic Event</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEventSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Event Title *</label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g. Science Exhibition & Lab Tour"
                  required
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-[#0050CB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Event Date</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Category</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                  >
                    <option value="Event">General Event</option>
                    <option value="Exam">Exam / Test</option>
                    <option value="Meeting">Meeting / PTM</option>
                    <option value="Holiday">School Holiday</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Location / Venue</label>
                <input
                  type="text"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  placeholder="e.g. Main Auditorium / Science Block"
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0050CB] text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW EVENT DETAILS MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#000E28] w-full max-w-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${selectedEvent.color}`}>
                {selectedEvent.type}
              </span>
              <button onClick={() => setSelectedEvent(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-black text-[#000E28] dark:text-white leading-tight">
                {selectedEvent.title}
              </h3>
              <p className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#0050CB]" />
                <span>{selectedEvent.month} {selectedEvent.day}, 2026 • {selectedEvent.time}</span>
              </p>
              <p className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>{selectedEvent.location}</span>
              </p>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 bg-[#0050CB] text-white text-xs font-bold rounded-xl"
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
