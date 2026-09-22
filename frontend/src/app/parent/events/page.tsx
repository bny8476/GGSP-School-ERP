"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Calendar, Clock, MapPin, Users, Sparkles, ChevronRight, Bell } from "lucide-react";
import SpotlightCard from "@/components/teacher/SpotlightCard";
import toast from "react-hot-toast";

export default function SchoolEventsPage() {
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("upcoming");

  const events = [
    {
      id: "ev-1",
      title: "Annual Sports Day: Champions in Motion 2026",
      date: "Saturday, 10 October 2026",
      time: "08:30 AM – 01:00 PM",
      location: "GGPS Central Athletic Stadium",
      audience: "All Parents & Students",
      category: "Sports & Fitness",
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&auto=format&fit=crop&q=80",
      description: "Join us for our flagship track and field tournament featuring sprint relays, obstacle dashes, and the proud March Past parade.",
      status: "Upcoming",
    },
    {
      id: "ev-2",
      title: "Parent-Teacher Developmental Conference (PTC)",
      date: "Saturday, 24 October 2026",
      time: "09:00 AM – 03:30 PM",
      location: "Pre-Primary & Primary Wings",
      audience: "Parents Only",
      category: "Academic Consultation",
      image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=500&auto=format&fit=crop&q=80",
      description: "1-on-1 bilateral consultation with your child's mentors to review Term 1 progress rubrics, milestones, and learning styles.",
      status: "Upcoming",
    },
    {
      id: "ev-3",
      title: "Grandparents Day Celebration & Musical Gala",
      date: "Friday, 06 November 2026",
      time: "10:00 AM – 12:30 PM",
      location: "Main Auditorium",
      audience: "Grandparents & Families",
      category: "Cultural Gala",
      image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500&auto=format&fit=crop&q=80",
      description: "A heartfelt morning celebrating wisdom and family bonds with musical performances, student choir recitals, and high tea.",
      status: "Upcoming",
    },
    {
      id: "ev-4",
      title: "Inter-School Science & STEAM Innovation Expo",
      date: "Thursday, 20 August 2026",
      time: "09:30 AM – 02:00 PM",
      location: "Discovery Science Centre",
      audience: "All Campus",
      category: "Science & Robotics",
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&auto=format&fit=crop&q=80",
      description: "Over 80 interactive student working models illustrating renewable green energy, simple machines, and junior robotics.",
      status: "Past",
    },
  ];

  const filtered = filter === "all"
    ? events
    : events.filter((e) => e.status.toLowerCase() === filter);

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-[22px] bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#0050CB]">
            Campus Community Life
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#000E28] dark:text-white">
            School Calendar & Official Events
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Stay informed about annual milestones, parent-teacher meetings, and celebrations.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          {(["upcoming", "all", "past"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                filter === t
                  ? "bg-[#0050CB] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-[#0050CB]"
              }`}
            >
              {t === "all" ? "All Events" : `${t} Events`}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((evt) => (
          <SpotlightCard key={evt.id} className="overflow-hidden flex flex-col justify-between">
            <div>
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={evt.image}
                  alt={evt.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-wider">
                  {evt.category}
                </div>
                <div className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                  evt.status === "Upcoming"
                    ? "bg-emerald-500 text-white shadow-md"
                    : "bg-slate-700 text-slate-300"
                }`}>
                  {evt.status}
                </div>
              </div>

              <div className="p-6 space-y-3">
                <h2 className="text-base sm:text-lg font-bold text-[#000E28] dark:text-white">
                  {evt.title}
                </h2>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {evt.description}
                </p>

                <div className="space-y-1.5 pt-2 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#0050CB]" />
                    <span className="font-bold text-[#000E28] dark:text-white">{evt.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#FF690C]" />
                    <span>{evt.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-purple-600" />
                    <span>{evt.location}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 mt-2">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                <Users className="w-3 h-3" /> {evt.audience}
              </span>
              <button
                onClick={() => toast.success(`Event reminder set for "${evt.title}"`)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-[#0050CB] text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Bell className="w-3.5 h-3.5" /> Set Reminder
              </button>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </div>
  );
}
