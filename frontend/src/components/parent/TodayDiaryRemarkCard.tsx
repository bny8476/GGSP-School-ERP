"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookMarked,
  MessageSquare,
  Sparkles,
  UserCheck,
  Send,
  CheckCircle2,
  FileText,
  Clock,
  X,
  Heart,
  Smile,
  Award,
} from "lucide-react";
import { DailyDiaryInfo, TeacherRemarkItem, useParent } from "@/context/ParentContext";

interface TodayDiaryRemarkCardProps {
  diary?: DailyDiaryInfo | null;
  remarks?: TeacherRemarkItem[];
  isLoading?: boolean;
  className?: string;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; icon: typeof Award }> = {
  Appreciation: {
    bg: "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800",
    text: "text-amber-700 dark:text-amber-300",
    icon: Award,
  },
  Academics: {
    bg: "bg-[#E5EEFF] text-[#0050CB] border border-[#0050CB]/20",
    text: "text-[#0050CB]",
    icon: Sparkles,
  },
  Behavior: {
    bg: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800",
    text: "text-emerald-700 dark:text-emerald-300",
    icon: Smile,
  },
  Participation: {
    bg: "bg-purple-100 dark:bg-purple-950/40 text-purple-800 dark:text-purple-200 border border-purple-200 dark:border-purple-800",
    text: "text-purple-700 dark:text-purple-300",
    icon: Heart,
  },
};

export default function TodayDiaryRemarkCard({
  diary: propDiary,
  remarks: propRemarks,
  isLoading = false,
  className = "",
}: TodayDiaryRemarkCardProps) {
  const { replyTeacherRemark, selectedChild, todayDiary, teacherRemarks } = useParent();
  const diary = propDiary !== undefined ? propDiary : todayDiary;
  const remarks: TeacherRemarkItem[] = (propRemarks !== undefined ? propRemarks : teacherRemarks) || [];

  const [activeTab, setActiveTab] = useState<"remarks" | "diary">("remarks");
  const [replyModalRemark, setReplyModalRemark] = useState<TeacherRemarkItem | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSendReply = async () => {
    if (!replyModalRemark || !replyText.trim()) return;
    setIsSubmittingReply(true);
    try {
      await replyTeacherRemark(replyModalRemark._id, replyText.trim());
      setSuccessMessage("Your reply has been sent to the teacher!");
      setTimeout(() => {
        setSuccessMessage("");
        setReplyModalRemark(null);
        setReplyText("");
      }, 1500);
    } catch (err) {
      console.error("Failed to send reply:", err);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`bg-white/95 dark:bg-[#07142F]/95 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm animate-pulse space-y-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="h-6 w-44 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          <div className="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded-full" />
        </div>
        <div className="h-40 bg-slate-100 dark:bg-slate-800/40 rounded-2xl" />
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className={`bg-white/95 dark:bg-[#07142F]/95 backdrop-blur-md border border-[rgba(70,150,255,0.16)] dark:border-white/10 rounded-[24px] p-5 sm:p-6 shadow-[0_8px_30px_rgba(0,80,203,0.06)] hover:shadow-[0_12px_36px_rgba(0,80,203,0.10)] transition-all duration-300 flex flex-col justify-between ${className}`}
      >
        {/* Header with Switcher Tabs */}
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-blue-50/90 dark:border-white/5 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0050CB] to-blue-600 flex items-center justify-center text-white shadow-md shadow-[#0050CB]/20 shrink-0">
                <BookMarked className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-[#000E28] dark:text-white flex items-center gap-1.5">
                  Daily Diary & Remarks
                </h3>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  Notes from the classroom & teacher feedback
                </p>
              </div>
            </div>

            {/* Pill Tabs */}
            <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700">
              <button
                onClick={() => setActiveTab("remarks")}
                className={`text-[11px] font-black px-2.5 py-1 rounded-lg transition-all ${
                  activeTab === "remarks"
                    ? "bg-white dark:bg-[#0050CB] text-[#0050CB] dark:text-white shadow-2xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                Teacher Remark {remarks.length > 0 && `(${remarks.length})`}
              </button>
              <button
                onClick={() => setActiveTab("diary")}
                className={`text-[11px] font-black px-2.5 py-1 rounded-lg transition-all ${
                  activeTab === "diary"
                    ? "bg-white dark:bg-[#0050CB] text-[#0050CB] dark:text-white shadow-2xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                Daily Diary
              </button>
            </div>
          </div>

          {/* Tab 1: Child-Specific Remarks */}
          {activeTab === "remarks" && (
            <div className="space-y-3">
              {remarks.length === 0 ? (
                <div className="text-center py-7 px-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/20 border border-dashed border-slate-200 dark:border-slate-800">
                  <MessageSquare className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    No individual remarks for {selectedChild?.firstName || "your child"} today
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    When the class teacher enters personalized feedback or observations, it appears here privately.
                  </p>
                </div>
              ) : (
                remarks.map((item: TeacherRemarkItem) => {
                  const catConfig = CATEGORY_COLORS[item.category] || CATEGORY_COLORS["Appreciation"];
                  const IconComp = catConfig.icon;

                  return (
                    <div
                      key={item._id}
                      className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-800 space-y-2.5"
                    >
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 ${catConfig.bg}`}
                          >
                            <IconComp className="w-3 h-3" />
                            {item.category}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {typeof item.date === 'string' ? item.date : new Date(item.date).toLocaleDateString()}
                          </span>
                        </div>
                        {item.teacherName && (
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                            <UserCheck className="w-3 h-3 text-[#0050CB]" />
                            {item.teacherName}
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed bg-white/70 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800/60 italic">
                        &ldquo;{item.content}&rdquo;
                      </p>

                      {/* Parent Reply Section */}
                      {item.parentReply ? (
                        <div className="pl-3 border-l-2 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 p-2.5 rounded-r-xl">
                          <p className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Your Reply ({item.parentRepliedAt ? new Date(item.parentRepliedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Sent"})
                          </p>
                          <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-0.5">
                            {item.parentReply}
                          </p>
                        </div>
                      ) : (
                        <div className="flex justify-end pt-0.5">
                          <button
                            onClick={() => {
                              setReplyModalRemark(item);
                              setReplyText("");
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-[11px] font-black bg-[#E5EEFF] hover:bg-blue-100 text-[#0050CB] border border-[#0050CB]/20 transition-colors shadow-2xs cursor-pointer"
                          >
                            <MessageSquare className="w-3 h-3" />
                            Reply to Teacher
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Tab 2: Daily Diary Overview */}
          {activeTab === "diary" && (
            <div className="space-y-3">
              {!diary ? (
                <div className="text-center py-7 px-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/20 border border-dashed border-slate-200 dark:border-slate-800">
                  <BookMarked className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    No Daily Diary published yet today
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    The teacher updates the class diary towards the close of the school day.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {/* Today's Learning */}
                  <div className="p-3 rounded-2xl bg-[#E5EEFF]/40 dark:bg-slate-800/30 border border-blue-100 dark:border-slate-800">
                    <h4 className="text-[10px] font-black text-[#0050CB] dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                      <Sparkles className="w-3 h-3" />
                      Today&apos;s Learning
                    </h4>
                    <p className="text-[11px] text-slate-700 dark:text-slate-200 leading-relaxed">
                      {diary.todayLearning || "Refer to classroom learning cards."}
                    </p>
                  </div>

                  {/* Activity */}
                  {diary.todayActivity && (
                    <div className="p-3 rounded-2xl bg-amber-50/50 dark:bg-slate-800/30 border border-amber-100 dark:border-slate-800">
                      <h4 className="text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                        <Smile className="w-3 h-3" />
                        Today&apos;s Activity
                      </h4>
                      <p className="text-[11px] text-slate-700 dark:text-slate-200 leading-relaxed">
                        {diary.todayActivity}
                      </p>
                    </div>
                  )}

                  {/* Homework */}
                  {diary.homework && (
                    <div className="p-3 rounded-2xl bg-orange-50/50 dark:bg-slate-800/30 border border-[#FF690C]/20">
                      <h4 className="text-[10px] font-black text-[#FF690C] uppercase tracking-wider flex items-center gap-1.5 mb-1">
                        <FileText className="w-3 h-3" />
                        Homework Assigned
                      </h4>
                      <p className="text-[11px] text-slate-700 dark:text-slate-200 leading-relaxed">
                        {diary.homework}
                      </p>
                    </div>
                  )}

                  {/* Teacher Note */}
                  {diary.teacherNote && (
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <UserCheck className="w-3 h-3 text-[#0050CB]" />
                          Teacher&apos;s Note
                        </h4>
                        {diary.teacherName && (
                          <span className="text-[10px] text-slate-400">By {diary.teacherName}</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-700 dark:text-slate-200 italic leading-relaxed">
                        &ldquo;{diary.teacherNote}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Reply to Teacher Modal */}
      <AnimatePresence>
        {replyModalRemark && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#000E28] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#E5EEFF] text-[#0050CB]">
                    Reply to Teacher
                  </span>
                  <h3 className="text-base font-black text-slate-900 dark:text-white mt-2">
                    Message regarding remark
                  </h3>
                </div>
                <button
                  onClick={() => setReplyModalRemark(null)}
                  className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Original Remark Snapshot */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 mb-4">
                <p className="text-[11px] text-slate-400 mb-1 font-semibold">
                  Remark by {replyModalRemark.teacherName || "Class Teacher"}:
                </p>
                <p className="text-xs text-slate-700 dark:text-slate-200 italic">
                  &ldquo;{replyModalRemark.content}&rdquo;
                </p>
              </div>

              {/* Reply Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Your Message to {replyModalRemark.teacherName || "Teacher"}
                </label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Thank you for sharing! We will reinforce this at home..."
                  rows={4}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0050CB]"
                />
              </div>

              {successMessage ? (
                <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {successMessage}
                </div>
              ) : null}

              <div className="mt-5 flex items-center justify-end gap-2">
                <button
                  onClick={() => setReplyModalRemark(null)}
                  className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendReply}
                  disabled={!replyText.trim() || isSubmittingReply}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-xl bg-[#0050CB] hover:bg-blue-700 text-white transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmittingReply ? "Sending..." : "Send Reply"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
