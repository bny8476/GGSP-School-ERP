"use client";

import React, { useState } from "react";
import { ShieldCheck, AlertTriangle, Plus, CheckCircle2, UserCheck } from "lucide-react";
import EmergencyBanner from "@/components/ui/EmergencyBanner";

export default function DisciplinePage() {
  const [incidents, setIncidents] = useState([
    { id: 1, student: "Sammy Student (SEED-001)", category: "Behavioral", severity: "Medium", date: "Sep 12, 2026", description: "Disrupted classroom instruction during Math period.", action: "Counseling session scheduled with Vice Principal.", parentNotified: true, status: "Under Investigation" },
    { id: 2, student: "Alex Johnson (GR-1002)", category: "Attendance", severity: "Low", date: "Sep 10, 2026", description: "Unexcused absence for 3 consecutive morning assemblies.", action: "Written warning issued to parent.", parentNotified: true, status: "Resolved" },
  ]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <EmergencyBanner />

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-[#000E28] dark:text-white flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-[#0050CB] dark:text-[#38BDF8]" />
            Student Discipline & Counseling Case Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm font-medium">
            Record behavioral incidents, track disciplinary actions, notify parents, and log counseling cases.
          </p>
        </div>

        <button className="px-5 py-2.5 bg-[#0050CB] hover:bg-[#0041A8] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>Log New Incident</span>
        </button>
      </div>

      {/* Incidents Table Container */}
      <div className="bg-white dark:bg-[#000E28] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Recorded Discipline Cases</h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {incidents.map((inc) => (
            <div key={inc.id} className="py-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className={`w-4 h-4 ${inc.severity === 'Medium' ? 'text-amber-500' : 'text-slate-400'}`} />
                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">{inc.student}</h4>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {inc.category}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-400">{inc.date}</span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 font-normal leading-relaxed">{inc.description}</p>

              <div className="pt-2 flex items-center justify-between text-[11px] font-semibold">
                <span className="text-[#0050CB] dark:text-[#38BDF8]">Action: <strong>{inc.action}</strong></span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                  inc.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
                }`}>
                  {inc.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
