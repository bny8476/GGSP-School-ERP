"use client";

import { useState, useEffect } from 'react';
import { Calendar, BookOpen, Clock, Plus, Trash2, Edit2, Users, CheckCircle2, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AcademicPage() {
  const [activeTab, setActiveTab] = useState<'subjects' | 'timetables'>('timetables');
  
  const [subjects, setSubjects] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [timetables, setTimetables] = useState<any>(null); // Current timetable for the class
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Modals
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [subjectForm, setSubjectForm] = useState({ name: '', description: '', colorCode: '#4F46E5' });

  // Timetable builder state
  const [periods, setPeriods] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchTimetable();
    }
  }, [selectedClass, selectedDay]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [subRes, classRes, teachRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/academic/subjects`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/classes`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, { headers })
      ]);
      
      if (subRes.ok) setSubjects(await subRes.json());
      if (classRes.ok) {
        const c = await classRes.json();
        setClasses(c);
        if (c.length > 0 && !selectedClass) setSelectedClass(c[0]._id);
      }
      if (teachRes.ok) {
        const u = await teachRes.json();
        setTeachers(u.filter((user: any) => user.role?.name === 'Teacher' || user.role?.name === 'Admin' || user.role === 'Admin')); // simplistic filter
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTimetable = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/academic/timetables/${selectedClass}`, { 
        headers: { 'Authorization': `Bearer ${token}` } 
      });
      if (res.ok) {
        const data = await res.json();
        // find the one for selected day
        const tt = data.find((t: any) => t.dayOfWeek === selectedDay);
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

  // --- SUBJECTS ---
  const handleSaveSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/academic/subjects`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(subjectForm)
      });
      if (res.ok) {
        toast.success("Subject saved!");
        setShowSubjectModal(false);
        setSubjectForm({ name: '', description: '', colorCode: '#4F46E5' });
        fetchData();
      } else {
        toast.error("Failed to save subject.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error saving subject.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSubject = async (id: string) => {
    if (!confirm("Delete this subject?")) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/academic/subjects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      toast.success("Subject deleted!");
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Error deleting subject.");
    }
  };

  // --- TIMETABLES ---
  const addPeriod = () => {
    setPeriods([...periods, { startTime: '', endTime: '', subjectId: '', teacherId: '', room: '' }]);
  };

  const updatePeriod = (index: number, field: string, value: string) => {
    const newP = [...periods];
    if (field === 'subjectId') {
       // if we update subject, it can be an object if populated, so just set the string ID
       newP[index][field] = value;
    } else if (field === 'teacherId') {
       newP[index][field] = value;
    } else {
       newP[index][field] = value;
    }
    setPeriods(newP);
  };

  const removePeriod = (index: number) => {
    const newP = [...periods];
    newP.splice(index, 1);
    setPeriods(newP);
  };

  const handleSaveTimetable = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      // Format periods to extract IDs if populated
      const formattedPeriods = periods.map(p => ({
        startTime: p.startTime,
        endTime: p.endTime,
        subjectId: typeof p.subjectId === 'object' ? p.subjectId._id : p.subjectId,
        teacherId: typeof p.teacherId === 'object' ? p.teacherId._id : p.teacherId,
        room: p.room
      }));

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/academic/timetables`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId: selectedClass,
          dayOfWeek: selectedDay,
          periods: formattedPeriods
        })
      });
      if (res.ok) {
        toast.success("Timetable saved!");
        fetchTimetable();
      } else {
        toast.error("Failed to save timetable.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error saving timetable.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Academic Schedule</h1>
          <p className="text-slate-500 mt-1">Manage subjects and class timetables / routines.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/50">
          <button 
            onClick={() => setActiveTab('timetables')}
            className={`flex-1 flex justify-center items-center py-4 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'timetables' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Clock className="h-5 w-5 mr-2" /> Class Routines
          </button>
          <button 
            onClick={() => setActiveTab('subjects')}
            className={`flex-1 flex justify-center items-center py-4 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'subjects' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="h-5 w-5 mr-2" /> Subject Management
          </button>
        </div>

        <div className="p-6 md:p-8">
          {activeTab === 'subjects' ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">Subjects & Activities</h2>
                <button 
                  onClick={() => setShowSubjectModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold flex items-center transition-all shadow-md shadow-indigo-200 text-sm"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Subject
                </button>
              </div>
              
              {isLoading ? (
                <div className="py-10 text-center text-slate-500">Loading subjects...</div>
              ) : subjects.length === 0 ? (
                <div className="py-10 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">No subjects defined yet.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subjects.map(sub => (
                    <div key={sub._id} className="border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-shadow flex flex-col h-full bg-white relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: sub.colorCode }}></div>
                      <div className="flex justify-between items-start pl-2">
                        <div>
                          <h3 className="font-bold text-lg text-slate-800 flex items-center">
                            {sub.name}
                          </h3>
                          <p className="text-sm text-slate-500 mt-1">{sub.description || 'No description provided'}</p>
                        </div>
                        <button onClick={() => handleDeleteSubject(sub._id)} className="text-slate-400 hover:text-rose-500 p-1">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              {/* Timetable Filters */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Select Class</label>
                  <select 
                    value={selectedClass} 
                    onChange={e => setSelectedClass(e.target.value)}
                    className="w-full rounded-xl border-slate-300 py-2.5 px-3 focus:border-indigo-500 focus:ring-indigo-500 font-medium"
                  >
                    {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Select Day</label>
                  <select 
                    value={selectedDay} 
                    onChange={e => setSelectedDay(e.target.value)}
                    className="w-full rounded-xl border-slate-300 py-2.5 px-3 focus:border-indigo-500 focus:ring-indigo-500 font-medium"
                  >
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              {/* Periods Builder */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg text-slate-800 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-indigo-500"/> 
                    {selectedDay} Routine
                  </h3>
                  <button onClick={addPeriod} className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors flex items-center">
                    <Plus className="h-4 w-4 mr-1" /> Add Block
                  </button>
                </div>

                {periods.length === 0 ? (
                  <div className="py-12 text-center bg-slate-50 border border-slate-200 border-dashed rounded-2xl text-slate-500">
                    <Clock className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                    <p className="font-medium">No routine defined for this day.</p>
                    <button onClick={addPeriod} className="mt-3 text-indigo-600 font-bold hover:underline">Add First Block</button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {periods.map((p, idx) => (
                      <div key={idx} className="flex flex-col md:flex-row items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-indigo-200 transition-colors">
                        <div className="flex items-center gap-2 w-full md:w-auto">
                          <input type="time" className="rounded-lg border-slate-300 text-sm p-2 w-28 font-medium" value={p.startTime} onChange={e => updatePeriod(idx, 'startTime', e.target.value)} />
                          <span className="text-slate-400 font-bold text-xs">TO</span>
                          <input type="time" className="rounded-lg border-slate-300 text-sm p-2 w-28 font-medium" value={p.endTime} onChange={e => updatePeriod(idx, 'endTime', e.target.value)} />
                        </div>
                        
                        <select 
                          className="rounded-lg border-slate-300 text-sm p-2 flex-1 w-full font-medium" 
                          value={typeof p.subjectId === 'object' ? p.subjectId._id : p.subjectId} 
                          onChange={e => updatePeriod(idx, 'subjectId', e.target.value)}
                        >
                          <option value="">-- Activity / Subject --</option>
                          {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                        </select>
                        
                        <select 
                          className="rounded-lg border-slate-300 text-sm p-2 flex-1 w-full font-medium" 
                          value={typeof p.teacherId === 'object' ? p.teacherId._id : p.teacherId || ''} 
                          onChange={e => updatePeriod(idx, 'teacherId', e.target.value)}
                        >
                          <option value="">-- Assign Teacher --</option>
                          {teachers.map(t => <option key={t._id} value={t._id}>{t.firstName} {t.lastName}</option>)}
                        </select>
                        
                        <button onClick={() => removePeriod(idx)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors w-full md:w-auto shrink-0 flex justify-center">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                    <div className="pt-4 flex justify-end">
                       <button onClick={handleSaveTimetable} disabled={isSaving} className="bg-indigo-600 text-white font-bold px-6 py-2.5 rounded-xl shadow-md hover:bg-indigo-700 transition-colors disabled:opacity-50">
                         {isSaving ? 'Saving...' : 'Save Routine'}
                       </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Subject Modal */}
      {showSubjectModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
             <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-xl text-slate-800">New Subject</h3>
                <button onClick={() => setShowSubjectModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
             </div>
             <form onSubmit={handleSaveSubject} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Subject Name</label>
                  <input required type="text" className="w-full rounded-xl border-slate-300 p-2.5 text-sm" value={subjectForm.name} onChange={e => setSubjectForm({...subjectForm, name: e.target.value})} placeholder="e.g. Literacy, Numeracy..." />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Description</label>
                  <input type="text" className="w-full rounded-xl border-slate-300 p-2.5 text-sm" value={subjectForm.description} onChange={e => setSubjectForm({...subjectForm, description: e.target.value})} placeholder="Optional description" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Color Tag</label>
                  <div className="flex gap-2">
                    <input type="color" className="h-10 w-10 rounded cursor-pointer" value={subjectForm.colorCode} onChange={e => setSubjectForm({...subjectForm, colorCode: e.target.value})} />
                    <input type="text" className="flex-1 rounded-xl border-slate-300 p-2.5 text-sm font-mono" value={subjectForm.colorCode} onChange={e => setSubjectForm({...subjectForm, colorCode: e.target.value})} />
                  </div>
                </div>
                <button type="submit" disabled={isSaving} className="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-xl mt-2 disabled:opacity-50 hover:bg-indigo-700">
                  {isSaving ? 'Saving...' : 'Create Subject'}
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
