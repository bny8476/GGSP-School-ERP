"use client";

import React, { useState } from "react";
import { FileText, Sparkles, Printer, Download, RefreshCw, CheckCircle2, Sliders, Layers } from "lucide-react";

export default function PaperGeneratorPage() {
  const [subject, setSubject] = useState("Mathematics");
  const [grade, setGrade] = useState("10");
  const [totalMarks, setTotalMarks] = useState("100");
  const [difficulty, setDifficulty] = useState("Balanced");
  const [loading, setLoading] = useState(false);
  const [paper, setPaper] = useState<any>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/nextgen/question-paper", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subject, grade, totalMarks, difficulty }),
      });

      if (res.ok) {
        const data = await res.json();
        setPaper(data.paper);
      } else {
        // Fallback generator preview
        setPaper({
          title: `Mid-Term Examination 2026-27 - ${subject} Grade ${grade}`,
          duration: "3 Hours",
          marks: totalMarks,
          sections: [
            {
              name: "Section A: Multiple Choice Questions (20 Marks)",
              questions: [
                "1. If x² - 5x + 6 = 0, find the roots of the quadratic equation. (2 Marks)",
                "2. What is the value of sin(90°) + cos(0°)? (2 Marks)",
                "3. Determine the slope of the line passing through (2, 3) and (4, 7). (2 Marks)",
              ],
            },
            {
              name: "Section B: Short Answer Analytical Problems (30 Marks)",
              questions: [
                "4. Prove that √2 is an irrational number using proof by contradiction. (5 Marks)",
                "5. Solve the system of linear equations: 2x + 3y = 12 and 4x - y = 10. (5 Marks)",
              ],
            },
            {
              name: "Section C: Advanced Application & Case Study (50 Marks)",
              questions: [
                "6. A lighthouse operator measures the angle of depression of two ships anchored in a straight line as 30° and 45°. If the height of the lighthouse is 100m, calculate the distance between the ships. (10 Marks)",
              ],
            },
          ],
        });
      }
    } catch (err) {
      console.error(err);
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
            <FileText className="h-4 w-4" />
            <span>AI Automated Assessment Suite</span>
          </div>
          <h1 className="text-2xl font-black text-[#000E28] dark:text-white tracking-tight">
            Question Paper Generator & Blueprint Engine
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate balanced, randomized exam question papers mapped to Bloom's taxonomy, course difficulty sliders, and curriculum standards.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Config Panel */}
        <div className="lg:col-span-1 bg-white dark:bg-[#000E28] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-sm font-black text-[#000E28] dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Sliders className="h-4 w-4 text-[#0050CB]" />
            Paper Configuration
          </h2>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#0050CB]"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="English Literature">English Literature</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Grade Level</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                >
                  <option value="9">Grade 9</option>
                  <option value="10">Grade 10</option>
                  <option value="11">Grade 11</option>
                  <option value="12">Grade 12</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Total Marks</label>
                <select
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                >
                  <option value="50">50 Marks</option>
                  <option value="75">75 Marks</option>
                  <option value="100">100 Marks</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Difficulty Curve</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              >
                <option value="Easy">Easy (Focus on Foundations)</option>
                <option value="Balanced">Balanced (30% Easy, 50% Med, 20% Hard)</option>
                <option value="Expert">Expert Olympiad (High Difficulty)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#0050CB] hover:bg-[#003da3] disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Sparkles className="h-4 w-4" />
              <span>{loading ? "Generating Questions..." : "Generate Question Paper"}</span>
            </button>
          </form>
        </div>

        {/* Right Preview Box */}
        <div className="lg:col-span-2 bg-white dark:bg-[#000E28] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-[#000E28] dark:text-white uppercase tracking-wider">
              Generated Paper Preview
            </h2>
            {paper && (
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-[#E5EEFF] text-[#0050CB] text-xs font-bold rounded-lg flex items-center gap-1.5 hover:bg-[#0050CB] hover:text-white transition-all cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print Paper</span>
                </button>
                <button className="px-3 py-1.5 bg-[#0050CB] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer">
                  <Download className="h-3.5 w-3.5" />
                  <span>Export PDF</span>
                </button>
              </div>
            )}
          </div>

          {!paper ? (
            <div className="py-20 text-center text-slate-400 space-y-2">
              <FileText className="h-10 w-10 mx-auto opacity-40 text-[#0050CB]" />
              <p className="text-xs font-bold">Configure parameters on the left and click "Generate Question Paper".</p>
            </div>
          ) : (
            <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-6 font-serif">
              {/* Header */}
              <div className="text-center border-b border-slate-200 dark:border-slate-800 pb-4 space-y-1">
                <h3 className="text-lg font-black uppercase text-[#000E28] dark:text-white">{paper.title}</h3>
                <div className="flex justify-between text-xs font-sans font-bold text-slate-500 pt-2 px-4">
                  <span>Time Allowed: {paper.duration}</span>
                  <span>Maximum Marks: {paper.marks}</span>
                </div>
              </div>

              {/* Question Sections */}
              {paper.sections.map((sec: any, idx: number) => (
                <div key={idx} className="space-y-3 font-sans">
                  <h4 className="text-xs font-black uppercase text-[#0050CB] dark:text-[#38BDF8] border-b border-slate-200 dark:border-slate-800 pb-1">
                    {sec.name}
                  </h4>
                  <div className="space-y-2 text-xs text-slate-700 dark:text-slate-200">
                    {sec.questions.map((q: string, qIdx: number) => (
                      <p key={qIdx} className="leading-relaxed">
                        {q}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
