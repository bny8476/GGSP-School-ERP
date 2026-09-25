"use client";

import React, { useState } from "react";
import { Activity, Trophy, Users, Plus, Award, X } from "lucide-react";
import EmergencyBanner from "@/components/ui/EmergencyBanner";
import toast from "react-hot-toast";

export default function SportsPage() {
  const [teams, setTeams] = useState([
    { id: 1, name: "Global Knights Football Club", sport: "Football", coach: "Coach Mark Davis", members: 18, achievements: "Inter-School Champions 2025" },
    { id: 2, name: "GGPS Eagles Basketball Team", sport: "Basketball", coach: "Coach Sarah Connor", members: 12, achievements: "Regional Runners Up" },
    { id: 3, name: "Lions Athletics Squad", sport: "Track & Field", coach: "Coach Robert Paul", members: 25, achievements: "State Gold Medalist" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [sport, setSport] = useState("Football");
  const [coach, setCoach] = useState("");
  const [members, setMembers] = useState(15);
  const [achievements, setAchievements] = useState("");

  const handleRegisterTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim() || !coach.trim()) {
      toast.error("Please provide both team name and coach name");
      return;
    }
    const newEntry = {
      id: Date.now(),
      name: teamName,
      sport,
      coach,
      members: Number(members) || 12,
      achievements: achievements.trim() || "Active Season Participant"
    };
    setTeams(prev => [newEntry, ...prev]);
    toast.success(`Team "${teamName}" registered successfully!`);
    setTeamName("");
    setCoach("");
    setAchievements("");
    setShowModal(false);
  };

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

        <button 
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 bg-[#0050CB] hover:bg-[#0041A8] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
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

      {/* Register New Team Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#000E28] w-full max-w-md p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#0050CB] dark:text-[#38BDF8]" />
                <h2 className="text-base font-black text-[#000E28] dark:text-white">Register New Sports Team</h2>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterTeam} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Team / Squad Name</label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. Thunderbolts Cricket XI"
                  required
                  className="w-full mt-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-[#0050CB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Sport Category</label>
                  <select
                    value={sport}
                    onChange={(e) => setSport(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                  >
                    <option value="Football">Football</option>
                    <option value="Basketball">Basketball</option>
                    <option value="Track & Field">Track & Field</option>
                    <option value="Cricket">Cricket</option>
                    <option value="Badminton">Badminton</option>
                    <option value="Swimming">Swimming</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Squad Size</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={members}
                    onChange={(e) => setMembers(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Coach / Mentor Name</label>
                <input
                  type="text"
                  value={coach}
                  onChange={(e) => setCoach(e.target.value)}
                  placeholder="e.g. Coach David Miller"
                  required
                  className="w-full mt-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Recent Accolades / Highlights</label>
                <input
                  type="text"
                  value={achievements}
                  onChange={(e) => setAchievements(e.target.value)}
                  placeholder="e.g. District Inter-School Champions 2025"
                  className="w-full mt-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0050CB] hover:bg-[#0041A8] text-white font-bold rounded-xl shadow-md cursor-pointer transition-colors"
                >
                  Register Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
