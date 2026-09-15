"use client";

import React, { useState } from "react";
import { FileText, Plus, Pin, Tag, Search, Trash2 } from "lucide-react";
import EmergencyBanner from "@/components/ui/EmergencyBanner";

export default function NotesPage() {
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: "Science Fair 2026 Project Guidelines",
      content: "Ensure all students in Grade 9 & 10 submit their project abstracts by October 1st. Safety review required.",
      pinned: true,
      tag: "Academic",
      date: "Sep 14, 2026",
    },
    {
      id: 2,
      title: "Staff Meeting Action Points",
      content: "1. Update biometrics for substitute teachers. 2. Finalize syllabus completion status before term end.",
      pinned: false,
      tag: "Staff",
      date: "Sep 10, 2026",
    },
  ]);

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setNotes((prev) => [
      {
        id: Date.now(),
        title: newTitle,
        content: newContent,
        pinned: false,
        tag: "General",
        date: "Today",
      },
      ...prev,
    ]);
    setNewTitle("");
    setNewContent("");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <EmergencyBanner />

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-[#000E28] dark:text-white flex items-center gap-3">
            <FileText className="w-8 h-8 text-[#0050CB] dark:text-[#38BDF8]" />
            Personal & Shared Academic Notes
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm font-medium">
            Rich text notes, teaching ideas, staff meeting logs, and pinned reminders.
          </p>
        </div>
      </div>

      {/* Create Note Card */}
      <form onSubmit={handleAddNote} className="bg-white dark:bg-[#000E28] border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-3">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Note Title..."
          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#001438] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#0050CB]"
        />

        <textarea
          rows={3}
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="Write your note or lesson details here..."
          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#001438] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-[#0050CB]"
        />

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#0050CB] hover:bg-[#0041A8] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Save Note</span>
          </button>
        </div>
      </form>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {notes.map((note) => (
          <div
            key={note.id}
            className="bg-white dark:bg-[#000E28] border border-slate-200/80 dark:border-slate-800 p-5 rounded-3xl shadow-xs space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#0050CB] dark:text-[#38BDF8] bg-[#E5EEFF] dark:bg-[#0050CB]/20 px-2.5 py-0.5 rounded-full">
                  {note.tag}
                </span>
                {note.pinned && <Pin className="w-4 h-4 text-[#FF690C] fill-current" />}
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">{note.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">{note.content}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] font-semibold text-slate-400">
              <span>{note.date}</span>
              <button
                onClick={() => setNotes(notes.filter((n) => n.id !== note.id))}
                className="text-rose-500 hover:text-rose-700 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
