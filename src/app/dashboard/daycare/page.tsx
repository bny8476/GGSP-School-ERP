"use client";

import { useState, useEffect } from 'react';
import { Sun, Plus, Edit2, Trash2, Search, Clock, Coffee, Moon, AlignLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DaycarePage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [editingLogId, setEditingLogId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    studentId: '',
    date: new Date().toISOString().split('T')[0],
    checkInTime: '',
    checkOutTime: '',
    foodTracking: '',
    sleepTracking: '',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      const [logsRes, studentsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/daycare`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students`, { headers })
      ]);
      
      if (logsRes.ok) setLogs(await logsRes.json());
      if (studentsRes.ok) setStudents(await studentsRes.json());
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStudentName = (id: string) => {
    const s = students.find(s => s._id === id);
    return s ? `${s.firstName} ${s.lastName}` : 'Unknown Student';
  };

  const resetForm = () => {
    setFormData({
      studentId: '', date: new Date().toISOString().split('T')[0], checkInTime: '', checkOutTime: '', foodTracking: '', sleepTracking: '', notes: ''
    });
    setEditingLogId(null);
    setActiveTab('list');
  };

  const openEdit = (log: any) => {
    setEditingLogId(log._id);
    setFormData({
      studentId: log.studentId,
      date: new Date(log.date).toISOString().split('T')[0],
      checkInTime: log.checkInTime || '',
      checkOutTime: log.checkOutTime || '',
      foodTracking: log.foodTracking || '',
      sleepTracking: log.sleepTracking || '',
      notes: log.notes || ''
    });
    setActiveTab('create');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this log?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/daycare/${id}`, {
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
      const url = editingLogId 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/daycare/${editingLogId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/daycare`;

      const res = await fetch(url, {
        method: editingLogId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success(editingLogId ? 'Daycare log updated successfully!' : 'Daycare log recorded!');
        resetForm();
        fetchData();
      } else {
        toast.error('Error saving log');
      }
    } catch (error) {
      console.error(error);
      toast.error('Network error saving daycare log');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredLogs = logs.filter(l => 
    getStudentName(l.studentId).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Day Care Management</h1>
          <p className="text-slate-500 mt-1">Track check-ins, meals, and naps for day care students.</p>
        </div>
        <div className="flex space-x-2 bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => { setActiveTab('list'); setEditingLogId(null); }}
            className={`px-5 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'list' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Daily Logs
          </button>
          <button 
            onClick={() => { setActiveTab('create'); if(!editingLogId) resetForm(); setActiveTab('create'); }}
            className={`px-5 py-2 rounded-lg font-bold text-sm transition-all flex items-center ${activeTab === 'create' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <Plus className="h-4 w-4 mr-1.5" />
            {editingLogId ? 'Edit Log' : 'New Log'}
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
                placeholder="Search by student name..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium bg-white"
              />
            </div>
          </div>

          <div className="p-0 overflow-x-auto">
            {isLoading ? (
              <div className="py-12 text-center text-slate-500">Loading logs...</div>
            ) : filteredLogs.length === 0 ? (
              <div className="py-12 text-center text-slate-500 bg-slate-50 border-t border-slate-100 m-6 rounded-2xl border-dashed">
                <Sun className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-700">No day care logs</h3>
                <p>Create a log to start tracking activities.</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Student</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Timing</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Activities</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {filteredLogs.map((log) => (
                    <tr key={log._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-bold text-slate-800">{getStudentName(log.studentId)}</div>
                        <div className="text-xs font-bold text-indigo-500 mt-0.5">{new Date(log.date).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center text-emerald-600 font-medium">
                          <span className="w-16">In:</span> {log.checkInTime || '-'}
                        </div>
                        <div className="flex items-center text-rose-600 font-medium mt-1">
                          <span className="w-16">Out:</span> {log.checkOutTime || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 max-w-xs">
                        {log.foodTracking && <div className="flex items-center mb-1"><Coffee className="w-3.5 h-3.5 mr-1.5 text-amber-500 flex-shrink-0"/> <span className="truncate">{log.foodTracking}</span></div>}
                        {log.sleepTracking && <div className="flex items-center mb-1"><Moon className="w-3.5 h-3.5 mr-1.5 text-indigo-400 flex-shrink-0"/> <span className="truncate">{log.sleepTracking}</span></div>}
                        {log.notes && <div className="flex items-center"><AlignLeft className="w-3.5 h-3.5 mr-1.5 text-slate-400 flex-shrink-0"/> <span className="truncate italic">{log.notes}</span></div>}
                        {!log.foodTracking && !log.sleepTracking && !log.notes && <span className="text-slate-400 italic">No activities logged</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button onClick={() => openEdit(log)} className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDelete(log._id)} className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors">
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
            <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4 mb-6">
              {editingLogId ? 'Edit Day Care Log' : 'Create Daily Log'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Student</label>
                <select required className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})}>
                  <option value="">Select Student...</option>
                  {students.map(s => (
                    <option key={s._id} value={s._id}>{s.firstName} {s.lastName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Date</label>
                <input required type="date" className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Check-In Time</label>
                <input type="time" className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.checkInTime} onChange={e => setFormData({...formData, checkInTime: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Check-Out Time</label>
                <input type="time" className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.checkOutTime} onChange={e => setFormData({...formData, checkOutTime: e.target.value})} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Food / Meals Tracking</label>
              <input type="text" placeholder="e.g. Ate all of lunch, refused snack..." className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.foodTracking} onChange={e => setFormData({...formData, foodTracking: e.target.value})} />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Sleep / Nap Tracking</label>
              <input type="text" placeholder="e.g. Napped 1:00 PM - 2:30 PM..." className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.sleepTracking} onChange={e => setFormData({...formData, sleepTracking: e.target.value})} />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Additional Notes</label>
              <textarea rows={3} placeholder="Behavior, mood, or anything to report to parents..." className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}></textarea>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
              <button type="button" onClick={resetForm} className="px-6 py-3 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
              <button type="submit" disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md disabled:opacity-50">
                {isSaving ? 'Saving...' : 'Save Log'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
