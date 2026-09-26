"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Calendar, BookOpen, Clock, Plus, Trash2, Edit2, Users, CheckCircle2, 
  ChevronDown, Check, Sparkles, Building, Layers, RefreshCw, X 
} from 'lucide-react';
import toast from 'react-hot-toast';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { getApiBaseUrl } from '@/lib/utils';

function AcademicContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get('tab') || 'timetable';

  const [activeTab, setActiveTab] = useState<'timetable' | 'subjects' | 'years' | 'terms'>('timetable');
  
  const [subjects, setSubjects] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [academicYears, setAcademicYears] = useState<any[]>([]);
  
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [timetables, setTimetables] = useState<any>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Modals
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [subjectForm, setSubjectForm] = useState({ name: '', description: '', colorCode: '#0050CB' });

  const [showYearModal, setShowYearModal] = useState(false);
  const [yearForm, setYearForm] = useState({
    name: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
  });

  // Timetable builder state
  const [periods, setPeriods] = useState<any[]>([]);

  // Terms State
  const [terms, setTerms] = useState<any[]>([
    { id: 'term-1', name: 'Term 1 (Monsoon)', startDate: '2025-04-01', endDate: '2025-08-31', weightage: '30%', status: 'Completed' },
    { id: 'term-2', name: 'Term 2 (Autumn)', startDate: '2025-09-01', endDate: '2025-12-20', weightage: '35%', status: 'Active' },
    { id: 'term-3', name: 'Term 3 (Spring)', startDate: '2026-01-05', endDate: '2026-03-31', weightage: '35%', status: 'Upcoming' },
  ]);

  useEffect(() => {
    if (tabParam === 'subjects' || tabParam === 'years' || tabParam === 'terms' || tabParam === 'timetable') {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const t = params.get('tab');
        if (t === 'subjects' || t === 'years' || t === 'terms' || t === 'timetable') {
          setActiveTab(t);
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleTabChange = (t: 'timetable' | 'subjects' | 'years' | 'terms') => {
    setActiveTab(t);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', t);
      window.history.pushState({}, '', url.toString());
    }
  };

  const apiBase = getApiBaseUrl();

  const getHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [subRes, classRes, teachRes, yearRes] = await Promise.allSettled([
        fetch(`${apiBase}/api/academic/subjects`, { headers: getHeaders(), credentials: 'include' }),
        fetch(`${apiBase}/api/classes`, { headers: getHeaders(), credentials: 'include' }),
        fetch(`${apiBase}/api/users`, { headers: getHeaders(), credentials: 'include' }),
        fetch(`${apiBase}/api/academic/years`, { headers: getHeaders(), credentials: 'include' }),
      ]);
      
      if (subRes.status === 'fulfilled' && subRes.value.ok) {
        const subs = await subRes.value.json();
        if (Array.isArray(subs) && subs.length > 0) {
          setSubjects(subs);
        } else {
          setSubjects([
            { _id: 'sub-1', name: 'Phonics & English', description: 'Early vocabulary, letter sounds & pre-reading', colorCode: '#0050CB', code: 'PHN' },
            { _id: 'sub-2', name: 'Early Numeracy & Math', description: 'Number sense, shapes, sorting & counting games', colorCode: '#8B5CF6', code: 'NUM' },
            { _id: 'sub-3', name: 'General Awareness (EVS)', description: 'Plants, animals, weather, and world discovery', colorCode: '#10B981', code: 'EVS' },
            { _id: 'sub-4', name: 'Rhymes & Storytelling', description: 'Musical expressions, puppets and verbal rhythm', colorCode: '#F59E0B', code: 'RHY' },
            { _id: 'sub-5', name: 'Art & Craft', description: 'Finger painting, coloring, origami and clay modeling', colorCode: '#EC4899', code: 'ART' },
            { _id: 'sub-6', name: 'Sensory & Motor Skills', description: 'Hand-eye coordination, balance and fine motor play', colorCode: '#06B6D4', code: 'SMS' },
          ]);
        }
      }
      if (classRes.status === 'fulfilled' && classRes.value.ok) {
        const c = await classRes.value.json();
        const list = Array.isArray(c) && c.length > 0 ? c : [
          { _id: 'cls-pkg', name: 'Pre-KG' },
          { _id: 'cls-lkg', name: 'LKG' },
          { _id: 'cls-ukg', name: 'UKG' },
        ];
        setClasses(list);
        if (list.length > 0 && !selectedClass) setSelectedClass(list[0]._id);
      }
      if (teachRes.status === 'fulfilled' && teachRes.value.ok) {
        const u = await teachRes.value.json();
        setTeachers(Array.isArray(u) ? u.filter((user: any) => user.role?.name === 'Teacher' || user.role?.name === 'Admin' || user.role === 'Admin') : []);
      }
      if (yearRes.status === 'fulfilled' && yearRes.value.ok) {
        const y = await yearRes.value.json();
        setAcademicYears(Array.isArray(y) ? y : []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTimetable = async () => {
    if (!selectedClass) return;
    try {
      const res = await fetch(`${apiBase}/api/academic/timetables/${selectedClass}`, { 
        headers: getHeaders(),
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        const tt = Array.isArray(data) ? data.find((t: any) => t.dayOfWeek === selectedDay) : null;
        if (tt) {
          setTimetables(tt);
          setPeriods(tt.periods || []);
        } else {
          setTimetables(null);
          setPeriods([]);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchTimetable();
    }
  }, [selectedClass, selectedDay]);

  // Save Subject
  const handleSaveSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch(`${apiBase}/api/academic/subjects`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(subjectForm)
      });
      if (res.ok) {
        toast.success('Subject created successfully');
        setShowSubjectModal(false);
        setSubjectForm({ name: '', description: '', colorCode: '#0050CB' });
        fetchData();
      } else {
        toast.error('Failed to create subject');
      }
    } catch (e) {
      toast.error('Network error creating subject');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Subject
  const handleDeleteSubject = async (id: string) => {
    if (!confirm('Are you sure you want to remove this subject?')) return;
    try {
      const res = await fetch(`${apiBase}/api/academic/subjects/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include'
      });
      if (res.ok) {
        toast.success('Subject removed');
        fetchData();
      }
    } catch (e) {
      toast.error('Could not remove subject');
    }
  };

  // Save Timetable
  const handleSaveTimetable = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`${apiBase}/api/academic/timetables`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          classId: selectedClass,
          dayOfWeek: selectedDay,
          periods
        })
      });
      if (res.ok) {
        toast.success(`Timetable saved for ${selectedDay}!`);
        fetchTimetable();
      } else {
        const err = await res.json();
        toast.error(err.message || 'Timetable conflict or error');
      }
    } catch (e) {
      toast.error('Network error saving timetable');
    } finally {
      setIsSaving(false);
    }
  };

  // Add/Remove Period Blocks
  const addPeriod = () => {
    setPeriods([
      ...periods,
      {
        startTime: '08:30',
        endTime: '09:15',
        subjectId: subjects[0]?._id || '',
        teacherId: teachers[0]?._id || '',
        room: 'Room 101'
      }
    ]);
  };

  const updatePeriod = (index: number, field: string, value: any) => {
    const updated = [...periods];
    updated[index] = { ...updated[index], [field]: value };
    setPeriods(updated);
  };

  const removePeriod = (index: number) => {
    setPeriods(periods.filter((_, i) => i !== index));
  };

  // Create Academic Year
  const handleSaveYear = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch(`${apiBase}/api/academic/years`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(yearForm)
      });
      if (res.ok) {
        toast.success('Academic session registered successfully');
        setShowYearModal(false);
        setYearForm({ name: '', startDate: '', endDate: '', isCurrent: false });
        fetchData();
      } else {
        toast.error('Failed to create academic year');
      }
    } catch (e) {
      toast.error('Network error creating academic year');
    } finally {
      setIsSaving(false);
    }
  };

  // Set Active Academic Year
  const handleSetActiveYear = async (id: string) => {
    try {
      const res = await fetch(`${apiBase}/api/academic/years/${id}/set-current`, {
        method: 'PUT',
        headers: getHeaders(),
        credentials: 'include'
      });
      if (res.ok) {
        toast.success('Active academic cycle updated');
        fetchData();
      }
    } catch (e) {
      toast.error('Failed to update active year');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-saas pb-24">
      {/* Page Header */}
      <AdminPageHeader
        title="Academics & Timetable Command"
        subtitle="Manage instructional routines, subject catalogs, academic years, and semester schedules."
        badge="Curricular Engine"
        badgeVariant="primary"
        breadcrumbs={[
          { label: 'Admin Desk', href: '/dashboard' },
          { label: 'Academics' }
        ]}
        actions={
          <div className="flex items-center gap-2">
            {activeTab === 'subjects' && (
              <button
                type="button"
                onClick={() => setShowSubjectModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#0050CB] hover:bg-[#003E9E] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Subject</span>
              </button>
            )}

            {activeTab === 'years' && (
              <button
                type="button"
                onClick={() => setShowYearModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#0050CB] hover:bg-[#003E9E] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>New Academic Year</span>
              </button>
            )}

            <button
              type="button"
              onClick={fetchData}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        }
      />

      {/* Tabs Bar */}
      <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 pb-px overflow-x-auto custom-scrollbar">
        {[
          { id: 'timetable', label: 'Timetable Matrix', icon: Clock },
          { id: 'subjects', label: 'Subject Management', icon: BookOpen },
          { id: 'years', label: 'Academic Year Setup', icon: Calendar },
          { id: 'terms', label: 'Terms & Semesters', icon: Layers },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'border-[#0050CB] text-[#0050CB] dark:text-[#E5EEFF] bg-blue-50/50 dark:bg-blue-950/20 rounded-t-xl'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: TIMETABLES */}
      {activeTab === 'timetable' && (
        <div className="space-y-6">
          {/* Class & Day Selector */}
          <div className="bg-white dark:bg-[#07152F] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Select Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs font-bold text-slate-800 dark:text-slate-100 outline-hidden"
              >
                {classes.map((c) => (
                  <option key={c._id} value={c._id}>
                    Class {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Select Day of Week</label>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs font-bold text-slate-800 dark:text-slate-100 outline-hidden"
              >
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Periods List */}
          <div className="bg-white dark:bg-[#07152F] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#0050CB]" />
                  <span>{selectedDay} Bell Schedule ({periods.length} Periods)</span>
                </h3>
                <p className="text-xs text-slate-500">Configure periods, instructors, and room allocation.</p>
              </div>
              <button
                type="button"
                onClick={addPeriod}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E5EEFF] dark:bg-[#0050CB]/20 text-[#0050CB] dark:text-[#E5EEFF] font-bold text-xs hover:bg-blue-100 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Period</span>
              </button>
            </div>

            {periods.length === 0 ? (
              <div className="py-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 space-y-2">
                <Clock className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
                <p className="text-xs font-bold">No periods scheduled for {selectedDay}.</p>
                <button
                  type="button"
                  onClick={addPeriod}
                  className="text-xs font-bold text-[#0050CB] hover:underline"
                >
                  + Add First Period
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {periods.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex flex-col md:flex-row items-center gap-3"
                  >
                    <span className="w-6 h-6 rounded-full bg-[#0050CB] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                      {idx + 1}
                    </span>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <input
                        type="time"
                        value={p.startTime}
                        onChange={(e) => updatePeriod(idx, 'startTime', e.target.value)}
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs font-mono font-bold w-24"
                      />
                      <span className="text-slate-400 text-xs font-bold">to</span>
                      <input
                        type="time"
                        value={p.endTime}
                        onChange={(e) => updatePeriod(idx, 'endTime', e.target.value)}
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs font-mono font-bold w-24"
                      />
                    </div>

                    <select
                      value={typeof p.subjectId === 'object' ? p.subjectId?._id : p.subjectId}
                      onChange={(e) => updatePeriod(idx, 'subjectId', e.target.value)}
                      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs font-bold flex-1 w-full"
                    >
                      <option value="">Select Subject...</option>
                      {subjects.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.name}
                        </option>
                      ))}
                    </select>

                    <select
                      value={typeof p.teacherId === 'object' ? p.teacherId?._id : p.teacherId || ''}
                      onChange={(e) => updatePeriod(idx, 'teacherId', e.target.value)}
                      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs font-bold flex-1 w-full"
                    >
                      <option value="">Assign Teacher...</option>
                      {teachers.map((t) => (
                        <option key={t._id} value={t._id}>
                          {t.firstName} {t.lastName}
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      placeholder="Room (e.g. Lab 2)"
                      value={p.room || ''}
                      onChange={(e) => updatePeriod(idx, 'room', e.target.value)}
                      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs font-bold w-full md:w-28"
                    />

                    <button
                      type="button"
                      onClick={() => removePeriod(idx)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Remove Block"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <div className="pt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveTimetable}
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-[#0050CB] hover:bg-[#003E9E] disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    {isSaving ? 'Validating Conflicts...' : 'Save Routine'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SUBJECTS */}
      {activeTab === 'subjects' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {subjects.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-400 bg-white dark:bg-[#07152F] rounded-2xl border border-slate-200 dark:border-slate-800">
                <BookOpen className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                <p className="font-bold text-slate-600 dark:text-slate-300">No subjects cataloged yet</p>
                <button
                  type="button"
                  onClick={() => setShowSubjectModal(true)}
                  className="mt-2 text-xs font-bold text-[#0050CB] hover:underline"
                >
                  + Add First Subject
                </button>
              </div>
            ) : (
              subjects.map((sub) => (
                <div
                  key={sub._id}
                  className="bg-white dark:bg-[#07152F] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div
                    className="absolute top-0 left-0 w-2 h-full"
                    style={{ backgroundColor: sub.colorCode || '#0050CB' }}
                  />
                  <div className="pl-3">
                    <div className="flex items-start justify-between">
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{sub.name}</h4>
                      <button
                        type="button"
                        onClick={() => handleDeleteSubject(sub._id)}
                        className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                      {sub.description || 'Core academic curriculum'}
                    </p>
                  </div>
                  <div className="pl-3 pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Code: {sub.code || sub.name?.slice(0, 3).toUpperCase()}</span>
                    <span className="font-bold text-[#0050CB] dark:text-[#E5EEFF]">Standard</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: ACADEMIC YEARS */}
      {activeTab === 'years' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#07152F] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
              Institutional Academic Sessions
            </h3>
            <p className="text-xs text-slate-500">
              Configure session timelines, term dates, and designate the active school calendar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {academicYears.map((yr) => {
              const isCurrent = yr.isCurrent;
              return (
                <div
                  key={yr._id}
                  className={`bg-white dark:bg-[#07152F] p-5 rounded-2xl border shadow-sm flex flex-col justify-between transition-all ${
                    isCurrent
                      ? 'border-[#0050CB] ring-2 ring-[#0050CB]/20 dark:ring-[#0050CB]/40'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-black text-sm text-slate-800 dark:text-slate-100">{yr.name}</h4>
                      <p className="text-[11px] text-slate-400">
                        {new Date(yr.startDate).toLocaleDateString('en-GB')} –{' '}
                        {new Date(yr.endDate).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                    {isCurrent ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800">
                        Inactive
                      </span>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Status: {yr.status || 'Active'}</span>
                    {!isCurrent && (
                      <button
                        type="button"
                        onClick={() => handleSetActiveYear(yr._id)}
                        className="px-3 py-1 bg-[#0050CB] hover:bg-[#003E9E] text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-xs"
                      >
                        Set as Active
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: TERMS & SEMESTERS */}
      {activeTab === 'terms' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#07152F] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
              Curricular Terms & Assessment Intervals
            </h3>
            <p className="text-xs text-slate-500">
              Three-term academic division with grade weighting configurations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {terms.map((t) => (
              <div
                key={t.id}
                className="bg-white dark:bg-[#07152F] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-sm text-slate-800 dark:text-slate-100">{t.name}</h4>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      t.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
                <div className="text-xs text-slate-500 space-y-1">
                  <p>
                    <strong>Schedule:</strong> {t.startDate} to {t.endDate}
                  </p>
                  <p>
                    <strong>Grade Weightage:</strong> {t.weightage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ADD SUBJECT */}
      {showSubjectModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#07152F] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-sm text-slate-800 dark:text-slate-100">Catalog New Subject</h3>
              <button
                type="button"
                onClick={() => setShowSubjectModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveSubject} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Subject Title *</label>
                <input
                  required
                  type="text"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-bold outline-hidden"
                  value={subjectForm.name}
                  onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                  placeholder="e.g. Mathematics, Physical Sciences"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <input
                  type="text"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-bold outline-hidden"
                  value={subjectForm.description}
                  onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })}
                  placeholder="Curricular scope"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Theme Color Tag</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    className="h-9 w-9 rounded-xl border-none cursor-pointer"
                    value={subjectForm.colorCode}
                    onChange={(e) => setSubjectForm({ ...subjectForm, colorCode: e.target.value })}
                  />
                  <input
                    type="text"
                    className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2 font-mono text-xs font-bold"
                    value={subjectForm.colorCode}
                    onChange={(e) => setSubjectForm({ ...subjectForm, colorCode: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubjectModal(false)}
                  className="px-4 py-2 font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-[#0050CB] hover:bg-[#003E9E] text-white font-bold rounded-xl shadow-md"
                >
                  {isSaving ? 'Saving...' : 'Add Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD ACADEMIC YEAR */}
      {showYearModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#07152F] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-sm text-slate-800 dark:text-slate-100">Register Academic Year</h3>
              <button
                type="button"
                onClick={() => setShowYearModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveYear} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Session Label *</label>
                <input
                  required
                  type="text"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-bold outline-hidden"
                  value={yearForm.name}
                  onChange={(e) => setYearForm({ ...yearForm, name: e.target.value })}
                  placeholder="e.g. AY 2026 - 2027"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Start Date *</label>
                  <input
                    required
                    type="date"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-bold outline-hidden"
                    value={yearForm.startDate}
                    onChange={(e) => setYearForm({ ...yearForm, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">End Date *</label>
                  <input
                    required
                    type="date"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-bold outline-hidden"
                    value={yearForm.endDate}
                    onChange={(e) => setYearForm({ ...yearForm, endDate: e.target.value })}
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={yearForm.isCurrent}
                  onChange={(e) => setYearForm({ ...yearForm, isCurrent: e.target.checked })}
                  className="w-4 h-4 rounded text-[#0050CB]"
                />
                <span>Set as active session immediately</span>
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowYearModal(false)}
                  className="px-4 py-2 font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-[#0050CB] hover:bg-[#003E9E] text-white font-bold rounded-xl shadow-md"
                >
                  {isSaving ? 'Creating...' : 'Register Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AcademicPage() {
  return (
    <Suspense fallback={
      <div className="p-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
        <div className="w-5 h-5 border-2 border-[#0050CB] border-t-transparent rounded-full animate-spin" />
        <span>Loading Academic Command...</span>
      </div>
    }>
      <AcademicContent />
    </Suspense>
  );
}
