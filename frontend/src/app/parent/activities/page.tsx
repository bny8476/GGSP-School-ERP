"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Palette, Sparkles, Calendar, User, CheckCircle2 } from "lucide-react";
import SpotlightCard from "@/components/teacher/SpotlightCard";
import { useParent } from "@/context/ParentContext";

export default function ActivitiesPage() {
  const { selectedChild } = useParent();
  const [filter, setFilter] = useState("all");

  const child = selectedChild || {
    firstName: "Aarav",
    lastName: "Sharma",
    grade: "LKG",
  };

  const activities = [
    {
      id: "act-1",
      title: "Tactile Numbers & Shapes Exploration",
      category: "Math Play",
      date: "18 Sep 2026",
      teacher: "Ms. Ananya Roy",
      description: "Children explored 3D geometric wooden solids and formed numerals using modeling dough and counting counters.",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&auto=format&fit=crop&q=80",
    },
    {
      id: "act-2",
      title: "Puppet Theatre & Fairy Tale Rhymes",
      category: "Storytelling",
      date: "17 Sep 2026",
      teacher: "Ms. Pooja Mehra",
      description: "Interactive animal puppet theatre encouraging spontaneous verbal dialogue, voice modulation, and listening attention.",
      image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500&auto=format&fit=crop&q=80",
    },
    {
      id: "act-3",
      title: "Botanical Leaf Rubbing & Texture Collage",
      category: "Nature & Art",
      date: "16 Sep 2026",
      teacher: "Mr. Deepak Sen",
      description: "Harvested natural fallen leaves from the campus orchard to create wax crayon impression art and understand leaf vein structure.",
      image: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=500&auto=format&fit=crop&q=80",
    },
    {
      id: "act-4",
      title: "Outdoor Agility & Parachute Relay",
      category: "Physical Play",
      date: "15 Sep 2026",
      teacher: "Coach Vikram",
      description: "Cooperative rainbow parachute canopy games emphasizing synchronized rhythm, arm endurance, and team spirit.",
      image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=500&auto=format&fit=crop&q=80",
    },
    {
      id: "act-5",
      title: "Phonics Sensory Sand Tray Tracing",
      category: "Early Literacy",
      date: "12 Sep 2026",
      teacher: "Ms. Ananya Roy",
      description: "Tracing alphabetical cursive strokes in dyed sensory cornmeal and reciting initial phoneme word families.",
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=500&auto=format&fit=crop&q=80",
    },
    {
      id: "act-6",
      title: "Little Chefs: Fruit Salad Assembling",
      category: "Life Skills",
      date: "10 Sep 2026",
      teacher: "Mrs. Shalini",
      description: "Safe child-friendly wooden knives to slice soft bananas, peel oranges, and learn about vitamin nutrition.",
      image: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=500&auto=format&fit=crop&q=80",
    },
  ];

  const filtered = filter === "all" ? activities : activities.filter((a) => a.category === filter);

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-[22px] bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#7C5CFC]">
            Experiential Curriculum
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#000E28] dark:text-white">
            Classroom Activities: {child.firstName} {child.lastName}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Visual diary of hands-on learning experiences, arts, physical coordination, and sensory projects.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3.5 py-2 rounded-xl">
          <Palette className="w-4 h-4 text-[#7C5CFC]" />
          <span>{activities.length} Recorded Activities This Term</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {["all", "Math Play", "Storytelling", "Nature & Art", "Physical Play", "Early Literacy", "Life Skills"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              filter === cat
                ? "bg-[#0050CB] text-white shadow-xs"
                : "bg-white dark:bg-[#111827] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300"
            }`}
          >
            {cat === "all" ? "All Experiences" : cat}
          </button>
        ))}
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((act) => (
          <SpotlightCard key={act.id} className="overflow-hidden flex flex-col justify-between">
            <div>
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={act.image}
                  alt={act.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-extrabold uppercase">
                  {act.category}
                </div>
              </div>

              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {act.date}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-300">
                    <User className="w-3 h-3" /> {act.teacher}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#000E28] dark:text-white line-clamp-1">
                  {act.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {act.description}
                </p>
              </div>
            </div>

            <div className="px-5 pb-5 pt-2">
              <span className="text-[11px] font-bold text-[#0050CB] dark:text-blue-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>{child.firstName} completed with high engagement</span>
              </span>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </div>
  );
}
