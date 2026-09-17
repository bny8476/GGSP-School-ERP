"use client";

import { useState, useEffect } from 'react';
import { Plus, Users, BookOpen } from 'lucide-react';

export default function ClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/classes`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setClasses(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/classes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name: newClassName })
      });
      setShowModal(false);
      setNewClassName('');
      fetchClasses();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading classes...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Classes & Sections</h1>
          <p className="text-slate-500">Manage all class grades and their sections</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Class
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {classes.map((c: any) => (
          <div key={c._id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-indigo-100 p-3 rounded-lg text-indigo-600">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">{c.name}</h3>
              </div>
            </div>
            <p className="text-slate-500 text-sm mb-4">{c.description || 'No description provided.'}</p>
            <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
              <span className="text-sm font-medium text-slate-600 flex items-center">
                <Users className="h-4 w-4 mr-1 text-slate-400" />
                Sections
              </span>
              <button className="text-indigo-600 text-sm font-semibold hover:text-indigo-800">
                Manage Sections &rarr;
              </button>
            </div>
          </div>
        ))}
        {classes.length === 0 && (
          <div className="col-span-3 text-center py-12 text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
            No classes created yet. Add your first class to get started.
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Class</h2>
            <form onSubmit={handleCreate}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Class Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Pre-K, LKG"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={newClassName}
                  onChange={e => setNewClassName(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
