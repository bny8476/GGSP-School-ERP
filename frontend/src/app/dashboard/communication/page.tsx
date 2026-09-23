"use client";

import { useState, useEffect } from 'react';
import { Megaphone, Users, Trash2, Send, Clock, Plus, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CommunicationPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userRole, setUserRole] = useState('');

  const [activeTab, setActiveTab] = useState<'view' | 'compose'>('view');

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    audience: 'All',
    classId: ''
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [annRes, classRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/announcements`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/classes`, { headers })
      ]);

      if (annRes.ok) setAnnouncements(await annRes.json());
      if (classRes.ok) setClasses(await classRes.json());

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Get user role from local storage
    const ustr = localStorage.getItem('user');
    if (ustr) {
      try {
        const u = JSON.parse(ustr);
        setUserRole(typeof u.role === 'string' ? u.role : (u.role?.name || ''));
      } catch (e) {}
    }
    fetchData();
  }, []);

  const isAdmin = userRole.toLowerCase() === 'admin' || userRole.toLowerCase() === 'superadmin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/announcements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success("Announcement posted successfully!");
        setFormData({ title: '', message: '', audience: 'All', classId: '' });
        setActiveTab('view');
        fetchData();
      } else {
        toast.error("Failed to post announcement.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error posting announcement.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this notice?")) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/announcements/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const getAudienceBadge = (audience: string) => {
    switch(audience) {
      case 'All': return <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-bold">All Users</span>;
      case 'Staff': return <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs font-bold">Staff Only</span>;
      case 'Parents': return <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs font-bold">Parents Only</span>;
      case 'Class': return <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded text-xs font-bold">Specific Class</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Notice Board</h1>
          <p className="text-slate-500 mt-1">Official circulars, announcements, and school communication.</p>
        </div>
        {isAdmin && (
          <div className="flex space-x-2 bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('view')}
              className={`px-5 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'view' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Notice Board
            </button>
            <button 
              onClick={() => setActiveTab('compose')}
              className={`px-5 py-2 rounded-lg font-bold text-sm transition-all flex items-center ${activeTab === 'compose' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Megaphone className="h-4 w-4 mr-1.5" />
              Compose
            </button>
          </div>
        )}
      </div>

      {activeTab === 'view' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {isLoading ? (
              <div className="p-8 text-center text-slate-500 bg-white rounded-3xl border border-slate-200 shadow-sm">Loading announcements...</div>
            ) : announcements.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center">
                <div className="bg-slate-50 p-4 rounded-full mb-4">
                  <Megaphone className="h-10 w-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">No Announcements</h3>
                <p className="text-slate-500 mt-1">There are no active notices for your role.</p>
              </div>
            ) : (
              announcements.map((ann) => (
                <div key={ann._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 text-indigo-500 shrink-0">
                          <Megaphone className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-800">{ann.title}</h3>
                          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                            {getAudienceBadge(ann.audience)}
                            {ann.audience === 'Class' && ann.classId && (
                              <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">{ann.classId.name}</span>
                            )}
                            <span className="flex items-center"><Clock className="h-3 w-3 mr-1" /> {new Date(ann.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      {isAdmin && (
                        <button onClick={() => handleDelete(ann._id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                    <div className="prose prose-sm max-w-none text-slate-600">
                      <p className="whitespace-pre-wrap">{ann.message}</p>
                    </div>
                    <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between text-xs font-medium text-slate-400">
                      <span>Posted by {ann.createdBy?.firstName} {ann.createdBy?.lastName}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-3xl p-6 text-white shadow-lg shadow-indigo-200">
              <h3 className="text-lg font-bold flex items-center mb-2"><Users className="h-5 w-5 mr-2" /> Stay Connected</h3>
              <p className="text-indigo-100 text-sm opacity-90 leading-relaxed mb-6">
                Use the Notice Board to keep up with the latest school circulars, holiday announcements, and event schedules.
              </p>
              {isAdmin && (
                <button onClick={() => setActiveTab('compose')} className="w-full bg-white text-indigo-600 font-bold py-2.5 rounded-xl text-sm shadow-md hover:bg-indigo-50 transition-colors">
                  Post New Circular
                </button>
              )}
            </div>

            {isAdmin && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center">
                  External Integrations
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-slate-100 rounded-xl bg-slate-50">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center mr-3 text-green-600 font-bold text-xs">SMS</div>
                      <span className="text-sm font-bold text-slate-700">SMS Gateway</span>
                    </div>
                    <span className="text-xs font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded">Pending config</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-slate-100 rounded-xl bg-slate-50">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3 text-blue-600 font-bold text-xs">@</div>
                      <span className="text-sm font-bold text-slate-700">Email SMTP</span>
                    </div>
                    <span className="text-xs font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded">Pending config</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Announcement Title</label>
              <input 
                required 
                type="text" 
                placeholder="e.g. Summer Holiday Schedule" 
                className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 focus:border-indigo-500 font-medium" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Target Audience</label>
                <select 
                  required
                  className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 focus:border-indigo-500 font-medium" 
                  value={formData.audience} 
                  onChange={e => setFormData({...formData, audience: e.target.value})} 
                >
                  <option value="All">All Users (Staff & Parents)</option>
                  <option value="Staff">Staff Only</option>
                  <option value="Parents">Parents Only</option>
                  <option value="Class">Specific Class</option>
                </select>
              </div>
              {formData.audience === 'Class' && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Select Class</label>
                  <select 
                    required
                    className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 focus:border-indigo-500 font-medium" 
                    value={formData.classId} 
                    onChange={e => setFormData({...formData, classId: e.target.value})} 
                  >
                    <option value="">-- Choose Class --</option>
                    {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Message Body</label>
              <textarea 
                required 
                rows={8}
                placeholder="Write the details of the circular here..." 
                className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 focus:border-indigo-500 font-medium" 
                value={formData.message} 
                onChange={e => setFormData({...formData, message: e.target.value})} 
              ></textarea>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button type="button" onClick={() => setActiveTab('view')} className="px-6 py-3 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
              <button type="submit" disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md flex items-center disabled:opacity-50">
                <Send className="h-4 w-4 mr-2" />
                {isSaving ? 'Posting...' : 'Publish Announcement'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
