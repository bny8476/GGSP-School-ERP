"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Sparkles, Plus, CheckCircle2, Clock, FileText, Send, Calendar } from "lucide-react";

export default function LessonPlannerPage() {
  const [subject, setSubject] = useState("Mathematics Grade 10");
  const [topic, setTopic] = useState("");
  const [objectives, setObjectives] = useState("");
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/nextgen/lesson-plans", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPlans(data.plans || []);
      } else {
        // Fallback seed plans
        setPlans([
          {
            id: "LP-101",
            subject: "Mathematics Grade 10",
            topic: "Quadratic Functions & Parabolic Graphs",
            objectives: "Understand vertex form, calculate roots using quadratic formula, and solve word problems.",
            status: "Approved",
            date: "Sep 18, 2026",
            teacher: "Dr. Robert Vance",
          },
          {
            id: "LP-102",
            subject: "Physics Grade 11",
            topic: "Newton's Laws of Motion & Friction Forces",
            objectives: "Conduct incline plane experiment and calculate static vs kinetic friction coefficients.",
            status: "Approved",
            date: "Sep 20, 2026",
            teacher: "Dr. Robert Vance",
          },
          {
            id: "LP-103",
            subject: "Chemistry Grade 9",
            topic: "Stoichiometry & Molar Mass Calculations",
            objectives: "Balance chemical equations and compute reactant/product stoichiometry ratios.",
            status: "Pending Review",
            date: "Sep 22, 2026",
            teacher: "Dr. Robert Vance",
          },
        ]);
      }
    } catch (e) {
      console.error("Error loading lesson plans:", e);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/nextgen/lesson-plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subject, topic, objectives }),
      });

      if (res.ok) {
        const data = await res.json();
        setPlans([data.plan, ...plans]);
      } else {
        const newPlan = {
          id: `LP-${Date.now()}`,
          subject,
          topic,
          objectives: objectives || "AI Drafted: Cover core formulas, interactive problem sets, and exit tickets.",
          status: "Pending Review",
          date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          teacher: "Active Staff",
        };
        setPlans([newPlan, ...plans]);
      }
      setTopic("");
      setObjectives("");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAIDraft = () => {
    if (!topic.trim()) setTopic("Trigonometric Ratios & Real-World Heights");
    setObjectives(
      "1. Define Sine, Cosine, and Tangent for right triangles.\n2. Apply clinometer measurements to calculate flagpole height.\n3. Complete 5-question digital exit ticket."
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#000E28] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-[#0050CB] dark:text-[#38BDF8] font-bold text-xs uppercase tracking-wider mb-1">
            <BookOpen className="h-4 w-4" />
            <span>AI-Assisted Syllabus & Pedagogy</span>
          </div>
          <h1 className="text-2xl font-black text-[#000E28] dark:text-white tracking-tight">
            Teacher Lesson Planner & Curriculum Progress
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Design structured lesson plans, align learning outcomes with state/IB standards, and generate AI-powered teaching outlines.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form: Plan Generator */}
        <div className="lg:col-span-1 bg-white dark:bg-[#000E28] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-[#000E28] dark:text-white uppercase tracking-wider">Create New Lesson Plan</h2>
            <button
              type="button"
              onClick={handleAIDraft}
              className="flex items-center gap-1.5 text-[11px] font-bold text-[#0050CB] dark:text-[#38BDF8] hover:underline cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI Auto-Draft</span>
            </button>
          </div>

          <form onSubmit={handleCreatePlan} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Subject / Class</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#0050CB]"
              >
                <option value="Mathematics Grade 10">Mathematics Grade 10</option>
                <option value="Physics Grade 11">Physics Grade 11</option>
                <option value="Chemistry Grade 9">Chemistry Grade 9</option>
                <option value="Computer Science Grade 12">Computer Science Grade 12</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Topic Title</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Quadratic Equations & Parabolas"
                required
                className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#0050CB]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Learning Objectives & Outcome</label>
              <textarea
                value={objectives}
                onChange={(e) => setObjectives(e.target.value)}
                rows={4}
                placeholder="State clear, measurable student outcomes..."
                className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#0050CB]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#0050CB] hover:bg-[#003da3] disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Plus className="h-4 w-4" />
              <span>Submit Lesson Plan for Approval</span>
            </button>
          </form>
        </div>

        {/* Right List: Submitted & Approved Plans */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-[#000E28] dark:text-white uppercase tracking-wider">
              Syllabus Plans Roster ({plans.length})
            </h2>
          </div>

          <div className="space-y-3">
            {plans.map((p) => (
              <div
                key={p.id}
                className="p-5 rounded-2xl bg-white dark:bg-[#000E28] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3 hover:border-[#0050CB] transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E5EEFF] text-[#0050CB] text-[10px] font-black uppercase">
                      {p.subject}
                    </span>
                    <h3 className="text-base font-bold text-[#000E28] dark:text-white mt-1">{p.topic}</h3>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase ${
                      p.status === "Approved"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {p.objectives}
                </p>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[11px] text-slate-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Target Date: {p.date}
                  </span>
                  <span>Teacher: {p.teacher}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
