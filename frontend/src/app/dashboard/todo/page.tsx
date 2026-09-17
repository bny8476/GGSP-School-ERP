"use client";

import React, { useState, useEffect } from "react";
import { 
  CheckCircle2, Plus, Search, Filter, Calendar, Clock, AlertCircle, 
  ChevronRight, MoreVertical, FileText, Users, Bus, BookOpen, Edit3, 
  Download, Upload, Sparkles, Check, X, ArrowRight, LayoutGrid, List
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function TodoPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"All" | "Pending" | "Completed" | "Overdue">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("All Priorities");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [showAddModal, setShowAddModal] = useState(false);

  // New task state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Academic");
  const [priority, setPriority] = useState("High");
  const [dueDate, setDueDate] = useState("Sep 25, 2026");

  useEffect(() => {
    // Initial sample task items matching screenshot exactly
    setTasks([
      {
        id: "1",
        title: "Review Grade 10 Mid-Term Exam Question Papers",
        description: "Check and finalize the question papers for Grade 10 Mid-Term Exam.",
        category: "Academic",
        dueDate: "Due: Sep 18, 2026",
        dateString: "Sep 18, 2026",
        priority: "High",
        priorityBg: "bg-pink-100 text-pink-600 dark:bg-pink-950/60 dark:text-pink-400",
        status: "Pending",
        statusBg: "bg-[#E5EEFF] text-[#0050CB] dark:bg-blue-950/60 dark:text-[#38BDF8]",
        icon: "📄",
        iconBg: "bg-blue-100 text-[#0050CB]",
        completed: false,
      },
      {
        id: "2",
        title: "Submit Monthly Attendance & Payroll Verification Report",
        description: "Prepare and submit the monthly attendance and payroll verification report.",
        category: "Administration",
        dueDate: "Due: Sep 20, 2026",
        dateString: "Sep 20, 2026",
        priority: "Urgent",
        priorityBg: "bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400",
        status: "Pending",
        statusBg: "bg-[#E5EEFF] text-[#0050CB] dark:bg-blue-950/60 dark:text-[#38BDF8]",
        icon: "👥",
        iconBg: "bg-purple-100 text-purple-600",
        completed: false,
      },
      {
        id: "3",
        title: "Approve Student Transportation Route Change Request",
        description: "Review and approve the transportation route change request for students.",
        category: "Transport",
        dueDate: "Due: Sep 22, 2026",
        dateString: "Sep 22, 2026",
        priority: "Medium",
        priorityBg: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400",
        status: "In Progress",
        statusBg: "bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400",
        icon: "🚌",
        iconBg: "bg-emerald-100 text-emerald-600",
        completed: true,
      },
      {
        id: "4",
        title: "Plan Annual Sports Day Event",
        description: "Coordinate with sports department and finalize event details.",
        category: "Events",
        dueDate: "Due: Sep 25, 2026",
        dateString: "Sep 25, 2026",
        priority: "Low",
        priorityBg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400",
        status: "Pending",
        statusBg: "bg-[#E5EEFF] text-[#0050CB] dark:bg-blue-950/60 dark:text-[#38BDF8]",
        icon: "📅",
        iconBg: "bg-amber-100 text-amber-600",
        completed: false,
      },
      {
        id: "5",
        title: "Update Library Book Inventory",
        description: "Add new books and update the library inventory system.",
        category: "Library",
        dueDate: "Due: Sep 28, 2026",
        dateString: "Sep 28, 2026",
        priority: "Medium",
        priorityBg: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400",
        status: "Pending",
        statusBg: "bg-[#E5EEFF] text-[#0050CB] dark:bg-blue-950/60 dark:text-[#38BDF8]",
        icon: "📖",
        iconBg: "bg-purple-100 text-purple-600",
        completed: false,
      },
    ]);
  }, []);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed, status: t.completed ? "Pending" : "Completed" } : t));
    toast.success("Task status updated!");
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask = {
      id: String(Date.now()),
      title,
      description: description || "New task action item",
      category,
      dueDate: `Due: ${dueDate}`,
      dateString: dueDate,
      priority,
      priorityBg: "bg-[#E5EEFF] text-[#0050CB]",
      status: "Pending",
      statusBg: "bg-[#E5EEFF] text-[#0050CB]",
      icon: "📄",
      iconBg: "bg-blue-100 text-[#0050CB]",
      completed: false,
    };

    setTasks([newTask, ...tasks]);
    toast.success("Task created successfully!");
    setTitle("");
    setDescription("");
    setShowAddModal(false);
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "All" ||
                       (activeTab === "Pending" && !t.completed) ||
                       (activeTab === "Completed" && t.completed) ||
                       (activeTab === "Overdue" && t.priority === "Urgent");
    
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6 font-sans text-[#000E28] dark:text-white pb-16">
      
      {/* BREADCRUMB */}
      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
        <Link href="/dashboard" className="hover:text-[#0050CB]">Home</Link>
        <span>&gt;</span>
        <span className="text-slate-600 dark:text-slate-300 font-semibold">To-Do Tasks</span>
      </div>

      {/* HERO BANNER SECTION WITH DESK IMAGE BACKDROP */}
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-[#EBF3FF] via-[#F3F7FF] to-[#E5EEFF] dark:from-[#001A48] dark:via-[#001438] dark:to-[#002766] p-6 sm:p-8 border border-blue-100/60 dark:border-slate-800 shadow-xs">
        
        {/* Background Desk Image Accent on Right */}
        <div 
          className="absolute top-0 right-0 bottom-0 w-1/2 opacity-20 dark:opacity-10 bg-no-repeat bg-cover bg-right pointer-events-none"
          style={{ backgroundImage: `url('/todo-hero-banner.png')` }}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#0050CB] text-white flex items-center justify-center font-bold shadow-md shrink-0">
              <CheckCircle2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#000E28] dark:text-white tracking-tight">
                To-Do Tasks
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-300 font-medium mt-1 max-w-xl">
                Stay organized and never miss important tasks, deadlines, and activities. Manage your daily workflow efficiently.
              </p>
            </div>
          </div>

          {/* Right Quote Container */}
          <div className="hidden lg:flex flex-col items-center justify-center p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm border border-white/80 dark:border-slate-800 shadow-xs max-w-xs text-center">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 italic">
              “ Small steps every day
            </p>
            <p className="text-xs font-bold text-[#000E28] dark:text-white italic relative inline-block mt-0.5">
              lead to big results. ”
              <span className="block h-0.5 bg-[#0050CB] w-12 mx-auto mt-1 rounded-full"></span>
            </p>
          </div>
        </div>
      </div>

      {/* 4 METRIC CARDS ROW + ADD NEW TASK BUTTON */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
          
          {/* Card 1: Total Tasks */}
          <div className="relative overflow-hidden bg-white dark:bg-[#000E28] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#0050CB] text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-[#000E28] dark:text-white leading-none">12</p>
              <p className="text-[11px] font-bold text-slate-400 mt-1">Total Tasks</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">↑ 3%</span>
              </div>
            </div>
            {/* Soft wave accent */}
            <div className="absolute right-0 bottom-0 w-16 h-8 opacity-10 bg-gradient-to-t from-[#0050CB] to-transparent rounded-tl-full pointer-events-none" />
          </div>

          {/* Card 2: Pending */}
          <div className="relative overflow-hidden bg-white dark:bg-[#000E28] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-[#000E28] dark:text-white leading-none">5</p>
              <p className="text-[11px] font-bold text-slate-400 mt-1">Pending</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">↑ 2%</span>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 w-16 h-8 opacity-10 bg-gradient-to-t from-emerald-500 to-transparent rounded-tl-full pointer-events-none" />
          </div>

          {/* Card 3: Completed */}
          <div className="relative overflow-hidden bg-white dark:bg-[#000E28] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-[#000E28] dark:text-white leading-none">6</p>
              <p className="text-[11px] font-bold text-slate-400 mt-1">Completed</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">↑ 5%</span>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 w-16 h-8 opacity-10 bg-gradient-to-t from-purple-600 to-transparent rounded-tl-full pointer-events-none" />
          </div>

          {/* Card 4: Overdue */}
          <div className="relative overflow-hidden bg-white dark:bg-[#000E28] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-[#000E28] dark:text-white leading-none">1</p>
              <p className="text-[11px] font-bold text-slate-400 mt-1">Overdue</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[10px] font-bold text-rose-500">↓ 1%</span>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 w-16 h-8 opacity-10 bg-gradient-to-t from-rose-500 to-transparent rounded-tl-full pointer-events-none" />
          </div>

        </div>

        {/* Add New Task Button on Far Right */}
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#0050CB] hover:bg-[#003EA3] text-white text-xs font-extrabold shadow-md cursor-pointer transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Task</span>
        </button>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: TASKS FILTER & LIST CONTAINER (COL-8) */}
        <div className="lg:col-span-8 bg-white dark:bg-[#000E28] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
          
          {/* SEARCH & FILTERS BAR */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tasks by title, description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium outline-none focus:ring-2 focus:ring-[#0050CB]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {/* Priority Filter */}
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none shrink-0"
              >
                <option value="All Priorities">All Priorities</option>
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none shrink-0"
              >
                <option value="All Statuses">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none shrink-0"
              >
                <option value="All Categories">All Categories</option>
                <option value="Academic">Academic</option>
                <option value="Administration">Administration</option>
                <option value="Transport">Transport</option>
                <option value="Events">Events</option>
                <option value="Library">Library</option>
              </select>

              {/* Filter Button */}
              <button className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 shrink-0">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span>Filter</span>
              </button>

              {/* View Mode Icons */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1 rounded-lg transition-colors ${viewMode === "grid" ? "bg-white dark:bg-slate-700 text-[#0050CB] shadow-xs" : "text-slate-400"}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1 rounded-lg transition-colors ${viewMode === "list" ? "bg-[#0050CB] text-white shadow-xs" : "text-slate-400"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* TABS ROW */}
          <div className="flex items-center gap-6 border-b border-slate-100 dark:border-slate-800 pb-2 text-xs font-bold">
            <button
              onClick={() => setActiveTab("All")}
              className={`pb-2 transition-colors cursor-pointer border-b-2 ${activeTab === "All" ? "border-[#0050CB] text-[#0050CB] font-black" : "border-transparent text-slate-500 hover:text-slate-800"}`}
            >
              All Tasks (12)
            </button>
            <button
              onClick={() => setActiveTab("Pending")}
              className={`pb-2 transition-colors cursor-pointer border-b-2 ${activeTab === "Pending" ? "border-[#0050CB] text-[#0050CB] font-black" : "border-transparent text-slate-500 hover:text-slate-800"}`}
            >
              Pending (5)
            </button>
            <button
              onClick={() => setActiveTab("Completed")}
              className={`pb-2 transition-colors cursor-pointer border-b-2 ${activeTab === "Completed" ? "border-[#0050CB] text-[#0050CB] font-black" : "border-transparent text-slate-500 hover:text-slate-800"}`}
            >
              Completed (6)
            </button>
            <button
              onClick={() => setActiveTab("Overdue")}
              className={`pb-2 transition-colors cursor-pointer border-b-2 ${activeTab === "Overdue" ? "border-[#0050CB] text-[#0050CB] font-black" : "border-transparent text-slate-500 hover:text-slate-800"}`}
            >
              Overdue (1)
            </button>
          </div>

          {/* TASK LIST ITEMS */}
          <div className="space-y-3">
            {filteredTasks.map((t) => (
              <div
                key={t.id}
                className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                  t.completed 
                    ? "bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800" 
                    : "bg-white dark:bg-[#000E28] border-slate-200/80 dark:border-slate-800 hover:border-[#0050CB]"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleTask(t.id)}
                    className={`w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer transition-colors mt-0.5 shrink-0 ${
                      t.completed
                        ? "bg-[#0050CB] border-[#0050CB] text-white"
                        : "border-slate-300 dark:border-slate-600 hover:border-[#0050CB]"
                    }`}
                  >
                    {t.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  {/* Icon */}
                  <div className={`w-9 h-9 rounded-xl ${t.iconBg} flex items-center justify-center font-bold text-sm shrink-0`}>
                    {t.icon}
                  </div>

                  {/* Task Details */}
                  <div className="space-y-0.5">
                    <h4 className={`text-xs font-extrabold leading-tight ${t.completed ? "line-through text-slate-400" : "text-[#000E28] dark:text-white"}`}>
                      {t.title}
                    </h4>
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-normal">
                      {t.description}
                    </p>

                    <div className="flex items-center gap-3 pt-1 text-[10px] text-slate-400 font-bold">
                      <span>👤 {t.category}</span>
                      <span>📅 {t.dueDate}</span>
                    </div>
                  </div>
                </div>

                {/* Priority & Status Badges */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold ${t.priorityBg}`}>
                    {t.priority}
                  </span>

                  <span className="hidden sm:inline-block text-[10px] font-bold text-slate-400">
                    {t.dateString}
                  </span>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${t.statusBg}`}>
                    {t.status}
                  </span>

                  <button className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* LIST FOOTER & PAGINATION */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-semibold">
            <span>Showing 1 to {filteredTasks.length} of 12 tasks</span>

            <div className="flex items-center gap-1.5">
              <button className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:bg-slate-50">
                &lt;
              </button>
              <button className="w-7 h-7 rounded-lg bg-[#0050CB] text-white font-bold flex items-center justify-center shadow-xs">
                1
              </button>
              <button className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50">
                2
              </button>
              <button className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50">
                3
              </button>
              <button className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:bg-slate-50">
                &gt;
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: QUICK ACTIONS + SUMMARY + STAY FOCUSED CARD (COL-4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* QUICK ACTIONS PANEL */}
          <div className="bg-white dark:bg-[#000E28] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Sparkles className="w-4 h-4 text-[#0050CB] dark:text-[#38BDF8]" />
              <h3 className="text-sm font-black text-[#000E28] dark:text-white">Quick Actions</h3>
            </div>

            <div className="space-y-2">
              <button 
                onClick={() => setShowAddModal(true)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 hover:bg-[#E5EEFF] dark:hover:bg-[#0050CB]/20 text-xs font-bold text-[#000E28] dark:text-white transition-all border border-slate-100 dark:border-slate-800 group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0050CB] text-white flex items-center justify-center">
                    <Edit3 className="w-4 h-4" />
                  </div>
                  <span>Create New Task</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0050CB]" />
              </button>

              <button 
                onClick={() => toast.success("Opening notes editor...")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 hover:bg-[#E5EEFF] dark:hover:bg-[#0050CB]/20 text-xs font-bold text-[#000E28] dark:text-white transition-all border border-slate-100 dark:border-slate-800 group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span>Add Note</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
              </button>

              <Link 
                href="/dashboard/file-manager"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 hover:bg-[#E5EEFF] dark:hover:bg-[#0050CB]/20 text-xs font-bold text-[#000E28] dark:text-white transition-all border border-slate-100 dark:border-slate-800 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span>Manage Files</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
              </Link>

              <Link 
                href="/dashboard/calendar"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 hover:bg-[#E5EEFF] dark:hover:bg-[#0050CB]/20 text-xs font-bold text-[#000E28] dark:text-white transition-all border border-slate-100 dark:border-slate-800 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span>View Calendar</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500" />
              </Link>

              <button 
                onClick={() => toast.success("Exporting tasks list...")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 hover:bg-[#E5EEFF] dark:hover:bg-[#0050CB]/20 text-xs font-bold text-[#000E28] dark:text-white transition-all border border-slate-100 dark:border-slate-800 group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500 text-white flex items-center justify-center">
                    <Download className="w-4 h-4" />
                  </div>
                  <span>Export Tasks</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-500" />
              </button>
            </div>
          </div>

          {/* TASK SUMMARY PANEL */}
          <div className="bg-white dark:bg-[#000E28] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#0050CB] dark:text-[#38BDF8]" />
                <h3 className="text-sm font-black text-[#000E28] dark:text-white">Task Summary</h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">This Month ∨</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#0050CB] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-base font-black text-[#000E28] dark:text-white leading-none">5</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">Pending</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-base font-black text-[#000E28] dark:text-white leading-none">6</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">Completed</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-base font-black text-[#000E28] dark:text-white leading-none">1</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">Overdue</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-base font-black text-[#000E28] dark:text-white leading-none">12</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">Total</p>
                </div>
              </div>
            </div>
          </div>

          {/* STAY FOCUSED GET THINGS DONE BRANDING CARD */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#EEF2FF] via-[#F3E8FF] to-[#E0E7FF] dark:from-[#1E1B4B] dark:via-[#2E1065] dark:to-[#3B0764] p-5 border border-purple-200/60 dark:border-purple-900/40 shadow-xs flex items-center justify-between">
            <div className="space-y-1 max-w-[170px] z-10">
              <h4 className="text-xs font-black text-[#000E28] dark:text-white leading-tight">
                Stay Focused<br />Get Things Done
              </h4>
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-300">
                Organize your tasks, achieve your goals.
              </p>
              <button className="mt-2 w-7 h-7 rounded-full bg-[#0050CB] text-white flex items-center justify-center cursor-pointer shadow-xs hover:bg-[#003EA3] transition-colors">
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Generated Stay Focused Illustration Graphic */}
            <div className="w-24 h-24 rounded-xl overflow-hidden shadow-sm shrink-0 border border-white/60">
              <img 
                src="/stay-focused-illustration.png" 
                alt="Stay Focused" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>

      </div>

      {/* FOOTER */}
      <footer className="pt-6 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-semibold">
        <div>
          <span className="font-black text-[#000E28] dark:text-white">Global International School ERP</span> &copy; 2026. All rights reserved.
        </div>
        <div className="flex items-center gap-3">
          <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Portal Active
          </span>
          <span>•</span>
          <span className="hover:underline cursor-pointer">Support</span>
          <span>|</span>
          <span className="hover:underline cursor-pointer">Help</span>
        </div>
      </footer>

      {/* CREATE NEW TASK MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#000E28] w-full max-w-md p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-base font-black text-[#000E28] dark:text-white">Create New Task</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Task Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Prepare Grade 10 Physics Mid-Term Exam Paper"
                  required
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-[#0050CB]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Task details and instructions..."
                  rows={3}
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Administration">Administration</option>
                    <option value="Transport">Transport</option>
                    <option value="Events">Events</option>
                    <option value="Library">Library</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                  >
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Due Date</label>
                <input
                  type="text"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  placeholder="e.g. Sep 25, 2026"
                  className="w-full mt-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0050CB] text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
