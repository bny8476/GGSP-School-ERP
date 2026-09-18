"use client";

import React, { useState, useMemo } from "react";
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, Tag, 
  MapPin, ChevronRight as ChevronRightIcon, Sun, Award, FileText, Check, 
  X, Sparkles, CheckCircle2, AlertCircle, Info, Lock, Users, Video, 
  Phone, Mail, AlertTriangle, ShieldCheck, CheckSquare, BellRing, Sparkle
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  endDate?: string;
  title: string;
  eventCode?: string;
  time: string;
  location: string;
  venueType?: "On-Campus" | "Off-Campus" | "Virtual";
  onlineMeetingUrl?: string;
  type: "Event" | "Exam" | "Meeting" | "Holiday" | "Sports" | "Deadline";
  priority?: "Normal" | "High" | "Mandatory";
  targetAudience?: "All School" | "Students & Parents" | "Faculty & Staff Only" | "Specific Grades";
  targetGrades?: string;
  coordinatorName?: string;
  coordinatorContact?: string;
  description?: string;
  dressCode?: string;
  isAllDay?: boolean;
  notifyParents?: boolean;
  notifyStaff?: boolean;
  requireRsvp?: boolean;
  color: string;
  iconBg: string;
}

export default function CalendarPage() {
  // Real-time anchor: current system date
  const today = useMemo(() => new Date(), []);
  const todayNormalized = useMemo(
    () => new Date(today.getFullYear(), today.getMonth(), today.getDate()),
    [today]
  );

  // Active navigated calendar view (starts on current month)
  const [currentDate, setCurrentDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Detailed Event Form State
  const [eventTitle, setEventTitle] = useState("");
  const [eventCode, setEventCode] = useState(() => `EV-${today.getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
  const [eventType, setEventType] = useState<CalendarEvent["type"]>("Event");
  const [eventPriority, setEventPriority] = useState<CalendarEvent["priority"]>("Normal");
  const [eventDate, setEventDate] = useState(today.toISOString().split("T")[0]);
  const [eventEndDate, setEventEndDate] = useState("");
  const [isAllDay, setIsAllDay] = useState(false);
  const [startTime, setStartTime] = useState("09:00 AM");
  const [endTime, setEndTime] = useState("11:30 AM");
  const [venueType, setVenueType] = useState<CalendarEvent["venueType"]>("On-Campus");
  const [eventLocation, setEventLocation] = useState("Main Auditorium");
  const [onlineMeetingUrl, setOnlineMeetingUrl] = useState("");
  const [targetAudience, setTargetAudience] = useState<CalendarEvent["targetAudience"]>("All School");
  const [targetGrades, setTargetGrades] = useState("All Classes (Grade 1 - 12)");
  const [coordinatorName, setCoordinatorName] = useState("Mrs. Sarah Johnson (Academic Head)");
  const [coordinatorContact, setCoordinatorContact] = useState("principal@globalinternational.edu");
  const [dressCode, setDressCode] = useState("Formal School Uniform");
  const [description, setDescription] = useState("");
  const [notifyParents, setNotifyParents] = useState(true);
  const [notifyStaff, setNotifyStaff] = useState(true);
  const [requireRsvp, setRequireRsvp] = useState(false);

  // Dynamic seed events relative to real-time current date
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const y = today.getFullYear();
    const m = today.getMonth();
    const d = today.getDate();

    const pad = (n: number) => n.toString().padStart(2, "0");
    const fmt = (dt: Date) => `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;

    return [
      {
        id: "ev1",
        date: fmt(new Date(y, m, Math.max(1, d - 4))),
        title: "Faculty Curriculum Audit & Term Planning",
        eventCode: "EV-2026-101",
        time: "09:00 AM - 11:30 AM",
        location: "Faculty Conference Hall B",
        venueType: "On-Campus",
        type: "Meeting",
        priority: "High",
        targetAudience: "Faculty & Staff Only",
        coordinatorName: "Dr. Ronald Vance",
        coordinatorContact: "dean@globalinternational.edu",
        dressCode: "Formal Academic Attire",
        description: "Review of lesson syllabi completion and examination blueprint sign-off.",
        notifyStaff: true,
        color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400",
        iconBg: "bg-emerald-500",
      },
      {
        id: "ev2",
        date: fmt(new Date(y, m, d)),
        title: "Student Council Leadership Investiture Assembly",
        eventCode: "EV-2026-102",
        time: "11:00 AM - 12:30 PM",
        location: "Main Campus Auditorium",
        venueType: "On-Campus",
        type: "Event",
        priority: "Normal",
        targetAudience: "Students & Parents",
        coordinatorName: "Mrs. Sarah Johnson",
        coordinatorContact: "s.johnson@globalinternational.edu",
        dressCode: "Ceremonial Blazer & Badge",
        description: "Official oath-taking ceremony and badge distribution for elected student leaders.",
        notifyParents: true,
        notifyStaff: true,
        requireRsvp: true,
        color: "bg-blue-100 text-[#0050CB] dark:bg-blue-950/60 dark:text-[#38BDF8]",
        iconBg: "bg-blue-500",
      },
      {
        id: "ev3",
        date: fmt(new Date(y, m, d + 3)),
        title: "Grade 10 Mathematics Mid-Term Assessment",
        eventCode: "EV-2026-103",
        time: "10:00 AM - 01:00 PM",
        location: "Examination Hall A & B",
        venueType: "On-Campus",
        type: "Exam",
        priority: "Mandatory",
        targetAudience: "Specific Grades",
        targetGrades: "Grade 10 (Sections A, B, C)",
        coordinatorName: "Mr. Arthur Pendelton (Math Chair)",
        coordinatorContact: "math@globalinternational.edu",
        dressCode: "Standard Uniform + ID Card",
        description: "Mandatory standardized mid-term paper. Calculators and geometry sets required.",
        notifyParents: true,
        color: "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400",
        iconBg: "bg-purple-500",
      },
      {
        id: "ev4",
        date: fmt(new Date(y, m, d + 7)),
        title: "Inter-School Sports Track Trials & Athletic Heats",
        eventCode: "EV-2026-104",
        time: "08:30 AM - 03:00 PM",
        location: "Olympic Athletic Ground",
        venueType: "On-Campus",
        type: "Sports",
        priority: "High",
        targetAudience: "All School",
        coordinatorName: "Coach Marcus Brody",
        coordinatorContact: "sports@globalinternational.edu",
        dressCode: "House Sports Tracksuit & Spikes",
        description: "Selection trials for 100m, 400m relay, long jump and high jump events.",
        notifyParents: true,
        color: "bg-pink-100 text-pink-700 dark:bg-pink-950/60 dark:text-pink-400",
        iconBg: "bg-pink-500",
      },
      {
        id: "ev5",
        date: fmt(new Date(y, m, d + 12)),
        title: "Term 1 Tuition Fee Reconciliation Deadline",
        eventCode: "EV-2026-105",
        time: "All Day (Closes 05:00 PM)",
        location: "Accounts Desk & Online Portal",
        venueType: "On-Campus",
        type: "Deadline",
        priority: "Mandatory",
        targetAudience: "Students & Parents",
        coordinatorName: "Bursar Office",
        coordinatorContact: "accounts@globalinternational.edu",
        description: "Final date for quarterly fee payments before late fine assessment.",
        notifyParents: true,
        color: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400",
        iconBg: "bg-amber-500",
      },
    ];
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Calendar Header Info
  const monthTitle = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const isViewingPastMonth = useMemo(() => {
    return (
      year < today.getFullYear() ||
      (year === today.getFullYear() && month < today.getMonth())
    );
  }, [year, month, today]);

  // Calendar Grid Generation
  const calendarCells = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells: {
      type: "prev" | "current" | "next";
      dayNumber: number;
      dateStr: string;
      dateObj: Date;
      isPast: boolean;
      isToday: boolean;
      isFuture: boolean;
    }[] = [];

    const pad = (n: number) => n.toString().padStart(2, "0");

    // Leading days from previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dNum = daysInPrevMonth - i;
      const prevDate = new Date(year, month - 1, dNum);
      const dateStr = `${prevDate.getFullYear()}-${pad(prevDate.getMonth() + 1)}-${pad(dNum)}`;
      cells.push({
        type: "prev",
        dayNumber: dNum,
        dateStr,
        dateObj: prevDate,
        isPast: true,
        isToday: false,
        isFuture: false,
      });
    }

    // Days in current month
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const cellDate = new Date(year, month, d);
      const dateStr = `${year}-${pad(month + 1)}-${pad(d)}`;
      const isPast = cellDate.getTime() < todayNormalized.getTime();
      const isToday = cellDate.getTime() === todayNormalized.getTime();
      const isFuture = cellDate.getTime() > todayNormalized.getTime();

      cells.push({
        type: "current",
        dayNumber: d,
        dateStr,
        dateObj: cellDate,
        isPast,
        isToday,
        isFuture,
      });
    }

    // Trailing days from next month to complete 35 or 42 grid
    const totalSlots = cells.length <= 35 ? 35 : 42;
    const nextDaysNeeded = totalSlots - cells.length;
    for (let n = 1; n <= nextDaysNeeded; n++) {
      const nextDate = new Date(year, month + 1, n);
      const dateStr = `${nextDate.getFullYear()}-${pad(nextDate.getMonth() + 1)}-${pad(n)}`;
      cells.push({
        type: "next",
        dayNumber: n,
        dateStr,
        dateObj: nextDate,
        isPast: nextDate.getTime() < todayNormalized.getTime(),
        isToday: false,
        isFuture: true,
      });
    }

    return cells;
  }, [year, month, todayNormalized]);

  // Month navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleGoToday = () => {
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  // Open modal for a specific day
  const handleDayClick = (cell: typeof calendarCells[0]) => {
    if (cell.isPast) {
      toast.error("This date has already passed and is marked as completed.", {
        icon: "🔒",
      });
      return;
    }
    setEventDate(cell.dateStr);
    setEventCode(`EV-${today.getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
    setShowAddModal(true);
  };

  // Form submit handler with all detailed attributes
  const handleAddEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) {
      toast.error("Please provide an Event Title");
      return;
    }

    const calculatedTime = isAllDay ? "All Day" : `${startTime} - ${endTime}`;

    const newEvent: CalendarEvent = {
      id: `ev-${Date.now()}`,
      date: eventDate,
      endDate: eventEndDate || undefined,
      title: eventTitle.trim(),
      eventCode: eventCode.trim(),
      time: calculatedTime,
      location: venueType === "Virtual" ? (onlineMeetingUrl || "Virtual / Google Meet") : eventLocation.trim(),
      venueType,
      onlineMeetingUrl: venueType === "Virtual" ? onlineMeetingUrl : undefined,
      type: eventType,
      priority: eventPriority,
      targetAudience,
      targetGrades: targetAudience === "Specific Grades" ? targetGrades : undefined,
      coordinatorName: coordinatorName.trim(),
      coordinatorContact: coordinatorContact.trim(),
      dressCode: dressCode.trim(),
      description: description.trim(),
      isAllDay,
      notifyParents,
      notifyStaff,
      requireRsvp,
      color:
        eventType === "Exam"
          ? "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400"
          : eventType === "Meeting"
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
          : eventType === "Sports"
          ? "bg-pink-100 text-pink-700 dark:bg-pink-950/60 dark:text-pink-400"
          : eventType === "Deadline"
          ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
          : "bg-blue-100 text-[#0050CB] dark:bg-blue-950/60 dark:text-[#38BDF8]",
      iconBg: "bg-[#0050CB]",
    };

    setEvents((prev) => [...prev, newEvent]);
    toast.success("Detailed academic event added to schedule!");
    
    // Reset form
    setEventTitle("");
    setDescription("");
    setShowAddModal(false);
  };

  // Quick stats
  const totalEventsCount = events.length;
  const completedEventsCount = events.filter((e) => new Date(e.date) < todayNormalized).length;
  const upcomingEvents = useMemo(() => {
    return [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events]);

  return (
    <div className="space-y-6 font-sans text-[#000E28] dark:text-white pb-16">
      
      {/* BREADCRUMB */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-semibold">
        <Link href="/dashboard" className="hover:text-[#0050CB]">Home</Link>
        <span>&gt;</span>
        <span className="text-[#0050CB] dark:text-[#38BDF8] font-bold">Real-Time Calendar</span>
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
                Academic Calendar
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-300 font-medium mt-1">
                Real-time scheduler. Completed dates are disabled; only current and future dates accept bookings.
              </p>
            </div>
          </div>

          {/* Right Action & Quote Card */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="hidden lg:flex items-center gap-3 p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white dark:border-slate-700 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-[#0050CB] text-white flex items-center justify-center shrink-0">
                <Award className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#000E28] dark:text-white leading-tight">
                  Today: {today.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                </p>
                <p className="text-[10px] text-slate-400 font-medium">Session 2025 - 2026</p>
              </div>
            </div>

            <button
              onClick={() => {
                setEventDate(today.toISOString().split("T")[0]);
                setEventCode(`EV-${today.getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
                setShowAddModal(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0050CB] hover:bg-[#0041A8] text-white text-xs font-bold shadow-md hover:shadow-lg cursor-pointer transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Academic Event</span>
            </button>
          </div>

        </div>
      </div>

      {/* PAST MONTH ARCHIVE NOTICE BANNER */}
      {isViewingPastMonth && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-2xl p-4 flex items-center justify-between gap-4 text-amber-900 dark:text-amber-200 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-200/80 dark:bg-amber-900/80 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4 text-amber-800 dark:text-amber-200" />
            </div>
            <div>
              <p className="text-xs font-bold">
                Archived Past Month ({monthTitle})
              </p>
              <p className="text-[11px] text-amber-700 dark:text-amber-300">
                All dates and scheduled events in this period are completed and disabled for booking.
              </p>
            </div>
          </div>
          <button
            onClick={handleGoToday}
            className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            Jump to Today
          </button>
        </div>
      )}

      {/* MAIN TWO-COLUMN CALENDAR GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: REAL-TIME CALENDAR GRID (COL-8) */}
        <div className="lg:col-span-8 bg-white dark:bg-[#000E28] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
          
          {/* Calendar Header Navigation */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <button 
                  onClick={handlePrevMonth}
                  title="Previous Month"
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleNextMonth}
                  title="Next Month"
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <h2 className="text-xl font-black text-[#000E28] dark:text-white tracking-tight">
                {monthTitle}
              </h2>

              <button 
                onClick={handleGoToday}
                className="px-3.5 py-1 rounded-full bg-[#E5EEFF] dark:bg-[#0050CB]/25 text-xs font-black text-[#0050CB] dark:text-[#38BDF8] hover:bg-[#0050CB] hover:text-white transition-all cursor-pointer"
              >
                Today
              </button>
            </div>

            <div className="text-xs text-slate-400 font-bold hidden sm:block">
              Click any active day to schedule
            </div>
          </div>

          {/* DAYS OF WEEK HEADER */}
          <div className="grid grid-cols-7 text-center text-xs font-black text-slate-400 uppercase tracking-wider py-1">
            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
          </div>

          {/* DYNAMIC MONTHLY DAYS GRID */}
          <div className="grid grid-cols-7 gap-2">
            {calendarCells.map((cell, idx) => {
              const dayEvents = events.filter((e) => e.date === cell.dateStr);

              // 1. PAST / COMPLETED DATES (Disabled)
              if (cell.isPast) {
                return (
                  <div
                    key={`${cell.dateStr}-${idx}`}
                    title="Date completed (Closed)"
                    className="min-h-[105px] p-2 rounded-xl border border-slate-200/50 dark:border-slate-800/40 bg-slate-100/70 dark:bg-slate-900/50 opacity-60 cursor-not-allowed select-none flex flex-col justify-between transition-colors"
                  >
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="line-through text-slate-400 dark:text-slate-500 font-bold">
                        {cell.dayNumber}
                      </span>
                      <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider px-1.5 py-0.2 rounded bg-slate-200/70 dark:bg-slate-800">
                        Done
                      </span>
                    </div>

                    {/* Events on past day rendered as Completed */}
                    <div className="space-y-1 mt-1">
                      {dayEvents.map((ev) => (
                        <div
                          key={ev.id}
                          onClick={() => setSelectedEvent(ev)}
                          className="p-1 rounded-md bg-slate-200/90 dark:bg-slate-800/90 text-slate-500 dark:text-slate-400 text-[10px] font-semibold line-through truncate flex items-center gap-1 cursor-pointer hover:opacity-100"
                        >
                          <Check className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                          <span className="truncate">{ev.title}</span>
                        </div>
                      ))}
                    </div>

                    <div className="text-[8px] text-slate-400/80 font-medium italic mt-auto pt-1">
                      Completed
                    </div>
                  </div>
                );
              }

              // 2. CURRENT ACTIVE DAY (Today)
              if (cell.isToday) {
                return (
                  <div
                    key={`${cell.dateStr}-${idx}`}
                    onClick={() => handleDayClick(cell)}
                    className="min-h-[105px] p-2 rounded-xl border-2 border-[#0050CB] bg-[#0050CB]/5 dark:bg-[#0050CB]/20 flex flex-col justify-between shadow-md cursor-pointer hover:scale-[1.02] transition-all"
                  >
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="w-6 h-6 rounded-full bg-[#0050CB] text-white flex items-center justify-center font-black text-xs shadow-xs">
                        {cell.dayNumber}
                      </span>
                      <span className="text-[9px] font-black text-[#0050CB] dark:text-[#38BDF8] uppercase tracking-wider bg-[#E5EEFF] dark:bg-[#0050CB]/40 px-1.5 py-0.5 rounded">
                        Today
                      </span>
                    </div>

                    <div className="space-y-1 mt-1">
                      {dayEvents.map((ev) => (
                        <div
                          key={ev.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEvent(ev);
                          }}
                          className={`p-1.5 rounded-lg text-[10px] font-bold truncate shadow-2xs cursor-pointer hover:opacity-90 ${ev.color}`}
                        >
                          <p className="truncate font-black">● {ev.title}</p>
                          <p className="text-[9px] opacity-80">{ev.time}</p>
                        </div>
                      ))}
                      {dayEvents.length === 0 && (
                        <p className="text-[10px] text-[#0050CB] dark:text-blue-300 font-semibold italic">
                          Click to add event
                        </p>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-[8px] text-[#0050CB] dark:text-[#38BDF8] font-black pt-1">
                      <span>Active</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                  </div>
                );
              }

              // 3. FUTURE ACTIVE DAYS
              return (
                <div
                  key={`${cell.dateStr}-${idx}`}
                  onClick={() => handleDayClick(cell)}
                  className={`min-h-[105px] p-2 rounded-xl border flex flex-col justify-between cursor-pointer transition-all hover:border-[#0050CB] hover:shadow-xs group ${
                    cell.type === "current"
                      ? "bg-white dark:bg-[#000E28] border-slate-200/80 dark:border-slate-800"
                      : "bg-slate-50/50 dark:bg-slate-900/30 border-slate-100 dark:border-slate-800/60 opacity-80"
                  }`}
                >
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-[#000E28] dark:text-white group-hover:text-[#0050CB] transition-colors">
                      {cell.dayNumber}
                    </span>
                    <span className="text-[8px] font-bold text-slate-300 group-hover:text-[#0050CB] opacity-0 group-hover:opacity-100 transition-opacity">
                      + Add
                    </span>
                  </div>

                  <div className="space-y-1 mt-1">
                    {dayEvents.map((ev) => (
                      <div
                        key={ev.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(ev);
                        }}
                        className={`p-1.5 rounded-lg text-[10px] font-bold truncate shadow-2xs cursor-pointer hover:opacity-90 ${ev.color}`}
                      >
                        <p className="truncate font-black">{ev.title}</p>
                        <p className="text-[9px] opacity-80">{ev.time}</p>
                      </div>
                    ))}
                  </div>

                  <div className="text-[9px] text-slate-400 group-hover:text-[#0050CB] font-medium mt-auto pt-1 flex items-center justify-between">
                    <span>{dayEvents.length > 0 ? `${dayEvents.length} Event` : ""}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CALENDAR LEGEND */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500 font-semibold">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700" />
                <span className="line-through text-slate-400">Past & Completed (Disabled)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#0050CB] text-white flex items-center justify-center text-[9px] font-bold">
                  ★
                </span>
                <span className="text-[#0050CB] dark:text-[#38BDF8] font-bold">Current Date (Today)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-white dark:bg-[#000E28] border border-slate-300 dark:border-slate-700" />
                <span>Future Dates (Active)</span>
              </span>
            </div>

            <div className="text-slate-400">
              Click any active date to add an event
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: EVENTS FEED & STATS (COL-4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* UPCOMING & COMPLETED EVENTS PANEL */}
          <div className="bg-white dark:bg-[#000E28] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-black text-[#000E28] dark:text-white">Events Timeline</h3>
                <p className="text-[11px] text-slate-400 font-medium">Real-time schedule lifecycle</p>
              </div>
              <span className="text-xs font-bold text-[#0050CB] dark:text-[#38BDF8] bg-[#E5EEFF] dark:bg-[#0050CB]/20 px-2 py-0.5 rounded-full">
                {events.length} Total
              </span>
            </div>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {upcomingEvents.map((ev) => {
                const isPast = new Date(ev.date) < todayNormalized;
                const isToday = new Date(ev.date).toDateString() === today.toDateString();
                const evDate = new Date(ev.date);

                return (
                  <div
                    key={ev.id}
                    onClick={() => setSelectedEvent(ev)}
                    className={`p-3.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer group ${
                      isPast
                        ? "bg-slate-50 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800 opacity-60 hover:opacity-100"
                        : isToday
                        ? "bg-[#0050CB]/5 dark:bg-[#0050CB]/15 border-[#0050CB]/50 shadow-2xs hover:border-[#0050CB]"
                        : "bg-slate-50 dark:bg-slate-900/60 border-slate-100 dark:border-slate-800 hover:border-[#0050CB]"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      {/* Date Block */}
                      <div
                        className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl shrink-0 ${
                          isToday
                            ? "bg-[#0050CB] text-white"
                            : isPast
                            ? "bg-slate-200 dark:bg-slate-800 text-slate-400"
                            : "bg-blue-100 dark:bg-blue-950/60 text-[#0050CB] dark:text-[#38BDF8]"
                        }`}
                      >
                        <span className="text-[9px] font-black uppercase">
                          {evDate.toLocaleDateString("en-US", { month: "short" })}
                        </span>
                        <span className="text-sm font-black leading-none">
                          {evDate.getDate()}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <h4 className={`text-xs font-black leading-tight ${
                            isPast ? "line-through text-slate-500" : "text-[#000E28] dark:text-white group-hover:text-[#0050CB]"
                          }`}>
                            {ev.title}
                          </h4>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {ev.time}
                          </span>
                          {isPast && (
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3" /> Completed
                            </span>
                          )}
                          {isToday && (
                            <span className="text-[#0050CB] dark:text-[#38BDF8] font-bold">
                              ● Today
                            </span>
                          )}
                        </div>

                        <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {ev.location}
                        </p>
                      </div>
                    </div>

                    <ChevronRightIcon className="w-4 h-4 text-slate-400 group-hover:text-[#0050CB] shrink-0" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* QUICK STATS PANEL */}
          <div className="bg-white dark:bg-[#000E28] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Sparkles className="w-4 h-4 text-[#0050CB] dark:text-[#38BDF8]" />
              <h3 className="text-sm font-black text-[#000E28] dark:text-white">Real-Time Stats</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0050CB] flex items-center justify-center shrink-0">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-base font-black text-[#000E28] dark:text-white leading-none">{totalEventsCount}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">Total Events</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-base font-black text-emerald-600 dark:text-emerald-400 leading-none">{completedEventsCount}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">Completed</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-base font-black text-[#000E28] dark:text-white leading-none">
                    {totalEventsCount - completedEventsCount}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">Upcoming</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-base font-black text-[#000E28] dark:text-white leading-none">
                    {calendarCells.filter((c) => c.isFuture && c.type === "current").length}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">Active Days Left</p>
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

      {/* ========================================================
          DETAILED ACADEMIC EVENT CREATOR MODAL
      ======================================================== */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 z-50 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#07152F] w-full max-w-3xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-[#0050CB] to-[#003B99] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center font-bold">
                  <CalendarIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black tracking-tight">Add Academic Event</h2>
                  <p className="text-xs text-blue-100 font-medium">Schedule institutional activities, exams, assemblies, or deadlines</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowAddModal(false)} 
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleAddEventSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs custom-scrollbar">
              
              {/* SECTION 1: CORE EVENT ESSENTIALS */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-[#0050CB] dark:text-[#38BDF8] flex items-center gap-1.5">
                    <FileText className="w-4 h-4" /> 1. Event Identification
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">Ref Code: {eventCode}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
                  <div className="md:col-span-8">
                    <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">
                      Event Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      placeholder="e.g. Annual Inter-School Science Fair & Robot Exhibition"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-[#000E28] dark:text-white outline-none focus:ring-2 focus:ring-[#0050CB] focus:border-transparent font-medium"
                    />
                  </div>

                  <div className="md:col-span-4">
                    <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">
                      Category Type <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value as CalendarEvent["type"])}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-[#000E28] dark:text-white outline-none focus:ring-2 focus:ring-[#0050CB] font-semibold cursor-pointer"
                    >
                      <option value="Event">General School Event</option>
                      <option value="Exam">Exam / Assessment</option>
                      <option value="Meeting">PTA / Faculty Meeting</option>
                      <option value="Sports">Sports & Athletics</option>
                      <option value="Deadline">Academic / Fee Deadline</option>
                      <option value="Holiday">Gazetted Holiday</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">Priority / Urgency</label>
                    <select
                      value={eventPriority}
                      onChange={(e) => setEventPriority(e.target.value as CalendarEvent["priority"])}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-[#000E28] dark:text-white outline-none font-semibold cursor-pointer"
                    >
                      <option value="Normal">Normal Attendance</option>
                      <option value="High">High Importance</option>
                      <option value="Mandatory">Critical / Mandatory Attendance</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">Event Code</label>
                    <input
                      type="text"
                      value={eventCode}
                      onChange={(e) => setEventCode(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-[#000E28] dark:text-white outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">Dress Code / Attire</label>
                    <input
                      type="text"
                      value={dressCode}
                      onChange={(e) => setDressCode(e.target.value)}
                      placeholder="e.g. Formal Uniform / House T-Shirt"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-[#000E28] dark:text-white outline-none font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: SCHEDULE & TIMINGS */}
              <div className="space-y-3.5 pt-2">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-[#0050CB] dark:text-[#38BDF8] flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> 2. Schedule, Date & Timings
                  </span>
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAllDay}
                      onChange={(e) => setIsAllDay(e.target.checked)}
                      className="w-4 h-4 rounded text-[#0050CB] focus:ring-[#0050CB] cursor-pointer"
                    />
                    <span className="font-bold text-slate-600 dark:text-slate-300">All-Day Event</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">
                      Start Date <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={eventDate}
                      min={today.toISOString().split("T")[0]}
                      onChange={(e) => setEventDate(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-[#000E28] dark:text-white outline-none font-semibold cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Current & future dates</span>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">End Date (Optional)</label>
                    <input
                      type="date"
                      value={eventEndDate}
                      min={eventDate || today.toISOString().split("T")[0]}
                      onChange={(e) => setEventEndDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-[#000E28] dark:text-white outline-none font-semibold cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">For multi-day routines</span>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">Start Time</label>
                    <input
                      type="text"
                      disabled={isAllDay}
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      placeholder="09:00 AM"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-[#000E28] dark:text-white outline-none disabled:opacity-40 font-medium"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">End Time</label>
                    <input
                      type="text"
                      disabled={isAllDay}
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      placeholder="11:30 AM"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-[#000E28] dark:text-white outline-none disabled:opacity-40 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: VENUE & PLATFORM */}
              <div className="space-y-3.5 pt-2">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-[#0050CB] dark:text-[#38BDF8] flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" /> 3. Venue & Facilities
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">Venue Format</label>
                    <select
                      value={venueType}
                      onChange={(e) => setVenueType(e.target.value as CalendarEvent["venueType"])}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-[#000E28] dark:text-white outline-none font-semibold cursor-pointer"
                    >
                      <option value="On-Campus">On-Campus Facility</option>
                      <option value="Off-Campus">Off-Campus Excursion / Ground</option>
                      <option value="Virtual">Online / Video Conference</option>
                    </select>
                  </div>

                  {venueType === "Virtual" ? (
                    <div className="sm:col-span-2">
                      <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">
                        Meeting Link (Zoom / Google Meet)
                      </label>
                      <input
                        type="url"
                        value={onlineMeetingUrl}
                        onChange={(e) => setOnlineMeetingUrl(e.target.value)}
                        placeholder="https://meet.google.com/xyz-abc-123"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-[#000E28] dark:text-white outline-none font-medium"
                      />
                    </div>
                  ) : (
                    <div className="sm:col-span-2">
                      <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">
                        Hall / Room / Ground Location
                      </label>
                      <input
                        type="text"
                        value={eventLocation}
                        onChange={(e) => setEventLocation(e.target.value)}
                        placeholder="e.g. Main Auditorium / Science Lab 2"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-[#000E28] dark:text-white outline-none font-medium"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 4: AUDIENCE & FACULTY IN-CHARGE */}
              <div className="space-y-3.5 pt-2">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-[#0050CB] dark:text-[#38BDF8] flex items-center gap-1.5">
                    <Users className="w-4 h-4" /> 4. Audience & Faculty Coordination
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">Target Audience</label>
                    <select
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value as CalendarEvent["targetAudience"])}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-[#000E28] dark:text-white outline-none font-semibold cursor-pointer"
                    >
                      <option value="All School">Entire School Community</option>
                      <option value="Students & Parents">Students & Parents</option>
                      <option value="Faculty & Staff Only">Faculty & Staff Only</option>
                      <option value="Specific Grades">Specific Grades / Classes</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">Target Classes</label>
                    <input
                      type="text"
                      value={targetGrades}
                      onChange={(e) => setTargetGrades(e.target.value)}
                      placeholder="e.g. Grade 9, Grade 10"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-[#000E28] dark:text-white outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">Faculty Coordinator</label>
                    <input
                      type="text"
                      value={coordinatorName}
                      onChange={(e) => setCoordinatorName(e.target.value)}
                      placeholder="e.g. Dr. Ronald Vance"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-[#000E28] dark:text-white outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">Coordinator Contact</label>
                    <input
                      type="text"
                      value={coordinatorContact}
                      onChange={(e) => setCoordinatorContact(e.target.value)}
                      placeholder="email or extension"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-[#000E28] dark:text-white outline-none font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 5: DESCRIPTION & INSTRUCTIONS */}
              <div className="space-y-3.5 pt-2">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-[#0050CB] dark:text-[#38BDF8] flex items-center gap-1.5">
                    <Tag className="w-4 h-4" /> 5. Event Instructions & Agenda
                  </span>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">
                    Detailed Event Description / Agenda
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide overview, event schedule, equipment requirements, or parent guidelines..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-[#000E28] dark:text-white outline-none focus:ring-2 focus:ring-[#0050CB] font-medium resize-none"
                  />
                </div>

                {/* NOTIFICATIONS & RSVP CHECKBOXES */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifyParents}
                      onChange={(e) => setNotifyParents(e.target.checked)}
                      className="w-4 h-4 rounded text-[#0050CB] focus:ring-[#0050CB] cursor-pointer"
                    />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">Notify Parents</span>
                      <span className="text-[10px] text-slate-400">Dispatch SMS & App Alert</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifyStaff}
                      onChange={(e) => setNotifyStaff(e.target.checked)}
                      className="w-4 h-4 rounded text-[#0050CB] focus:ring-[#0050CB] cursor-pointer"
                    />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">Notify Faculty</span>
                      <span className="text-[10px] text-slate-400">Broadcast to Staff Email</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={requireRsvp}
                      onChange={(e) => setRequireRsvp(e.target.checked)}
                      className="w-4 h-4 rounded text-[#0050CB] focus:ring-[#0050CB] cursor-pointer"
                    />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">Require Parent RSVP</span>
                      <span className="text-[10px] text-slate-400">Track attendance count</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* MODAL ACTION BUTTONS */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0050CB] hover:bg-[#0041A8] text-white font-bold rounded-xl shadow-lg shadow-[#0050CB]/25 cursor-pointer transition-all hover:scale-[1.02]"
                >
                  Save to Academic Calendar
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          DETAILED VIEW EVENT MODAL
      ======================================================== */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in zoom-in-95 duration-150">
          <div className="bg-white dark:bg-[#07152F] w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden space-y-4">
            
            {/* Header Banner */}
            <div className="px-6 py-4 bg-gradient-to-r from-[#0050CB] to-[#003B99] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 text-white`}>
                  {selectedEvent.type}
                </span>
                {selectedEvent.priority && selectedEvent.priority !== "Normal" && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white">
                    {selectedEvent.priority}
                  </span>
                )}
              </div>
              <button 
                type="button"
                onClick={() => setSelectedEvent(null)} 
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-1">
                  <span>Code: {selectedEvent.eventCode || "EV-SCH-01"}</span>
                  {new Date(selectedEvent.date) < todayNormalized ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Event Completed
                    </span>
                  ) : (
                    <span className="text-[#0050CB] dark:text-[#38BDF8] font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Active Schedule
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-black text-[#000E28] dark:text-white leading-tight">
                  {selectedEvent.title}
                </h3>
              </div>

              {selectedEvent.description && (
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {selectedEvent.description}
                </div>
              )}

              {/* Grid Attributes */}
              <div className="grid grid-cols-2 gap-3 text-slate-600 dark:text-slate-300">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <CalendarIcon className="w-3 h-3 text-[#0050CB]" /> Event Date & Time
                  </span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    {new Date(selectedEvent.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                  </p>
                  <p className="text-[11px] text-slate-500">{selectedEvent.time}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-500" /> Venue & Location
                  </span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{selectedEvent.location}</p>
                  <p className="text-[11px] text-slate-500">{selectedEvent.venueType || "On-Campus"}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Users className="w-3 h-3 text-emerald-500" /> Target Audience
                  </span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{selectedEvent.targetAudience || "All School"}</p>
                  {selectedEvent.targetGrades && (
                    <p className="text-[11px] text-slate-500">{selectedEvent.targetGrades}</p>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Tag className="w-3 h-3 text-amber-500" /> Coordinator / Lead
                  </span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{selectedEvent.coordinatorName || "Academic Office"}</p>
                  {selectedEvent.coordinatorContact && (
                    <p className="text-[11px] text-slate-500">{selectedEvent.coordinatorContact}</p>
                  )}
                </div>
              </div>

              {selectedEvent.dressCode && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                  <span className="font-bold text-[#0050CB] dark:text-[#38BDF8]">Dress Code:</span>
                  <span>{selectedEvent.dressCode}</span>
                </div>
              )}

              <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="px-5 py-2 bg-[#0050CB] hover:bg-[#0041A8] text-white font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
