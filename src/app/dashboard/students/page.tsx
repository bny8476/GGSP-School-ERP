"use client";

import { useState, useEffect } from 'react';
import { GraduationCap, Plus, Edit2, Trash2, Search, Activity, Phone, ShieldAlert, Bus, FileText, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [parents, setParents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    admissionNumber: '',
    grade: 'Pre-KG',
    bloodGroup: '',
    medicalNotes: '',
    parentId: '',
    emergencyContact: '',
    transportDetails: '',
    status: 'Active'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [studentsRes, parentsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/parents`, { headers })
      ]);

      if (studentsRes.ok) setStudents(await studentsRes.json());
      if (parentsRes.ok) setParents(await parentsRes.json());
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '', lastName: '', admissionNumber: '', grade: 'Pre-KG',
      bloodGroup: '', medicalNotes: '', parentId: '', emergencyContact: '',
      transportDetails: '', status: 'Active'
    });
    setEditingStudentId(null);
    setActiveTab('list');
  };

  const openEdit = (student: any) => {
    setEditingStudentId(student._id);
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      admissionNumber: student.admissionNumber || '',
      grade: student.grade || 'Pre-KG',
      bloodGroup: student.bloodGroup || '',
      medicalNotes: student.medicalNotes || '',
      parentId: student.parentId?._id || student.parentId || '',
      emergencyContact: student.emergencyContact || student.emergencyContactPhone || '',
      transportDetails: student.transportDetails || '',
      status: student.status || 'Active'
    });
    setActiveTab('create');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this student record?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students/${id}`, {
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
      const url = editingStudentId 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/students/${editingStudentId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/students`;
        
      const payload = { ...formData };
      if (!payload.parentId) delete (payload as any).parentId;

      const res = await fetch(url, {
        method: editingStudentId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success(editingStudentId ? 'Student updated successfully!' : 'Student created successfully!');
        resetForm();
        fetchData();
      } else {
        toast.error('Error saving student data');
      }
    } catch (error) {
      console.error(error);
      toast.error('Network error saving student');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredStudents = students.filter(s => 
    s.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.admissionNumber || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownloadReportCard = async (student: any) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students/${student._id}/report-card`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to generate Report Card PDF');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report_card_${student.firstName}_${student.lastName}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Report Card downloaded!');
    } catch (error) {
      console.error(error);
      toast.error('Error downloading Report Card');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Student Management</h1>
          <p className="text-slate-500 mt-1">Manage enrollments, medical notes, and student profiles.</p>
        </div>
        <div className="flex space-x-2 bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => { setActiveTab('list'); setEditingStudentId(null); }}
            className={`px-5 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'list' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            All Students
          </button>
          <button 
            onClick={() => { setActiveTab('create'); if(!editingStudentId) resetForm(); setActiveTab('create'); }}
            className={`px-5 py-2 rounded-lg font-bold text-sm transition-all flex items-center ${activeTab === 'create' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <Plus className="h-4 w-4 mr-1.5" />
            {editingStudentId ? 'Edit Student' : 'New Student'}
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
                placeholder="Search by name or admission number..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium bg-white"
              />
            </div>
          </div>

          <div className="p-6 md:p-8">
            {isLoading ? (
              <div className="py-12 text-center text-slate-500">Loading students...</div>
            ) : filteredStudents.length === 0 ? (
              <div className="py-12 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <GraduationCap className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-700">No students found</h3>
                <p>Add a new student to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStudents.map((student) => (
                  <div key={student._id} className="border border-slate-200 rounded-2xl hover:shadow-lg transition-shadow bg-white flex flex-col overflow-hidden group">
                    <div className="p-5 border-b border-slate-100 bg-indigo-50/30">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg">
                            {student.firstName[0]}{student.lastName[0]}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-400">ADM: {student.admissionNumber || 'N/A'}</span>
                            <span className={`block text-xs font-bold ${student.status === 'Active' ? 'text-emerald-600' : 'text-slate-500'}`}>
                              • {student.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleDownloadReportCard(student)} title="Download Report Card" className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded-md"><Download className="h-4 w-4" /></button>
                          <button onClick={() => openEdit(student)} className="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded-md"><Edit2 className="h-4 w-4" /></button>
                          <button onClick={() => handleDelete(student._id)} className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-md"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </div>
                      <h3 className="font-bold text-lg text-slate-800 leading-tight">
                        {student.firstName} {student.lastName}
                      </h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full">
                          {student.grade || 'Class N/A'}
                        </span>
                        <div className="flex space-x-2">
                          <Link
                            href={`/dashboard/students/${student._id}`}
                            className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold text-xs rounded-xl hover:bg-indigo-100 transition-colors"
                          >
                            360° Profile
                          </Link>
                          <button
                            onClick={() => openEdit(student)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            title="Edit Student"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="p-5 flex-1 text-sm space-y-3">
                      <div className="flex items-center text-slate-600">
                        <Phone className="h-4 w-4 mr-3 shrink-0 text-slate-400" />
                        <span className="truncate">
                          {student.parentId ? (student.parentId.fatherName || student.parentId.motherName) : 'No parent linked'}
                        </span>
                      </div>
                      <div className="flex items-center text-rose-600 font-medium bg-rose-50 px-2 py-1 -ml-2 rounded-lg w-fit">
                        <ShieldAlert className="h-4 w-4 mr-2 shrink-0 text-rose-500" />
                        <span>Emg: {student.emergencyContact || 'None'}</span>
                      </div>
                      <div className="flex items-center text-slate-600">
                        <Activity className="h-4 w-4 mr-3 shrink-0 text-red-400" />
                        <span className="truncate">Blood: <strong className="text-red-600">{student.bloodGroup || 'N/A'}</strong></span>
                      </div>
                      <div className="flex items-center text-slate-600">
                        <Bus className="h-4 w-4 mr-3 shrink-0 text-amber-500" />
                        <span>{student.transportDetails ? student.transportDetails : 'Self Drop'}</span>
                      </div>
                      
                      {student.medicalNotes && (
                        <div className="pt-3 mt-3 border-t border-slate-100">
                          <p className="text-xs text-rose-700 font-medium italic">
                            Medical: {student.medicalNotes}
                          </p>
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
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2 text-indigo-500" /> Basic Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
                  <input required type="text" className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
                  <input required type="text" className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Admission Number</label>
                  <input type="text" className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.admissionNumber} onChange={e => setFormData({...formData, admissionNumber: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Class / Grade</label>
                  <select className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.grade} onChange={e => setFormData({...formData, grade: e.target.value})}>
                    <option>Pre-KG</option>
                    <option>LKG</option>
                    <option>UKG</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Health Info */}
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-red-500" /> Health & Medical
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Blood Group</label>
                  <select className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.bloodGroup} onChange={e => setFormData({...formData, bloodGroup: e.target.value})}>
                    <option value="">Select...</option>
                    <option>A+</option><option>A-</option>
                    <option>B+</option><option>B-</option>
                    <option>AB+</option><option>AB-</option>
                    <option>O+</option><option>O-</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Medical Notes</label>
                  <input type="text" placeholder="Allergies, chronic conditions..." className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.medicalNotes} onChange={e => setFormData({...formData, medicalNotes: e.target.value})} />
                </div>
              </div>
            </div>

            {/* Admin Info */}
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-amber-500" /> Administrative
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Link Parent</label>
                  <select className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.parentId} onChange={e => setFormData({...formData, parentId: e.target.value})}>
                    <option value="">No parent linked</option>
                    {parents.map(p => (
                      <option key={p._id} value={p._id}>{p.fatherName} & {p.motherName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Emergency Contact Number</label>
                  <input type="text" className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.emergencyContact} onChange={e => setFormData({...formData, emergencyContact: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Transport Details</label>
                  <input type="text" placeholder="Route 1 / Own Transport" className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.transportDetails} onChange={e => setFormData({...formData, transportDetails: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Status</label>
                  <select className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>Graduated</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
              <button type="button" onClick={resetForm} className="px-6 py-3 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
              <button type="submit" disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md disabled:opacity-50">
                {isSaving ? 'Saving...' : (editingStudentId ? 'Update Student' : 'Add Student')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
