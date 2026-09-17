"use client";

import React, { useState } from "react";
import { DollarSign, Lock, ShieldCheck, CheckCircle2, RefreshCw, AlertCircle } from "lucide-react";

export default function FinancialAuditPage() {
  const [refundNotice, setRefundNotice] = useState<string | null>(null);

  const periods = [
    { name: "FY 2026-2027 (Q1)", dates: "Apr 01, 2026 - Jun 30, 2026", status: "Locked", lockedBy: "Chief Accountant" },
    { name: "FY 2026-2027 (Q2)", dates: "Jul 01, 2026 - Sep 30, 2026", status: "Active Period", lockedBy: "-" },
  ];

  const refunds = [
    { id: "RF-901", student: "Alexander Wright", amount: 450.0, reason: "Duplicate Admission Payment", status: "Approved & Settled" },
    { id: "RF-902", student: "Sophia Martinez", amount: 200.0, reason: "Transport Fee Adjustment", status: "Pending Provider Confirmation" },
  ];

  const handleProcessRefund = (id: string) => {
    setRefundNotice(`Refund ${id} processed successfully. Idempotent payment provider reference verified.`);
    setTimeout(() => setRefundNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#000E28] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-[#0050CB] dark:text-[#38BDF8] font-bold text-xs uppercase tracking-wider mb-1">
            <DollarSign className="h-4 w-4" />
            <span>Financial Compliance & Audit Center</span>
          </div>
          <h1 className="text-2xl font-black text-[#000E28] dark:text-white tracking-tight">
            Financial Period Lock, Reconciliation & Refund Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Lock closed accounting periods against unauthorized edits, audit payment provider webhook events, and manage controlled student refund workflows.
          </p>
        </div>
      </div>

      {refundNotice && (
        <div className="p-4 rounded-xl bg-emerald-500 text-white font-bold text-xs flex items-center gap-3 shadow-md">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{refundNotice}</span>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fiscal Periods */}
        <div className="bg-white dark:bg-[#000E28] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-sm font-black text-[#000E28] dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Lock className="h-4 w-4 text-[#0050CB]" />
            Fiscal Accounting Periods
          </h2>

          <div className="space-y-3">
            {periods.map((p, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between"
              >
                <div>
                  <h3 className="text-xs font-bold text-[#000E28] dark:text-white">{p.name}</h3>
                  <p className="text-[11px] text-slate-400">{p.dates}</p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                    p.status === "Locked"
                      ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400"
                      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                  }`}
                >
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Refund Queue */}
        <div className="bg-white dark:bg-[#000E28] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-sm font-black text-[#000E28] dark:text-white uppercase tracking-wider flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-[#0050CB]" />
            Controlled Refund Queue
          </h2>

          <div className="space-y-3">
            {refunds.map((r) => (
              <div
                key={r.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#0050CB]">{r.id}</span>
                    <h3 className="text-xs font-bold text-[#000E28] dark:text-white">{r.student}</h3>
                  </div>
                  <span className="text-sm font-black text-rose-600">${r.amount.toFixed(2)}</span>
                </div>
                <p className="text-[11px] text-slate-500">{r.reason}</p>
                <div className="pt-2 flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold">{r.status}</span>
                  {r.status.includes("Pending") && (
                    <button
                      onClick={() => handleProcessRefund(r.id)}
                      className="px-3 py-1 bg-[#0050CB] text-white text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Authorize Refund
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
