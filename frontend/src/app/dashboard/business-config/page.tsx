"use client";

import React, { useState, useEffect } from "react";
import { Sliders, Save, CheckCircle2, ShieldCheck, Clock, BookOpen, DollarSign } from "lucide-react";

export default function BusinessConfigPage() {
  const [attendanceThreshold, setAttendanceThreshold] = useState(75);
  const [lateThresholdMinutes, setLateThresholdMinutes] = useState(15);
  const [passingMarksPercentage, setPassingMarksPercentage] = useState(40);
  const [libraryFinePerDay, setLibraryFinePerDay] = useState(2.0);
  const [leaveLimitPerYear, setLeaveLimitPerYear] = useState(12);
  const [savedNotice, setSavedNotice] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchConfig = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/enterprise/business-config", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.config) {
          setAttendanceThreshold(data.config.attendanceThreshold || 75);
          setLateThresholdMinutes(data.config.lateThresholdMinutes || 15);
          setPassingMarksPercentage(data.config.passingMarksPercentage || 40);
          setLibraryFinePerDay(data.config.libraryFinePerDay || 2.0);
          setLeaveLimitPerYear(data.config.leaveLimitPerYear || 12);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await fetch("/api/enterprise/business-config", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          attendanceThreshold,
          lateThresholdMinutes,
          passingMarksPercentage,
          libraryFinePerDay,
          leaveLimitPerYear,
        }),
      });
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#000E28] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-[#0050CB] dark:text-[#38BDF8] font-bold text-xs uppercase tracking-wider mb-1">
            <Sliders className="h-4 w-4" />
            <span>Central Business Logic Engine</span>
          </div>
          <h1 className="text-2xl font-black text-[#000E28] dark:text-white tracking-tight">
            Business Rules & Configuration Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure attendance thresholds, exam pass benchmarks, library fines, and staff leave policies without modifying source code.
          </p>
        </div>
      </div>

      {savedNotice && (
        <div className="p-4 rounded-xl bg-emerald-500 text-white font-bold text-xs flex items-center gap-3 shadow-md">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>Business configuration updated and synchronized across all active portals!</span>
        </div>
      )}

      {/* Form Grid */}
      <form onSubmit={handleSave} className="bg-white dark:bg-[#000E28] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Attendance Threshold */}
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#000E28] dark:text-white">Minimum Attendance Threshold</label>
              <span className="text-xs font-black text-[#0050CB] dark:text-[#38BDF8]">{attendanceThreshold}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              value={attendanceThreshold}
              onChange={(e) => setAttendanceThreshold(Number(e.target.value))}
              className="w-full accent-[#0050CB]"
            />
            <p className="text-[11px] text-slate-500">Students falling below this threshold are flagged in the Early Warning Risk System.</p>
          </div>

          {/* Late Arrival Threshold */}
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#000E28] dark:text-white">Late Arrival Grace Period (Minutes)</label>
              <span className="text-xs font-black text-[#0050CB] dark:text-[#38BDF8]">{lateThresholdMinutes} Mins</span>
            </div>
            <input
              type="number"
              min="1"
              max="60"
              value={lateThresholdMinutes}
              onChange={(e) => setLateThresholdMinutes(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
            />
            <p className="text-[11px] text-slate-500">Arrivals after this window are automatically marked as Late in attendance logs.</p>
          </div>

          {/* Passing Marks Percentage */}
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#000E28] dark:text-white">Exam Passing Benchmark (%)</label>
              <span className="text-xs font-black text-[#0050CB] dark:text-[#38BDF8]">{passingMarksPercentage}%</span>
            </div>
            <input
              type="number"
              min="30"
              max="75"
              value={passingMarksPercentage}
              onChange={(e) => setPassingMarksPercentage(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
            />
            <p className="text-[11px] text-slate-500">Minimum grade benchmark required for course completion credit.</p>
          </div>

          {/* Library Fine Per Day */}
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#000E28] dark:text-white">Overdue Library Book Fine ($/Day)</label>
              <span className="text-xs font-black text-[#0050CB] dark:text-[#38BDF8]">${libraryFinePerDay.toFixed(2)}</span>
            </div>
            <input
              type="number"
              step="0.5"
              min="0"
              max="10"
              value={libraryFinePerDay}
              onChange={(e) => setLibraryFinePerDay(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
            />
            <p className="text-[11px] text-slate-500">Daily fine added to student fee ledger for late book returns.</p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-[#0050CB] hover:bg-[#003da3] text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <Save className="h-4 w-4" />
            <span>{loading ? "Saving..." : "Save Business Rules"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
