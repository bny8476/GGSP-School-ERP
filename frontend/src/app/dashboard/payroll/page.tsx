"use client";

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Banknote, 
  Plus, 
  Search, 
  FileText, 
  CheckCircle2, 
  User, 
  Download, 
  Edit2, 
  Trash2, 
  Clock, 
  Calendar,
  Wallet,
  TrendingUp,
  ArrowUpRight,
  Loader2,
  Check,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function PayrollPage() {
  const [payrolls, setPayrolls] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    staffId: '',
    month: '',
    baseSalary: '',
    attendanceDays: '30',
    deductions: '0',
    bonuses: '0',
    status: 'Pending'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [payrollRes, staffRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payroll`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, { headers })
      ]);

      if (payrollRes.ok) setPayrolls(await payrollRes.json());
      if (staffRes.ok) {
        const users = await staffRes.json();
        // Filter out parents/students, assume rest are staff
        setStaffList(users.filter((u: any) => u.role?.name === 'Teacher' || u.role?.name === 'Admin' || u.role?.name === 'Receptionist'));
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch payroll records");
    } finally {
      setIsLoading(false);
    }
  };

  const getStaffName = (id: string) => {
    const s = staffList.find(s => s._id === id);
    return s ? `${s.firstName} ${s.lastName}` : 'Staff Member';
  };

  const getStaffRole = (id: string) => {
    const s = staffList.find(s => s._id === id);
    return s?.designation || s?.role?.name || 'Faculty';
  };

  const calculateNetSalary = () => {
    const base = Number(formData.baseSalary) || 0;
    const bonus = Number(formData.bonuses) || 0;
    const deduct = Number(formData.deductions) || 0;
    return Math.max(0, base + bonus - deduct);
  };

  const resetForm = () => {
    const currentMonth = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });
    setFormData({
      staffId: '', month: currentMonth, baseSalary: '', attendanceDays: '30', deductions: '0', bonuses: '0', status: 'Pending'
    });
    setEditingId(null);
    setActiveTab('list');
  };

  const handleStaffSelect = (staffId: string) => {
    const staff = staffList.find(s => s._id === staffId);
    setFormData({
      ...formData,
      staffId,
      baseSalary: staff?.salary ? staff.salary.toString() : ''
    });
  };

  const openEdit = (payroll: any) => {
    setEditingId(payroll._id);
    setFormData({
      staffId: payroll.staffId,
      month: payroll.month,
      baseSalary: payroll.baseSalary.toString(),
      attendanceDays: payroll.attendanceDays.toString(),
      deductions: payroll.deductions?.toString() || '0',
      bonuses: payroll.bonuses?.toString() || '0',
      status: payroll.status
    });
    setActiveTab('create');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this payroll record?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payroll/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Payroll record deleted');
        fetchData();
      } else {
        toast.error('Failed to delete payroll record');
      }
    } catch (error) {
      console.error(error);
      toast.error('Network error deleting payroll');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const url = editingId 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/payroll/${editingId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/payroll`;

      const payload = {
        ...formData,
        baseSalary: Number(formData.baseSalary),
        attendanceDays: Number(formData.attendanceDays),
        deductions: Number(formData.deductions),
        bonuses: Number(formData.bonuses),
        netSalary: calculateNetSalary(),
        paymentDate: formData.status === 'Paid' ? new Date() : undefined
      };

      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success(editingId ? 'Payroll updated successfully!' : 'Payroll generated successfully!');
        resetForm();
        fetchData();
      } else {
        toast.error('Error saving payroll');
      }
    } catch (error) {
      console.error(error);
      toast.error('Network error saving payroll');
    } finally {
      setIsSaving(false);
    }
  };

  const markAsPaid = async (payroll: any) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payroll/${payroll._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...payroll, status: 'Paid', paymentDate: new Date() })
      });
      if (res.ok) {
        toast.success('Marked as Paid!');
        fetchData();
      } else {
        toast.error('Failed to update payment status');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update payment status');
    }
  };

  const handleDownloadPayslip = async (payroll: any) => {
    setDownloadingId(payroll._id);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payroll/${payroll._id}/pdf`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to generate PDF');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payslip_${payroll.month.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Payslip downloaded!');
    } catch (error) {
      console.error(error);
      toast.error('Error downloading payslip');
    } finally {
      setDownloadingId(null);
    }
  };

  // Metrics calculation
  const metrics = useMemo(() => {
    const totalDisbursed = payrolls
      .filter(p => p.status === 'Paid')
      .reduce((acc, curr) => acc + (curr.netSalary || 0), 0);

    const pendingPayout = payrolls
      .filter(p => p.status === 'Pending')
      .reduce((acc, curr) => acc + (curr.netSalary || 0), 0);

    const totalRecords = payrolls.length;
    const paidRecords = payrolls.filter(p => p.status === 'Paid').length;

    return {
      totalDisbursed,
      pendingPayout,
      totalRecords,
      paidRecords
    };
  }, [payrolls]);

  const filteredPayrolls = payrolls.filter(p => 
    getStaffName(p.staffId).toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.month && p.month.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full space-y-5 sm:space-y-6"
    >
      {/* Page Header: Title + Subtitle & Action Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl lg:text-[38px] font-extrabold text-[#000E28] dark:text-white tracking-tight">
              Payroll Management
            </h1>
          </div>
          <p className="text-[14px] sm:text-[16px] font-normal text-slate-500 dark:text-slate-400">
            Manage staff compensation, bonuses, deductions, and automated payslip generation.
          </p>
        </div>

        {/* Action Button: Process New Salary */}
        <div className="flex items-center shrink-0">
          <button 
            onClick={() => {
              if (activeTab === 'create' && !editingId) {
                setActiveTab('list');
              } else {
                resetForm();
                setActiveTab('create');
              }
            }}
            className="group relative inline-flex items-center justify-center gap-2.5 h-[48px] sm:h-[50px] px-6 sm:px-7 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-[#0050CB] via-[#0048BD] to-[#003893] hover:from-[#0059E0] hover:to-[#0042AD] shadow-md shadow-[#0050CB]/20 hover:shadow-lg hover:shadow-[#0050CB]/30 transition-all duration-200 cursor-pointer active:scale-[0.98]"
            title="Process a new staff salary"
          >
            <Plus className="h-4 w-4 text-white/90 group-hover:rotate-90 transition-transform duration-200" />
            <span>{activeTab === 'create' && !editingId ? 'Back to History' : 'Process Salary'}</span>
          </button>
        </div>
      </div>

      {/* Segmented Navigation Tabs */}
      <div className="bg-slate-100/90 dark:bg-[#000E28]/80 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 inline-flex flex-wrap sm:flex-nowrap gap-1.5 w-full sm:w-auto shadow-2xs">
        <button 
          onClick={() => { setActiveTab('list'); setEditingId(null); }}
          className={`relative flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
            activeTab === 'list'
              ? 'text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:text-[#0050CB] dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/40'
          }`}
        >
          {activeTab === 'list' && (
            <motion.div 
              layoutId="activePayrollTabBadge" 
              className="absolute inset-0 bg-[#0050CB] rounded-xl shadow-sm shadow-[#0050CB]/25"
              transition={{ type: "spring", stiffness: 450, damping: 35 }}
            />
          )}
          <Banknote className="h-4 w-4 relative z-10 shrink-0" />
          <span className="relative z-10 font-bold whitespace-nowrap">Payroll History</span>
        </button>

        <button 
          onClick={() => {
            if (!editingId) resetForm();
            setActiveTab('create');
          }}
          className={`relative flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
            activeTab === 'create'
              ? 'text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:text-[#0050CB] dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/40'
          }`}
        >
          {activeTab === 'create' && (
            <motion.div 
              layoutId="activePayrollTabBadge" 
              className="absolute inset-0 bg-[#0050CB] rounded-xl shadow-sm shadow-[#0050CB]/25"
              transition={{ type: "spring", stiffness: 450, damping: 35 }}
            />
          )}
          <FileText className="h-4 w-4 relative z-10 shrink-0" />
          <span className="relative z-10 font-bold whitespace-nowrap">
            {editingId ? 'Edit Salary Record' : 'Process New Salary'}
          </span>
        </button>
      </div>

      {/* KPI Cards (Visible in List Mode) */}
      {activeTab === 'list' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Total Disbursed */}
          <div className="bg-white dark:bg-[#000E28]/60 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Disbursed This Year
              </span>
              <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#000E28] dark:text-white">
              ₹{metrics.totalDisbursed.toLocaleString('en-IN')}
            </div>
            <div className="mt-2 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{metrics.paidRecords} payouts cleared</span>
            </div>
          </div>

          {/* Pending Payout */}
          <div className="bg-white dark:bg-[#000E28]/60 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Pending Approvals
              </span>
              <span className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                <Clock className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
              ₹{metrics.pendingPayout.toLocaleString('en-IN')}
            </div>
            <div className="mt-2 text-[11px] font-semibold text-slate-400 dark:text-slate-500">
              Awaiting disbursement
            </div>
          </div>

          {/* Total Staff in Directory */}
          <div className="bg-white dark:bg-[#000E28]/60 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Active Staff
              </span>
              <span className="p-1.5 rounded-lg bg-[#E5EEFF] dark:bg-[#0050CB]/20 text-[#0050CB] dark:text-[#38BDF8]">
                <User className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#000E28] dark:text-white">
              {staffList.length}
            </div>
            <div className="mt-2 text-[11px] font-semibold text-slate-400 dark:text-slate-500">
              Teachers &amp; Administrative
            </div>
          </div>

          {/* Total Payroll Cycles */}
          <div className="bg-white dark:bg-[#000E28]/60 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total Statements
              </span>
              <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                <FileText className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#000E28] dark:text-white">
              {metrics.totalRecords}
            </div>
            <div className="mt-2 text-[11px] font-semibold text-[#0050CB] dark:text-[#38BDF8]">
              Automated PDF generation
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {activeTab === 'list' ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="w-full bg-white dark:bg-[#000E28]/50 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden"
          >
            {/* Table Card Header (72-80px) */}
            <div className="min-h-[72px] sm:min-h-[78px] px-6 sm:px-8 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#000E28]/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0050CB]/10 dark:bg-[#0050CB]/20 border border-[#0050CB]/20 flex items-center justify-center text-[#0050CB] dark:text-[#38BDF8] shrink-0">
                  <Banknote className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-[19px] font-extrabold text-[#000E28] dark:text-white tracking-tight">
                    Disbursement &amp; Payroll Records
                  </h2>
                </div>
              </div>

              {/* Search Bar + Records Count */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-64 lg:w-72">
                  <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Search staff or month..." 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs font-medium bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#0050CB]/30 focus:border-[#0050CB] text-[#000E28] dark:text-white placeholder-slate-400 transition-colors"
                  />
                </div>

                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-xs font-bold shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0050CB]" />
                  {filteredPayrolls.length} Records
                </span>
              </div>
            </div>

            {/* Table Container */}
            <div className="w-full overflow-x-auto custom-scrollbar">
              {isLoading ? (
                <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
                  <Loader2 className="w-8 h-8 text-[#0050CB] animate-spin" />
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Loading payroll data...</p>
                </div>
              ) : filteredPayrolls.length === 0 ? (
                <div className="py-16 px-6 text-center">
                  <div className="flex flex-col items-center justify-center max-w-md mx-auto space-y-3">
                    <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center ring-8 ring-slate-100/60 dark:ring-slate-800/30">
                      <Banknote className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base sm:text-lg font-extrabold text-[#000E28] dark:text-white">
                        No payroll records found
                      </h3>
                      <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                        {searchQuery 
                          ? "Try adjusting your search criteria or clear the query." 
                          : "Process a new staff salary using the button above to generate payslips."}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <table className="w-full text-left border-collapse min-w-[850px]">
                  <thead>
                    <tr className="bg-slate-50/80 dark:bg-slate-900/40 border-b border-slate-200/70 dark:border-slate-800 text-[12px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                      <th className="py-3.5 px-6 font-bold">Staff Member</th>
                      <th className="py-3.5 px-6 font-bold">Period</th>
                      <th className="py-3.5 px-6 font-bold">Breakdown</th>
                      <th className="py-3.5 px-6 font-bold text-right">Net Salary</th>
                      <th className="py-3.5 px-6 font-bold text-center">Status</th>
                      <th className="py-3.5 px-6 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 text-sm">
                    {filteredPayrolls.map((payroll) => {
                      const isPaid = payroll.status === 'Paid';
                      const isDownloadingThis = downloadingId === payroll._id;

                      return (
                        <tr 
                          key={payroll._id}
                          className="h-16 sm:h-[68px] hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors duration-150"
                        >
                          {/* Staff Column */}
                          <td className="py-3 px-6 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#0050CB] to-[#38BDF8] text-white flex items-center justify-center font-black text-xs shadow-2xs shrink-0 ring-2 ring-white dark:ring-[#000E28]">
                                {getStaffName(payroll.staffId).charAt(0)}
                              </div>
                              <div>
                                <div className="font-extrabold text-[#000E28] dark:text-white">
                                  {getStaffName(payroll.staffId)}
                                </div>
                                <div className="text-xs font-semibold text-[#0050CB] dark:text-[#38BDF8]">
                                  {getStaffRole(payroll.staffId)}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Period */}
                          <td className="py-3 px-6 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200/60 dark:border-slate-700">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              {payroll.month}
                            </span>
                          </td>

                          {/* Breakdown */}
                          <td className="py-3 px-6 whitespace-nowrap text-xs">
                            <div className="space-y-0.5">
                              <div className="text-slate-600 dark:text-slate-300 font-medium">
                                <span className="w-14 inline-block text-slate-400">Base:</span> 
                                ₹{(payroll.baseSalary || 0).toLocaleString('en-IN')}
                              </div>
                              <div className="text-emerald-600 dark:text-emerald-400 font-medium">
                                <span className="w-14 inline-block text-slate-400">Bonus:</span> 
                                +₹{(payroll.bonuses || 0).toLocaleString('en-IN')}
                              </div>
                              <div className="text-rose-600 dark:text-rose-400 font-medium">
                                <span className="w-14 inline-block text-slate-400">Deduct:</span> 
                                -₹{(payroll.deductions || 0).toLocaleString('en-IN')}
                              </div>
                            </div>
                          </td>

                          {/* Net Pay */}
                          <td className="py-3 px-6 whitespace-nowrap text-right">
                            <div className="text-base sm:text-lg font-black text-[#000E28] dark:text-white">
                              ₹{(payroll.netSalary || 0).toLocaleString('en-IN')}
                            </div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                              {payroll.attendanceDays || 30} Days Attended
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-3 px-6 whitespace-nowrap text-center">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                              isPaid 
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60'
                                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${isPaid ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                              {payroll.status}
                            </span>
                            {isPaid && payroll.paymentDate && (
                              <div className="text-[10px] text-slate-400 font-medium mt-1">
                                {new Date(payroll.paymentDate).toLocaleDateString()}
                              </div>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-6 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {!isPaid && (
                                <button 
                                  onClick={() => markAsPaid(payroll)} 
                                  title="Mark as Paid" 
                                  className="p-2 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-xl transition-colors cursor-pointer border border-emerald-200/60 dark:border-emerald-800/50"
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                </button>
                              )}
                              
                              <button 
                                onClick={() => handleDownloadPayslip(payroll)} 
                                disabled={isDownloadingThis}
                                title="Download Payslip PDF" 
                                className="p-2 text-[#0050CB] dark:text-[#38BDF8] bg-[#E5EEFF] dark:bg-[#0050CB]/20 hover:bg-[#D4E4FF] dark:hover:bg-[#0050CB]/30 rounded-xl transition-colors cursor-pointer border border-[#0050CB]/20 disabled:opacity-50"
                              >
                                {isDownloadingThis ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Download className="h-4 w-4" />
                                )}
                              </button>

                              <button 
                                onClick={() => openEdit(payroll)} 
                                title="Edit Record" 
                                className="p-2 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>

                              <button 
                                onClick={() => handleDelete(payroll._id)} 
                                title="Delete Record" 
                                className="p-2 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded-xl transition-colors cursor-pointer border border-rose-200/60 dark:border-rose-800/50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>
        ) : (
          /* TAB: PROCESS SALARY / EDIT FORM */
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="w-full bg-white dark:bg-[#000E28]/50 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 sm:p-8 lg:p-10"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Form Title */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0050CB]/10 dark:bg-[#0050CB]/20 border border-[#0050CB]/20 flex items-center justify-center text-[#0050CB] dark:text-[#38BDF8] shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-[20px] font-extrabold text-[#000E28] dark:text-white tracking-tight">
                      {editingId ? 'Edit Staff Compensation Record' : 'Process Monthly Salary Statement'}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Configure base salary, attendance days, bonuses, and tax/leave deductions.
                    </p>
                  </div>
                </div>

                {editingId && (
                  <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 text-xs font-bold">
                    Editing Mode
                  </span>
                )}
              </div>

              {/* Two Column Layout: Inputs on left, Live Net Pay summary on right */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left 2 Cols: Form Inputs */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        Select Staff Member *
                      </label>
                      <select 
                        required 
                        className="w-full rounded-xl border border-slate-200/80 dark:border-slate-700 py-2.5 px-3.5 focus:ring-2 focus:ring-[#0050CB]/30 focus:border-[#0050CB] font-semibold text-sm bg-slate-50/50 dark:bg-slate-800/60 text-[#000E28] dark:text-white" 
                        value={formData.staffId} 
                        onChange={e => handleStaffSelect(e.target.value)}
                      >
                        <option value="">Select Faculty / Staff...</option>
                        {staffList.map(s => (
                          <option key={s._id} value={s._id}>
                            {s.firstName} {s.lastName} — ({s.designation || s.role?.name || 'Staff'})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        Salary Month *
                      </label>
                      <input 
                        required 
                        type="text" 
                        placeholder="e.g. June 2026" 
                        className="w-full rounded-xl border border-slate-200/80 dark:border-slate-700 py-2.5 px-3.5 focus:ring-2 focus:ring-[#0050CB]/30 focus:border-[#0050CB] font-semibold text-sm bg-slate-50/50 dark:bg-slate-800/60 text-[#000E28] dark:text-white" 
                        value={formData.month} 
                        onChange={e => setFormData({...formData, month: e.target.value})} 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        Base Monthly Salary (₹) *
                      </label>
                      <input 
                        required 
                        type="number" 
                        min="0" 
                        placeholder="35000"
                        className="w-full rounded-xl border border-slate-200/80 dark:border-slate-700 py-2.5 px-3.5 focus:ring-2 focus:ring-[#0050CB]/30 focus:border-[#0050CB] font-semibold text-sm bg-slate-50/50 dark:bg-slate-800/60 text-[#000E28] dark:text-white" 
                        value={formData.baseSalary} 
                        onChange={e => setFormData({...formData, baseSalary: e.target.value})} 
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        Days Attended *
                      </label>
                      <input 
                        required 
                        type="number" 
                        min="0" 
                        max="31" 
                        className="w-full rounded-xl border border-slate-200/80 dark:border-slate-700 py-2.5 px-3.5 focus:ring-2 focus:ring-[#0050CB]/30 focus:border-[#0050CB] font-semibold text-sm bg-slate-50/50 dark:bg-slate-800/60 text-[#000E28] dark:text-white" 
                        value={formData.attendanceDays} 
                        onChange={e => setFormData({...formData, attendanceDays: e.target.value})} 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                        Bonuses &amp; Allowances (₹)
                      </label>
                      <input 
                        type="number" 
                        min="0" 
                        className="w-full rounded-xl border border-emerald-200 dark:border-emerald-800/60 py-2.5 px-3.5 focus:ring-2 focus:ring-emerald-500 font-semibold text-sm bg-emerald-50/40 dark:bg-emerald-950/20 text-[#000E28] dark:text-white" 
                        value={formData.bonuses} 
                        onChange={e => setFormData({...formData, bonuses: e.target.value})} 
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-2">
                        Deductions &amp; Unpaid Leaves (₹)
                      </label>
                      <input 
                        type="number" 
                        min="0" 
                        className="w-full rounded-xl border border-rose-200 dark:border-rose-800/60 py-2.5 px-3.5 focus:ring-2 focus:ring-rose-500 font-semibold text-sm bg-rose-50/40 dark:bg-rose-950/20 text-[#000E28] dark:text-white" 
                        value={formData.deductions} 
                        onChange={e => setFormData({...formData, deductions: e.target.value})} 
                      />
                    </div>
                  </div>
                </div>

                {/* Right 1 Col: Live Net Salary Preview & Status */}
                <div className="bg-slate-50/80 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-3">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Summary Preview
                      </span>
                      <Wallet className="w-4 h-4 text-[#0050CB]" />
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between text-slate-600 dark:text-slate-300">
                        <span>Base Salary</span>
                        <span className="font-bold">₹{Number(formData.baseSalary || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                        <span>Bonus / Incentives</span>
                        <span className="font-bold">+₹{Number(formData.bonuses || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-rose-600 dark:text-rose-400">
                        <span>Deductions</span>
                        <span className="font-bold">-₹{Number(formData.deductions || 0).toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800">
                      <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Total Net Payable
                      </p>
                      <p className="text-3xl font-black text-[#0050CB] dark:text-[#38BDF8] mt-1">
                        ₹{calculateNetSalary().toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div className="pt-2">
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        Payment Status
                      </label>
                      <select 
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 py-2 px-3 font-bold text-xs bg-white dark:bg-slate-800 text-[#000E28] dark:text-white" 
                        value={formData.status} 
                        onChange={e => setFormData({...formData, status: e.target.value})}
                      >
                        <option value="Pending">Pending (Draft)</option>
                        <option value="Paid">Mark as Paid Immediately</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-4">
                    <button 
                      type="submit" 
                      disabled={isSaving} 
                      className="w-full h-11 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#0050CB] via-[#0048BD] to-[#003893] hover:from-[#0059E0] hover:to-[#0042AD] shadow-md shadow-[#0050CB]/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Saving Payroll...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>{editingId ? 'Update Record' : 'Generate Statement'}</span>
                        </>
                      )}
                    </button>

                    <button 
                      type="button" 
                      onClick={resetForm} 
                      className="w-full h-10 rounded-xl font-bold text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
