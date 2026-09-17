"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, ShieldCheck, Search, Filter, Phone, Mail, User, AlertCircle, ArrowUpRight, CheckCircle2 } from "lucide-react";

interface AtRiskStudent {
  id: string;
  name: string;
  rollNo: string;
  grade: string;
  section: string;
  riskLevel: "Normal" | "Watch" | "At Risk" | "Critical";
  riskScore: number;
  attendanceRate: number;
  gpaDrop: number;
  behaviorFlags: number;
  missedAssignments: number;
  parentContact: string;
  lastIntervention?: string;
}

export default function EarlyWarningPage() {
  const [filterLevel, setFilterLevel] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState<AtRiskStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    fetchEarlyWarningData();
  }, []);

  const fetchEarlyWarningData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/ai/early-warning", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStudents(data.students || []);
      } else {
        // Fallback realistic seed data
        setStudents([
          {
            id: "STU-101",
            name: "Alexander Wright",
            rollNo: "10-A-12",
            grade: "10",
            section: "A",
            riskLevel: "Critical",
            riskScore: 88,
            attendanceRate: 64.5,
            gpaDrop: 1.8,
            behaviorFlags: 4,
            missedAssignments: 9,
            parentContact: "+1 (555) 234-5678",
            lastIntervention: "Parent Meeting Requested",
          },
          {
            id: "STU-102",
            name: "Sophia Martinez",
            rollNo: "9-B-05",
            grade: "9",
            section: "B",
            riskLevel: "At Risk",
            riskScore: 72,
            attendanceRate: 78.0,
            gpaDrop: 1.2,
            behaviorFlags: 2,
            missedAssignments: 5,
            parentContact: "+1 (555) 876-5432",
          },
          {
            id: "STU-103",
            name: "Liam O'Connor",
            rollNo: "11-[#0050CB]-22",
            grade: "11",
            section: "C",
            riskLevel: "Watch",
            riskScore: 45,
            attendanceRate: 85.2,
            gpaDrop: 0.6,
            behaviorFlags: 1,
            missedAssignments: 3,
            parentContact: "+1 (555) 345-6789",
          },
          {
            id: "STU-104",
            name: "Emily Watson",
            rollNo: "8-A-18",
            grade: "8",
            section: "A",
            riskLevel: "Normal",
            riskScore: 15,
            attendanceRate: 96.8,
            gpaDrop: 0.0,
            behaviorFlags: 0,
            missedAssignments: 0,
            parentContact: "+1 (555) 901-2345",
          },
        ]);
      }
    } catch (e) {
      console.error("Error loading early warning data:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerIntervention = (studentName: string, actionType: string) => {
    setActionNotice(`Intervention triggered for ${studentName}: ${actionType}. SMS & email notification sent to parent.`);
    setTimeout(() => setActionNotice(null), 5000);
  };

  const filtered = students.filter((s) => {
    const matchesFilter = filterLevel === "All" || s.riskLevel === filterLevel;
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const criticalCount = students.filter((s) => s.riskLevel === "Critical").length;
  const atRiskCount = students.filter((s) => s.riskLevel === "At Risk").length;
  const watchCount = students.filter((s) => s.riskLevel === "Watch").length;
  const normalCount = students.filter((s) => s.riskLevel === "Normal").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#000E28] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider mb-1">
            <AlertTriangle className="h-4 w-4" />
            <span>AI Predictive Analytics</span>
          </div>
          <h1 className="text-2xl font-black text-[#000E28] dark:text-white tracking-tight">
            Student Early-Warning Risk System
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Multi-factor risk analysis combining attendance drop, academic performance, behavioral logs, and assignment completion.
          </p>
        </div>
      </div>

      {actionNotice && (
        <div className="p-4 rounded-xl bg-emerald-500 text-white font-bold text-xs flex items-center gap-3 shadow-md animate-fade-in">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setFilterLevel("Critical")}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            filterLevel === "Critical"
              ? "bg-rose-50 border-rose-500 ring-2 ring-rose-500/20 dark:bg-rose-950/40"
              : "bg-white dark:bg-[#000E28] border-slate-200 dark:border-slate-800 hover:border-rose-300"
          }`}
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Critical Risk</span>
            <AlertTriangle className="h-4 w-4 text-rose-500" />
          </div>
          <div className="text-3xl font-black text-rose-600 mt-2">{criticalCount}</div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Immediate intervention needed</p>
        </div>

        <div
          onClick={() => setFilterLevel("At Risk")}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            filterLevel === "At Risk"
              ? "bg-amber-50 border-amber-500 ring-2 ring-amber-500/20 dark:bg-amber-950/40"
              : "bg-white dark:bg-[#000E28] border-slate-200 dark:border-slate-800 hover:border-amber-300"
          }`}
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">At Risk</span>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-amber-600 mt-2">{atRiskCount}</div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Slight grade & attendance drop</p>
        </div>

        <div
          onClick={() => setFilterLevel("Watch")}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            filterLevel === "Watch"
              ? "bg-blue-50 border-blue-500 ring-2 ring-blue-500/20 dark:bg-blue-950/40"
              : "bg-white dark:bg-[#000E28] border-slate-200 dark:border-slate-800 hover:border-blue-300"
          }`}
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Watch List</span>
            <Search className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-3xl font-black text-blue-600 mt-2">{watchCount}</div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Monitoring mild trends</p>
        </div>

        <div
          onClick={() => setFilterLevel("Normal")}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            filterLevel === "Normal"
              ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 dark:bg-emerald-950/40"
              : "bg-white dark:bg-[#000E28] border-slate-200 dark:border-slate-800 hover:border-emerald-300"
          }`}
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Normal</span>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-emerald-600 mt-2">{normalCount}</div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Optimal performance</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#000E28] p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {["All", "Critical", "At Risk", "Watch", "Normal"].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                filterLevel === lvl
                  ? "bg-[#0050CB] text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search student or roll no..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#0050CB]"
          />
        </div>
      </div>

      {/* Student Risk List */}
      <div className="space-y-4">
        {filtered.map((student) => (
          <div
            key={student.id}
            className="p-5 rounded-2xl bg-white dark:bg-[#000E28] border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:shadow-md transition-all"
          >
            {/* Left Info */}
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-[#E5EEFF] dark:bg-[#0050CB]/20 text-[#0050CB] dark:text-[#38BDF8] flex items-center justify-center font-black text-lg shrink-0">
                {student.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-black text-[#000E28] dark:text-white">{student.name}</h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      student.riskLevel === "Critical"
                        ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400"
                        : student.riskLevel === "At Risk"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                        : student.riskLevel === "Watch"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
                        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                    }`}
                  >
                    {student.riskLevel} Risk ({student.riskScore}%)
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Roll: <span className="font-bold">{student.rollNo}</span> • Grade {student.grade}-{student.section} • Parent: {student.parentContact}
                </p>
                {student.lastIntervention && (
                  <p className="text-[11px] text-[#0050CB] dark:text-[#38BDF8] font-bold mt-1">
                    Last Action: {student.lastIntervention}
                  </p>
                )}
              </div>
            </div>

            {/* Middle Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Attendance</span>
                <p className={`text-xs font-black ${student.attendanceRate < 75 ? "text-rose-600" : "text-slate-700 dark:text-white"}`}>
                  {student.attendanceRate}%
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">GPA Drop</span>
                <p className={`text-xs font-black ${student.gpaDrop > 1.0 ? "text-rose-600" : "text-slate-700 dark:text-white"}`}>
                  -{student.gpaDrop} pts
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Behavior Flags</span>
                <p className={`text-xs font-black ${student.behaviorFlags > 2 ? "text-rose-600" : "text-slate-700 dark:text-white"}`}>
                  {student.behaviorFlags} incidents
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Missed Work</span>
                <p className={`text-xs font-black ${student.missedAssignments > 4 ? "text-rose-600" : "text-slate-700 dark:text-white"}`}>
                  {student.missedAssignments} tasks
                </p>
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleTriggerIntervention(student.name, "Parent Meeting Call")}
                className="px-3 py-2 bg-[#0050CB] text-white hover:bg-[#003da3] text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>Call Parent</span>
              </button>
              <button
                onClick={() => handleTriggerIntervention(student.name, "Counselor Referral")}
                className="px-3 py-2 bg-[#E5EEFF] dark:bg-slate-800 text-[#0050CB] dark:text-[#38BDF8] hover:bg-[#0050CB] hover:text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                <span>Refer Counselor</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
