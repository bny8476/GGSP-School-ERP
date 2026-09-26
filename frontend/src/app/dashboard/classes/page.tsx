"use client";

import { useState, useEffect } from 'react';
import { Plus, Users, BookOpen, X, Check } from 'lucide-react';
import { getApiBaseUrl } from '@/lib/utils';

export default function ClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [selectedClassForSections, setSelectedClassForSections] = useState<any | null>(null);
  const [newSectionName, setNewSectionName] = useState('');

  const fetchClasses = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const apiBase = getApiBaseUrl();
      const res = await fetch(`${apiBase}/api/classes`, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        credentials: 'include',
      });
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setClasses(data);
      } else {
        setClasses([
          { _id: 'cls-1', name: 'Pre-KG', description: 'Early playgroup & sensory exploration cohort', sections: ['Section A', 'Section B'] },
          { _id: 'cls-2', name: 'LKG', description: 'Lower kindergarten foundational numeracy & phonics', sections: ['Section A', 'Section B'] },
          { _id: 'cls-3', name: 'UKG', description: 'Upper kindergarten primary readiness cohort', sections: ['Section A', 'Section B'] },
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const apiBase = getApiBaseUrl();
      await fetch(`${apiBase}/api/classes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({ name: newClassName })
      });
      setShowModal(false);
      setNewClassName('');
      fetchClasses();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassForSections || !newSectionName.trim()) return;
    const currentSections = selectedClassForSections.sections || ['Section A', 'Section B'];
    const updated = [...currentSections, newSectionName.trim()];
    setSelectedClassForSections({ ...selectedClassForSections, sections: updated });
    setNewSectionName('');
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
              <button
                type="button"
                onClick={() => setSelectedClassForSections(c)}
                className="text-indigo-600 text-sm font-semibold hover:text-indigo-800 cursor-pointer"
              >
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
      {/* Manage Sections Modal */}
      {selectedClassForSections && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Manage Sections</h2>
                <p className="text-xs text-slate-500">{selectedClassForSections.name} • Class Roster & Sections</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedClassForSections(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Existing Sections */}
            <div className="space-y-2 mb-4">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Active Sections</label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {(selectedClassForSections.sections || ['Section A', 'Section B']).map((sec: string, idx: number) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700">
                    <span>{sec}</span>
                    <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                      30 Students
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Section Form */}
            <form onSubmit={handleAddSection} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Add New Section</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g., Section C"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={newSectionName}
                    onChange={(e) => setNewSectionName(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-lg hover:bg-indigo-700 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
              </div>
            </form>

            <div className="flex justify-end pt-4 border-t border-slate-100 mt-4">
              <button
                type="button"
                onClick={() => setSelectedClassForSections(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-lg hover:bg-slate-200"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
