"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Calendar, 
  Phone, 
  User, 
  CheckCircle2, 
  ChevronRight, 
  Sparkles,
  ArrowRight,
  MoreVertical
} from 'lucide-react';

export interface AdmissionApplication {
  _id: string;
  childFirstName: string;
  childLastName: string;
  parentName: string;
  parentPhone?: string;
  parentEmail?: string;
  gradeAppliedFor?: string;
  status: string;
  createdAt?: string;
  notes?: string;
}

interface AdmissionKanbanProps {
  applications: AdmissionApplication[];
  onStatusChange: (id: string, newStatus: string) => void;
  onSelectApplication?: (app: AdmissionApplication) => void;
}

const COLUMNS = [
  { id: 'New Inquiry', title: 'New Inquiries', color: 'border-slate-300 dark:border-slate-700', badge: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  { id: 'Follow-up Pending', title: 'Follow-up Pending', color: 'border-blue-400 dark:border-blue-700', badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300' },
  { id: 'Demo Class Scheduled', title: 'Demo / Interview', color: 'border-amber-400 dark:border-amber-700', badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300' },
  { id: 'Interested', title: 'Approved / Review', color: 'border-purple-400 dark:border-purple-700', badge: 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300' },
  { id: 'Admission Confirmed', title: 'Confirmed Enrolled', color: 'border-emerald-500 dark:border-emerald-700', badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300' },
];

export default function AdmissionKanban({
  applications,
  onStatusChange,
  onSelectApplication,
}: AdmissionKanbanProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4 overflow-x-auto pb-4 custom-scrollbar">
      {COLUMNS.map((col) => {
        const columnApps = applications.filter((app) => app.status === col.id);

        return (
          <div
            key={col.id}
            className="flex flex-col bg-slate-50/70 dark:bg-[#07152F]/70 rounded-[22px] border border-slate-200/80 dark:border-slate-800 p-3 min-w-[270px] max-h-[78vh]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80 dark:border-slate-800 px-1 shrink-0">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${col.id === 'Admission Confirmed' ? 'bg-emerald-500' : 'bg-[#0050CB]'}`} />
                <h3 className="text-xs font-black text-[#000E28] dark:text-white uppercase tracking-wider">
                  {col.title}
                </h3>
              </div>
              <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${col.badge}`}>
                {columnApps.length}
              </span>
            </div>

            {/* Column Cards (Scrollable) */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
              {columnApps.length === 0 ? (
                <div className="py-10 text-center text-slate-400 dark:text-slate-600 text-xs">
                  No applicants in this stage
                </div>
              ) : (
                columnApps.map((app) => (
                  <motion.div
                    key={app._id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white dark:bg-[#0B1F3A] rounded-2xl p-4 border border-[#E6EAF2] dark:border-slate-700/80 shadow-xs hover:shadow-md hover:border-[#0050CB]/40 dark:hover:border-[#0050CB]/50 transition-all duration-200 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Bar: Grade Badge + Date */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#E5EEFF] dark:bg-[#0050CB]/30 text-[#0050CB] dark:text-[#E5EEFF]">
                          {app.gradeAppliedFor || 'LKG'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {app.createdAt
                            ? new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                            : 'Recent'}
                        </span>
                      </div>

                      {/* Applicant Name */}
                      <h4 
                        onClick={() => onSelectApplication?.(app)}
                        className="text-sm font-black text-[#000E28] dark:text-white group-hover:text-[#0050CB] dark:group-hover:text-[#E5EEFF] transition-colors cursor-pointer"
                      >
                        {app.childFirstName} {app.childLastName}
                      </h4>

                      {/* Parent details */}
                      <div className="mt-2 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{app.parentName || 'Parent'}</span>
                        </div>
                        {app.parentPhone && (
                          <div className="flex items-center gap-1.5 font-mono text-[11px]">
                            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{app.parentPhone}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stage Transition Selector */}
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      <select
                        value={app.status}
                        onChange={(e) => onStatusChange(app._id, e.target.value)}
                        className="text-[11px] font-bold py-1 px-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#000E28] dark:text-slate-200 cursor-pointer focus:outline-none"
                      >
                        {COLUMNS.map((c) => (
                          <option key={c.id} value={c.id}>
                            Move: {c.title}
                          </option>
                        ))}
                      </select>

                      {app.status !== 'Admission Confirmed' && (
                        <button
                          type="button"
                          onClick={() => onStatusChange(app._id, 'Admission Confirmed')}
                          className="p-1 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                          title="Confirm Admission"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
