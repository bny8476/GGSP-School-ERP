"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { 
  CalendarHeart, Calendar, Clock, Smile, Utensils, Moon, 
  Paperclip, ChevronRight, BookOpen, Sparkles, CheckCircle2 
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import SpotlightCard from "@/components/teacher/SpotlightCard";
import { useParent } from "@/context/ParentContext";

export default function DailyDiaryPage() {
  const { selectedChild } = useParent();
  const [selectedDate, setSelectedDate] = useState("2026-09-18");
  const [diaries, setDiaries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const child = selectedChild || {
    firstName: "Aarav",
    lastName: "Sharma",
    grade: "LKG",
  };

  useEffect(() => {
    async function fetchDiaries() {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
        const res = await fetch(`${apiBase}/api/v1/daily-diary?date=${selectedDate}`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setDiaries(data);
          }
        }
      } catch (_) {
      } finally {
        setIsLoading(false);
      }
    }
    fetchDiaries();
  }, [selectedDate, child]);

  const sampleEntries = [
    {
      id: "d1",
      date: "Friday, 18 September 2026",
      teacher: "Ms. Ananya Roy",
      role: "Class Mentor (LKG)",
      topic: "Numbers & Counting 1 to 10 with Wooden Blocks",
      description: "Children practiced counting and grouping tactile wooden beads and coloured blocks into sets of 5 and 10. Aarav engaged energetically, demonstrated great number recognition, and assisted classmates during table cleanup.",
      meals: "Finished complete vegetable poha snack box & water bottle",
      napTime: "45 minutes rest during post-lunch quiet time",
      mood: "Happy & highly inquisitive",
      activities: ["Counting 1-10", "Number Rhyme Time", "Clay Number Shapes"],
      images: [
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&auto=format&fit=crop&q=80"
      ]
    },
    {
      id: "d2",
      date: "Thursday, 17 September 2026",
      teacher: "Ms. Ananya Roy",
      role: "Class Mentor (LKG)",
      topic: "Sensory Nature Exploration & Leaf Rubbing",
      description: "Students collected fallen leaves of varying shapes and textures from the school garden, followed by wax crayon texture rubbing on art sheets.",
      meals: "Ate fruit salad and sandwiches completely",
      napTime: "30 minutes rest",
      mood: "Curious and creative",
      activities: ["Nature Walk", "Texture Rubbing Art", "Botanical Vocabulary"],
      images: [
        "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80"
      ]
    }
  ];

  const [acknowledgedMap, setAcknowledgedMap] = useState<Record<string, boolean>>({
    d1: true,
  });

  const handleAcknowledge = (id: string) => {
    setAcknowledgedMap((prev) => {
      const isNowAck = !prev[id];
      if (isNowAck) {
        toast.success("Daily diary signed & acknowledged for class mentor!");
      }
      return { ...prev, [id]: isNowAck };
    });
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-7 rounded-[26px] bg-gradient-to-r from-white via-[#F8FBFF] to-[#EFF6FF] dark:from-[#07142F] dark:via-[#091D45] dark:to-[#07142F] border border-blue-100/90 dark:border-white/10 shadow-xs">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-rose-500">
            Digital Daily Diary
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#000E28] dark:text-white">
            Classroom Log: {child.firstName} {child.lastName}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time daily learning updates, educator observations, meals, and nap logs.
          </p>
        </div>

        {/* Quick Date Filters + Custom Picker */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { label: "Today", value: "2026-09-18" },
            { label: "Yesterday", value: "2026-09-17" },
            { label: "Past 7 Days", value: "2026-09-14" },
          ].map((pill) => (
            <button
              key={pill.label}
              onClick={() => setSelectedDate(pill.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedDate === pill.value
                  ? "bg-[#0050CB] text-white shadow-xs"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-300"
              }`}
            >
              {pill.label}
            </button>
          ))}
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-[#000E28] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0050CB]"
          />
        </div>
      </div>

      {/* Diary Entries List */}
      <div className="space-y-6">
        {sampleEntries.map((entry) => (
          <SpotlightCard key={entry.id} className="p-6 sm:p-8 space-y-6">
            {/* Entry Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center shrink-0">
                  <CalendarHeart className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#000E28] dark:text-white">
                    {entry.topic}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Recorded by {entry.teacher} • {entry.role}
                  </p>
                </div>
              </div>
              <span className="text-xs font-extrabold text-[#0050CB] dark:text-blue-400 font-mono">
                {entry.date}
              </span>
            </div>

            {/* Educator Observation */}
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Educator Observations
              </span>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                &ldquo;{entry.description}&rdquo;
              </p>
            </div>

            {/* Daily Routine Telemetry Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#F6F8FC] dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-start gap-2.5">
                <Utensils className="w-4 h-4 text-[#FF690C] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Meals & Nutrition</span>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">{entry.meals}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F6F8FC] dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-start gap-2.5">
                <Moon className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Rest & Nap Time</span>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">{entry.napTime}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F6F8FC] dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-start gap-2.5">
                <Smile className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Classroom Mood</span>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">{entry.mood}</p>
                </div>
              </div>
            </div>

            {/* Learning Activities Chips */}
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Core Activities Covered
              </span>
              <div className="flex flex-wrap gap-2">
                {entry.activities.map((act, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0050CB]" />
                    {act}
                  </span>
                ))}
              </div>
            </div>

            {/* Photo Gallery Attachments */}
            {entry.images && entry.images.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Paperclip className="w-3 h-3" /> Classroom Activity Photos ({entry.images.length})
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {entry.images.map((imgUrl, i) => (
                    <div
                      key={i}
                      className="relative h-44 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 group cursor-pointer"
                    >
                      <Image
                        src={imgUrl}
                        alt="Activity photograph"
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Parent Acknowledgement & Message Action Footer */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleAcknowledge(entry.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  acknowledgedMap[entry.id]
                    ? "bg-[#E8FAF0] text-[#027A48] border border-emerald-200"
                    : "bg-[#0050CB] text-white hover:bg-[#0040A8] shadow-xs"
                }`}
              >
                <CheckCircle2 className={`w-4 h-4 ${acknowledgedMap[entry.id] ? "text-[#027A48]" : "text-white"}`} />
                <span>
                  {acknowledgedMap[entry.id]
                    ? "Signed & Acknowledged by Guardian"
                    : "Sign & Acknowledge Entry"}
                </span>
              </button>

              <Link
                href="/parent/messages"
                className="text-xs font-bold text-[#0050CB] hover:underline flex items-center gap-1.5"
              >
                <span>Message {entry.teacher}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </div>
  );
}
