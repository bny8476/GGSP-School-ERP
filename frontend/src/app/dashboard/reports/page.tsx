"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  CircleDollarSign, 
  Download, 
  AlertTriangle, 
  CalendarCheck, 
  CheckCircle2, 
  Loader2,
  TrendingUp,
  UserPlus,
  Clock,
  ArrowDownToLine,
  FileSpreadsheet
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState<'fees' | 'admissions' | 'attendance'>('fees');
  
  const [feeData, setFeeData] = useState<any[]>([]);
  const [admData, setAdmData] = useState<any>(null);
  const [attData, setAttData] = useState<any>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    fetchReportData(activeReport);
  }, [activeReport]);

  const fetchReportData = async (type: string) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      if (type === 'fees') {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/fee-defaulters`, { headers });
        if (res.ok) setFeeData(await res.json());
      } else if (type === 'admissions') {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/admissions`, { headers });
        if (res.ok) setAdmData(await res.json());
      } else if (type === 'attendance') {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/attendance`, { headers });
        if (res.ok) setAttData(await res.json());
      }
    } catch (error) {
      console.error("Failed to fetch report data:", error);
      toast.error("Could not load report data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCSV = async () => {
    if (activeReport === 'fees') {
      setIsExporting(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 400));
        const headers = ['Student Name', 'Admission No', 'Fee Type', 'Total Amount (INR)', 'Amount Paid (INR)', 'Due Date', 'Status'];
        const csvContent = "data:text/csv;charset=utf-8," 
          + headers.join(",") + "\n"
          + feeData.map(f => {
            const name = f.studentId ? `${f.studentId.firstName} ${f.studentId.lastName}` : 'Unknown';
            const admNo = f.studentId?.admissionNumber || 'N/A';
            const date = new Date(f.dueDate).toLocaleDateString();
            return `"${name}","${admNo}","${f.feeType}","${f.totalAmount}","${f.amountPaid}","${date}","${f.status}"`;
          }).join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `fee_defaulters_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Fee defaulters CSV downloaded successfully!");
      } catch (err) {
        toast.error("Failed to generate CSV export");
      } finally {
        setIsExporting(false);
      }
    } else {
      toast.error("CSV export is currently available for the Fee Defaulters tabular report.");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full space-y-5 sm:space-y-6"
    >
      {/* Page Header: Title + Subtitle & Export Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl lg:text-[38px] font-extrabold text-[#000E28] dark:text-white tracking-tight">
              Reports &amp; Analytics
            </h1>
          </div>
          <p className="text-[14px] sm:text-[16px] font-normal text-slate-500 dark:text-slate-400">
            Generate deep insights and tabular data for administration.
          </p>
        </div>

        {/* Primary Action Button: Export to CSV */}
        <div className="flex items-center shrink-0">
          <button 
            onClick={handleExportCSV}
            disabled={isExporting}
            className="group relative inline-flex items-center justify-center gap-2.5 h-[48px] sm:h-[50px] px-6 sm:px-7 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-[#0050CB] via-[#0048BD] to-[#003893] hover:from-[#0059E0] hover:to-[#0042AD] shadow-md shadow-[#0050CB]/20 hover:shadow-lg hover:shadow-[#0050CB]/30 transition-all duration-200 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed active:scale-[0.98]"
            title="Export report data to CSV"
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white/90" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4 text-white/90 group-hover:translate-y-0.5 transition-transform duration-200" />
                <span>Export to CSV</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Segmented Navigation Tabs */}
      <div className="bg-slate-100/90 dark:bg-[#000E28]/80 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 inline-flex flex-wrap sm:flex-nowrap gap-1.5 w-full sm:w-auto shadow-2xs">
        <button 
          onClick={() => setActiveReport('fees')}
          className={`relative flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
            activeReport === 'fees'
              ? 'text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:text-[#0050CB] dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/40'
          }`}
        >
          {activeReport === 'fees' && (
            <motion.div 
              layoutId="activeTabBadge" 
              className="absolute inset-0 bg-[#0050CB] rounded-xl shadow-sm shadow-[#0050CB]/25"
              transition={{ type: "spring", stiffness: 450, damping: 35 }}
            />
          )}
          <CircleDollarSign className="h-4 w-4 relative z-10 shrink-0" />
          <span className="relative z-10 font-bold whitespace-nowrap">Fee Defaulters</span>
        </button>

        <button 
          onClick={() => setActiveReport('admissions')}
          className={`relative flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
            activeReport === 'admissions'
              ? 'text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:text-[#0050CB] dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/40'
          }`}
        >
          {activeReport === 'admissions' && (
            <motion.div 
              layoutId="activeTabBadge" 
              className="absolute inset-0 bg-[#0050CB] rounded-xl shadow-sm shadow-[#0050CB]/25"
              transition={{ type: "spring", stiffness: 450, damping: 35 }}
            />
          )}
          <Users className="h-4 w-4 relative z-10 shrink-0" />
          <span className="relative z-10 font-bold whitespace-nowrap">Admission Conversion</span>
        </button>

        <button 
          onClick={() => setActiveReport('attendance')}
          className={`relative flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
            activeReport === 'attendance'
              ? 'text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:text-[#0050CB] dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/40'
          }`}
        >
          {activeReport === 'attendance' && (
            <motion.div 
              layoutId="activeTabBadge" 
              className="absolute inset-0 bg-[#0050CB] rounded-xl shadow-sm shadow-[#0050CB]/25"
              transition={{ type: "spring", stiffness: 450, damping: 35 }}
            />
          )}
          <CalendarCheck className="h-4 w-4 relative z-10 shrink-0" />
          <span className="relative z-10 font-bold whitespace-nowrap">Attendance Summary</span>
        </button>
      </div>

      {/* Main Analytics Card */}
      <div className="w-full bg-white dark:bg-[#000E28]/50 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden transition-all duration-200">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-16 sm:p-24 flex flex-col items-center justify-center text-center space-y-3.5"
            >
              <div className="relative">
                <Loader2 className="w-9 h-9 text-[#0050CB] animate-spin" />
                <div className="absolute inset-0 blur-lg bg-[#0050CB]/20 -z-10" />
              </div>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Generating analytical report data...
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={activeReport}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="w-full"
            >
              {/* TAB 1: FEE DEFAULTERS */}
              {activeReport === 'fees' && (
                <div className="w-full">
                  {/* Card Header (72-80px) */}
                  <div className="min-h-[72px] sm:min-h-[78px] px-6 sm:px-8 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 bg-white dark:bg-[#000E28]/40">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-lg sm:text-[19px] font-extrabold text-[#000E28] dark:text-white tracking-tight">
                          Pending &amp; Overdue Fees
                        </h2>
                      </div>
                    </div>

                    {/* Status badge: Positive / Neutral when 0, alerting when > 0 */}
                    <div>
                      {feeData.length === 0 ? (
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 text-xs font-bold shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          0 Records Found
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/60 text-xs font-bold shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                          {feeData.length} Records Found
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Wide Data Table Container */}
                  <div className="w-full overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[760px]">
                      <thead>
                        <tr className="bg-slate-50/80 dark:bg-slate-900/40 border-b border-slate-200/70 dark:border-slate-800 text-[12px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                          <th className="py-3.5 px-6 font-bold">Student</th>
                          <th className="py-3.5 px-6 font-bold">Fee Type</th>
                          <th className="py-3.5 px-6 font-bold">Due Date</th>
                          <th className="py-3.5 px-6 font-bold text-right">Total (₹)</th>
                          <th className="py-3.5 px-6 font-bold text-right">Paid (₹)</th>
                          <th className="py-3.5 px-6 font-bold text-right">Balance (₹)</th>
                          <th className="py-3.5 px-6 font-bold text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 text-sm">
                        {feeData.map((fee, idx) => {
                          const bal = (fee.totalAmount || 0) - (fee.amountPaid || 0);
                          const isOverdue = fee.status === 'Overdue';
                          return (
                            <tr 
                              key={fee._id || idx} 
                              className="h-16 sm:h-[68px] hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors duration-150"
                            >
                              <td className="py-3 px-6">
                                <div className="font-bold text-[#000E28] dark:text-white">
                                  {fee.studentId?.firstName} {fee.studentId?.lastName}
                                </div>
                                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                  Adm: {fee.studentId?.admissionNumber || 'N/A'}
                                </div>
                              </td>
                              <td className="py-3 px-6 font-medium text-slate-700 dark:text-slate-300">
                                {fee.feeType}
                              </td>
                              <td className="py-3 px-6 font-medium text-slate-600 dark:text-slate-400">
                                {fee.dueDate ? new Date(fee.dueDate).toLocaleDateString() : '—'}
                              </td>
                              <td className="py-3 px-6 font-bold text-right text-slate-800 dark:text-slate-200">
                                ₹{(fee.totalAmount || 0).toLocaleString('en-IN')}
                              </td>
                              <td className="py-3 px-6 font-bold text-right text-emerald-600 dark:text-emerald-400">
                                ₹{(fee.amountPaid || 0).toLocaleString('en-IN')}
                              </td>
                              <td className="py-3 px-6 font-bold text-right text-rose-600 dark:text-rose-400">
                                ₹{bal.toLocaleString('en-IN')}
                              </td>
                              <td className="py-3 px-6 text-center">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold ${
                                  isOverdue 
                                    ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60'
                                    : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60'
                                }`}>
                                  {fee.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}

                        {/* Polished Empty State (180-220px vertical height) */}
                        {feeData.length === 0 && (
                          <tr>
                            <td colSpan={7} className="py-14 sm:py-16 px-6 text-center">
                              <div className="flex flex-col items-center justify-center max-w-md mx-auto space-y-3">
                                <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center ring-8 ring-emerald-50/50 dark:ring-emerald-950/20 shadow-2xs">
                                  <CheckCircle2 className="w-7 h-7" />
                                </div>
                                <div className="space-y-1">
                                  <h3 className="text-base sm:text-lg font-extrabold text-[#000E28] dark:text-white">
                                    No pending fees
                                  </h3>
                                  <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                                    Excellent collection rate. No students currently have overdue payments.
                                  </p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 2: ADMISSION CONVERSION */}
              {activeReport === 'admissions' && (
                <div className="w-full p-6 sm:p-8 space-y-8">
                  {/* Tab Card Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#0050CB]/10 dark:bg-[#0050CB]/20 border border-[#0050CB]/20 flex items-center justify-center text-[#0050CB] dark:text-[#38BDF8] shrink-0">
                        <BarChart3 className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-lg sm:text-[19px] font-extrabold text-[#000E28] dark:text-white tracking-tight">
                          Inquiry to Admission Funnel
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Conversion tracking through all inquiry and evaluation pipeline phases.
                        </p>
                      </div>
                    </div>

                    <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
                      Pipeline Active
                    </span>
                  </div>

                  {/* 4-Card Funnel Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                    {[
                      { key: 'New Inquiry', label: 'New Inquiry', icon: UserPlus, color: 'text-[#0050CB]' },
                      { key: 'Demo Class Scheduled', label: 'Demo Scheduled', icon: Clock, color: 'text-amber-600 dark:text-amber-400' },
                      { key: 'Interested', label: 'Interested', icon: TrendingUp, color: 'text-[#FF690C]' },
                      { key: 'Admission Confirmed', label: 'Confirmed', icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400' }
                    ].map((step, idx) => {
                      const count = admData?.counts?.[step.key] || 0;
                      const Icon = step.icon;
                      return (
                        <div 
                          key={step.key} 
                          className="bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl hover:border-[#0050CB]/30 transition-all duration-200 flex flex-col justify-between"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                              {step.label}
                            </span>
                            <Icon className={`w-4 h-4 ${step.color}`} />
                          </div>
                          <div className="text-3xl sm:text-4xl font-black text-[#000E28] dark:text-white">
                            {count}
                          </div>
                          <div className="mt-2 text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                            Stage {idx + 1} of 4
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Recent Inquiries Section */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Recent Inquiries
                      </h3>
                      <span className="text-xs font-medium text-slate-400">
                        Showing latest applicants
                      </span>
                    </div>

                    {admData?.recent && admData.recent.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {admData.recent.map((adm: any) => (
                          <div 
                            key={adm._id} 
                            className="p-4 border border-slate-200/80 dark:border-slate-800 rounded-xl flex justify-between items-center bg-white dark:bg-[#000E28]/40 hover:border-[#0050CB]/30 transition-all duration-150 shadow-2xs"
                          >
                            <div className="space-y-0.5">
                              <div className="font-bold text-sm text-[#000E28] dark:text-white">
                                {adm.childName}
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">
                                Parent: {adm.parentName} • {adm.applicationDate ? new Date(adm.applicationDate).toLocaleDateString() : 'Recent'}
                              </div>
                            </div>
                            <span className="text-xs font-bold bg-[#E5EEFF] dark:bg-[#0050CB]/20 text-[#0050CB] dark:text-[#38BDF8] px-2.5 py-1 rounded-md border border-[#0050CB]/20">
                              {adm.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-10 text-center text-slate-500 dark:text-slate-400 text-sm">
                        No recent inquiries logged in the selected period.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: ATTENDANCE SUMMARY */}
              {activeReport === 'attendance' && (
                <div className="w-full p-6 sm:p-8 space-y-8">
                  {/* Tab Card Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                        <CalendarCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-lg sm:text-[19px] font-extrabold text-[#000E28] dark:text-white tracking-tight">
                          Student Attendance Overview
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Aggregate daily attendance telemetry and student check-in status.
                        </p>
                      </div>
                    </div>

                    <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      System Sync
                    </span>
                  </div>

                  {/* 3 Metric Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Total Present */}
                    <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-800/40 p-6 sm:p-7 rounded-2xl flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                          Total Present
                        </span>
                        <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                          <CheckCircle2 className="w-4 h-4" />
                        </span>
                      </div>
                      <div className="text-4xl sm:text-5xl font-black text-emerald-800 dark:text-emerald-200">
                        {attData?.counts?.['Present'] || 0}
                      </div>
                      <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-2">
                        Active in classroom sessions
                      </p>
                    </div>

                    {/* Total Absent */}
                    <div className="bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-800/40 p-6 sm:p-7 rounded-2xl flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-extrabold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                          Total Absent
                        </span>
                        <span className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300">
                          <AlertTriangle className="w-4 h-4" />
                        </span>
                      </div>
                      <div className="text-4xl sm:text-5xl font-black text-rose-800 dark:text-rose-200">
                        {attData?.counts?.['Absent'] || 0}
                      </div>
                      <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 mt-2">
                        Unexcused or notified absences
                      </p>
                    </div>

                    {/* Total Late / Half-Day */}
                    <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-800/40 p-6 sm:p-7 rounded-2xl flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-extrabold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                          Total Late / Half-Day
                        </span>
                        <span className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300">
                          <Clock className="w-4 h-4" />
                        </span>
                      </div>
                      <div className="text-4xl sm:text-5xl font-black text-amber-800 dark:text-amber-200">
                        {((attData?.counts?.['Late'] || 0) + (attData?.counts?.['Half-day'] || 0))}
                      </div>
                      <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mt-2">
                        Partial day or late arrivals
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800 text-center">
                    <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                      These statistics provide an aggregate view of student attendance records logged in the system across all classes and sessions.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
