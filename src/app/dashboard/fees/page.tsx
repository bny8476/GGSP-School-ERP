"use client";

import { useState, useEffect } from 'react';
import { Wallet, IndianRupee, PieChart, Download, Plus, Search, Edit, CheckCircle2, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<'fees' | 'expenses'>('fees');
  const [fees, setFees] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [feesRes, expRes, stuRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/finance/fees`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/finance/expenses`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students`, { headers })
      ]);

      if (feesRes.ok) setFees(await feesRes.json());
      if (expRes.ok) setExpenses(await expRes.json());
      if (stuRes.ok) setStudents(await stuRes.json());
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateFee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/finance/fees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(feeForm)
      });
      if (res.ok) {
        toast.success('Fee invoice generated successfully!');
        setShowFeeModal(false);
        setFeeForm({ studentId: '', grade: 'Pre-KG', feeType: 'Tuition', totalAmount: '', dueDate: '' });
        fetchData();
      } else {
        const err = await res.json();
        toast.error(`Error: ${err.message}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Network error creating fee');
    }
  };

  const handleUpdateFee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showUpdateFeeModal.fee) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/finance/fees/${showUpdateFeeModal.fee._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(updateFeeForm)
      });
      if (res.ok) {
        toast.success('Fee payment updated!');
        setShowUpdateFeeModal({show: false, fee: null});
        fetchData();
      } else {
        const err = await res.json();
        toast.error(`Error: ${err.message}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Network error updating fee');
    }
  };

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/finance/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(expenseForm)
      });
      if (res.ok) {
        toast.success('Expense recorded successfully!');
        setShowExpenseModal(false);
        setExpenseForm({ description: '', category: 'Supplies', amount: '', date: new Date().toISOString().split('T')[0] });
        fetchData();
      } else {
        const err = await res.json();
        toast.error(`Error: ${err.message}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Network error recording expense');
    }
  };

  // Analytics Calculation
  const totalCollected = fees.reduce((sum, fee) => sum + (fee.amountPaid || 0), 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const netRevenue = totalCollected - totalExpenses;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Finance Management</h1>
          <p className="text-slate-500 mt-1">Manage student fee collections and track school expenses.</p>
        </div>
        <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl font-bold flex items-center transition-colors shadow-sm">
          <Download className="h-5 w-5 mr-2 text-slate-400" />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center space-x-5">
          <div className="p-4 bg-emerald-50 rounded-2xl ring-1 ring-emerald-100">
            <IndianRupee className="h-7 w-7 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Collected</p>
            <p className="text-3xl font-black text-slate-800">₹{totalCollected.toLocaleString('en-IN')}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center space-x-5">
          <div className="p-4 bg-rose-50 rounded-2xl ring-1 ring-rose-100">
            <IndianRupee className="h-7 w-7 text-rose-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Expenses</p>
            <p className="text-3xl font-black text-slate-800">₹{totalExpenses.toLocaleString('en-IN')}</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-3xl shadow-lg shadow-indigo-200 flex items-center space-x-5 text-white">
          <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/10">
            <PieChart className="h-7 w-7 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-indigo-200 uppercase tracking-wider mb-1">Net Revenue</p>
            <p className="text-3xl font-black text-white">₹{netRevenue.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="flex border-b border-slate-200 p-2 gap-2 bg-slate-50/50">
          <button 
            onClick={() => setActiveTab('fees')}
            className={`flex-1 py-3 text-center font-bold rounded-xl transition-all ${activeTab === 'fees' ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
          >
            Fee Collection
          </button>
          <button 
            onClick={() => setActiveTab('expenses')}
            className={`flex-1 py-3 text-center font-bold rounded-xl transition-all ${activeTab === 'expenses' ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
          >
            Expenses & Payroll
          </button>
        </div>

        <div className="p-8">
          {activeTab === 'fees' ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white border border-slate-100 p-3 rounded-2xl shadow-sm">
                <div className="relative">
                  <Search className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Search fees..." 
                    className="pl-10 pr-4 py-2 border-none rounded-xl focus:ring-0 text-sm font-medium w-64 bg-slate-50"
                  />
                </div>
                <button 
                  onClick={() => setShowFeeModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center transform hover:-translate-y-0.5"
                >
                  <Plus className="h-4 w-4 mr-1.5" /> Issue New Fee
                </button>
              </div>
              
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-500">Student Name</th>
                      <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-500">Grade</th>
                      <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-500">Type</th>
                      <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-500">Total Fee</th>
                      <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-500">Paid</th>
                      <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-500">Status</th>
                      <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-500 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-500">Loading fees...</td>
                      </tr>
                    ) : fees.length > 0 ? (
                      fees.map((fee) => (
                        <tr key={fee._id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-6 text-sm font-bold text-slate-800">
                            {fee.studentId ? `${fee.studentId.firstName} ${fee.studentId.lastName}` : 'Unknown Student'}
                          </td>
                          <td className="py-4 px-6 text-sm font-medium text-slate-500">{fee.grade}</td>
                          <td className="py-4 px-6 text-sm">
                            <span className="px-2.5 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-md text-[11px] font-bold uppercase tracking-wider">
                              {fee.feeType || 'Tuition'}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-sm font-medium text-slate-800">₹{fee.totalAmount.toLocaleString('en-IN')}</td>
                          <td className="py-4 px-6 text-sm font-medium text-slate-600">₹{fee.amountPaid.toLocaleString('en-IN')}</td>
                          <td className="py-4 px-6 text-sm">
                            <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                              fee.status === 'Paid' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                              fee.status === 'Partial' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                              fee.status === 'Overdue' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                              'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}>
                              {fee.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button 
                              onClick={() => {
                                setUpdateFeeForm({ amountPaid: fee.amountPaid, status: fee.status });
                                setShowUpdateFeeModal({show: true, fee});
                              }}
                              className="text-indigo-600 font-bold text-sm bg-indigo-50 hover:bg-indigo-100 px-4 py-1.5 rounded-lg transition-colors"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-500">No fee records found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white border border-slate-100 p-3 rounded-2xl shadow-sm">
                <div className="relative">
                  <Search className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Search expenses..." 
                    className="pl-10 pr-4 py-2 border-none rounded-xl focus:ring-0 text-sm font-medium w-64 bg-slate-50"
                  />
                </div>
                <button 
                  onClick={() => setShowExpenseModal(true)}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center transform hover:-translate-y-0.5"
                >
                  <Plus className="h-4 w-4 mr-1.5" /> Record Expense
                </button>
              </div>
              
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-500">Date</th>
                      <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-500">Description</th>
                      <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-500">Category</th>
                      <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-500">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-slate-500">Loading expenses...</td>
                      </tr>
                    ) : expenses.length > 0 ? (
                      expenses.map((expense) => (
                        <tr key={expense._id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-6 text-sm text-slate-500 font-medium">{new Date(expense.date).toLocaleDateString()}</td>
                          <td className="py-4 px-6 text-sm font-bold text-slate-800">{expense.description}</td>
                          <td className="py-4 px-6 text-sm">
                            <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 rounded-md text-[11px] font-bold uppercase tracking-wider">
                              {expense.category}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-sm text-rose-600 font-bold">₹{expense.amount.toLocaleString('en-IN')}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-slate-500">No expense records found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CREATE FEE MODAL */}
      {showFeeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-xl text-slate-800">Issue New Fee</h3>
              <button onClick={() => setShowFeeModal(false)} className="text-slate-400 hover:text-slate-700"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleCreateFee} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Select Student</label>
                <select required className="w-full rounded-xl border-slate-300 py-2.5 px-3 focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 text-sm font-medium" value={feeForm.studentId} onChange={e => setFeeForm({...feeForm, studentId: e.target.value})}>
                  <option value="">-- Choose student --</option>
                  {students.map(s => <option key={s._id} value={s._id}>{s.firstName} {s.lastName} ({s.grade})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Grade Level</label>
                  <select required className="w-full rounded-xl border-slate-300 py-2.5 px-3 focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 text-sm font-medium" value={feeForm.grade} onChange={e => setFeeForm({...feeForm, grade: e.target.value})}>
                    <option>Pre-KG</option><option>LKG</option><option>UKG</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Fee Type</label>
                  <select required className="w-full rounded-xl border-slate-300 py-2.5 px-3 focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 text-sm font-medium" value={feeForm.feeType} onChange={e => setFeeForm({...feeForm, feeType: e.target.value})}>
                    <option>Admission</option><option>Tuition</option><option>Transport</option><option>Activity</option><option>Day Care</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Total Amount (₹)</label>
                  <input required type="number" className="w-full rounded-xl border-slate-300 py-2.5 px-3 focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 text-sm font-medium" value={feeForm.totalAmount} onChange={e => setFeeForm({...feeForm, totalAmount: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Due Date</label>
                <input required type="date" className="w-full rounded-xl border-slate-300 py-2.5 px-3 focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 text-sm font-medium" value={feeForm.dueDate} onChange={e => setFeeForm({...feeForm, dueDate: e.target.value})} />
              </div>
              <div className="pt-3">
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-md transition-all">Issue Fee Invoice</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPDATE FEE MODAL */}
      {showUpdateFeeModal.show && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-xl text-slate-800">Process Payment</h3>
              <button onClick={() => setShowUpdateFeeModal({show: false, fee: null})} className="text-slate-400 hover:text-slate-700"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleUpdateFee} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Total Amount Paid So Far (₹)</label>
                <input required type="number" className="w-full rounded-xl border-slate-300 py-2.5 px-3 focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 text-sm font-medium" value={updateFeeForm.amountPaid} onChange={e => setUpdateFeeForm({...updateFeeForm, amountPaid: e.target.value})} />
                <p className="text-xs text-slate-500 mt-2 font-medium">Total Bill: ₹{showUpdateFeeModal.fee?.totalAmount}</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Payment Status</label>
                <select required className="w-full rounded-xl border-slate-300 py-2.5 px-3 focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 text-sm font-medium" value={updateFeeForm.status} onChange={e => setUpdateFeeForm({...updateFeeForm, status: e.target.value})}>
                  <option>Pending</option><option>Partial</option><option>Paid</option><option>Overdue</option>
                </select>
              </div>
              <div className="pt-3">
                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-md transition-all">Update Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE EXPENSE MODAL */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-5 border-b border-rose-100 flex justify-between items-center bg-rose-50">
              <h3 className="font-bold text-xl text-rose-900">Record Expense</h3>
              <button onClick={() => setShowExpenseModal(false)} className="text-rose-400 hover:text-rose-700"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleCreateExpense} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Description / Vendor</label>
                <input required type="text" placeholder="e.g. Paint supplies from art store" className="w-full rounded-xl border-slate-300 py-2.5 px-3 focus:border-rose-500 focus:ring-rose-500 bg-slate-50 text-sm font-medium" value={expenseForm.description} onChange={e => setExpenseForm({...expenseForm, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Category</label>
                  <select required className="w-full rounded-xl border-slate-300 py-2.5 px-3 focus:border-rose-500 focus:ring-rose-500 bg-slate-50 text-sm font-medium" value={expenseForm.category} onChange={e => setExpenseForm({...expenseForm, category: e.target.value})}>
                    <option>Payroll</option><option>Utilities</option><option>Supplies</option><option>Maintenance</option><option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Amount (₹)</label>
                  <input required type="number" className="w-full rounded-xl border-slate-300 py-2.5 px-3 focus:border-rose-500 focus:ring-rose-500 bg-slate-50 text-sm font-medium" value={expenseForm.amount} onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Date incurred</label>
                <input required type="date" className="w-full rounded-xl border-slate-300 py-2.5 px-3 focus:border-rose-500 focus:ring-rose-500 bg-slate-50 text-sm font-medium" value={expenseForm.date} onChange={e => setExpenseForm({...expenseForm, date: e.target.value})} />
              </div>
              <div className="pt-3">
                <button type="submit" className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl shadow-md transition-all">Record Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
