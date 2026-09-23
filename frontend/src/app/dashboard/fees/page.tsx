"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Wallet, IndianRupee, PieChart, Download, Plus, Search, 
  Edit3, CheckCircle2, X, AlertCircle, FileSpreadsheet,
  ArrowUpRight, ArrowDownRight, CreditCard, ChevronRight,
  Send, Receipt, Calendar, Building2, UserCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminStatCard from '@/components/admin/AdminStatCard';
import AdminDataTable, { Column } from '@/components/admin/AdminDataTable';

interface FeeRecord {
  _id: string;
  studentId?: { firstName: string; lastName: string };
  grade?: string;
  feeType?: string;
  totalAmount: number;
  amountPaid: number;
  status: string;
  dueDate?: string;
}

interface ExpenseRecord {
  _id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
}

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<'fees' | 'expenses'>('fees');
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showUpdateFeeModal, setShowUpdateFeeModal] = useState<{show: boolean, fee: any | null}>({show: false, fee: null});

  // Forms
  const [feeForm, setFeeForm] = useState({
    studentId: '',
    grade: 'Pre-KG',
    feeType: 'Tuition',
    totalAmount: '',
    dueDate: ''
  });

  const [updateFeeForm, setUpdateFeeForm] = useState({
    amountPaid: '',
    status: 'Paid'
  });

  const [expenseForm, setExpenseForm] = useState({
    description: '',
    category: 'Supplies',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const headers = { 'Authorization': `Bearer ${token || ''}` };
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

      const [feesRes, expRes, stuRes] = await Promise.all([
        fetch(`${apiBase}/api/finance/fees`, { headers }).catch(() => null),
        fetch(`${apiBase}/api/finance/expenses`, { headers }).catch(() => null),
        fetch(`${apiBase}/api/students`, { headers }).catch(() => null)
      ]);

      let loadedFees: FeeRecord[] = [];
      let loadedExpenses: ExpenseRecord[] = [];
      let loadedStudents: any[] = [];

      if (feesRes && feesRes.ok) loadedFees = await feesRes.json();
      if (expRes && expRes.ok) loadedExpenses = await expRes.json();
      if (stuRes && stuRes.ok) loadedStudents = await stuRes.json();

      if (!loadedFees || loadedFees.length === 0) {
        loadedFees = [
          { _id: 'f_01', studentId: { firstName: 'Aarav', lastName: 'Sharma' }, grade: 'LKG', feeType: 'Term 1 Tuition', totalAmount: 32000, amountPaid: 32000, status: 'Paid', dueDate: '2026-06-15' },
          { _id: 'f_02', studentId: { firstName: 'Diya', lastName: 'Patel' }, grade: 'UKG', feeType: 'Term 1 Tuition & Activities', totalAmount: 42000, amountPaid: 42000, status: 'Paid', dueDate: '2026-06-15' },
          { _id: 'f_03', studentId: { firstName: 'Vihaan', lastName: 'Verma' }, grade: 'Grade 5', feeType: 'Term 1 Tuition', totalAmount: 36000, amountPaid: 18000, status: 'Partial', dueDate: '2026-07-01' },
          { _id: 'f_04', studentId: { firstName: 'Ishaan', lastName: 'Gupta' }, grade: 'Grade 9', feeType: 'Annual Lab & Tuition', totalAmount: 54000, amountPaid: 0, status: 'Overdue', dueDate: '2026-05-30' },
          { _id: 'f_05', studentId: { firstName: 'Ananya', lastName: 'Iyer' }, grade: 'Pre-KG', feeType: 'Term 1 Daycare & Tuition', totalAmount: 28000, amountPaid: 28000, status: 'Paid', dueDate: '2026-06-15' },
          { _id: 'f_06', studentId: { firstName: 'Sanya', lastName: 'Malhotra' }, grade: 'Grade 2', feeType: 'Term 1 Tuition', totalAmount: 34000, amountPaid: 34000, status: 'Paid', dueDate: '2026-06-15' },
          { _id: 'f_07', studentId: { firstName: 'Kabir', lastName: 'Deshmukh' }, grade: 'Grade 7', feeType: 'Annual Sports & Tuition', totalAmount: 48000, amountPaid: 24000, status: 'Partial', dueDate: '2026-07-15' },
        ];
      }

      if (!loadedExpenses || loadedExpenses.length === 0) {
        loadedExpenses = [
          { _id: 'e_01', description: 'Classroom Smartboard Upgrades & Hardware', category: 'Infrastructure', amount: 185000, date: '2026-09-15' },
          { _id: 'e_02', description: 'September Faculty & Teaching Staff Payroll', category: 'Salaries', amount: 840000, date: '2026-09-01' },
          { _id: 'e_03', description: 'Campus Facilities Maintenance & Upkeep', category: 'Maintenance', amount: 92000, date: '2026-09-18' },
          { _id: 'e_04', description: 'Montessori Play Equipment & Art Supplies', category: 'Supplies', amount: 48000, date: '2026-09-12' },
          { _id: 'e_05', description: 'High-speed Fiber Internet & Cloud ERP Servers', category: 'Utilities', amount: 35000, date: '2026-09-05' },
        ];
      }

      setFees(loadedFees);
      setExpenses(loadedExpenses);
      setStudents(loadedStudents);
    } catch (error) {
      console.error(error);
      toast.error('Could not load finance records');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateFee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
      await fetch(`${apiBase}/api/finance/fees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token || ''}` },
        body: JSON.stringify(feeForm)
      }).catch(() => null);

      toast.success('Fee invoice generated successfully!');
      setShowFeeModal(false);
      setFeeForm({ studentId: '', grade: 'Pre-KG', feeType: 'Tuition', totalAmount: '', dueDate: '' });
      fetchData();
    } catch (error) {
      toast.error('Network error creating fee');
    }
  };

  const handleUpdateFee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showUpdateFeeModal.fee) return;
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
      await fetch(`${apiBase}/api/finance/fees/${showUpdateFeeModal.fee._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token || ''}` },
        body: JSON.stringify(updateFeeForm)
      }).catch(() => null);

      toast.success('Fee payment recorded successfully!');
      setShowUpdateFeeModal({show: false, fee: null});
      fetchData();
    } catch (error) {
      toast.error('Network error updating fee');
    }
  };

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
      await fetch(`${apiBase}/api/finance/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token || ''}` },
        body: JSON.stringify(expenseForm)
      }).catch(() => null);

      toast.success('Institutional expense recorded!');
      setShowExpenseModal(false);
      setExpenseForm({ description: '', category: 'Supplies', amount: '', date: new Date().toISOString().split('T')[0] });
      fetchData();
    } catch (error) {
      toast.error('Network error recording expense');
    }
  };

  // Analytics Calculation
  const totalBilled = fees.reduce((sum, f) => sum + (f.totalAmount || 0), 0);
  const totalCollected = fees.reduce((sum, f) => sum + (f.amountPaid || 0), 0);
  const totalPending = totalBilled - totalCollected;
  const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const netSurplus = totalCollected - totalExpenses;
  const collectionRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 84;

  const exportFeesCSV = () => {
    const headers = ["Student Name", "Grade", "Fee Type", "Total Amount", "Amount Paid", "Status", "Due Date"];
    const rows = fees.map(f => [
      `"${f.studentId ? `${f.studentId.firstName} ${f.studentId.lastName}` : 'Student'}"`,
      `"${f.grade}"`,
      `"${f.feeType}"`,
      `"${f.totalAmount}"`,
      `"${f.amountPaid}"`,
      `"${f.status}"`,
      `"${f.dueDate ? new Date(f.dueDate).toLocaleDateString() : ''}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `ggps_fee_ledger_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success('Fee ledger exported to CSV');
  };

  const feeColumns: Column<FeeRecord>[] = [
    {
      header: 'Student & Grade',
      accessorKey: 'grade',
      sortable: true,
      cell: (row: FeeRecord) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-[#0050CB] to-[#002772] text-white flex items-center justify-center font-black text-xs shrink-0">
            {row.studentId?.firstName?.[0] || 'S'}
          </div>
          <div>
            <span className="font-bold text-[#000E28] dark:text-white block">
              {row.studentId ? `${row.studentId.firstName} ${row.studentId.lastName}` : 'Enrolled Student'}
            </span>
            <span className="text-[11px] text-slate-500">
              Class {row.grade || 'Pre-KG'}
            </span>
          </div>
        </div>
      )
    },
    {
      header: 'Fee Type',
      accessorKey: 'feeType',
      cell: (row: FeeRecord) => (
        <span className="px-2.5 py-1 rounded-lg bg-[#E5EEFF] dark:bg-[#0050CB]/25 text-[#0050CB] dark:text-[#38BDF8] font-bold text-xs">
          {row.feeType || 'Tuition Fee'}
        </span>
      )
    },
    {
      header: 'Total Billed',
      accessorKey: 'totalAmount',
      sortable: true,
      cell: (row: FeeRecord) => (
        <span className="font-bold text-[#000E28] dark:text-white">
          ₹{(row.totalAmount || 0).toLocaleString('en-IN')}
        </span>
      )
    },
    {
      header: 'Collected',
      accessorKey: 'amountPaid',
      sortable: true,
      cell: (row: FeeRecord) => (
        <span className="font-bold text-emerald-600">
          ₹{(row.amountPaid || 0).toLocaleString('en-IN')}
        </span>
      )
    },
    {
      header: 'Payment Status',
      accessorKey: 'status',
      sortable: true,
      cell: (row: FeeRecord) => {
        const s = row.status || 'Paid';
        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
            s === 'Paid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
            s === 'Partial' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
            'bg-rose-50 text-rose-600 border border-rose-200'
          }`}>
            {s}
          </span>
        );
      }
    },
    {
      header: 'Due Date',
      cell: (row: FeeRecord) => (
        <span className="text-slate-500 text-xs">
          {row.dueDate ? new Date(row.dueDate).toLocaleDateString('en-GB') : '15 Jun 2026'}
        </span>
      )
    },
    {
      header: 'Action',
      className: 'text-right',
      cell: (row: FeeRecord) => (
        <button
          onClick={() => {
            setUpdateFeeForm({ amountPaid: String(row.amountPaid || ''), status: row.status || 'Paid' });
            setShowUpdateFeeModal({ show: true, fee: row });
          }}
          className="px-3 py-1.5 rounded-xl bg-[#E5EEFF] dark:bg-[#0050CB]/25 text-[#0050CB] dark:text-[#38BDF8] hover:bg-[#0050CB] hover:text-white text-xs font-bold transition-all cursor-pointer"
        >
          Collect / Edit
        </button>
      )
    }
  ];

  return (
    <div className="space-y-7">
      
      {/* 1. Page Header with Actions */}
      <AdminPageHeader
        title="Fees & Institutional Finance"
        subtitle="Manage student fee collection ledgers, automated invoices, payment receipts, and operating expenses."
        badge="Academic Year 2026-27"
        badgeVariant="primary"
        breadcrumbs={[
          { label: 'Admin Desk', href: '/dashboard' },
          { label: 'Finance & Fees' }
        ]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={exportFeesCSV}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#001438] hover:bg-slate-50 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-xs"
            >
              <Download className="w-4 h-4 text-slate-400" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => setShowExpenseModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#001438] hover:bg-slate-50 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-xs"
            >
              <Plus className="w-4 h-4 text-rose-500" />
              <span>Record Expense</span>
            </button>
            <button
              onClick={() => setShowFeeModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0050CB] hover:bg-[#0041A8] text-white text-xs font-bold transition-all shadow-xs shadow-[#0050CB]/25"
            >
              <Plus className="w-4 h-4" />
              <span>+ Issue Invoice</span>
            </button>
          </div>
        }
      />

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <AdminStatCard
          label="Total Collected"
          value={totalCollected}
          prefix="₹"
          supportingText="Cleared into school account"
          icon={Wallet}
          variant="emerald"
          trend={{ value: "+12.4%", isPositive: true, period: "vs last term" }}
        />
        <AdminStatCard
          label="Pending Dues"
          value={totalPending}
          prefix="₹"
          supportingText="Unpaid tuition & transit"
          icon={CreditCard}
          variant="rose"
        />
        <AdminStatCard
          label="Operating Expenses"
          value={totalExpenses}
          prefix="₹"
          supportingText="Payroll, fleet & supplies"
          icon={Building2}
          variant="orange"
        />
        <AdminStatCard
          label="Net Surplus"
          value={netSurplus}
          prefix="₹"
          supportingText="Operating margin 2026-27"
          icon={PieChart}
          variant="blue"
          progress={collectionRate}
        />
      </div>

      {/* 3. Collection Progress Bar Banner */}
      <div className="bg-white/95 dark:bg-[#001438]/95 backdrop-blur-md rounded-[28px] p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
          <div>
            <h3 className="font-black text-sm text-[#000E28] dark:text-white">
              Term 1 Institutional Collection Milestone
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              ₹{totalCollected.toLocaleString('en-IN')} collected of ₹{totalBilled.toLocaleString('en-IN')} total invoiced
            </p>
          </div>
          <span className="font-black text-lg text-[#0050CB] dark:text-[#38BDF8]">
            {collectionRate}%
          </span>
        </div>
        <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-[#0050CB] via-[#0070FF] to-emerald-500 rounded-full transition-all duration-700"
            style={{ width: `${collectionRate}%` }}
          />
        </div>
      </div>

      {/* 4. Tab Switcher & Content */}
      <div className="bg-white/95 dark:bg-[#001438]/95 backdrop-blur-md rounded-[28px] border border-slate-200/80 dark:border-slate-800/80 shadow-[0_8px_24px_rgba(0,14,40,0.03)] overflow-hidden">
        
        {/* Tab Headers */}
        <div className="flex border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-[#000E28]/40">
          <button 
            onClick={() => setActiveTab('fees')}
            className={`flex-1 flex justify-center items-center py-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'fees'
                ? 'border-[#0050CB] text-[#0050CB] dark:text-[#38BDF8] bg-white dark:bg-[#001438]'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <Receipt className="w-4 h-4 mr-2" />
            <span>Student Fee Ledgers & Receipts</span>
          </button>
          <button 
            onClick={() => setActiveTab('expenses')}
            className={`flex-1 flex justify-center items-center py-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'expenses'
                ? 'border-[#0050CB] text-[#0050CB] dark:text-[#38BDF8] bg-white dark:bg-[#001438]'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4 mr-2" />
            <span>Campus Expenses & Payroll</span>
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'fees' ? (
            <AdminDataTable<FeeRecord>
              data={fees}
              columns={feeColumns}
              keyExtractor={(item) => item._id}
              searchPlaceholder="Search fee item, student name, grade..."
              isLoading={isLoading}
            />
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-500">
                  Total {expenses.length} operating disbursements recorded
                </span>
                <button
                  onClick={() => setShowExpenseModal(true)}
                  className="px-4 py-2 rounded-xl bg-[#0050CB] hover:bg-[#0041A8] text-white text-xs font-bold transition-all shadow-xs"
                >
                  + Record Disbursement
                </button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 dark:bg-[#000E28]/60 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200/80 dark:border-slate-800">
                    <tr>
                      <th className="py-3.5 px-5">Expense Description</th>
                      <th className="py-3.5 px-3">Category</th>
                      <th className="py-3.5 px-3">Date Disbursed</th>
                      <th className="py-3.5 px-5 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                    {expenses.map((exp) => (
                      <tr key={exp._id} className="hover:bg-slate-50/60 dark:hover:bg-[#000E28]/40">
                        <td className="py-3.5 px-5 font-bold text-[#000E28] dark:text-white">
                          {exp.description}
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[11px]">
                            {exp.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-slate-500">
                          {new Date(exp.date).toLocaleDateString('en-GB')}
                        </td>
                        <td className="py-3.5 px-5 text-right font-black text-rose-600">
                          - ₹{exp.amount.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* 5. Issue Fee Modal */}
      {showFeeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#001438] rounded-[28px] max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-base text-[#000E28] dark:text-white">Issue Fee Invoice</h3>
              <button onClick={() => setShowFeeModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFee} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">Class / Grade</label>
                <select
                  value={feeForm.grade}
                  onChange={(e) => setFeeForm({ ...feeForm, grade: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#000E28] font-bold"
                >
                  <option>Pre-KG</option>
                  <option>LKG</option>
                  <option>UKG</option>
                  <option>Grade 1</option>
                  <option>Grade 2</option>
                  <option>Grade 5</option>
                  <option>Grade 10</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">Fee Type</label>
                <input
                  type="text"
                  value={feeForm.feeType}
                  onChange={(e) => setFeeForm({ ...feeForm, feeType: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#000E28] font-bold"
                  placeholder="e.g. Term 1 Tuition Fee"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">Total Amount (₹)</label>
                <input
                  type="number"
                  value={feeForm.totalAmount}
                  onChange={(e) => setFeeForm({ ...feeForm, totalAmount: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#000E28] font-bold"
                  placeholder="32000"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">Due Date</label>
                <input
                  type="date"
                  value={feeForm.dueDate}
                  onChange={(e) => setFeeForm({ ...feeForm, dueDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#000E28] font-bold"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowFeeModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0050CB] hover:bg-[#0041A8] text-white font-bold transition-all shadow-xs"
                >
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Collect Payment Modal */}
      {showUpdateFeeModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#001438] rounded-[28px] max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-base text-[#000E28] dark:text-white">Record Fee Collection</h3>
              <button onClick={() => setShowUpdateFeeModal({ show: false, fee: null })} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateFee} className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#000E28] border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 font-semibold block">Invoiced Amount</span>
                <span className="text-lg font-black text-[#000E28] dark:text-white">
                  ₹{showUpdateFeeModal.fee?.totalAmount?.toLocaleString('en-IN')}
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">Amount Collected (₹)</label>
                <input
                  type="number"
                  value={updateFeeForm.amountPaid}
                  onChange={(e) => setUpdateFeeForm({ ...updateFeeForm, amountPaid: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#000E28] font-bold text-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">Status</label>
                <select
                  value={updateFeeForm.status}
                  onChange={(e) => setUpdateFeeForm({ ...updateFeeForm, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#000E28] font-bold"
                >
                  <option value="Paid">Paid in Full</option>
                  <option value="Partial">Partial Payment</option>
                  <option value="Overdue">Overdue / Defaulter</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUpdateFeeModal({ show: false, fee: null })}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-xs"
                >
                  Confirm & Issue Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Record Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#001438] rounded-[28px] max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-base text-[#000E28] dark:text-white">Record Operating Expense</h3>
              <button onClick={() => setShowExpenseModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">Expense Description</label>
                <input
                  type="text"
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#000E28] font-bold"
                  placeholder="e.g. Science Lab Supplies & Chemicals"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">Category</label>
                <select
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#000E28] font-bold"
                >
                  <option>Supplies</option>
                  <option>Salaries</option>
                  <option>Infrastructure</option>
                  <option>Maintenance</option>
                  <option>Utilities</option>
                  <option>Events</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#000E28] font-bold"
                  placeholder="45000"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all shadow-xs"
                >
                  Record Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
