"use client";

import { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2, Search, Phone, Mail, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ParentsPage() {
  const [parents, setParents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [editingParentId, setEditingParentId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fatherName: '',
    fatherOccupation: '',
    fatherContact: '',
    motherName: '',
    motherOccupation: '',
    motherContact: '',
    guardianName: '',
    guardianContact: '',
    primaryEmail: '',
    address: '',
    whatsappNumber: ''
  });

  const fetchParents = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/parents`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setParents(await res.json());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchParents();
  }, []);

  const resetForm = () => {
    setFormData({
      fatherName: '', fatherOccupation: '', fatherContact: '',
      motherName: '', motherOccupation: '', motherContact: '',
      guardianName: '', guardianContact: '', primaryEmail: '',
      address: '', whatsappNumber: ''
    });
    setEditingParentId(null);
    setActiveTab('list');
  };

  const openEdit = (parent: any) => {
    setEditingParentId(parent._id);
    setFormData({
      fatherName: parent.fatherName,
      fatherOccupation: parent.fatherOccupation || '',
      fatherContact: parent.fatherContact || '',
      motherName: parent.motherName,
      motherOccupation: parent.motherOccupation || '',
      motherContact: parent.motherContact || '',
      guardianName: parent.guardianName || '',
      guardianContact: parent.guardianContact || '',
      primaryEmail: parent.primaryEmail,
      address: parent.address,
      whatsappNumber: parent.whatsappNumber || ''
    });
    setActiveTab('create');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this parent record?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/parents/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchParents();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const url = editingParentId 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/parents/${editingParentId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/parents`;
        
      const res = await fetch(url, {
        method: editingParentId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success(editingParentId ? 'Parent profile updated!' : 'Parent registered successfully!');
        resetForm();
        fetchParents();
      } else {
        toast.error('Error saving parent data');
      }
    } catch (error) {
      console.error(error);
      toast.error('Network error saving parent data');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredParents = parents.filter(p => 
    p.fatherName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.motherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.primaryEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Parent Management</h1>
          <p className="text-slate-500 mt-1">Manage parent details, contact info, and occupations.</p>
        </div>
        <div className="flex space-x-2 bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => { setActiveTab('list'); setEditingParentId(null); }}
            className={`px-5 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'list' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            All Parents
          </button>
          <button 
            onClick={() => { setActiveTab('create'); if(!editingParentId) resetForm(); setActiveTab('create'); }}
            className={`px-5 py-2 rounded-lg font-bold text-sm transition-all flex items-center ${activeTab === 'create' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <Plus className="h-4 w-4 mr-1.5" />
            {editingParentId ? 'Edit Parent' : 'New Parent'}
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
                placeholder="Search by name or email..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium bg-white"
              />
            </div>
          </div>

          <div className="p-6 md:p-8">
            {isLoading ? (
              <div className="py-12 text-center text-slate-500">Loading parents...</div>
            ) : filteredParents.length === 0 ? (
              <div className="py-12 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <Users className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-700">No parents found</h3>
                <p>Add a new parent to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredParents.map((parent) => (
                  <div key={parent._id} className="border border-slate-200 rounded-2xl hover:shadow-lg transition-shadow bg-white flex flex-col overflow-hidden group">
                    <div className="p-5 border-b border-slate-100 bg-indigo-50/30">
                      <div className="flex justify-between items-start">
                        <div className="h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg mb-4">
                          {parent.fatherName[0]}{parent.motherName[0]}
                        </div>
                        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEdit(parent)} className="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded-md"><Edit2 className="h-4 w-4" /></button>
                          <button onClick={() => handleDelete(parent._id)} className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-md"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </div>
                      <h3 className="font-bold text-lg text-slate-800 leading-tight">
                        {parent.fatherName} & {parent.motherName}
                      </h3>
                      <div className="flex items-center text-xs font-semibold text-slate-500 mt-2">
                        <Mail className="h-3 w-3 mr-1" /> {parent.primaryEmail}
                      </div>
                    </div>
                    <div className="p-5 flex-1 text-sm space-y-3">
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase">Father</span>
                        <div className="font-medium text-slate-700">{parent.fatherOccupation || 'N/A'} • {parent.fatherContact || 'No Contact'}</div>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase">Mother</span>
                        <div className="font-medium text-slate-700">{parent.motherOccupation || 'N/A'} • {parent.motherContact || 'No Contact'}</div>
                      </div>
                      <div className="pt-2 border-t border-slate-100 flex items-start text-slate-600">
                        <MapPin className="h-4 w-4 mr-2 shrink-0 text-slate-400 mt-0.5" />
                        <span className="text-xs">{parent.address}</span>
                      </div>
                      {parent.whatsappNumber && (
                        <div className="flex items-start text-emerald-600">
                          <Phone className="h-4 w-4 mr-2 shrink-0 mt-0.5" />
                          <span className="text-xs font-bold">WhatsApp: {parent.whatsappNumber}</span>
                        </div>
                      )}
                      <div className="pt-3 mt-3 border-t border-slate-100">
                        <span className="text-xs font-bold text-slate-400 uppercase block mb-2">Linked Students</span>
                        {parent.students && parent.students.length > 0 ? (
                          <div className="space-y-2">
                            {parent.students.map((student: any) => (
                              <div key={student._id} className="flex items-center justify-between bg-indigo-50/50 p-2 rounded-lg border border-indigo-50">
                                <span className="font-semibold text-xs text-indigo-900">{student.firstName} {student.lastName}</span>
                                {student.grade && <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">{student.grade}</span>}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-xs text-slate-400 italic bg-slate-50 p-2 rounded-lg text-center">No students linked yet</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Father Details */}
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Father Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Father Name</label>
                  <input required type="text" className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.fatherName} onChange={e => setFormData({...formData, fatherName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Occupation</label>
                  <input type="text" className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.fatherOccupation} onChange={e => setFormData({...formData, fatherOccupation: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Contact Number</label>
                  <input type="text" className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.fatherContact} onChange={e => setFormData({...formData, fatherContact: e.target.value})} />
                </div>
              </div>
            </div>

            {/* Mother Details */}
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Mother Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Mother Name</label>
                  <input required type="text" className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.motherName} onChange={e => setFormData({...formData, motherName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Occupation</label>
                  <input type="text" className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.motherOccupation} onChange={e => setFormData({...formData, motherOccupation: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Contact Number</label>
                  <input type="text" className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.motherContact} onChange={e => setFormData({...formData, motherContact: e.target.value})} />
                </div>
              </div>
            </div>

            {/* Guardian & Contact */}
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Guardian & Contact</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Guardian Name (Optional)</label>
                  <input type="text" className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.guardianName} onChange={e => setFormData({...formData, guardianName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Guardian Contact</label>
                  <input type="text" className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.guardianContact} onChange={e => setFormData({...formData, guardianContact: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Primary Email ID</label>
                  <input required type="email" className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.primaryEmail} onChange={e => setFormData({...formData, primaryEmail: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">WhatsApp Number</label>
                  <input type="text" className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.whatsappNumber} onChange={e => setFormData({...formData, whatsappNumber: e.target.value})} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Address</label>
                  <textarea required rows={3} className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}></textarea>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
              <button type="button" onClick={resetForm} className="px-6 py-3 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
              <button type="submit" disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md disabled:opacity-50">
                {isSaving ? 'Saving...' : (editingParentId ? 'Update Parent' : 'Add Parent')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
