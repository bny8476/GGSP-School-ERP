"use client";

import React, { useState } from "react";
import { GraduationCap, Award, Star, Upload, CheckCircle2, FileText, Plus, ShieldCheck, Sparkles } from "lucide-react";

export default function GrowthProfilePage() {
  const [selectedTab, setSelectedTab] = useState<"competencies" | "portfolio" | "milestones">("competencies");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("STEM Project");

  const [portfolioItems, setPortfolioItems] = useState([
    {
      id: "P-01",
      title: "Autonomous Robotics Rover Project",
      category: "STEM & Robotics",
      date: "Sep 2026",
      status: "Approved",
      grade: "10-A",
      evaluator: "Dr. Robert Vance",
    },
    {
      id: "P-02",
      title: "Model United Nations Position Paper",
      category: "Leadership & Humanities",
      date: "Aug 2026",
      status: "Under Review",
      grade: "10-A",
      evaluator: "Ms. Elena Rostova",
    },
    {
      id: "P-03",
      title: "Eco-Friendly School Compost Design",
      category: "Environmental Science",
      date: "Jul 2026",
      status: "Approved",
      grade: "10-A",
      evaluator: "Mr. David Miller",
    },
  ]);

  const competencies = [
    { name: "Critical Thinking & Logic", score: 92, level: "Advanced" },
    { name: "STEM & Digital Literacy", score: 88, level: "Advanced" },
    { name: "Leadership & Collaboration", score: 85, level: "Proficient" },
    { name: "Creative Writing & Arts", score: 78, level: "Proficient" },
    { name: "Global Awareness & Ethics", score: 94, level: "Exemplary" },
  ];

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newItem = {
      id: `P-0${portfolioItems.length + 1}`,
      title: newTitle,
      category: newCategory,
      date: "Just now",
      status: "Approved",
      grade: "10-A",
      evaluator: "Self Submitted (Verified)",
    };
    setPortfolioItems([newItem, ...portfolioItems]);
    setNewTitle("");
    setShowUploadModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#000E28] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-[#0050CB] dark:text-[#38BDF8] font-bold text-xs uppercase tracking-wider mb-1">
            <GraduationCap className="h-4 w-4" />
            <span>Holistic Growth & Portfolio Engine</span>
          </div>
          <h1 className="text-2xl font-black text-[#000E28] dark:text-white tracking-tight">
            Student Growth Profile & Competency Map
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track student skill progressions beyond traditional GPA: STEM, leadership, creative arts, ethics, and verified portfolio projects.
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0050CB] text-white hover:bg-[#003da3] font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md"
        >
          <Plus className="h-4 w-4" />
          <span>Add Portfolio Artifact</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setSelectedTab("competencies")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            selectedTab === "competencies"
              ? "bg-[#0050CB] text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Core Competencies & Radar
        </button>
        <button
          onClick={() => setSelectedTab("portfolio")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            selectedTab === "portfolio"
              ? "bg-[#0050CB] text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Verified Student Portfolio
        </button>
        <button
          onClick={() => setSelectedTab("milestones")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            selectedTab === "milestones"
              ? "bg-[#0050CB] text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Extracurricular Milestones
        </button>
      </div>

      {/* Competencies Tab */}
      {selectedTab === "competencies" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-[#000E28] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <h2 className="text-sm font-black text-[#000E28] dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Star className="h-4 w-4 text-[#FF690C]" />
              Skill & Competency Breakdown
            </h2>

            <div className="space-y-4">
              {competencies.map((c, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-[#000E28] dark:text-white">{c.name}</span>
                    <span className="text-[#0050CB] dark:text-[#38BDF8]">
                      {c.score}% ({c.level})
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#0050CB] to-[#38BDF8] h-full rounded-full transition-all duration-500"
                      style={{ width: `${c.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#0050CB] to-[#000E28] text-white p-6 rounded-2xl shadow-md space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#FF690C]" />
              <h3 className="text-sm font-black uppercase tracking-wider">AI Growth Assessment</h3>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              Student displays top percentile logic and global awareness skills. Recommended for Advanced Robotics & MUN Leadership tracks.
            </p>
            <div className="p-3 bg-white/10 rounded-xl text-[11px] space-y-1">
              <div className="font-bold text-white">Next Goal:</div>
              <div className="text-slate-300">Complete Creative Writing Module to achieve 85%+ all-round balance.</div>
            </div>
          </div>
        </div>
      )}

      {/* Portfolio Tab */}
      {selectedTab === "portfolio" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {portfolioItems.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#000E28] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3 hover:border-[#0050CB] transition-all"
            >
              <div className="flex justify-between items-start">
                <span className="px-2.5 py-0.5 rounded-full bg-[#E5EEFF] text-[#0050CB] text-[10px] font-black uppercase">
                  {item.category}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    item.status === "Approved"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-[#000E28] dark:text-white leading-snug">{item.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Evaluated by: {item.evaluator}</p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[11px] text-slate-400 font-semibold">
                <span>Date: {item.date}</span>
                <span className="text-[#0050CB] dark:text-[#38BDF8] cursor-pointer hover:underline">View Artifact →</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Milestones Tab */}
      {selectedTab === "milestones" && (
        <div className="bg-white dark:bg-[#000E28] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-sm font-black text-[#000E28] dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Award className="h-4 w-4 text-[#0050CB]" />
            Verified Student Milestones
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold shrink-0">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#000E28] dark:text-white">1st Place - Inter-School Robotics Olympiad</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Awarded by International STEM Federation • Aug 2026</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#000E28] dark:text-white">Certified Peer Tutor - Mathematics</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Verified by High School Academic Board • May 2026</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Artifact Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#000E28] w-full max-w-md p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h2 className="text-base font-black text-[#000E28] dark:text-white">Add Portfolio Artifact</h2>
            <form onSubmit={handleAddItem} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Artifact Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Science Fair Research Paper"
                  required
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#0050CB]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#0050CB]"
                >
                  <option value="STEM & Robotics">STEM & Robotics</option>
                  <option value="Leadership & Humanities">Leadership & Humanities</option>
                  <option value="Environmental Science">Environmental Science</option>
                  <option value="Creative Arts & Design">Creative Arts & Design</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0050CB] text-white hover:bg-[#003da3] text-xs font-bold rounded-xl"
                >
                  Save Artifact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
