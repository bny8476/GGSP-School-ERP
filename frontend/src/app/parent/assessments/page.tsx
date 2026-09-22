"use client";

import React, { useState, useEffect } from "react";
import { Award, Calendar, CheckCircle2, FileText, Download, Sparkles, Printer } from "lucide-react";
import SpotlightCard from "@/components/teacher/SpotlightCard";
import ReportCardModal from "@/components/parent/ReportCardModal";
import { useParent } from "@/context/ParentContext";
import toast from "react-hot-toast";

export default function ParentAssessmentsPage() {
  const { selectedChild } = useParent();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [assessments, setAssessments] = useState<any[]>([]);

  const child = selectedChild || {
    _id: "c-01",
    firstName: "Aarav",
    lastName: "Sharma",
    grade: "LKG",
    section: "Section A",
  };

  useEffect(() => {
    async function fetchAssessments() {
      try {
        const token = localStorage.getItem("token");
        const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
        const res = await fetch(`${apiBase}/api/v1/assessments`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setAssessments(data);
          }
        }
      } catch (_) {}
    }
    fetchAssessments();
  }, [child._id]);

  const assessmentTerms = [
    {
      term: "Term 1 Comprehensive Evaluation (Current)",
      status: "Finalized & Published",
      date: "15 September 2026",
      evaluator: "Ms. Ananya Roy",
      summary: "Exceptional engagement across Early Literacy and Mathematical Logic. Demonstrates eager participation in group activities.",
      rubrics: [
        { category: "Language & Phonics", skill: "Letter Sound Blends", status: "Achieved" },
        { category: "Language & Phonics", skill: "Listening Comprehension", status: "Achieved" },
        { category: "Numeracy", skill: "Counting 1–50", status: "Achieved" },
        { category: "Numeracy", skill: "2D Geometric Shapes", status: "Progressing" },
        { category: "Motor Development", skill: "Pencil & Scissor Grip", status: "Achieved" },
        { category: "Social-Emotional", skill: "Cooperative Peer Play", status: "Progressing" },
      ]
    },
    {
      term: "Term 2 Mid-Year Milestone Review",
      status: "Scheduled",
      date: "18 December 2026",
      evaluator: "Ms. Ananya Roy",
      summary: "Upcoming evaluation covering phonics blends, subtraction concepts, and science observation projects.",
      rubrics: []
    }
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-[22px] bg-white dark:bg-[#07142F] border border-[#E7EAF0] dark:border-white/10 shadow-sm">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#3157D5]">
            Formative & Summative Evaluations
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#07142F] dark:text-white">
            Assessments & Report Card: {child.firstName} {child.lastName}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Teacher rubrics, developmental standards, and official certified report cards at GGPS.
          </p>
        </div>

        <button
          onClick={() => setIsReportModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#3157D5] hover:bg-[#2444B5] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shrink-0"
        >
          <FileText className="w-4 h-4" />
          View Report Card
        </button>
      </div>

      {/* Terms & Rubrics List */}
      <div className="space-y-6">
        {assessmentTerms.map((evalItem, idx) => (
          <SpotlightCard key={idx} className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-[#07142F] dark:text-white">
                    {evalItem.term}
                  </h2>
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                    evalItem.status.includes("Finalized")
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                      : "bg-blue-100 text-[#3157D5] dark:bg-blue-950/60 dark:text-blue-300"
                  }`}>
                    {evalItem.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Evaluated on {evalItem.date} by {evalItem.evaluator}
                </p>
              </div>

              {evalItem.rubrics.length > 0 && (
                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-bold text-[#3157D5] dark:text-blue-300 flex items-center gap-1.5 transition-colors self-start sm:self-center"
                >
                  <Download className="w-3.5 h-3.5" /> Download PDF Record
                </button>
              )}
            </div>

            {/* Teacher Remarks Box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Lead Teacher Assessment Remarks
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                &ldquo;{evalItem.summary}&rdquo;
              </p>
            </div>

            {/* Rubrics Grid */}
            {evalItem.rubrics.length > 0 ? (
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Evaluated Competencies & Standards
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {evalItem.rubrics.map((r, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/60 flex items-center justify-between gap-3"
                    >
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#0050CB]">
                          {r.category}
                        </span>
                        <p className="text-xs font-bold text-[#000E28] dark:text-white mt-0.5">
                          {r.skill}
                        </p>
                      </div>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                        r.status === "Achieved"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : "bg-blue-100 text-[#0050CB] dark:bg-blue-950/60 dark:text-blue-300"
                      }`}>
                        {r.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">
                Rubric parameters and test schedules will unlock 2 weeks prior to Term 2 commencement.
              </div>
            )}
          </SpotlightCard>
        ))}
      </div>

      <ReportCardModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        child={child}
      />
    </div>
  );
}
