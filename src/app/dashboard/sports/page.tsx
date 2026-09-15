"use client";

import React, { useState } from "react";
import { Activity, Trophy, Users, Plus, Award } from "lucide-react";
import EmergencyBanner from "@/components/ui/EmergencyBanner";

export default function SportsPage() {
  const [teams, setTeams] = useState([
    { id: 1, name: "Global Knights Football Club", sport: "Football", coach: "Coach Mark Davis", members: 18, achievements: "Inter-School Champions 2025" },
    { id: 2, name: "E.A.S. Eagles Basketball Team", sport: "Basketball", coach: "Coach Sarah Connor", members: 12, achievements: "Regional Runners Up" },
    { id: 3, name: "Lions Athletics Squad", sport: "Track & Field", coach: "Coach Robert Paul", members: 25, achievements: "State Gold Medalist" },
  ]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <EmergencyBanner />

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-[#000E28] dark:text-white flex items-center gap-3">
            <Trophy className="w-8 h-8 text-[#0050CB] dark:text-[#38BDF8]" />
            Sports Teams & Athletic Competitions
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm font-medium">
            Manage school sports teams, rosters, upcoming fixtures, and championship records.
          </p>
        </div>

        <button className="px-5 py-2.5 bg-[#0050CB] hover:bg-[#0041A8] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>Register New Team</span>
        </button>
      </div>

      {/* Sports Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {teams.map((t) => (
          <div
            key={t.id}
            className="bg-white dark:bg-[#000E28] border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#0050CB] dark:text-[#38BDF8] bg-[#E5EEFF] dark:bg-[#0050CB]/20 px-3 py-1 rounded-full">
                  {t.sport}
                </span>
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> {t.members} Players
                </span>
              </div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-snug">{t.name}</h3>
              <p className="text-xs text-slate-500 font-medium">Coach: <strong className="text-slate-800 dark:text-slate-200">{t.coach}</strong></p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
              <Award className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{t.achievements}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
