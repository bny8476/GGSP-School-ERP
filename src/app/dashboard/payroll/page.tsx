"use client";

import { useState, useEffect } from 'react';
import { Banknote, Plus, Search, FileText, CheckCircle2, User, Download, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PayrollPage() {
  const [payrolls, setPayrolls] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
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
    } finally {
      setIsLoading(false);
    }
  };

  const getStaffName = (id: string) => {
    const s = staffList.find(s => s._id === id);
    return s ? `${s.firstName} ${s.lastName}` : 'Unknown Staff';
  };

  const calculateNetSalary = () => {
    const base = Number(formData.baseSalary) || 0;
    const bonus = Number(formData.bonuses) || 0;
    const deduct = Number(formData.deductions) || 0;
    return base + bonus - deduct;
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
    if (!confirm('Delete this payroll record?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payroll/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error(error);
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
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payroll/${payroll._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...payroll, status: 'Paid', paymentDate: new Date() })
      });
      toast.success('Marked as Paid!');
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update payment status');
    }
  };

  const handleDownloadPayslip = async (payroll: any) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payroll/${payroll._id}/pdf`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to generate PDF');

      // Create a blob from the PDF stream and trigger download
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
    }
  };

  const filteredPayrolls = payrolls.filter(p => 
    getStaffName(p.staffId).toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.month.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Payroll Management</h1>
          <p className="text-slate-500 mt-1">Manage staff salaries, bonuses, and generate payslips.</p>
        </div>
        <div className="flex space-x-2 bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => { setActiveTab('list'); setEditingId(null); }}
            className={`px-5 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'list' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Payroll History
          </button>
          <button 
            onClick={() => { setActiveTab('create'); if(!editingId) resetForm(); setActiveTab('create'); }}
            className={`px-5 py-2 rounded-lg font-bold text-sm transition-all flex items-center ${activeTab === 'create' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <Plus className="h-4 w-4 mr-1.5" />
            {editingId ? 'Edit Record' : 'Process Salary'}
          </button>
        </div>
      </div>

      {activeTab === 'list' ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:max-w-md">
              <Search className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search staff name or month (e.g. June 2026)..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium bg-white"
              />
            </div>
          </div>

          <div className="p-0 overflow-x-auto">
            {isLoading ? (
              <div className="py-12 text-center text-slate-500">Loading payroll data...</div>
            ) : filteredPayrolls.length === 0 ? (
              <div className="py-12 text-center text-slate-500 bg-slate-50 border-t border-slate-100 m-6 rounded-2xl border-dashed">
                <Banknote className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-700">No payroll records</h3>
                <p>Process a staff salary to see it here.</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Staff & Month</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Salary Breakdown</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Net Pay</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {filteredPayrolls.map((payroll) => (
                    <tr key={payroll._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold mr-3 border border-indigo-100">
                            <User className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-800">{getStaffName(payroll.staffId)}</div>
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">{payroll.month}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="text-slate-600 font-medium"><span className="w-16 inline-block text-slate-400">Base:</span> ₹{payroll.baseSalary.toLocaleString()}</div>
                        <div className="text-emerald-600 font-medium"><span className="w-16 inline-block text-slate-400">Bonus:</span> +₹{payroll.bonuses.toLocaleString()}</div>
                        <div className="text-rose-600 font-medium"><span className="w-16 inline-block text-slate-400">Deduct:</span> -₹{payroll.deductions.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-lg font-black text-slate-900">₹{payroll.netSalary.toLocaleString()}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{payroll.attendanceDays} Days Attended</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 inline-flex text-[10px] uppercase tracking-wider font-bold rounded-full border ${payroll.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                          {payroll.status}
                        </span>
                        {payroll.status === 'Paid' && payroll.paymentDate && (
                          <div className="text-[10px] text-slate-400 font-medium mt-1">On {new Date(payroll.paymentDate).toLocaleDateString()}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          {payroll.status === 'Pending' && (
                            <button onClick={() => markAsPaid(payroll)} title="Mark as Paid" className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors">
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                          )}
                          <button onClick={() => handleDownloadPayslip(payroll)} title="Download Payslip" className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
                            <Download className="h-4 w-4" />
                          </button>
                          <button onClick={() => openEdit(payroll)} className="p-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDelete(payroll._id)} className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4 mb-6 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-indigo-500" />
              {editingId ? 'Edit Salary Record' : 'Process New Salary'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Select Staff</label>
                <select required className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.staffId} onChange={e => handleStaffSelect(e.target.value)}>
                  <option value="">Select...</option>
                  {staffList.map(s => (
                    <option key={s._id} value={s._id}>{s.firstName} {s.lastName} - {s.designation || s.role?.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Salary Month</label>
                <input required type="text" placeholder="e.g. June 2026" className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.month} onChange={e => setFormData({...formData, month: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Base Salary (₹)</label>
                <input required type="number" min="0" className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.baseSalary} onChange={e => setFormData({...formData, baseSalary: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Days Attended</label>
                <input required type="number" min="0" max="31" className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.attendanceDays} onChange={e => setFormData({...formData, attendanceDays: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-sm font-bold text-emerald-600 mb-2">Bonuses / Allowances (₹)</label>
                <input type="number" min="0" className="w-full rounded-xl border-emerald-200 py-3 px-4 focus:ring-emerald-500 focus:border-emerald-500 font-medium bg-emerald-50/50" value={formData.bonuses} onChange={e => setFormData({...formData, bonuses: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-rose-600 mb-2">Deductions / Leaves (₹)</label>
                <input type="number" min="0" className="w-full rounded-xl border-rose-200 py-3 px-4 focus:ring-rose-500 focus:border-rose-500 font-medium bg-rose-50/50" value={formData.deductions} onChange={e => setFormData({...formData, deductions: e.target.value})} />
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mt-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Calculated Net Salary</p>
                <p className="text-3xl font-black text-indigo-700 mt-1">₹{calculateNetSalary().toLocaleString()}</p>
              </div>
              <div className="text-right">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Payment Status</label>
                <select className="rounded-xl border-slate-300 py-2 px-4 focus:ring-indigo-500 font-bold text-sm bg-white" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                  <option value="Pending">Pending</option>
                  <option value="Paid">Mark as Paid</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
              <button type="button" onClick={resetForm} className="px-6 py-3 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
              <button type="submit" disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md disabled:opacity-50">
                {isSaving ? 'Processing...' : (editingId ? 'Update Record' : 'Save Payroll Record')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
