"use client";

import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Clock, ShieldCheck, FileText, WalletCards, DollarSign, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CentralApprovalCenter() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [payroll, setPayroll] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'leaves' | 'admissions' | 'payroll'>('leaves');

  const fetchPendingApprovals = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [leavesRes, admissionsRes, payrollRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/leaves`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admissions?stage=Submitted`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payroll`, { headers }),
      ]);

      if (leavesRes.ok) setLeaves(await leavesRes.json());
      if (admissionsRes.ok) setAdmissions(await admissionsRes.json());
      if (payrollRes.ok) setPayroll(await payrollRes.json());
    } catch (e) {
      console.error('Failed to load pending approvals', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const handleApproveLeave = async (id: string, status: 'Approved' | 'Rejected') => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/leaves/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success(`Leave request ${status.toLowerCase()} successfully!`);
        fetchPendingApprovals();
      }
    } catch (e) {
      toast.error('Failed to update leave request');
    }
  };

  const handleApproveAdmission = async (id: string, stage: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admissions/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage }),
      });
      if (res.ok) {
        toast.success(`Admission moved to ${stage}!`);
        fetchPendingApprovals();
      }
    } catch (e) {
      toast.error('Failed to update admission stage');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Central Approval Center</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Single-page administrative decision dashboard for Leave Requests, Admission Pipeline, Payroll, and Expenses.
          </p>
        </div>

        <button
          onClick={fetchPendingApprovals}
          className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          title="Refresh pending approvals"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('leaves')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'leaves' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Staff & Student Leaves ({leaves.filter((l) => l.status === 'Pending').length})
        </button>
        <button
          onClick={() => setActiveTab('admissions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'admissions' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Admission Applications ({admissions.length})
        </button>
        <button
          onClick={() => setActiveTab('payroll')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'payroll' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Payroll Reviews ({payroll.length})
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'leaves' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 md:p-8 space-y-4">
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-indigo-600" /> Pending Leave Requests
          </h2>

          {leaves.filter((l) => l.status === 'Pending').length === 0 ? (
            <div className="p-8 text-center text-slate-400 font-medium">
              No pending leave requests requiring approval.
            </div>
          ) : (
            <div className="space-y-3">
              {leaves
                .filter((l) => l.status === 'Pending')
                .map((leave) => (
                  <div key={leave._id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="font-extrabold text-slate-800 dark:text-slate-100">
                        {leave.staffId ? `${leave.staffId.firstName} ${leave.staffId.lastName}` : 'Staff Member'}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Reason: <span className="font-bold text-slate-700 dark:text-slate-300">{leave.reason}</span> • {new Date(leave.startDate).toLocaleDateString()} to {new Date(leave.endDate).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => handleApproveLeave(leave._id, 'Approved')}
                        className="px-3 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-emerald-500 transition-colors flex items-center"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                      </button>
                      <button
                        onClick={() => handleApproveLeave(leave._id, 'Rejected')}
                        className="px-3 py-1.5 bg-rose-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-rose-500 transition-colors flex items-center"
                      >
                        <XCircle className="h-4 w-4 mr-1" /> Reject
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'admissions' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 md:p-8 space-y-4">
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-indigo-600" /> Submitted Admissions
          </h2>

          {admissions.length === 0 ? (
            <div className="p-8 text-center text-slate-400 font-medium">
              No new submitted admission applications awaiting review.
            </div>
          ) : (
            <div className="space-y-3">
              {admissions.map((adm) => (
                <div key={adm._id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-slate-800 dark:text-slate-100">
                        {adm.childFirstName} {adm.childLastName}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        {adm.gradeAppliedFor}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Parent: {adm.parentName} ({adm.email}) • App #: {adm.applicationNumber || 'N/A'}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => handleApproveAdmission(adm._id, 'Under Review')}
                      className="px-3 py-1.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-indigo-500"
                    >
                      Move to Under Review
                    </button>
                    <button
                      onClick={() => handleApproveAdmission(adm._id, 'Approved')}
                      className="px-3 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-emerald-500"
                    >
                      Approve Admission
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'payroll' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 md:p-8 space-y-4">
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center">
            <WalletCards className="h-5 w-5 mr-2 text-indigo-600" /> Payroll Records Overview
          </h2>

          {payroll.length === 0 ? (
            <div className="p-8 text-center text-slate-400 font-medium">
              No payroll items calculated.
            </div>
          ) : (
            <div className="space-y-3">
              {payroll.map((pay) => (
                <div key={pay._id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <div>
                    <p className="font-extrabold text-slate-800 dark:text-slate-100">
                      {pay.staffId ? `${pay.staffId.firstName} ${pay.staffId.lastName}` : 'Staff Member'}
                    </p>
                    <p className="text-xs text-slate-400">Month: {pay.month} • Status: {pay.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-800 dark:text-white">₹{pay.netSalary}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
