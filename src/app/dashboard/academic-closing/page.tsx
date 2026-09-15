"use client";

import React, { useState } from "react";
import { Calendar, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Lock, Play, RefreshCw } from "lucide-react";

export default function AcademicClosingPage() {
  const [selectedYear, setSelectedYear] = useState("2026-2027");
  const [isClosing, setIsClosing] = useState(false);
  const [closedSuccess, setClosedSuccess] = useState(false);

  const checklist = [
    { title: "Pending Fee Ledger Cleared", status: "Validated", desc: "98.4% fee collection target achieved.", ok: true },
    { title: "Final Exam Marks & Transcripts Published", status: "Validated", desc: "All 10th & 12th grade report cards signed.", ok: true },
    { title: "Library Resource Returns Completed", status: "Validated", desc: "Zero outstanding unreturned books.", ok: true },
    { title: "Hostel & Transport De-allocation", status: "Validated", desc: "All room allocations ready for rollover.", ok: true },
    { title: "Student Batch Promotion Prepared", status: "Ready", desc: "Grade 9 -> Grade 10 promotion rules active.", ok: true },
  ];

  const handleExecuteClosing = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setClosedSuccess(true);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#000E28] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-[#0050CB] dark:text-[#38BDF8] font-bold text-xs uppercase tracking-wider mb-1">
            <Calendar className="h-4 w-4" />
            <span>Multi-Academic-Year Lifecycle Engine</span>
          </div>
          <h1 className="text-2xl font-black text-[#000E28] dark:text-white tracking-tight">
            Academic Year Closing & Student Promotion Workflow
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Validate pending ledger fees, exam results, library loans, and execute automated student promotion and historic archiving.
          </p>
        </div>
      </div>

      {closedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500 text-white font-bold text-xs flex items-center gap-3 shadow-md">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>Academic Year 2026-2027 officially closed and archived! All students promoted to the next academic grade.</span>
        </div>
      )}

      {/* Main Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-[#000E28] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-[#000E28] dark:text-white uppercase tracking-wider">
              Pre-Closing Readiness Checklist
            </h2>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 text-xs font-bold">
              5/5 Requirements Met
            </span>
          </div>

          <div className="space-y-3">
            {checklist.map((item, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-bold text-[#000E28] dark:text-white">{item.title}</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.desc}</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase shrink-0">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Panel */}
        <div className="bg-white dark:bg-[#000E28] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-sm font-black text-[#000E28] dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Lock className="h-4 w-4 text-[#0050CB]" />
            Execute Year Close
          </h2>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Active Academic Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              >
                <option value="2026-2027">2026-2027 (Current Active)</option>
                <option value="2025-2026">2025-2026 (Archived)</option>
              </select>
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs space-y-1">
              <span className="font-bold text-amber-800 dark:text-amber-400">Irreversible Action:</span>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                Closing an academic year locks all historical exam scores and financial ledgers against unauthorized edits.
              </p>
            </div>

            <button
              onClick={handleExecuteClosing}
              disabled={isClosing || closedSuccess}
              className="w-full py-3 bg-[#0050CB] hover:bg-[#003da3] disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md mt-2"
            >
              <Play className="h-4 w-4" />
              <span>{isClosing ? "Closing Year..." : "Execute Close & Promote Students"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
