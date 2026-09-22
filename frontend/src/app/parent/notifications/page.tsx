"use client";

import React, { useState } from "react";
import { 
  Bell, CheckCheck, BookOpen, UserCheck, WalletCards, 
  Calendar, Bus, MessageSquare, AlertCircle, CheckCircle2 
} from "lucide-react";
import SpotlightCard from "@/components/teacher/SpotlightCard";
import toast from "react-hot-toast";

interface NotificationItem {
  id: string;
  category: "School" | "Teacher" | "Attendance" | "Homework" | "Fees" | "Events" | "Transport";
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

export default function NotificationsPage() {
  const [filter, setFilter] = useState<string>("All");

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "n-1",
      category: "Fees",
      title: "Term 2 Fee Invoice Published",
      message: "Tuition and digital classroom fee invoice for Term 2 (₹4,500) has been generated. Due by 30 September 2026.",
      time: "10 minutes ago",
      isRead: false,
    },
    {
      id: "n-2",
      category: "Homework",
      title: "New Assignment: Drawing Domestic Animals",
      message: "Ms. Ananya Roy assigned a new creative arts colouring worksheet due tomorrow.",
      time: "2 hours ago",
      isRead: false,
    },
    {
      id: "n-3",
      category: "Attendance",
      title: "Morning Campus Check-In Confirmed",
      message: "Aarav Sharma checked into campus Gate 2 at 08:24 AM via RFID transport reader.",
      time: "Today, 08:26 AM",
      isRead: true,
    },
    {
      id: "n-4",
      category: "Events",
      title: "Annual Sports Day Registration Open",
      message: "Registrations for track & field races and parent-child obstacle relays are now open on the school calendar.",
      time: "Yesterday",
      isRead: true,
    },
    {
      id: "n-5",
      category: "Transport",
      title: "Route 04 Transit Advisory",
      message: "Bus 08 departed morning depot on schedule. Estimated arrival at your designated stop is 07:50 AM.",
      time: "Yesterday",
      isRead: true,
    },
    {
      id: "n-6",
      category: "Teacher",
      title: "Daily Diary Entry Posted",
      message: "Classroom log regarding 'Numbers & Counting 1-10' and lunch nutrition has been published.",
      time: "17 Sep 2026",
      isRead: true,
    },
  ]);

  const categories = ["All", "Fees", "Homework", "Attendance", "Events", "Transport", "Teacher"];

  const filtered = filter === "All"
    ? notifications
    : notifications.filter((n) => n.category === filter);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success("All notifications marked as read");
  };

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const getIcon = (cat: string) => {
    switch (cat) {
      case "Fees": return <WalletCards className="w-4 h-4 text-emerald-600" />;
      case "Homework": return <BookOpen className="w-4 h-4 text-[#FF690C]" />;
      case "Attendance": return <UserCheck className="w-4 h-4 text-[#0050CB]" />;
      case "Events": return <Calendar className="w-4 h-4 text-purple-600" />;
      case "Transport": return <Bus className="w-4 h-4 text-blue-500" />;
      default: return <MessageSquare className="w-4 h-4 text-rose-500" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-[22px] bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#0050CB]">
            Real-Time Broadcasts
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#000E28] dark:text-white">
            Notifications Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Official campus notices, academic updates, bus timings, and payment circulars.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-[#000E28] dark:text-white text-xs font-bold flex items-center gap-2 transition-colors shrink-0"
          >
            <CheckCheck className="w-4 h-4 text-[#0050CB]" />
            Mark All as Read
          </button>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              filter === cat
                ? "bg-[#0050CB] text-white shadow-xs"
                : "bg-white dark:bg-[#111827] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notifications Stream */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <SpotlightCard className="p-12 text-center text-slate-400">
            <Bell className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
            <p className="text-sm font-bold text-[#000E28] dark:text-white">You&rsquo;re all caught up</p>
            <p className="text-xs text-slate-500 mt-0.5">No unread notifications in this category.</p>
          </SpotlightCard>
        ) : (
          filtered.map((item) => (
            <SpotlightCard
              key={item.id}
              onClick={() => handleToggleRead(item.id)}
              className={`p-5 flex items-start gap-4 transition-all cursor-pointer ${
                !item.isRead
                  ? "border-l-4 border-l-[#0050CB] bg-[#E5EEFF]/30 dark:bg-[#0050CB]/10"
                  : "opacity-85"
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-xs">
                {getIcon(item.category)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#000E28] dark:text-white truncate">
                      {item.title}
                    </span>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                      {item.category}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono shrink-0">
                    {item.time}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {item.message}
                </p>
              </div>

              {!item.isRead && (
                <div className="w-2.5 h-2.5 rounded-full bg-[#0050CB] shrink-0 self-center" />
              )}
            </SpotlightCard>
          ))
        )}
      </div>
    </div>
  );
}
