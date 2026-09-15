"use client";

import { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit2, Trash2, Search, Phone, Mail, Award, Clock, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    designation: '',
    qualification: '',
    experienceYears: '',
    salary: '',
    performanceNotes: '',
    roleName: 'Teacher',
    teachingAssignments: [] as { classId: string, subjectId: string }[]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [usersRes, classesRes, subjectsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/classes`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/academic/subjects`, { headers })
      ]);

      if (usersRes.ok) {
        const allUsers = await usersRes.json();
        const staff = allUsers.filter((u: any) => u.role?.name === 'Teacher' || u.role?.name === 'Principal');
        setTeachers(staff);
      }
      if (classesRes.ok) setClasses(await classesRes.json());
      if (subjectsRes.ok) setSubjects(await subjectsRes.json());
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '', lastName: '', email: '', password: '',
      phoneNumber: '', designation: '', qualification: '',
      experienceYears: '', salary: '', performanceNotes: '', roleName: 'Teacher',
      teachingAssignments: []
    });
    setEditingTeacherId(null);
    setActiveTab('list');
  };

  const openEdit = (teacher: any) => {
    setEditingTeacherId(teacher._id);
    setFormData({
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      email: teacher.email,
      password: '', // Leave blank when editing
      phoneNumber: teacher.phoneNumber || '',
      designation: teacher.designation || '',
      qualification: teacher.qualification || '',
      experienceYears: teacher.experienceYears?.toString() || '',
      salary: teacher.salary?.toString() || '',
      performanceNotes: teacher.performanceNotes || '',
      roleName: teacher.role?.name || 'Teacher',
      teachingAssignments: teacher.teachingAssignments ? teacher.teachingAssignments.map((ta: any) => ({
        classId: ta.classId?._id || ta.classId || '',
        subjectId: ta.subjectId?._id || ta.subjectId || ''
      })) : []
    });
    setActiveTab('create');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this teacher record?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`, {
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
      const url = editingTeacherId 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/users/${editingTeacherId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/users`;
        
      const payload = { ...formData };
      if (editingTeacherId && !payload.password) {
        delete (payload as any).password;
      }
      if (payload.experienceYears) (payload as any).experienceYears = Number(payload.experienceYears);
      if (payload.salary) (payload as any).salary = Number(payload.salary);

      const res = await fetch(url, {
        method: editingTeacherId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success(editingTeacherId ? 'Teacher profile updated!' : 'Teacher added successfully!');
        resetForm();
        fetchData();
      } else {
        toast.error('Error saving teacher data');
      }
    } catch (error) {
      console.error(error);
      toast.error('Network error saving teacher');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredTeachers = teachers.filter(t => 
    t.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.designation || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Teacher Management</h1>
          <p className="text-slate-500 mt-1">Manage teacher profiles, qualifications, and performance.</p>
        </div>
        <div className="flex space-x-2 bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => { setActiveTab('list'); setEditingTeacherId(null); }}
            className={`px-5 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'list' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            All Teachers
          </button>
          <button 
            onClick={() => { setActiveTab('create'); if(!editingTeacherId) resetForm(); setActiveTab('create'); }}
            className={`px-5 py-2 rounded-lg font-bold text-sm transition-all flex items-center ${activeTab === 'create' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <Plus className="h-4 w-4 mr-1.5" />
            {editingTeacherId ? 'Edit Teacher' : 'New Teacher'}
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
                placeholder="Search by name, email, or designation..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium bg-white"
              />
            </div>
          </div>

          <div className="p-6 md:p-8">
            {isLoading ? (
              <div className="py-12 text-center text-slate-500">Loading teachers...</div>
            ) : filteredTeachers.length === 0 ? (
              <div className="py-12 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <BookOpen className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-700">No teachers found</h3>
                <p>Add a new teacher to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTeachers.map((teacher) => (
                  <div key={teacher._id} className="border border-slate-200 rounded-2xl hover:shadow-lg transition-shadow bg-white flex flex-col overflow-hidden group">
                    <div className="p-5 border-b border-slate-100 bg-indigo-50/30">
                      <div className="flex justify-between items-start">
                        <div className="h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg mb-4">
                          {teacher.firstName[0]}{teacher.lastName[0]}
                        </div>
                        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEdit(teacher)} className="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded-md"><Edit2 className="h-4 w-4" /></button>
                          <button onClick={() => handleDelete(teacher._id)} className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-md"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </div>
                      <h3 className="font-bold text-lg text-slate-800 leading-tight">
                        {teacher.firstName} {teacher.lastName}
                      </h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full">
                          {teacher.designation || teacher.role?.name || 'Staff'}
                        </span>
                      </div>
                    </div>
                    <div className="p-5 flex-1 text-sm space-y-3">
                      <div className="flex items-center text-slate-600">
                        <Mail className="h-4 w-4 mr-3 shrink-0 text-slate-400" />
                        <span className="truncate">{teacher.email}</span>
                      </div>
                      <div className="flex items-center text-slate-600">
                        <Phone className="h-4 w-4 mr-3 shrink-0 text-slate-400" />
                        <span>{teacher.phoneNumber || 'No phone'}</span>
                      </div>
                      <div className="flex items-center text-slate-600">
                        <Award className="h-4 w-4 mr-3 shrink-0 text-slate-400" />
                        <span className="truncate">{teacher.qualification || 'Not specified'}</span>
                      </div>
                      <div className="flex items-center text-slate-600">
                        <Clock className="h-4 w-4 mr-3 shrink-0 text-slate-400" />
                        <span>{teacher.experienceYears ? `${teacher.experienceYears} Years Experience` : 'No experience recorded'}</span>
                      </div>
                      
                      {teacher.teachingAssignments && teacher.teachingAssignments.length > 0 && (
                        <div className="pt-3 mt-3 border-t border-slate-100">
                          <span className="text-xs font-bold text-slate-400 uppercase block mb-2">Teaching Assignments</span>
                          <div className="flex flex-wrap gap-2">
                            {teacher.teachingAssignments.map((ta: any, idx: number) => (
                              <span key={idx} className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md border border-indigo-100">
                                {ta.subjectId?.name || 'Unknown'} ({ta.classId?.name || 'Unknown'})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {teacher.performanceNotes && (
                        <div className="pt-3 mt-3 border-t border-slate-100">
                          <p className="text-xs text-slate-500 italic line-clamp-2">
                            "{teacher.performanceNotes}"
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
              <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Basic Profile</h2>
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
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                  <input required type="email" className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Password {editingTeacherId && <span className="text-slate-400 text-xs font-normal">(Leave blank to keep)</span>}</label>
                  <input type="password" required={!editingTeacherId} className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                  <input type="text" className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} />
                </div>
              </div>
            </div>

            {/* Professional Info */}
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Professional Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Designation</label>
                  <input type="text" placeholder="e.g., Senior Math Teacher" className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Qualification</label>
                  <input type="text" placeholder="e.g., M.Sc., B.Ed." className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.qualification} onChange={e => setFormData({...formData, qualification: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Experience (Years)</label>
                  <input type="number" min="0" className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.experienceYears} onChange={e => setFormData({...formData, experienceYears: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Base Salary</label>
                  <input type="number" min="0" className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Performance Notes</label>
                  <textarea rows={3} placeholder="Internal administrative notes..." className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" value={formData.performanceNotes} onChange={e => setFormData({...formData, performanceNotes: e.target.value})}></textarea>
                </div>
              </div>
            </div>

            {/* Teaching Assignments */}
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
                <h2 className="text-lg font-bold text-slate-800">Teaching Assignments</h2>
                <button 
                  type="button" 
                  onClick={() => setFormData({...formData, teachingAssignments: [...formData.teachingAssignments, {classId: '', subjectId: ''}]})}
                  className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center bg-indigo-50 px-3 py-1.5 rounded-lg"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Assignment
                </button>
              </div>
              
              {formData.teachingAssignments.length === 0 ? (
                <div className="text-sm text-slate-500 italic py-4 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  No classes or subjects assigned yet. Click "Add Assignment" to start.
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.teachingAssignments.map((assignment, index) => (
                    <div key={index} className="flex flex-col md:flex-row gap-4 items-start md:items-end bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <div className="flex-1 w-full">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Class</label>
                        <select 
                          required
                          className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" 
                          value={assignment.classId} 
                          onChange={e => {
                            const newAssignments = [...formData.teachingAssignments];
                            newAssignments[index].classId = e.target.value;
                            setFormData({...formData, teachingAssignments: newAssignments});
                          }}
                        >
                          <option value="">Select Class...</option>
                          {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div className="flex-1 w-full">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Subject</label>
                        <select 
                          required
                          className="w-full rounded-xl border-slate-300 py-3 px-4 focus:ring-indigo-500 font-medium" 
                          value={assignment.subjectId} 
                          onChange={e => {
                            const newAssignments = [...formData.teachingAssignments];
                            newAssignments[index].subjectId = e.target.value;
                            setFormData({...formData, teachingAssignments: newAssignments});
                          }}
                        >
                          <option value="">Select Subject...</option>
                          {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                        </select>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => {
                          const newAssignments = [...formData.teachingAssignments];
                          newAssignments.splice(index, 1);
                          setFormData({...formData, teachingAssignments: newAssignments});
                        }}
                        className="p-3 text-rose-600 hover:bg-rose-100 rounded-xl transition-colors md:mt-0 mt-2 self-end md:self-auto"
                        title="Remove Assignment"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
              <button type="button" onClick={resetForm} className="px-6 py-3 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
              <button type="submit" disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md disabled:opacity-50">
                {isSaving ? 'Saving...' : (editingTeacherId ? 'Update Teacher' : 'Add Teacher')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
