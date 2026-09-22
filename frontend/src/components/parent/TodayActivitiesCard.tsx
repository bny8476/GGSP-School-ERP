"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette,
  BookOpen,
  Music,
  Gamepad2,
  Sparkles,
  UserCheck,
  ChevronRight,
  X,
} from "lucide-react";
import { useParent, ClassroomActivityItem } from "@/context/ParentContext";

interface TodayActivitiesCardProps {
  activities?: ClassroomActivityItem[];
  isLoading?: boolean;
  className?: string;
}

const CATEGORY_CONFIG: Record<
  string,
  {
    icon: typeof Palette;
    gradient: string;
    bgBadge: string;
    textBadge: string;
    borderColor: string;
  }
> = {
  "Art & Craft": {
    icon: Palette,
    gradient: "from-pink-500/10 via-rose-500/5 to-transparent",
    bgBadge: "bg-pink-100 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300",
    textBadge: "Art & Craft",
    borderColor: "border-pink-200 dark:border-pink-900/40",
  },
  "Story Time": {
    icon: BookOpen,
    gradient: "from-amber-500/10 via-orange-500/5 to-transparent",
    bgBadge: "bg-[#FF690C]/10 text-[#FF690C] border border-[#FF690C]/20",
    textBadge: "Story Time",
    borderColor: "border-orange-200 dark:border-orange-900/40",
  },
  Rhymes: {
    icon: Music,
    gradient: "from-purple-500/10 via-indigo-500/5 to-transparent",
    bgBadge: "bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300",
    textBadge: "Rhymes & Rhythm",
    borderColor: "border-purple-200 dark:border-purple-900/40",
  },
  "Physical Play": {
    icon: Gamepad2,
    gradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
    bgBadge: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300",
    textBadge: "Physical Play",
    borderColor: "border-emerald-200 dark:border-emerald-900/40",
  },
  Music: {
    icon: Music,
    gradient: "from-blue-500/10 via-cyan-500/5 to-transparent",
    bgBadge: "bg-[#E5EEFF] text-[#0050CB] border border-[#0050CB]/20",
    textBadge: "Music",
    borderColor: "border-blue-200 dark:border-blue-900/40",
  },
};

export default function TodayActivitiesCard({
  activities: propsActivities,
  isLoading = false,
  className = "",
}: TodayActivitiesCardProps) {
  const { todayActivities } = useParent();
  const activities = propsActivities !== undefined ? propsActivities : todayActivities;
  const [selectedActivity, setSelectedActivity] = useState<ClassroomActivityItem | null>(null);

  if (isLoading) {
    return (
      <div className={`bg-white/95 dark:bg-[#07142F]/95 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm animate-pulse space-y-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="h-6 w-44 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          <div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-36 bg-slate-100 dark:bg-slate-800/40 rounded-2xl p-4" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className={`bg-white/95 dark:bg-[#07142F]/95 backdrop-blur-md border border-[rgba(70,150,255,0.16)] dark:border-white/10 rounded-[24px] p-5 sm:p-6 shadow-[0_8px_30px_rgba(0,80,203,0.06)] hover:shadow-[0_12px_36px_rgba(0,80,203,0.10)] transition-all duration-300 ${className}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-blue-50/90 dark:border-white/5 relative z-10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF690C] to-amber-500 text-white flex items-center justify-center shadow-md shadow-[#FF690C]/20 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-[#000E28] dark:text-white flex items-center gap-1.5">
                Today&apos;s Activities
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  ({activities.length})
                </span>
              </h3>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Interactive experiences & hands-on play
              </p>
            </div>
          </div>
          <span className="text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#E5EEFF] text-[#0050CB] border border-[#0050CB]/20">
            Active Learning
          </span>
        </div>

        {/* Content */}
        {activities.length === 0 ? (
          <div className="text-center py-7 px-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/20 border border-dashed border-slate-200 dark:border-slate-800">
            <Sparkles className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              No special activities logged yet today
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Classroom activity highlights will appear here once the teacher logs them.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {activities.map((act, index) => {
              const config = CATEGORY_CONFIG[act.category] || CATEGORY_CONFIG["Story Time"];
              const IconComp = config.icon;

              return (
                <motion.div
                  key={act._id || `act-${index}`}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setSelectedActivity(act)}
                  className={`relative group cursor-pointer overflow-hidden rounded-2xl border ${config.borderColor} bg-gradient-to-br ${config.gradient} p-4 flex flex-col justify-between transition-all hover:shadow-md`}
                >
                  <div>
                    {/* Top Row: Category Badge & Teacher */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full ${config.bgBadge}`}
                      >
                        {act.category}
                      </span>
                      {act.teacherName && (
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                          <UserCheck className="w-3 h-3 text-[#0050CB]" />
                          {act.teacherName}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs group-hover:text-[#0050CB] dark:group-hover:text-blue-400 transition-colors flex items-center gap-1.5 mb-1">
                      <IconComp className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300 shrink-0" />
                      <span className="truncate">{act.title}</span>
                    </h4>

                    {/* Description */}
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {act.description}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="mt-2.5 pt-2 border-t border-slate-200/50 dark:border-slate-800/60 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Hands-on creative</span>
                    <span className="text-[11px] text-[#0050CB] dark:text-blue-400 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      Details <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Activity Details Modal */}
      <AnimatePresence>
        {selectedActivity && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#000E28] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E5EEFF] text-[#0050CB]">
                    {selectedActivity.category}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2">
                    {selectedActivity.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedActivity(null)}
                  className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Activity Overview
                  </h4>
                  <p className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 leading-relaxed text-xs">
                    {selectedActivity.description}
                  </p>
                </div>

                {selectedActivity.teacherName && (
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                    <UserCheck className="w-4 h-4 text-[#0050CB]" />
                    <span>Conducted by: <strong>{selectedActivity.teacherName}</strong></span>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedActivity(null)}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
