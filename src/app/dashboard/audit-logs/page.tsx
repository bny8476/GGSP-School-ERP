"use client";

import React, { useState } from "react";
import { Database, Shield, Search, User, Clock, CheckCircle2 } from "lucide-react";
import EmergencyBanner from "@/components/ui/EmergencyBanner";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([
    { id: 1, user: "admin@schoolerp.com", role: "SuperAdmin", action: "User Role Update", module: "Users", details: "Granted SuperAdmin permissions to principal@schoolerp.com", ip: "192.168.1.105", timestamp: "Today, 11:42 AM" },
    { id: 2, user: "accountant@schoolerp.com", role: "Accountant", action: "Fee Payment Collected", module: "Finance", details: "Processed payment of $1,200 for Student SEED-001 (Sammy)", ip: "192.168.1.112", timestamp: "Today, 10:15 AM" },
    { id: 3, user: "teacher@school.com", role: "Teacher", action: "Attendance Marked", module: "Attendance", details: "Marked morning attendance for Grade 10-A (28 Present, 2 Absent)", ip: "192.168.1.120", timestamp: "Today, 09:00 AM" },
    { id: 4, user: "system@schoolerp.com", role: "System", action: "Automated Backup Completed", module: "System", details: "Completed nightly MongoDB backup (global_international_erp.gz)", ip: "127.0.0.1", timestamp: "Today, 03:00 AM" },
  ]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <EmergencyBanner />

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#000E28] dark:text-white flex items-center gap-3">
          <Database className="w-8 h-8 text-[#0050CB] dark:text-[#38BDF8]" />
          System Security Audit Trail & Event Logs
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm font-medium">
          Comprehensive, immutable activity trail recording user actions, role changes, and system modifications.
        </p>
      </div>

      {/* Audit Log Table Container */}
      <div className="bg-white dark:bg-[#000E28] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#0050CB]" />
            Audit History Stream
          </h3>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search user, action or IP..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-[#001438] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-[#0050CB]"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {logs.map((log) => (
            <div key={log.id} className="py-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-[#0050CB]" />
                  <span className="font-extrabold text-xs text-slate-900 dark:text-white">{log.user}</span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#0050CB] bg-[#E5EEFF] dark:bg-[#0050CB]/20 dark:text-[#38BDF8] px-2.5 py-0.5 rounded-md">
                    {log.role}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {log.timestamp}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                <span className="text-slate-400 font-normal">[{log.module}]</span>
                <span>{log.action}</span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">{log.details}</p>
              <p className="text-[10px] text-slate-400 font-medium">IP Address: {log.ip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
