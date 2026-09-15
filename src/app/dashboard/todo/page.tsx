"use client";

import React, { useState } from "react";
import { CheckSquare, Plus, Calendar, AlertCircle, Tag, CheckCircle2 } from "lucide-react";
import EmergencyBanner from "@/components/ui/EmergencyBanner";

export default function TodoPage() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Review Grade 10 Mid-Term Exam Question Papers", priority: "High", dueDate: "Sep 18, 2026", category: "Academic", status: "In Progress" },
    { id: 2, title: "Submit Monthly Attendance & Payroll Verification Report", priority: "Urgent", dueDate: "Sep 20, 2026", category: "Administrative", status: "Pending" },
    { id: 3, title: "Approve Student Transportation Route Change Request", priority: "Medium", dueDate: "Sep 22, 2026", category: "Operations", status: "Completed" },
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("Medium");

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    setTasks((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: newTaskTitle,
        priority: newTaskPriority,
        dueDate: "Sep 25, 2026",
        category: "General",
        status: "Pending",
      },
    ]);
    setNewTaskTitle("");
  };

  const toggleTaskStatus = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: t.status === "Completed" ? "Pending" : "Completed" } : t))
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <EmergencyBanner />

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-[#000E28] dark:text-white flex items-center gap-3">
            <CheckSquare className="w-8 h-8 text-[#0050CB] dark:text-[#38BDF8]" />
            Staff & Task Execution Manager
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm font-medium">
            Manage administrative tasks, academic deadlines, priorities, and workflow progress.
          </p>
        </div>
      </div>

      {/* Add Task Bar */}
      <form onSubmit={handleAddTask} className="bg-white dark:bg-[#000E28] border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex items-center gap-3">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a new task or action item..."
          className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-[#001438] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-[#0050CB]"
        />

        <select
          value={newTaskPriority}
          onChange={(e) => setNewTaskPriority(e.target.value)}
          className="px-3 py-2.5 bg-slate-50 dark:bg-[#001438] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-white"
        >
          <option value="Low">Low Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="High">High Priority</option>
          <option value="Urgent">Urgent Priority</option>
        </select>

        <button
          type="submit"
          className="px-5 py-2.5 bg-[#0050CB] hover:bg-[#0041A8] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </form>

      {/* Task List Container */}
      <div className="bg-white dark:bg-[#000E28] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Active Action Items</h3>

        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                task.status === "Completed"
                  ? "bg-slate-50/60 dark:bg-slate-900/30 border-slate-100 dark:border-slate-800 opacity-70"
                  : "bg-white dark:bg-[#001438] border-slate-200/80 dark:border-slate-700/80 shadow-xs"
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleTaskStatus(task.id)}
                  className={`p-1 rounded-lg transition-colors cursor-pointer ${
                    task.status === "Completed" ? "text-emerald-500" : "text-slate-300 hover:text-[#0050CB]"
                  }`}
                >
                  <CheckCircle2 className="w-6 h-6" />
                </button>
                <div>
                  <h4
                    className={`text-xs font-extrabold ${
                      task.status === "Completed"
                        ? "line-through text-slate-400"
                        : "text-slate-800 dark:text-white"
                    }`}
                  >
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-1 text-[10px] font-semibold text-slate-400">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Due: {task.dueDate}</span>
                    <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {task.category}</span>
                  </div>
                </div>
              </div>

              <span
                className={`text-[10px] font-extrabold px-3 py-1 rounded-full ${
                  task.priority === "Urgent" || task.priority === "High"
                    ? "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/50"
                    : "bg-[#E5EEFF] text-[#0050CB] dark:bg-[#0050CB]/20 dark:text-[#38BDF8]"
                }`}
              >
                {task.priority}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
