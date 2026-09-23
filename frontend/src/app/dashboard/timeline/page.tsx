"use client";

import { useState, useEffect } from 'react';
import { Activity, Filter, RefreshCw, User, Shield, Clock, Layers } from 'lucide-react';

interface AuditItem {
  _id: string;
  userId?: {
    _id: string;
    firstName: string;
    lastName: string;
    role: string;
    email: string;
  };
  userName?: string;
  userRole?: string;
  action: string;
  module: string;
  targetId?: string;
  ipAddress?: string;
  details?: string;
  createdAt: string;
}

export default function GlobalActivityTimeline() {
  const [logs, setLogs] = useState<AuditItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [moduleFilter, setModuleFilter] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const url = moduleFilter
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/audit?module=${moduleFilter}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/audit`;

      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        setLogs(await res.json());
      }
    } catch (e) {
      console.error('Failed to load audit logs', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [moduleFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Global Activity & Audit Stream</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Realtime institutional audit logs tracking system actions, security events, and data modifications.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchLogs}
            className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Refresh stream"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
        <Filter className="h-4 w-4 text-slate-400" />
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Filter Module:</span>
        <select
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
          className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold px-3 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Modules</option>
          <option value="Auth">Auth & Security</option>
          <option value="Student">Students</option>
          <option value="Finance">Finance & Fees</option>
          <option value="Academic">Academic & Timetable</option>
          <option value="Payroll">Staff Payroll</option>
          <option value="Hostel">Hostel</option>
          <option value="Library">Library</option>
          <option value="Support">Support Tickets</option>
        </select>
      </div>

      {/* Activity Timeline Feed */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 md:p-8">
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-medium animate-pulse">
            Loading activity feed...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 font-medium">
            No audit log records found for the selected criteria.
          </div>
        ) : (
          <div className="space-y-6 border-l-2 border-slate-200 dark:border-slate-800 pl-6 ml-4">
            {logs.map((log) => {
              const userName = log.userId
                ? `${log.userId.firstName} ${log.userId.lastName}`
                : log.userName || 'System Action';
              const roleName = log.userId?.role || log.userRole || 'System';

              return (
                <div key={log._id} className="relative group">
                  {/* Circle Marker */}
                  <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-indigo-600 border-2 border-white dark:border-slate-900 group-hover:scale-125 transition-transform"></div>

                  <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 hover:border-indigo-200 dark:hover:border-indigo-900 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">{userName}</span>
                        <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold uppercase">
                          {roleName}
                        </span>
                      </div>

                      <div className="flex items-center text-xs font-semibold text-slate-400 space-x-3">
                        <span className="flex items-center">
                          <Layers className="h-3.5 w-3.5 mr-1" /> {log.module}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1" /> {new Date(log.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                      Action: <span className="text-indigo-600 dark:text-indigo-400">{log.action}</span>
                    </div>

                    {log.details && (
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-mono bg-white dark:bg-slate-900/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                        {log.details}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
