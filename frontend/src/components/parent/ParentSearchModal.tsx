"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, X, CalendarHeart, BookOpen, UserCheck, WalletCards, 
  FileText, ArrowRight, Sparkles, Award, Bell
} from "lucide-react";
import { useParent } from "@/context/ParentContext";

export default function ParentSearchModal() {
  const { isSearchOpen, setIsSearchOpen, children, selectedChild } = useParent();
  const [query, setQuery] = useState("");
  const router = useRouter();

  // Reset query when opening
  useEffect(() => {
    if (isSearchOpen) {
      setQuery("");
    }
  }, [isSearchOpen]);

  const searchItems = useMemo(() => [
    {
      id: "nav-children",
      category: "Children",
      title: `${selectedChild?.firstName}'s Profile`,
      description: `View ${selectedChild?.grade} profile, records & details`,
      icon: UserCheck,
      href: `/parent/children/${selectedChild?._id || "c1"}`,
    },
    ...children.map((c) => ({
      id: `child-${c._id}`,
      category: "Children",
      title: `${c.firstName} ${c.lastName}`,
      description: `${c.grade} – ${c.section} (Roll #${c.rollNumber})`,
      icon: UserCheck,
      href: `/parent/children/${c._id}`,
    })),
    {
      id: "att-today",
      category: "Attendance",
      title: "Attendance Records & History",
      description: `${selectedChild?.firstName}'s monthly attendance (${selectedChild?.attendanceRate}% present)`,
      icon: UserCheck,
      href: "/parent/attendance",
    },
    {
      id: "diary-daily",
      category: "Diary",
      title: "Daily School Diary",
      description: "Today's classroom activities, teacher notes, meals & nap time",
      icon: CalendarHeart,
      href: "/parent/diary",
    },
    {
      id: "hw-drawing",
      category: "Homework",
      title: "Pending Homework Tasks",
      description: `${selectedChild?.pendingHomework || 2} assignments due this week`,
      icon: BookOpen,
      href: "/parent/homework",
    },
    {
      id: "prog-growth",
      category: "Progress",
      title: "Holistic Development & Milestones",
      description: "Cognitive, communication, motor & social skills evaluation",
      icon: Sparkles,
      href: "/parent/progress",
    },
    {
      id: "assess-term",
      category: "Assessments",
      title: "Term 1 Report Card & Rubrics",
      description: "Official evaluation rubrics & printable PDF report card",
      icon: Award,
      href: "/parent/assessments",
    },
    {
      id: "fee-tuition",
      category: "Fees",
      title: "Term Fees & Online Payment",
      description: `Pending fee dues: ₹${(selectedChild?.feesDue || 8500).toLocaleString()}`,
      icon: WalletCards,
      href: "/parent/fees",
    },
    {
      id: "doc-receipt",
      category: "Documents",
      title: "School Documents & Fee Receipts",
      description: "Download verified report cards, certificates & receipts",
      icon: FileText,
      href: "/parent/documents",
    },
    {
      id: "notif-center",
      category: "Notifications",
      title: "School Announcements & Alerts",
      description: "View important circulars, event invites & teacher notices",
      icon: Bell,
      href: "/parent/notifications",
    },
  ], [children, selectedChild]);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return searchItems.slice(0, 7);
    const q = query.toLowerCase();
    return searchItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [query, searchItems]);

  const handleSelect = (href: string) => {
    setIsSearchOpen(false);
    router.push(href);
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSearchOpen(false)}
            className="fixed inset-0 bg-[#000E28]/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-2xl bg-white dark:bg-[#111827] rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-[0_24px_60px_rgba(0,14,40,0.25)] overflow-hidden z-10"
          >
            {/* Input Bar */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800/80">
              <Search className="w-5 h-5 text-[#0050CB] shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Search your child, homework, diary, fees, assessments..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-sm sm:text-base font-medium text-[#000E28] dark:text-white placeholder:text-slate-400 focus:outline-none"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-[380px] overflow-y-auto p-3 space-y-1">
              {filteredItems.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <p className="text-sm font-medium">No results found for &ldquo;{query}&rdquo;</p>
                  <p className="text-xs text-slate-500 mt-1">Try searching for homework, fees, diary, or child name.</p>
                </div>
              ) : (
                filteredItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.href)}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group text-left"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-[#E5EEFF] dark:bg-[#0050CB]/20 text-[#0050CB] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#000E28] dark:text-white truncate">
                              {item.title}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                              {item.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-[#0050CB] group-hover:translate-x-0.5 transition-all shrink-0 ml-3" />
                    </button>
                  );
                })
              )}
            </div>

            {/* Modal Footer with keyboard hints */}
            <div className="px-5 py-3 bg-slate-50/80 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Quick navigation for parents</span>
              <div className="flex items-center gap-3">
                <span><kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono">ESC</kbd> to close</span>
                <span><kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono">↵</kbd> to select</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
