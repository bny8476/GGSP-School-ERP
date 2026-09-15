"use client";

import React, { useState } from "react";
import { Megaphone, Users, CheckCircle2, Play, Plus, RefreshCw, BarChart2, Radio, Edit3, Image as ImageIcon, Sparkles } from "lucide-react";

export default function DigitalBoardPage() {
  const [activeTab, setActiveTab] = useState<"whiteboard" | "polls">("polls");
  const [pollQuestion, setPollQuestion] = useState("What is the slope of the equation y = 4x + 7?");
  const [pollOptions, setPollOptions] = useState(["4", "7", "4/7", "-4"]);
  const [isPollActive, setIsPollActive] = useState(true);
  const [votes, setVotes] = useState({ 0: 18, 1: 3, 2: 2, 3: 1 });

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  const handleVote = (idx: number) => {
    setVotes((prev: any) => ({ ...prev, [idx]: prev[idx] + 1 }));
  };

  const handleNewPoll = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPollActive(true);
    setVotes({ 0: 0, 1: 0, 2: 0, 3: 0 });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#000E28] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-[#0050CB] dark:text-[#38BDF8] font-bold text-xs uppercase tracking-wider mb-1">
            <Radio className="h-4 w-4 animate-pulse text-rose-500" />
            <span>Interactive Classroom Suite</span>
          </div>
          <h1 className="text-2xl font-black text-[#000E28] dark:text-white tracking-tight">
            Digital Classroom Board & Live Student Polls
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Engage online and physical classroom students in real time with interactive polling, instant comprehension feedback, and digital whiteboard tools.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            28 Students Connected
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("polls")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === "polls"
              ? "bg-[#0050CB] text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Live Interactive Polls
        </button>
        <button
          onClick={() => setActiveTab("whiteboard")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === "whiteboard"
              ? "bg-[#0050CB] text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Digital Canvas Whiteboard
        </button>
      </div>

      {/* Live Polls View */}
      {activeTab === "polls" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Poll Card */}
          <div className="lg:col-span-2 bg-white dark:bg-[#000E28] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-[#0050CB]" />
                <h2 className="text-sm font-black text-[#000E28] dark:text-white uppercase tracking-wider">
                  Active Live Poll
                </h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold animate-pulse">
                ● Live (1 min left)
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-[#000E28] dark:text-white mb-4">{pollQuestion}</h3>

              <div className="space-y-3">
                {pollOptions.map((opt, idx) => {
                  const count = (votes as any)[idx] || 0;
                  const percent = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                  const isCorrect = idx === 0;

                  return (
                    <div
                      key={idx}
                      onClick={() => handleVote(idx)}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#0050CB] bg-white dark:bg-slate-800 cursor-pointer space-y-2 transition-all"
                    >
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-[#000E28] dark:text-white">Option {String.fromCharCode(65 + idx)}: {opt}</span>
                        <span className="text-[#0050CB] dark:text-[#38BDF8]">
                          {count} votes ({percent}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isCorrect ? "bg-emerald-500" : "bg-[#0050CB]"
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-400 font-bold">
                <span>Total Responses: {totalVotes} / 28</span>
                <button
                  onClick={() => setIsPollActive(false)}
                  className="text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                >
                  End Poll & Lock Answers
                </button>
              </div>
            </div>
          </div>

          {/* Create Poll Box */}
          <div className="bg-white dark:bg-[#000E28] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-[#000E28] dark:text-white uppercase tracking-wider">
              Launch Quick Poll
            </h2>
            <form onSubmit={handleNewPoll} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Question Prompt</label>
                <input
                  type="text"
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  required
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#0050CB]"
                />
              </div>

              {pollOptions.map((opt, i) => (
                <div key={i}>
                  <label className="text-[11px] font-bold text-slate-500">Option {String.fromCharCode(65 + i)}</label>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const copy = [...pollOptions];
                      copy[i] = e.target.value;
                      setPollOptions(copy);
                    }}
                    required
                    className="w-full mt-0.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>
              ))}

              <button
                type="submit"
                className="w-full py-2.5 bg-[#0050CB] hover:bg-[#003da3] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md mt-2"
              >
                <Play className="h-4 w-4" />
                <span>Broadcast Instant Poll</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Whiteboard Canvas View */}
      {activeTab === "whiteboard" && (
        <div className="bg-white dark:bg-[#000E28] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Edit3 className="h-5 w-5 text-[#0050CB]" />
              <h2 className="text-sm font-black text-[#000E28] dark:text-white uppercase tracking-wider">
                Virtual Math & Science Canvas
              </h2>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded-lg">Pencil</button>
              <button className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded-lg">Highlighter</button>
              <button className="px-3 py-1.5 bg-[#E5EEFF] text-[#0050CB] text-xs font-bold rounded-lg">Formula Insert</button>
              <button className="px-3 py-1.5 bg-rose-100 text-rose-700 text-xs font-bold rounded-lg">Clear Canvas</button>
            </div>
          </div>

          <div className="h-[450px] w-full bg-slate-900 text-slate-100 rounded-xl p-6 relative overflow-hidden font-mono flex flex-col justify-between border border-slate-800 shadow-inner">
            <div className="space-y-2">
              <div className="text-emerald-400 font-bold text-sm"># Interactive Digital Canvas - Live Stream</div>
              <div className="text-slate-300 text-xs">Equation: f(x) = ax² + bx + c</div>
              <div className="text-amber-400 text-xs">Vertex V = (-b/2a, f(-b/2a)) = (2, -9)</div>
            </div>

            <div className="border-t border-slate-800 pt-3 flex justify-between items-center text-xs text-slate-400 font-sans">
              <span>Canvas Sync: Real-time 60fps • 28 Viewers connected</span>
              <button className="px-3 py-1 bg-[#0050CB] text-white text-xs font-bold rounded-lg">Export Snapshot (PNG)</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
