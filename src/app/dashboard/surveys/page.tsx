"use client";

import React, { useState, useEffect } from "react";
import { 
  FileText, Plus, Eye, CheckCircle2, BarChart2, Share2, Download,
  Users, MessageSquare, Star, ArrowRight, X, Search, Filter, Sparkles,
  Check, ChevronRight, Clock, AlertCircle
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function SurveysPage() {
  const [surveys, setSurveys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<any | null>(null);

  // New survey state
  const [title, setTitle] = useState("");
  const [targetAudience, setTargetAudience] = useState("Parents");
  const [category, setCategory] = useState("Parent Satisfaction");
  const [description, setDescription] = useState("");

  useEffect(() => {
    // Initial sample surveys
    setSurveys([
      {
        id: "SRV-101",
        title: "Q3 Parent Satisfaction & Campus Safety Survey",
        category: "Parent Satisfaction",
        audience: "Parents",
        status: "Active",
        totalResponses: 412,
        targetResponses: 500,
        responseRate: "82%",
        avgScore: 4.8,
        createdAt: "Sep 10, 2026",
        questionsCount: 10,
      },
      {
        id: "SRV-102",
        title: "Annual Teacher Workload & Resource Feedback",
        category: "Staff Feedback",
        audience: "Teachers",
        status: "Active",
        totalResponses: 86,
        targetResponses: 100,
        responseRate: "86%",
        avgScore: 4.6,
        createdAt: "Sep 05, 2026",
        questionsCount: 12,
      },
      {
        id: "SRV-103",
        title: "Student Mental Health & Classroom Support Poll",
        category: "Student Wellness",
        audience: "Students",
        status: "Active",
        totalResponses: 620,
        targetResponses: 750,
        responseRate: "83%",
        avgScore: 4.7,
        createdAt: "Aug 28, 2026",
        questionsCount: 8,
      },
      {
        id: "SRV-104",
        title: "Campus Cafeteria & Transport Service Survey",
        category: "Facilities",
        audience: "Parents & Students",
        status: "Completed",
        totalResponses: 920,
        targetResponses: 920,
        responseRate: "100%",
        avgScore: 4.4,
        createdAt: "Aug 15, 2026",
        questionsCount: 6,
      },
    ]);
    setLoading(false);
  }, []);

  const handleCreateSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newSurvey = {
      id: `SRV-${Date.now().toString().slice(-3)}`,
      title,
      category,
      audience: targetAudience,
      status: "Active",
      totalResponses: 0,
      targetResponses: 250,
      responseRate: "0%",
      avgScore: 5.0,
      createdAt: "Just now",
      questionsCount: 5,
    };

    setSurveys([newSurvey, ...surveys]);
    toast.success("New survey published successfully!");
    setTitle("");
    setDescription("");
    setShowModal(false);
  };

  const handleShare = (surveyTitle: string) => {
    navigator.clipboard.writeText(`https://school.erp/surveys/${encodeURIComponent(surveyTitle)}`);
    toast.success("Survey invitation link copied to clipboard!");
  };

  const filteredSurveys = surveys.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "All" || s.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 font-sans text-[#000E28] dark:text-white pb-16">
      
      {/* BREADCRUMB */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-semibold">
        <Link href="/dashboard" className="hover:text-[#0050CB]">Home</Link>
        <span>&gt;</span>
        <Link href="/dashboard/form-builder" className="hover:text-[#0050CB]">Form Builder & Surveys</Link>
        <span>&gt;</span>
        <span className="text-[#0050CB] dark:text-[#38BDF8] font-bold">Surveys & Polls</span>
      </div>

      {/* HERO BANNER SECTION */}
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-[#000E28] via-[#002772] to-[#0050CB] p-6 sm:p-8 text-white border border-white/15 shadow-md">
        
        {/* Glow ambient background effect */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-[#38BDF8]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#38BDF8] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Feedback Analytics Engine</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              School Surveys & Sentiment Hub
            </h1>

            <p className="text-blue-100/90 text-xs sm:text-sm leading-relaxed max-w-xl">
              Create custom parent feedback surveys, teacher satisfaction forms, and student wellness polls with automated response analytics and sentiment scores.
            </p>

          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#FF690C] hover:bg-[#FF7E2E] text-white text-xs font-bold shadow-lg shadow-[#FF690C]/30 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Survey</span>
          </button>
        </div>

        {/* 4 KPI METRIC CARDS ROW */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-white/15">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
            <p className="text-xs font-bold text-blue-200 uppercase tracking-wider">Active Surveys</p>
            <p className="text-2xl font-black text-white mt-1">12</p>
            <span className="text-[10px] font-bold text-emerald-300">● 3 Closing Soon</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
            <p className="text-xs font-bold text-blue-200 uppercase tracking-wider">Total Responses</p>
            <p className="text-2xl font-black text-white mt-1">2,038</p>
            <span className="text-[10px] font-bold text-[#38BDF8]">↑ 24% MoM</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
            <p className="text-xs font-bold text-blue-200 uppercase tracking-wider">Avg Response Rate</p>
            <p className="text-2xl font-black text-white mt-1">84%</p>
            <span className="text-[10px] font-bold text-emerald-300">High Engagement</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
            <p className="text-xs font-bold text-blue-200 uppercase tracking-wider">Satisfaction Index</p>
            <p className="text-2xl font-black text-white mt-1">4.8 / 5.0</p>
            <span className="text-[10px] font-bold text-amber-300">⭐ Excellent</span>
          </div>
        </div>

      </div>

      {/* FILTER & SEARCH CONTROL BAR */}
      <div className="bg-white dark:bg-[#000E28] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search surveys by title, category, or audience..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium outline-none focus:ring-2 focus:ring-[#0050CB]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {["All", "Parent Satisfaction", "Staff Feedback", "Student Wellness", "Facilities"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                filterCategory === cat
                  ? "bg-[#0050CB] text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* SURVEYS CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSurveys.map((survey) => {
          const progressPercent = Math.round((survey.totalResponses / survey.targetResponses) * 100);

          return (
            <div
              key={survey.id}
              className="bg-white dark:bg-[#000E28] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 hover:border-[#0050CB] transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-[#E5EEFF] dark:bg-[#0050CB]/20 text-[#0050CB] dark:text-[#38BDF8] text-[10px] font-black uppercase tracking-wider">
                    {survey.category}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                      survey.status === "Active"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                        : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {survey.status}
                  </span>
                </div>

                <h3 className="text-sm font-black text-[#000E28] dark:text-white leading-snug">
                  {survey.title}
                </h3>

                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Audience: <strong>{survey.audience}</strong></span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center text-[11px] font-bold">
                    <span className="text-slate-500">{survey.totalResponses} / {survey.targetResponses} Submissions</span>
                    <span className="text-[#0050CB] dark:text-[#38BDF8]">{survey.responseRate}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#0050CB] to-[#38BDF8] rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(progressPercent, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <button
                  onClick={() => setSelectedSurvey(survey)}
                  className="flex items-center gap-1.5 font-bold text-[#0050CB] dark:text-[#38BDF8] hover:underline cursor-pointer"
                >
                  <BarChart2 className="w-3.5 h-3.5" />
                  <span>View Results</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleShare(survey.title)}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#0050CB] cursor-pointer"
                    title="Share Survey Link"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => toast.success("Exporting responses CSV...")}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#0050CB] cursor-pointer"
                    title="Export CSV"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE NEW SURVEY MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#000E28] w-full max-w-md p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-base font-black text-[#000E28] dark:text-white">Create New School Survey</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSurvey} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Survey Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Term 1 Parent Feedback & Campus Transport Poll"
                  required
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-[#0050CB]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                >
                  <option value="Parent Satisfaction">Parent Satisfaction</option>
                  <option value="Staff Feedback">Staff Feedback</option>
                  <option value="Student Wellness">Student Wellness</option>
                  <option value="Facilities">Facilities & Transport</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Target Audience</label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                >
                  <option value="Parents">Parents & Guardians</option>
                  <option value="Teachers">Teachers & Staff</option>
                  <option value="Students">Enrolled Students</option>
                  <option value="All">Entire School Community</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Instructions / Guidance</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly describe the purpose of this feedback survey..."
                  rows={3}
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0050CB] text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Publish Survey
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW SURVEY RESULTS MODAL */}
      {selectedSurvey && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#000E28] w-full max-w-lg p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#E5EEFF] text-[#0050CB] text-[10px] font-black uppercase">
                  {selectedSurvey.category}
                </span>
                <h3 className="text-base font-black text-[#000E28] dark:text-white mt-1">
                  {selectedSurvey.title}
                </h3>
              </div>
              <button onClick={() => setSelectedSurvey(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 py-2 text-xs">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-bold text-slate-400">Total Responses</p>
                  <p className="text-lg font-black text-[#0050CB] dark:text-[#38BDF8] mt-0.5">{selectedSurvey.totalResponses}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-bold text-slate-400">Completion</p>
                  <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{selectedSurvey.responseRate}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-bold text-slate-400">Avg Satisfaction</p>
                  <p className="text-lg font-black text-amber-500 mt-0.5">{selectedSurvey.avgScore} / 5</p>
                </div>
              </div>

              {/* Sample Response breakdown */}
              <div className="space-y-3 pt-2">
                <p className="font-bold text-slate-700 dark:text-slate-300">Question Breakdown Analytics:</p>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 space-y-2">
                  <div className="flex justify-between text-slate-700 dark:text-slate-200 font-semibold">
                    <span>1. Overall campus safety & discipline</span>
                    <span className="font-bold text-emerald-600">92% Positive</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700">
                    <div className="h-full bg-emerald-500 rounded-full w-[92%]" />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 space-y-2">
                  <div className="flex justify-between text-slate-700 dark:text-slate-200 font-semibold">
                    <span>2. Communication quality from school admin</span>
                    <span className="font-bold text-[#0050CB]">88% Satisfied</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700">
                    <div className="h-full bg-[#0050CB] rounded-full w-[88%]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedSurvey(null)}
                className="px-4 py-2 bg-[#0050CB] text-white text-xs font-bold rounded-xl"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
