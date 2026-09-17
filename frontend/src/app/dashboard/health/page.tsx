"use client";

import { useState, useEffect } from 'react';
import { HeartPulse, Plus, Edit2, Trash2, Search, AlertTriangle, ThermometerSun, Pill, AlignLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function HealthPage() {
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
    temperature: '98.6',
    symptoms: '',
    medicationAdministered: '',
    allergiesAlert: false,
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
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/operations/health`, { headers }),
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
      studentId: '', date: new Date().toISOString().split('T')[0], temperature: '98.6', symptoms: '', medicationAdministered: '', allergiesAlert: false, notes: ''
    });
    setEditingLogId(null);
    setActiveTab('list');
  };

  const openEdit = (log: any) => {
    setEditingLogId(log._id);
    setFormData({
      studentId: log.studentId?._id || log.studentId,
      date: new Date(log.date).toISOString().split('T')[0],
      temperature: log.temperature.toString(),
      symptoms: log.symptoms ? log.symptoms.join(', ') : '',
      medicationAdministered: log.medicationAdministered || '',
      allergiesAlert: log.allergiesAlert || false,
      notes: log.notes || ''
    });
    setActiveTab('create');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this health record?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/operations/health/${id}`, {
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
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/operations/health/${editingLogId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/operations/health`;

      const payload = {
        ...formData,
        temperature: Number(formData.temperature),
        symptoms: formData.symptoms.split(',').map(s => s.trim()).filter(s => s !== '')
      };

      const res = await fetch(url, {
        method: editingLogId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success(editingLogId ? 'Health log updated!' : 'Health log recorded!');
        resetForm();
        fetchData();
      } else {
        toast.error('Error saving health log');
      }
    } catch (error) {
      console.error(error);
      toast.error('Network error saving health log');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredLogs = logs.filter(l => {
    const sId = l.studentId?._id || l.studentId;
    return getStudentName(sId).toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Health Management</h1>
          <p className="text-slate-500 mt-1">Track student health records, allergies, and daily checkups.</p>
        </div>
        <div className="flex space-x-2 bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => { setActiveTab('list'); setEditingLogId(null); }}
            className={`px-5 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'list' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Health Logs
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
              <div className="py-12 text-center text-slate-500">Loading health records...</div>
            ) : filteredLogs.length === 0 ? (
              <div className="py-12 text-center text-slate-500 bg-slate-50 border-t border-slate-100 m-6 rounded-2xl border-dashed">
                <HeartPulse className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-700">No health logs found</h3>
                <p>Log a health checkup to start tracking.</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Student & Date</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Vitals</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status / Notes</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {filteredLogs.map((log) => (
                    <tr key={log._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-bold text-slate-800">{getStudentName(log.studentId?._id || log.studentId)}</div>
                        <div className="text-xs font-bold text-slate-500 mt-0.5">{new Date(log.date).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className={`flex items-center font-medium ${log.temperature >= 99 ? 'text-rose-600' : 'text-emerald-600'}`}>
                          <ThermometerSun className="w-4 h-4 mr-1.5" />
                          {log.temperature}°F
                        </div>
                        {log.allergiesAlert && (
                          <div className="flex items-center text-rose-500 font-bold text-xs mt-1 bg-rose-50 px-2 py-0.5 rounded w-max">
                            <AlertTriangle className="w-3 h-3 mr-1" /> Allergy Alert
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 max-w-xs">
                        {log.symptoms && log.symptoms.length > 0 && <div className="mb-1"><span className="font-bold text-slate-700">Symptoms:</span> {log.symptoms.join(', ')}</div>}
                        {log.medicationAdministered && <div className="flex items-center mb-1 text-indigo-600 font-medium"><Pill className="w-3.5 h-3.5 mr-1.5 flex-shrink-0"/> <span className="truncate">{log.medicationAdministered}</span></div>}
                        {log.notes && <div className="flex items-start"><AlignLeft className="w-3.5 h-3.5 mr-1.5 mt-0.5 text-slate-400 flex-shrink-0"/> <span className="truncate italic">{log.notes}</span></div>}
                        {(!log.symptoms || log.symptoms.length === 0) && !log.medicationAdministered && !log.notes && <span className="text-slate-400 italic">Routine checkup, no issues.</span>}
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
            <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4 mb-6 flex items-center">
              <HeartPulse className="w-5 h-5 mr-2 text-rose-500" />
              {editingLogId ? 'Edit Health Record' : 'Log New Health Check'}
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
                <label className="block text-sm font-bold text-slate-700 mb-2">Temperature (°F)</label>
                <div className="relative">
                  <ThermometerSun className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input required type="number" step="0.1" className="w-full pl-10 rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.temperature} onChange={e => setFormData({...formData, temperature: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Allergy Alert</label>
                <label className="flex items-center p-3 border border-slate-200 rounded-xl bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                  <input type="checkbox" className="w-5 h-5 rounded text-rose-600 focus:ring-rose-500 border-slate-300" checked={formData.allergiesAlert} onChange={e => setFormData({...formData, allergiesAlert: e.target.checked})} />
                  <span className="ml-3 font-bold text-slate-700">Flag as Allergy/Emergency</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Symptoms</label>
              <input type="text" placeholder="e.g. Cough, Runny Nose, Headache (comma separated)" className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.symptoms} onChange={e => setFormData({...formData, symptoms: e.target.value})} />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Medication Administered</label>
              <div className="relative">
                <Pill className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input type="text" placeholder="e.g. Tylenol 5ml at 1:00 PM" className="w-full pl-10 rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.medicationAdministered} onChange={e => setFormData({...formData, medicationAdministered: e.target.value})} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Additional Notes</label>
              <textarea rows={3} placeholder="Doctor's notes, behavior observation..." className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}></textarea>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
              <button type="button" onClick={resetForm} className="px-6 py-3 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
              <button type="submit" disabled={isSaving} className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md disabled:opacity-50">
                {isSaving ? 'Saving...' : 'Save Health Record'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
