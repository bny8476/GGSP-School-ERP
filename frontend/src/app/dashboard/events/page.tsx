"use client";

import { useState, useEffect } from 'react';
import { Calendar, Plus, Edit2, Trash2, Search, Users, Clock, AlignLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    type: 'Annual Day',
    date: '',
    time: '',
    audience: 'All',
    description: ''
  });

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const resetForm = () => {
    setFormData({
      title: '', type: 'Annual Day', date: '', time: '', audience: 'All', description: ''
    });
    setEditingEventId(null);
    setActiveTab('list');
  };

  const openEdit = (event: any) => {
    setEditingEventId(event._id);
    setFormData({
      title: event.title,
      type: event.type,
      date: new Date(event.date).toISOString().split('T')[0],
      time: event.time || '',
      audience: event.audience,
      description: event.description || ''
    });
    setActiveTab('create');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchEvents();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const url = editingEventId 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/events/${editingEventId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/events`;

      const res = await fetch(url, {
        method: editingEventId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success(editingEventId ? 'Event updated successfully!' : 'Event created successfully!');
        resetForm();
        fetchEvents();
      } else {
        toast.error('Error saving event');
      }
    } catch (error) {
      console.error(error);
      toast.error('Network error saving event');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Events Management</h1>
          <p className="text-slate-500 mt-1">Schedule and manage school events and holidays.</p>
        </div>
        <div className="flex space-x-2 bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => { setActiveTab('list'); setEditingEventId(null); }}
            className={`px-5 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'list' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Calendar List
          </button>
          <button 
            onClick={() => { setActiveTab('create'); if(!editingEventId) resetForm(); setActiveTab('create'); }}
            className={`px-5 py-2 rounded-lg font-bold text-sm transition-all flex items-center ${activeTab === 'create' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <Plus className="h-4 w-4 mr-1.5" />
            {editingEventId ? 'Edit Event' : 'New Event'}
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
                placeholder="Search events..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium bg-white"
              />
            </div>
          </div>

          <div className="p-6 md:p-8">
            {isLoading ? (
              <div className="py-12 text-center text-slate-500">Loading events...</div>
            ) : filteredEvents.length === 0 ? (
              <div className="py-12 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <Calendar className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-700">No events scheduled</h3>
                <p>Create a new event to populate the calendar.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <div key={event._id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative group">
                    <div className="absolute top-4 right-4 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(event)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md"><Edit2 className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(event._id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md"><Trash2 className="h-4 w-4" /></button>
                    </div>

                    <div className="flex items-start mb-4">
                      <div className="bg-indigo-50 border border-indigo-100 rounded-xl w-16 h-16 flex flex-col items-center justify-center mr-4 flex-shrink-0">
                        <span className="text-xs font-bold text-indigo-500 uppercase">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                        <span className="text-xl font-black text-indigo-700">{new Date(event.date).getDate()}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 pr-12 line-clamp-2 leading-tight mb-1">{event.title}</h3>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-600">
                          {event.type}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 mt-4 pt-4 border-t border-slate-100 text-sm">
                      <div className="flex items-center text-slate-600">
                        <Clock className="w-4 h-4 mr-2 text-slate-400" />
                        <span className="font-medium">{event.time || 'All Day'}</span>
                      </div>
                      <div className="flex items-center text-slate-600">
                        <Users className="w-4 h-4 mr-2 text-slate-400" />
                        <span className="font-medium">Audience: {event.audience}</span>
                      </div>
                      {event.description && (
                        <div className="flex items-start text-slate-600 pt-1">
                          <AlignLeft className="w-4 h-4 mr-2 mt-0.5 text-slate-400 flex-shrink-0" />
                          <p className="line-clamp-2 italic">{event.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4 mb-6">
              {editingEventId ? 'Edit Event Details' : 'Create New Event'}
            </h2>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Event Title</label>
              <input required type="text" placeholder="e.g. Annual Sports Meet 2026" className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Event Type</label>
                <select className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                  <option>Annual Day</option>
                  <option>Sports Day</option>
                  <option>Fancy Dress</option>
                  <option>Field Trip</option>
                  <option>Parent Meeting</option>
                  <option>Holiday</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Target Audience</label>
                <select className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.audience} onChange={e => setFormData({...formData, audience: e.target.value})}>
                  <option>All</option>
                  <option>Parents</option>
                  <option>Staff</option>
                  <option>Students</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Date</label>
                <input required type="date" className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Time <span className="text-slate-400 font-normal">(Optional)</span></label>
                <input type="time" className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
              <textarea rows={4} placeholder="Add any details, location, or instructions..." className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
              <button type="button" onClick={resetForm} className="px-6 py-3 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
              <button type="submit" disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md disabled:opacity-50">
                {isSaving ? 'Saving...' : (editingEventId ? 'Update Event' : 'Schedule Event')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
