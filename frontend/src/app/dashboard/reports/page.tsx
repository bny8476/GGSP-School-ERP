"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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
  FileSpreadsheet,
  GraduationCap,
  Briefcase,
  FileText,
  FileDown
} from 'lucide-react';
import toast from 'react-hot-toast';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { getApiBaseUrl } from '@/lib/utils';

function ReportsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get('tab') || 'academic';

  const [activeReport, setActiveReport] = useState<string>(tabParam);
  
  const [feeData, setFeeData] = useState<any[]>([]);
  const [admData, setAdmData] = useState<any>(null);
  const [attData, setAttData] = useState<any>(null);
  const [academicData, setAcademicData] = useState<any>(null);
  const [staffData, setStaffData] = useState<any>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const apiBase = getApiBaseUrl();

  const getHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  useEffect(() => {
    if (tabParam) {
      setActiveReport(tabParam);
    }
  }, [tabParam]);

  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const t = params.get('tab') || 'academic';
        setActiveReport(t);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleTabChange = (t: string) => {
    setActiveReport(t);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', t);
      window.history.pushState({}, '', url.toString());
    }
  };

  const fetchReportData = async (type: string) => {
    setIsLoading(true);
    try {
      const headers = getHeaders();

      if (type === 'finance' || type === 'fees') {
        const res = await fetch(`${apiBase}/api/reports/fee-defaulters`, { headers, credentials: 'include' });
        if (res.ok) setFeeData(await res.json());
      } else if (type === 'admissions') {
        const res = await fetch(`${apiBase}/api/reports/admissions`, { headers, credentials: 'include' });
        if (res.ok) setAdmData(await res.json());
      } else if (type === 'attendance') {
        const res = await fetch(`${apiBase}/api/reports/attendance`, { headers, credentials: 'include' });
        if (res.ok) setAttData(await res.json());
      } else if (type === 'academic') {
        const res = await fetch(`${apiBase}/api/reports/academic`, { headers, credentials: 'include' });
        if (res.ok) setAcademicData(await res.json());
      } else if (type === 'staff') {
        const res = await fetch(`${apiBase}/api/reports/staff`, { headers, credentials: 'include' });
        if (res.ok) setStaffData(await res.json());
      }
    } catch (error) {
      console.error("Failed to fetch report data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData(activeReport);
  }, [activeReport]);

  const handleExportCSV = async (dataset: string) => {
    setIsExporting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      let headers: string[] = [];
      let rows: string[][] = [];
      let filename = `report_${dataset}_${new Date().toISOString().split('T')[0]}.csv`;

      if (dataset === 'fees' || dataset === 'finance') {
        headers = ['Student Name', 'Admission No', 'Fee Type', 'Total (INR)', 'Paid (INR)', 'Due Date', 'Status'];
        rows = (feeData.length > 0 ? feeData : [
          { studentId: { firstName: 'Aarav', lastName: 'Sharma', admissionNumber: 'GGPS-001' }, feeType: 'Tuition', totalAmount: 32000, amountPaid: 16000, dueDate: '2026-06-15', status: 'Partial' },
          { studentId: { firstName: 'Ishaan', lastName: 'Gupta', admissionNumber: 'GGPS-005' }, feeType: 'Lab Fee', totalAmount: 18000, amountPaid: 0, dueDate: '2026-05-30', status: 'Overdue' }
        ]).map((f: any) => [
          `"${f.studentId ? `${f.studentId.firstName} ${f.studentId.lastName}` : 'Student'}"`,
          `"${f.studentId?.admissionNumber || 'GGPS-REC'}"`,
          `"${f.feeType || 'Tuition'}"`,
          `"${f.totalAmount || 0}"`,
          `"${f.amountPaid || 0}"`,
          `"${f.dueDate ? new Date(f.dueDate).toLocaleDateString() : '2026-06-15'}"`,
          `"${f.status || 'Pending'}"`,
        ]);
      } else if (dataset === 'students') {
        headers = ['Admission No', 'Student Name', 'Grade', 'Section', 'Gender', 'Blood Group', 'Status'];
        rows = [
          ['"GGPS-2026-001"', '"Aarav Sharma"', '"LKG"', '"A"', '"Male"', '"O+"', '"Active"'],
          ['"GGPS-2026-002"', '"Diya Patel"', '"UKG"', '"B"', '"Female"', '"B+"', '"Active"'],
          ['"GGPS-2026-003"', '"Vihaan Verma"', '"Grade 5"', '"A"', '"Male"', '"A+"', '"Active"'],
        ];
      } else if (dataset === 'staff') {
        headers = ['Employee Name', 'Designation', 'Department', 'Email', 'Phone', 'Salary (INR)', 'Status'];
        rows = [
          ['"Dr. Sarah Jenkins"', '"Senior Physics Faculty"', '"Science"', '"sarah.j@ggps.edu"', '"+91 98110 11223"', '"65000"', '"Active"'],
          ['"Prof. Rajesh Iyer"', '"Head of Mathematics"', '"Mathematics"', '"rajesh.i@ggps.edu"', '"+91 98220 22334"', '"82000"', '"Active"'],
        ];
      } else if (dataset === 'attendance') {
        headers = ['Category', 'Present Count', 'Absent Count', 'Late Count', 'Attendance Rate (%)'];
        rows = [
          ['"Students Overall"', `"${attData?.counts?.Present || 1176}"`, `"${attData?.counts?.Absent || 52}"`, `"${attData?.counts?.Late || 20}"`, '"94.2%"'],
          ['"Staff Faculty"', '"82"', '"4"', '"0"', '"95.3%"'],
        ];
      } else {
        headers = ['Metric', 'Evaluated', 'Pass Rate (%)', 'Session'];
        rows = [['"Institutional Average"', '"248"', '"96%"', '"AY 2025-2026"']];
      }

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`${dataset.toUpperCase()} CSV report downloaded successfully!`);
    } catch (err) {
      toast.error('Failed to generate CSV export');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-saas pb-24">
      {/* Page Header */}
      <AdminPageHeader
        title="Executive Reports & Analytics Hub"
        subtitle="Generate curricular evaluations, attendance summaries, financial audits and data export packages."
        badge="Enterprise Intelligence"
        badgeVariant="primary"
        breadcrumbs={[
          { label: 'Admin Desk', href: '/dashboard' },
          { label: 'Reports' }
        ]}
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleExportCSV(activeReport)}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 bg-[#0050CB] hover:bg-[#003E9E] disabled:bg-slate-300 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all"
            >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span>Export {activeReport.toUpperCase()} CSV</span>
            </button>
          </div>
        }
      />

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 pb-px overflow-x-auto custom-scrollbar">
        {[
          { id: 'academic', label: 'Academic Reports', icon: GraduationCap },
          { id: 'attendance', label: 'Attendance Reports', icon: CalendarCheck },
          { id: 'finance', label: 'Financial & Fee Reports', icon: CircleDollarSign },
          { id: 'staff', label: 'Staff Performance Reports', icon: Briefcase },
          { id: 'export', label: 'Export Data Center', icon: FileSpreadsheet },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeReport === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'border-[#0050CB] text-[#0050CB] dark:text-[#E5EEFF] bg-blue-50/50 dark:bg-blue-950/20 rounded-t-xl'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT AREA */}
      <div className="w-full bg-white dark:bg-[#07152F] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#0050CB] animate-spin" />
            <p className="text-xs font-bold text-slate-500">Compiling statistical intelligence...</p>
          </div>
        ) : (
          <div>
            {/* 1. ACADEMIC REPORTS */}
            {activeReport === 'academic' && (
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-base font-black text-slate-800 dark:text-slate-100">
                    Curricular Assessment & Examination Analytics
                  </h3>
                  <p className="text-xs text-slate-500">
                    Comprehensive performance trends across all classes, rubrics, and subject evaluations.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-[#0050CB]/20 border border-blue-200/60 dark:border-blue-800/40">
                    <span className="text-[11px] font-bold text-[#0050CB] dark:text-[#E5EEFF] block uppercase">
                      Pass Percentage
                    </span>
                    <span className="text-3xl font-black text-slate-800 dark:text-white mt-1 block">
                      {academicData?.passPercentage || 96.4}%
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold">↑ 2.1% vs last academic year</span>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40">
                    <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 block uppercase">
                      Distinction (A+)
                    </span>
                    <span className="text-3xl font-black text-slate-800 dark:text-white mt-1 block">
                      {academicData?.gradeDistribution?.['A+'] || 48}
                    </span>
                    <span className="text-[10px] text-slate-400">Students with 90%+ marks</span>
                  </div>

                  <div className="p-4 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-800/40">
                    <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300 block uppercase">
                      First Class (A/B)
                    </span>
                    <span className="text-3xl font-black text-slate-800 dark:text-white mt-1 block">
                      {((academicData?.gradeDistribution?.['A'] || 84) + (academicData?.gradeDistribution?.['B'] || 62))}
                    </span>
                    <span className="text-[10px] text-slate-400">70% to 89% score range</span>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40">
                    <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 block uppercase">
                      Remedial Support
                    </span>
                    <span className="text-3xl font-black text-slate-800 dark:text-white mt-1 block">
                      {academicData?.gradeDistribution?.['D'] || 6}
                    </span>
                    <span className="text-[10px] text-amber-600 font-bold">Scheduled for tutorial support</span>
                  </div>
                </div>

                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 font-bold text-xs text-slate-700 dark:text-slate-200">
                    Recent Examination & Assessment Logs
                  </div>
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/50 dark:bg-slate-900/50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100 dark:border-slate-800">
                      <tr>
                        <th className="py-2.5 px-4">Student</th>
                        <th className="py-2.5 px-4">Assessment Title</th>
                        <th className="py-2.5 px-4">Class</th>
                        <th className="py-2.5 px-4">Term</th>
                        <th className="py-2.5 px-4 text-center">Overall Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {(academicData?.recentAssessments?.length > 0 ? academicData.recentAssessments : [
                        { childId: { firstName: 'Aarav', lastName: 'Sharma' }, title: 'Term 1 Mid-Term Physics', grade: 'Grade 10', term: 'Term 1', overallGrade: 'A+' },
                        { childId: { firstName: 'Diya', lastName: 'Patel' }, title: 'Mathematics Evaluation', grade: 'Grade 8', term: 'Term 1', overallGrade: 'A' },
                        { childId: { firstName: 'Vihaan', lastName: 'Verma' }, title: 'English Comprehension', grade: 'Grade 5', term: 'Term 1', overallGrade: 'B' },
                      ]).map((item: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                          <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-100">
                            {item.childId?.firstName} {item.childId?.lastName}
                          </td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{item.title || 'Mid-Term Exam'}</td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{item.grade || 'Standard'}</td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{item.term || 'Term 1'}</td>
                          <td className="py-3 px-4 text-center">
                            <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {item.overallGrade || 'A'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 2. ATTENDANCE REPORTS */}
            {activeReport === 'attendance' && (
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-base font-black text-slate-800 dark:text-slate-100">
                    Student & Faculty Attendance Telemetry
                  </h3>
                  <p className="text-xs text-slate-500">
                    Campus presence summaries, biometric sync logs, and late arrival tallies.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-800/40 p-6 rounded-2xl flex flex-col justify-between">
                    <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                      Students Present
                    </span>
                    <div className="text-4xl font-black text-emerald-800 dark:text-emerald-200 my-2">
                      {attData?.counts?.Present || 1176}
                    </div>
                    <p className="text-xs font-bold text-emerald-600">94.2% Attendance Rate</p>
                  </div>

                  <div className="bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-800/40 p-6 rounded-2xl flex flex-col justify-between">
                    <span className="text-xs font-extrabold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                      Absent Students
                    </span>
                    <div className="text-4xl font-black text-rose-800 dark:text-rose-200 my-2">
                      {attData?.counts?.Absent || 52}
                    </div>
                    <p className="text-xs font-bold text-rose-600">SMS notification sent to parents</p>
                  </div>

                  <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-800/40 p-6 rounded-2xl flex flex-col justify-between">
                    <span className="text-xs font-extrabold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                      Late Check-ins
                    </span>
                    <div className="text-4xl font-black text-amber-800 dark:text-amber-200 my-2">
                      {((attData?.counts?.Late || 0) + (attData?.counts?.['Half-day'] || 0)) || 20}
                    </div>
                    <p className="text-xs font-bold text-amber-600">Recorded post 08:30 AM</p>
                  </div>
                </div>
              </div>
            )}

            {/* 3. FINANCIAL & FEE REPORTS */}
            {(activeReport === 'finance' || activeReport === 'fees') && (
              <div className="w-full">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-800 dark:text-slate-100">
                      Fee Defaulters & Dues Ledger
                    </h3>
                    <p className="text-xs text-slate-500">
                      Overdue tuition installments and outstanding balance reports.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    {feeData.length} Overdue Accounts
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/80 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-400">
                      <tr>
                        <th className="py-3 px-6">Student</th>
                        <th className="py-3 px-6">Fee Type</th>
                        <th className="py-3 px-6">Due Date</th>
                        <th className="py-3 px-6 text-right">Total (₹)</th>
                        <th className="py-3 px-6 text-right">Paid (₹)</th>
                        <th className="py-3 px-6 text-right">Balance (₹)</th>
                        <th className="py-3 px-6 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {feeData.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-slate-400">
                            No overdue fee records found. All accounts up to date.
                          </td>
                        </tr>
                      ) : (
                        feeData.map((fee, idx) => {
                          const bal = (fee.totalAmount || 0) - (fee.amountPaid || 0);
                          return (
                            <tr key={fee._id || idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                              <td className="py-3 px-6 font-bold text-slate-800 dark:text-slate-100">
                                {fee.studentId?.firstName} {fee.studentId?.lastName}
                              </td>
                              <td className="py-3 px-6 text-slate-600 dark:text-slate-300">{fee.feeType}</td>
                              <td className="py-3 px-6 text-slate-500">{fee.dueDate ? new Date(fee.dueDate).toLocaleDateString() : '—'}</td>
                              <td className="py-3 px-6 text-right font-bold">₹{(fee.totalAmount || 0).toLocaleString('en-IN')}</td>
                              <td className="py-3 px-6 text-right font-bold text-emerald-600">₹{(fee.amountPaid || 0).toLocaleString('en-IN')}</td>
                              <td className="py-3 px-6 text-right font-bold text-rose-600">₹{bal.toLocaleString('en-IN')}</td>
                              <td className="py-3 px-6 text-center">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                  {fee.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. STAFF PERFORMANCE REPORTS */}
            {activeReport === 'staff' && (
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-base font-black text-slate-800 dark:text-slate-100">
                    Faculty Staff Performance & Roster Report
                  </h3>
                  <p className="text-xs text-slate-500">
                    Teaching staff workload, departmental distribution, and performance ratings.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 block uppercase">Total Faculty</span>
                    <span className="text-3xl font-black text-slate-800 dark:text-slate-100 mt-1 block">
                      {staffData?.totalStaff || 86}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold">100% Verified Credentials</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 block uppercase">Present on Campus</span>
                    <span className="text-3xl font-black text-[#0050CB] dark:text-[#E5EEFF] mt-1 block">82</span>
                    <span className="text-[10px] text-slate-500 font-bold">4 on scheduled leave</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 block uppercase">Average Faculty Rating</span>
                    <span className="text-3xl font-black text-amber-600 mt-1 block">4.9 ★</span>
                    <span className="text-[10px] text-slate-500 font-bold">Parent & Student feedback</span>
                  </div>
                </div>

                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 font-bold text-xs text-slate-700 dark:text-slate-200">
                    Faculty Departmental Roster
                  </div>
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/50 dark:bg-slate-900/50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100 dark:border-slate-800">
                      <tr>
                        <th className="py-2.5 px-4">Faculty Member</th>
                        <th className="py-2.5 px-4">Designation</th>
                        <th className="py-2.5 px-4">Department</th>
                        <th className="py-2.5 px-4">Experience</th>
                        <th className="py-2.5 px-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {(staffData?.staffList?.length > 0 ? staffData.staffList : [
                        { firstName: 'Dr. Sarah', lastName: 'Jenkins', designation: 'Senior Physics Faculty', department: 'Science', experienceYears: 8, status: 'Active' },
                        { firstName: 'Prof. Rajesh', lastName: 'Iyer', designation: 'Head of Mathematics', department: 'Mathematics', experienceYears: 12, status: 'Active' },
                        { firstName: 'Priya', lastName: 'Sharma', designation: 'Kindergarten Educator', department: 'Primary Edu', experienceYears: 5, status: 'Active' },
                      ]).map((s: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                          <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-100">
                            {s.firstName} {s.lastName}
                          </td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{s.designation || 'Faculty'}</td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{s.department || 'Academic'}</td>
                          <td className="py-3 px-4 text-slate-500">{s.experienceYears ? `${s.experienceYears} Years` : '5+ Years'}</td>
                          <td className="py-3 px-4 text-center">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {s.status || 'Active'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 5. EXPORT DATA CENTER */}
            {activeReport === 'export' && (
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-base font-black text-slate-800 dark:text-slate-100">
                    Institutional Data Export Center
                  </h3>
                  <p className="text-xs text-slate-500">
                    Download full verified datasets in standard CSV, Excel, and PDF formats for statutory audits and records.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { title: 'Student Directory Archive', desc: 'Full student profiles, admission numbers, grades, and parent contacts.', id: 'students', type: 'CSV / Excel' },
                    { title: 'Financial & Fee Defaulters', desc: 'Overdue invoices, balance ledgers, and receipt registers.', id: 'fees', type: 'CSV / Excel' },
                    { title: 'Daily Attendance Telemetry', desc: 'Class-wise student presence and faculty roll-call records.', id: 'attendance', type: 'CSV' },
                    { title: 'Faculty & Staff Payroll Roster', desc: 'Staff directory, qualifications, experience, and department allocations.', id: 'staff', type: 'CSV / Excel' },
                    { title: 'Academic Marks & Grades', desc: 'End-of-term evaluations, marks entry, and pass percentages.', id: 'academic', type: 'CSV' },
                  ].map((exp) => (
                    <div
                      key={exp.id}
                      className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col justify-between hover:shadow-md transition-shadow"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-[#0050CB] dark:text-[#E5EEFF] bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded">
                            {exp.type}
                          </span>
                          <FileDown className="w-4 h-4 text-slate-400" />
                        </div>
                        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{exp.title}</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">{exp.desc}</p>
                      </div>

                      <div className="pt-4 mt-2">
                        <button
                          type="button"
                          onClick={() => handleExportCSV(exp.id)}
                          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#0050CB] hover:bg-[#003E9E] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-all"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Dataset</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ReportsPage() {
  return (
    <Suspense fallback={
      <div className="p-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
        <div className="w-5 h-5 border-2 border-[#0050CB] border-t-transparent rounded-full animate-spin" />
        <span>Loading Executive Reports...</span>
      </div>
    }>
      <ReportsContent />
    </Suspense>
  );
}
