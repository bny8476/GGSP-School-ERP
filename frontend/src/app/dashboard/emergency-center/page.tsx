"use client";

import React, { useState } from "react";
import { ShieldCheck, AlertTriangle, PhoneCall, Radio, Users, CheckCircle2, XCircle, BellRing, RefreshCw } from "lucide-react";

export default function EmergencyCenterPage() {
  const [activeAlert, setActiveAlert] = useState<string | null>(null);
  const [broadcastSent, setBroadcastSent] = useState(false);

  const classroomRoster = [
    { room: "Class 10-A", teacher: "Mr. David Miller", status: "All Safe", headcount: "28/28", updated: "1 min ago" },
    { room: "Class 10-B", teacher: "Ms. Elena Rostova", status: "All Safe", headcount: "30/30", updated: "2 mins ago" },
    { room: "Science Lab 2", teacher: "Dr. Robert Vance", status: "Unaccounted (1 Missing)", headcount: "24/25", updated: "Just now" },
    { room: "Gymnasium", teacher: "Coach Marcus", status: "All Safe", headcount: "45/45", updated: "3 mins ago" },
  ];

  const handlePanicTrigger = (type: string) => {
    setActiveAlert(type);
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 6000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#000E28] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Radio className="h-4 w-4 animate-ping" />
            <span>Campus Security & SOS Protocol</span>
          </div>
          <h1 className="text-2xl font-black text-[#000E28] dark:text-white tracking-tight">
            Emergency Control Center & Live Safety Roster
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time emergency broadcast system, automated headcounts, lockdown triggers, and instant parent emergency communication.
          </p>
        </div>
      </div>

      {broadcastSent && (
        <div className="p-4 rounded-xl bg-rose-600 text-white font-bold text-xs flex items-center justify-between shadow-lg animate-bounce">
          <div className="flex items-center gap-3">
            <BellRing className="h-5 w-5" />
            <span>EMERGENCY BROADCAST SENT: SMS & Push notifications dispatched to 1,240 parents, staff, and security units.</span>
          </div>
        </div>
      )}

      {/* Quick Panic Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => handlePanicTrigger("Fire Drill / Evacuation")}
          className="p-5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-left shadow-md transition-all cursor-pointer space-y-2"
        >
          <AlertTriangle className="h-6 w-6 text-amber-300" />
          <div className="text-base">Fire Evacuation</div>
          <p className="text-[11px] font-medium opacity-90">Trigger alarm & route students to soccer field assembly point</p>
        </button>

        <button
          onClick={() => handlePanicTrigger("Severe Weather Warning")}
          className="p-5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-left shadow-md transition-all cursor-pointer space-y-2"
        >
          <ShieldCheck className="h-6 w-6 text-white" />
          <div className="text-base">Severe Weather Alert</div>
          <p className="text-[11px] font-medium opacity-90">Shelter-in-place protocol for storm / heavy rain</p>
        </button>

        <button
          onClick={() => handlePanicTrigger("Medical Emergency SOS")}
          className="p-5 rounded-2xl bg-[#0050CB] hover:bg-[#003da3] text-white font-black text-left shadow-md transition-all cursor-pointer space-y-2"
        >
          <PhoneCall className="h-6 w-6 text-cyan-300" />
          <div className="text-base">Medical SOS Alert</div>
          <p className="text-[11px] font-medium opacity-90">Dispatch campus nurse & paramedic team to location</p>
        </button>

        <button
          onClick={() => handlePanicTrigger("Security Lockdown")}
          className="p-5 rounded-2xl bg-slate-900 hover:bg-black text-white font-black text-left shadow-md transition-all cursor-pointer space-y-2 border border-slate-700"
        >
          <Radio className="h-6 w-6 text-rose-500 animate-pulse" />
          <div className="text-base">Security Lockdown</div>
          <p className="text-[11px] font-medium opacity-90">Lock all electronic gates & notify local authorities</p>
        </button>
      </div>

      {/* Main Roster Grid */}
      <div className="bg-white dark:bg-[#000E28] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-[#000E28] dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Users className="h-4 w-4 text-[#0050CB]" />
            Live Classroom Headcount Roster
          </h2>
          <span className="text-xs font-bold text-slate-400">Total Accounted: 127 / 128 Students</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {classroomRoster.map((r, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
                r.status.includes("Safe")
                  ? "bg-emerald-50/50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800"
                  : "bg-rose-50 border-rose-300 dark:bg-rose-950/40 dark:border-rose-800"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-[#000E28] dark:text-white">{r.room}</h3>
                  <span className="text-xs text-slate-500 font-bold">({r.teacher})</span>
                </div>
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Headcount: {r.headcount}</p>
                <p className="text-[10px] text-slate-400">Last Ping: {r.updated}</p>
              </div>

              <div className="text-right space-y-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                    r.status.includes("Safe")
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                      : "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300"
                  }`}
                >
                  {r.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
