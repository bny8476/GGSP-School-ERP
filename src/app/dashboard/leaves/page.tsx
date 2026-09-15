"use client";

import { useState, useEffect, useMemo } from 'react';
import { Calendar, CheckCircle2, XCircle, Clock, Search, Plus, UserCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LeavesPage() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Need to pick a staff member to request leave for (assuming Admin view where admin can log leave for staff, or staff can pick their name)
  const [formData, setFormData] = useState({
    userId: '',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [leavesRes, staffRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/leaves`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, { headers })
      ]);
      
      if (leavesRes.ok) setLeaves(await leavesRes.json());
      if (staffRes.ok) setStaff(await staffRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/leaves`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        toast.success('Leave application submitted!');
        setShowAddModal(false);
        setFormData({ userId: '', startDate: '', endDate: '', reason: '' });
        fetchData();
      } else {
        const err = await res.json();
        toast.error(`Error: ${err.message}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Network error submitting leave');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/leaves/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      
      if (res.ok) {
        toast.success(`Leave request ${status.toLowerCase()}!`);
        fetchData();
      } else {
        const err = await res.json();
        toast.error(`Error: ${err.message}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Network error updating leave status');
    }
  };

  const filteredLeaves = useMemo(() => {
    return leaves.filter(leave => {
      const staffName = leave.userId ? `${leave.userId.firstName} ${leave.userId.lastName}` : '';
      const matchesSearch = staffName.toLowerCase().includes(searchQuery.toLowerCase()) || leave.reason.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === 'All' || leave.status === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [leaves, searchQuery, activeFilter]);

  const metrics = useMemo(() => {
    return {
      total: leaves.length,
      pending: leaves.filter(l => l.status === 'Pending').length,
      approved: leaves.filter(l => l.status === 'Approved').length,
      rejected: leaves.filter(l => l.status === 'Rejected').length,
    };
  }, [leaves]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Leave Management</h1>
          <p className="text-slate-500 mt-1">Review and manage staff leave requests.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center transition-all shadow-md shadow-indigo-200"
        >
          <Plus className="h-5 w-5 mr-1.5" />
          Log Leave Request
        </button>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Total Requests</div>
          <span className="text-3xl font-black text-slate-800">{metrics.total}</span>
        </div>
        <div className="bg-amber-50 p-5 rounded-3xl border border-amber-100 flex flex-col justify-center">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">Pending Approval</div>
          <span className="text-3xl font-black text-amber-600">{metrics.pending}</span>
        </div>
        <div className="bg-emerald-50 p-5 rounded-3xl border border-emerald-100 flex flex-col justify-center">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">Approved</div>
          <span className="text-3xl font-black text-emerald-600">{metrics.approved}</span>
        </div>
        <div className="bg-rose-50 p-5 rounded-3xl border border-rose-100 flex flex-col justify-center">
          <div className="text-xs font-bold uppercase tracking-wider text-rose-800 mb-1">Rejected</div>
          <span className="text-3xl font-black text-rose-600">{metrics.rejected}</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 bg-slate-50 justify-between items-center">
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto hide-scrollbar">
            {['All', 'Pending', 'Approved', 'Rejected'].map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                  activeFilter === filter 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search staff or reason..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            />
          </div>
        </div>

        {/* List */}
        <div className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="py-20 text-center text-slate-500 flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-200 border-t-indigo-600 mb-4"></div>
              <p className="font-bold">Loading requests...</p>
            </div>
          ) : filteredLeaves.length === 0 ? (
            <div className="py-20 text-center text-slate-500 flex flex-col items-center bg-slate-50">
              <Calendar className="h-12 w-12 text-slate-300 mb-3" />
              <p className="font-bold text-lg text-slate-600">No leave requests found</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="py-4 px-6 text-left text-xs font-black uppercase tracking-wider text-slate-500">Staff Member</th>
                  <th className="py-4 px-6 text-left text-xs font-black uppercase tracking-wider text-slate-500">Duration</th>
                  <th className="py-4 px-6 text-left text-xs font-black uppercase tracking-wider text-slate-500 w-1/3">Reason</th>
                  <th className="py-4 px-6 text-left text-xs font-black uppercase tracking-wider text-slate-500">Status</th>
                  <th className="py-4 px-6 text-right text-xs font-black uppercase tracking-wider text-slate-500">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {filteredLeaves.map(leave => (
                  <tr key={leave._id} className="hover:bg-slate-50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm mr-3 border border-indigo-200">
                          {leave.userId ? `${leave.userId.firstName[0]}${leave.userId.lastName[0]}` : <UserCircle className="h-5 w-5" />}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-sm">{leave.userId ? `${leave.userId.firstName} ${leave.userId.lastName}` : 'Unknown User'}</div>
                          {leave.userId?.designation && <div className="text-[11px] font-semibold text-slate-500">{leave.userId.designation}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-700 font-medium">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                        {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-600 font-medium">
                      {leave.reason}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1.5 inline-flex text-[11px] font-black uppercase tracking-wider rounded-md border ${
                        leave.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        leave.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {leave.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {leave.status === 'Pending' ? (
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleUpdateStatus(leave._id, 'Approved')} className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200" title="Approve">
                            <CheckCircle2 className="h-5 w-5" />
                          </button>
                          <button onClick={() => handleUpdateStatus(leave._id, 'Rejected')} className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors border border-rose-200" title="Reject">
                            <XCircle className="h-5 w-5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Resolved</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* CREATE LEAVE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-xl text-slate-800">Log Leave Request</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleCreateLeave} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Select Staff Member</label>
                <select required className="w-full rounded-xl border-slate-300 py-2.5 px-3 focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 text-sm font-medium" value={formData.userId} onChange={e => setFormData({...formData, userId: e.target.value})}>
                  <option value="">-- Choose staff --</option>
                  {staff.map(s => <option key={s._id} value={s._id}>{s.firstName} {s.lastName}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Start Date</label>
                  <input required type="date" className="w-full rounded-xl border-slate-300 py-2.5 px-3 focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 text-sm font-medium" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">End Date</label>
                  <input required type="date" className="w-full rounded-xl border-slate-300 py-2.5 px-3 focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 text-sm font-medium" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Reason</label>
                <textarea required rows={3} placeholder="Sick leave, vacation, etc." className="w-full rounded-xl border-slate-300 py-2.5 px-3 focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 text-sm font-medium" value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} />
              </div>
              <div className="pt-3">
                <button type="submit" disabled={isSaving} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-md transition-all flex justify-center disabled:opacity-50">
                  {isSaving ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div> : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
