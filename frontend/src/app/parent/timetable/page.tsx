"use client";

import React, { useState } from "react";
import { Clock, MapPin, User, Calendar, CheckCircle2, ChevronRight } from "lucide-react";
import SpotlightCard from "@/components/teacher/SpotlightCard";
import { useParent } from "@/context/ParentContext";

export default function TimetablePage() {
  const { selectedChild } = useParent();
  const [selectedDay, setSelectedDay] = useState<"Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday">("Friday");

  const child = selectedChild || {
    firstName: "Aarav",
    lastName: "Sharma",
    grade: "LKG",
    section: "Section A",
  };

  const days: ("Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday")[] = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"
  ];

  const scheduleByDay: Record<string, any[]> = {
    Friday: [
      { time: "08:30 AM – 09:00 AM", subject: "Morning Assembly & Circle Time", room: "Classroom 102", teacher: "Ms. Ananya Roy", activity: "Greetings, weather chart & morning hymn" },
      { time: "09:00 AM – 09:45 AM", subject: "Numbers & Counting", room: "Classroom 102", teacher: "Ms. Ananya Roy", activity: "Tactile counting with wooden beads & sorting games" },
      { time: "10:00 AM – 10:45 AM", subject: "Creative Arts & Crafts", room: "Art Studio", teacher: "Mr. Deepak Sen", activity: "Clay modeling & animal outline colouring" },
      { time: "11:00 AM – 11:45 AM", subject: "Story & Rhymes", room: "Interactive Library", teacher: "Ms. Pooja Mehra", activity: "Puppet theatre storytelling & rhyme recitation" },
      { time: "12:00 PM – 12:45 PM", subject: "Nutritious Lunch Break", room: "Dining Hall", teacher: "Class Care Team", activity: "Healthy meals & table etiquette practice" },
      { time: "01:00 PM – 02:00 PM", subject: "Physical Play & Motor Gym", room: "Outdoor Turf", teacher: "Coach Vikram", activity: "Beam balance, parachute play & obstacle relay" },
      { time: "02:15 PM – 02:30 PM", subject: "Dismissal & Parent Pickup", room: "Main Gate", teacher: "Class Care Team", activity: "Orderly afternoon student dispersal with security check" },
    ],
    Monday: [
      { time: "08:30 AM – 09:00 AM", subject: "Morning Assembly & Circle Time", room: "Auditorium", teacher: "Ms. Ananya Roy", activity: "National anthem, prayer & week kick-off" },
      { time: "09:00 AM – 09:45 AM", subject: "English Alphabet & Phonics", room: "Classroom 102", teacher: "Ms. Ananya Roy", activity: "Letter sounds A to M with phonetic flashcards" },
      { time: "10:00 AM – 10:45 AM", subject: "Music & Rhythmic Movement", room: "Music Room", teacher: "Mrs. Shalini", activity: "Percussion instruments & vocal rhythm clapping" },
      { time: "11:00 AM – 11:45 AM", subject: "Sensory Nature Play", room: "Courtyard Garden", teacher: "Ms. Ananya Roy", activity: "Plant inspection, tactile soil & leaf grouping" },
      { time: "12:00 PM – 12:45 PM", subject: "Nutritious Lunch Break", room: "Dining Hall", teacher: "Class Care Team", activity: "Hand washing routines and balanced lunch" },
      { time: "01:00 PM – 02:00 PM", subject: "Quiet Story Hour & Free Play", room: "Classroom 102", teacher: "Ms. Ananya Roy", activity: "Picture book reading & soft block construction" },
      { time: "02:15 PM – 02:30 PM", subject: "Dismissal & Parent Pickup", room: "Main Gate", teacher: "Class Care Team", activity: "Orderly afternoon student dispersal with security check" },
    ],
    Tuesday: [
      { time: "08:30 AM – 09:00 AM", subject: "Morning Circle & News Share", room: "Classroom 102", teacher: "Ms. Ananya Roy", activity: "Show & Tell with classroom objects" },
      { time: "09:00 AM – 09:45 AM", subject: "Numeracy: Shapes & Sizes", room: "Classroom 102", teacher: "Ms. Ananya Roy", activity: "Circles, squares & triangles puzzle board" },
      { time: "10:00 AM – 10:45 AM", subject: "Gross Motor Obstacle Course", room: "Play Gym", teacher: "Coach Vikram", activity: "Tunnel crawl, beanbag toss & hopscotch" },
      { time: "11:00 AM – 11:45 AM", subject: "Water & Sand Sensory Play", room: "Sensory Hub", teacher: "Ms. Ananya Roy", activity: "Measuring cups, funnels & tactile damp sand" },
      { time: "12:00 PM – 12:45 PM", subject: "Lunch Break", room: "Dining Hall", teacher: "Class Care Team", activity: "Snack & warm meal time" },
      { time: "01:00 PM – 02:00 PM", subject: "Colouring & Free Expression", room: "Classroom 102", teacher: "Mr. Deepak Sen", activity: "Big crayon drawing on butcher paper" },
      { time: "02:15 PM – 02:30 PM", subject: "Dismissal & Parent Pickup", room: "Main Gate", teacher: "Class Care Team", activity: "Orderly afternoon student dispersal" },
    ],
    Wednesday: [
      { time: "08:30 AM – 09:00 AM", subject: "Circle Time & Finger Plays", room: "Classroom 102", teacher: "Ms. Ananya Roy", activity: "Nursery rhymes with hand gestures" },
      { time: "09:00 AM – 09:45 AM", subject: "Phonics & Tracing", room: "Classroom 102", teacher: "Ms. Ananya Roy", activity: "Sandpaper letter tracing" },
      { time: "10:00 AM – 10:45 AM", subject: "Yoga & Mindfulness for Kids", room: "Zen Studio", teacher: "Mrs. Shalini", activity: "Animal stretch poses & breathing exercises" },
      { time: "11:00 AM – 11:45 AM", subject: "Little Scientists Observation", room: "Science Lab", teacher: "Mr. Rajesh Kumar", activity: "Sink or float experiment with water tubs" },
      { time: "12:00 PM – 12:45 PM", subject: "Lunch & Social Time", room: "Dining Hall", teacher: "Class Care Team", activity: "Lunch sharing and conversation" },
      { time: "01:00 PM – 02:00 PM", subject: "Building Blocks & Puzzles", room: "Activity Wing", teacher: "Ms. Ananya Roy", activity: "Magnetic tiles and Mega Bloks building" },
      { time: "02:15 PM – 02:30 PM", subject: "Dismissal & Parent Pickup", room: "Main Gate", teacher: "Class Care Team", activity: "Orderly afternoon student dispersal" },
    ],
    Thursday: [
      { time: "08:30 AM – 09:00 AM", subject: "Circle Time & Calendar Talk", room: "Classroom 102", teacher: "Ms. Ananya Roy", activity: "Days of the week & season wheel" },
      { time: "09:00 AM – 09:45 AM", subject: "Numbers & Quantities", room: "Classroom 102", teacher: "Ms. Ananya Roy", activity: "Counting teddy bear counters" },
      { time: "10:00 AM – 10:45 AM", subject: "Theatre & Puppet Roleplay", room: "Drama Studio", teacher: "Ms. Pooja Mehra", activity: "Goldilocks and Three Bears dramatization" },
      { time: "11:00 AM – 11:45 AM", subject: "Fine Motor Scissors & Pasting", room: "Art Studio", teacher: "Mr. Deepak Sen", activity: "Safety scissor snipping & sticker collage" },
      { time: "12:00 PM – 12:45 PM", subject: "Lunch & Free Play", room: "Dining Hall", teacher: "Class Care Team", activity: "Healthy nutrition check" },
      { time: "01:00 PM – 02:00 PM", subject: "Outdoor Tricycle Track", room: "Campus Quad", teacher: "Coach Vikram", activity: "Riding safety and pedal motor skills" },
      { time: "02:15 PM – 02:30 PM", subject: "Dismissal & Parent Pickup", room: "Main Gate", teacher: "Class Care Team", activity: "Orderly afternoon student dispersal" },
    ],
  };

  const activePeriods = scheduleByDay[selectedDay] || scheduleByDay.Friday;

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-[22px] bg-white dark:bg-[#07142F] border border-[#E7EAF0] dark:border-white/10 shadow-sm">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#3157D5]">
            Weekly Curriculum Schedule
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#07142F] dark:text-white">
            Timetable: {child.grade} – {child.section}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Student daily subject distribution, faculty assignments, and room locations at GGPS.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-100 dark:bg-white/5 px-3.5 py-2 rounded-xl">
          <Clock className="w-4 h-4 text-[#3157D5]" />
          <span>School Hours: <strong>08:30 AM – 02:30 PM</strong></span>
        </div>
      </div>

      {/* Interactive Day Selector Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-[#07142F] border border-[#E7EAF0] dark:border-white/10 overflow-x-auto scrollbar-none shadow-xs">
        {days.map((d) => {
          const isSelected = selectedDay === d;
          return (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className={`flex-1 min-w-[100px] py-3 px-4 rounded-xl text-xs font-bold transition-all text-center flex flex-col items-center gap-0.5 ${
                isSelected
                  ? "bg-[#3157D5] text-white shadow-md shadow-[#3157D5]/20"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
            >
              <span>{d}</span>
              {d === "Friday" && (
                <span className={`text-[9px] uppercase font-black px-1.5 rounded-full ${isSelected ? "bg-white/20 text-white" : "text-[#3157D5]"}`}>
                  Today
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Period Schedule Cards List */}
      <SpotlightCard className="p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-bold text-[#07142F] dark:text-white">
            {selectedDay}&rsquo;s Class Period Timeline ({activePeriods.length} Periods)
          </h2>
          <span className="text-xs font-bold text-[#3157D5]">
            {child.grade} – {child.section}
          </span>
        </div>

        <div className="space-y-3">
          {activePeriods.map((period, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#3157D5]/40 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-black text-[#3157D5] dark:text-blue-400 font-mono">
                    {period.time}
                  </span>
                  <span className="text-xs font-bold text-[#07142F] dark:text-white">
                    {period.subject}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {period.activity}
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-500 shrink-0">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#3157D5]" />
                  <span>{period.room}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{period.teacher}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SpotlightCard>
    </div>
  );
}
