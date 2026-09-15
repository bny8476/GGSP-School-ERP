"use client";

import React, { useState } from "react";
import { CheckCircle2, Clock, ShieldCheck, ArrowRight, UserCheck, Plus, AlertCircle } from "lucide-react";

export default function ApprovalEnginePage() {
  const [showModal, setShowModal] = useState(false);
  const [delegatee, setDelegatee] = useState("Mr. Marcus Thorne (Vice Principal)");
  const [scope, setScope] = useState("Staff Leave Approvals");

  const [delegations, setDelegations] = useState([
    {
      id: "DEL-101",
      delegator: "Dr. Elizabeth Vance (Principal)",
      delegatee: "Mr. Marcus Thorne (Vice Principal)",
      scope: "Staff Leave Approvals",
      dates: "Sep 20, 2026 - Sep 28, 2026",
      sla: "48 Hours",
      status: "Active",
    },
    {
      id: "DEL-102",
      delegator: "Mr. David Miller (Head of Accounts)",
      delegatee: "Ms. Sarah Jenkins (Senior Accountant)",
      scope: "Purchase Orders < $5,000",
      dates: "Sep 15, 2026 - Oct 01, 2026",
      sla: "24 Hours",
      status: "Active",
    },
  ]);

  const handleDelegate = (e: React.FormEvent) => {
    e.preventDefault();
    const newDel = {
      id: `DEL-${Date.now()}`,
      delegator: "Active Administrator",
      delegatee,
      scope,
      dates: "Sep 20, 2026 - Oct 05, 2026",
      sla: "48 Hours",
      status: "Active",
    };
    setDelegations([newDel, ...delegations]);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#000E28] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-[#0050CB] dark:text-[#38BDF8] font-bold text-xs uppercase tracking-wider mb-1">
            <ShieldCheck className="h-4 w-4" />
            <span>Workflow Governance & SLAs</span>
          </div>
          <h1 className="text-2xl font-black text-[#000E28] dark:text-white tracking-tight">
            Approval Delegation, SLA & Escalation Engine
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Delegate approval authority during absence, enforce strict SLA response deadlines, and configure Level 1 $\rightarrow$ Level 2 $\rightarrow$ Level 3 escalation triggers.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0050CB] text-white hover:bg-[#003da3] font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md"
        >
          <Plus className="h-4 w-4" />
          <span>Create Delegation Rule</span>
        </button>
      </div>

      {/* Escalation Tree Hierarchy */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#000E28] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-sm font-black text-[#000E28] dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Clock className="h-4 w-4 text-[#0050CB]" />
          3-Tier SLA Escalation Path
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-black uppercase text-[#0050CB]">Level 1 (SLA: 24h)</span>
            <h3 className="text-xs font-bold text-[#000E28] dark:text-white">Department Head / Manager</h3>
            <p className="text-[11px] text-slate-400">Initial review and authorization</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-black uppercase text-amber-600">Level 2 (SLA: 48h)</span>
            <h3 className="text-xs font-bold text-[#000E28] dark:text-white">Vice Principal / Finance Director</h3>
            <p className="text-[11px] text-slate-400">Auto-escalated if Level 1 exceeds deadline</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-black uppercase text-rose-600">Level 3 (Emergency)</span>
            <h3 className="text-xs font-bold text-[#000E28] dark:text-white">Executive Principal / Super Admin</h3>
            <p className="text-[11px] text-slate-400">Final override authority & audit flag</p>
          </div>
        </div>
      </div>

      {/* Delegations Table */}
      <div className="bg-white dark:bg-[#000E28] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-sm font-black text-[#000E28] dark:text-white uppercase tracking-wider">
          Active Approval Delegations ({delegations.length})
        </h2>

        <div className="space-y-3">
          {delegations.map((d) => (
            <div
              key={d.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-[#000E28] dark:text-white">{d.scope}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                    {d.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Delegated to: <strong className="text-[#0050CB] dark:text-[#38BDF8]">{d.delegatee}</strong> (by {d.delegator})
                </p>
                <p className="text-[10px] text-slate-400">Valid: {d.dates} • SLA: {d.sla}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#000E28] w-full max-w-md p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h2 className="text-base font-black text-[#000E28] dark:text-white">Create Approval Delegation</h2>
            <form onSubmit={handleDelegate} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Temporary Delegatee</label>
                <input
                  type="text"
                  value={delegatee}
                  onChange={(e) => setDelegatee(e.target.value)}
                  required
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Delegation Scope</label>
                <select
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                >
                  <option value="Staff Leave Approvals">Staff Leave Approvals</option>
                  <option value="Purchase Orders < $5,000">Purchase Orders &lt; $5,000</option>
                  <option value="Student Admission Approvals">Student Admission Approvals</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0050CB] text-white hover:bg-[#003da3] text-xs font-bold rounded-xl"
                >
                  Confirm Delegation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
