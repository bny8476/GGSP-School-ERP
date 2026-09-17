"use client";

import { useState, useEffect } from 'react';
import { Calendar, Save, Sun, Moon, Utensils, Smile, Search, Activity, Palette, Music, BookOpen, Trees, Shapes } from 'lucide-react';
import toast from 'react-hot-toast';

const AVAILABLE_ACTIVITIES = [
  { name: 'Art & Craft', icon: Palette, color: 'text-pink-500 bg-pink-50 ring-pink-200' },
  { name: 'Music & Dance', icon: Music, color: 'text-purple-500 bg-purple-50 ring-purple-200' },
  { name: 'Story Time', icon: BookOpen, color: 'text-amber-500 bg-amber-50 ring-amber-200' },
  { name: 'Outdoor Play', icon: Trees, color: 'text-emerald-500 bg-emerald-50 ring-emerald-200' },
  { name: 'Math / Puzzles', icon: Shapes, color: 'text-blue-500 bg-blue-50 ring-blue-200' },
];

export default function DailyDiaryPage() {
  const [selectedClass, setSelectedClass] = useState('LKG');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<any[]>([]);
  const [diaries, setDiaries] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchClassData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        // Fetch students in this class
        const studentsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students`, { headers });
        const allStudents = studentsRes.ok ? await studentsRes.json() : [];
        const classStudents = allStudents.filter((s: any) => s.grade === selectedClass);
        setStudents(classStudents);

        // Fetch existing diaries for this date and class
        const diaryRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/daily-diary?date=${selectedDate}&grade=${selectedClass}`, { headers });
        if (diaryRes.ok) {
          const existingDiaries = await diaryRes.json();
          const diaryMap: Record<string, any> = {};
          existingDiaries.forEach((d: any) => {
            const studentId = typeof d.studentId === 'object' ? d.studentId._id : d.studentId;
            diaryMap[studentId] = d;
          });
          setDiaries(diaryMap);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClassData();
  }, [selectedClass, selectedDate]);

  const handleUpdate = (studentId: string, field: string, value: any) => {
    setDiaries(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const toggleActivity = (studentId: string, activityName: string) => {
    setDiaries(prev => {
      const current = prev[studentId]?.activities || [];
      const newActivities = current.includes(activityName) 
        ? current.filter((a: string) => a !== activityName)
        : [...current, activityName];
      return {
        ...prev,
        [studentId]: {
          ...prev[studentId],
          activities: newActivities
        }
      };
    });
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

      const promises = Object.keys(diaries).map(studentId => {
        const data = diaries[studentId];
        return fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/daily-diary`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            studentId,
            date: selectedDate,
            meals: data.meals || [],
            napTime: data.napTime || { duration: '' },
            mood: data.mood || 'Happy',
            activities: data.activities || [],
            notes: data.notes || ''
          })
        });
      });

      await Promise.all(promises);
      
      // Refresh to get the updated teacher attribution
      const diaryRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/daily-diary?date=${selectedDate}&grade=${selectedClass}`, { headers });
      if (diaryRes.ok) {
        const existingDiaries = await diaryRes.json();
        const diaryMap: Record<string, any> = {};
        existingDiaries.forEach((d: any) => {
          const sId = typeof d.studentId === 'object' ? d.studentId._id : d.studentId;
          diaryMap[sId] = d;
        });
        setDiaries(diaryMap);
      }

      toast.success('All daily diaries saved successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Error saving diaries');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Daily Diary</h1>
          <p className="text-slate-500 mt-1">Log meals, naps, mood, and activities for parents to see.</p>
        </div>
        <button 
          onClick={handleSaveAll}
          disabled={isSaving || Object.keys(diaries).length === 0}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-medium flex items-center transition-colors shadow-sm"
        >
          <Save className="h-5 w-5 mr-2" />
          {isSaving ? 'Saving...' : 'Save All Diaries'}
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Controls */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-bold text-slate-700 mb-2">Select Class</label>
            <div className="flex gap-2">
              {['Pre-KG', 'LKG', 'UKG'].map(grade => (
                <button
                  key={grade}
                  onClick={() => setSelectedClass(grade)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${selectedClass === grade ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  {grade}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Select Date</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-4 w-4 text-slate-400" />
              </div>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm font-medium focus:ring-indigo-500 focus:border-indigo-500 bg-white" 
              />
            </div>
          </div>
        </div>

        {/* Student List */}
        <div className="p-0">
          {isLoading ? (
            <div className="p-16 text-center text-slate-500">
              <div className="animate-spin h-8 w-8 text-indigo-500 mx-auto mb-4 border-4 border-indigo-200 border-t-indigo-600 rounded-full"></div>
              Loading student diaries...
            </div>
          ) : students.length === 0 ? (
            <div className="p-16 text-center text-slate-500">No students enrolled in {selectedClass}.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {students.map(student => {
                const diary = diaries[student._id] || {};
                const studentActivities = diary.activities || [];
                
                return (
                  <div key={student._id} className="p-8 hover:bg-slate-50 transition-colors">
                    <div className="flex flex-col xl:flex-row gap-8">
                      
                      {/* Student Info */}
                      <div className="w-full xl:w-48 flex items-start gap-4">
                        <div className="h-14 w-14 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xl shrink-0 shadow-inner">
                          {student.firstName[0]}{student.lastName[0]}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-lg">{student.firstName} {student.lastName}</h3>
                          <p className="text-xs font-semibold text-slate-500 bg-slate-100 inline-block px-2 py-0.5 rounded mt-1">ID: {student._id.substring(0,6)}</p>
                          {diary.teacherId && (
                            <p className="text-[10px] uppercase font-bold text-slate-400 mt-2 tracking-wider">
                              Last updated by:<br/>
                              <span className="text-indigo-600">{diary.teacherId.firstName} {diary.teacherId.lastName}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Controls Grid */}
                      <div className="flex-1 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Meals */}
                          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center">
                              <Utensils className="h-3 w-3 mr-1.5 text-orange-500" /> Meals Eaten
                            </h4>
                            <select 
                              className="w-full border-slate-200 rounded-xl text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
                              value={diary.meals?.[0]?.status || ''}
                              onChange={(e) => handleUpdate(student._id, 'meals', [{ type: 'Lunch', status: e.target.value }])}
                            >
                              <option value="">Select quantity...</option>
                              <option value="None">None (0%)</option>
                              <option value="Some">Some (50%)</option>
                              <option value="Most">Most (75%)</option>
                              <option value="All">All (100%)</option>
                            </select>
                          </div>

                          {/* Nap */}
                          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center">
                              <Moon className="h-3 w-3 mr-1.5 text-indigo-500" /> Nap Duration
                            </h4>
                            <select 
                              className="w-full border-slate-200 rounded-xl text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
                              value={diary.napTime?.duration || ''}
                              onChange={(e) => handleUpdate(student._id, 'napTime', { duration: e.target.value })}
                            >
                              <option value="">Select duration...</option>
                              <option value="Did not sleep">Did not sleep</option>
                              <option value="30 mins">30 mins</option>
                              <option value="1 hour">1 hour</option>
                              <option value="1.5 hours">1.5 hours</option>
                              <option value="2+ hours">2+ hours</option>
                            </select>
                          </div>

                          {/* Mood */}
                          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center">
                              <Smile className="h-3 w-3 mr-1.5 text-amber-500" /> General Mood
                            </h4>
                            <div className="flex gap-2">
                              {['Happy', 'Quiet', 'Fussy'].map(m => (
                                <button
                                  key={m}
                                  onClick={() => handleUpdate(student._id, 'mood', m)}
                                  className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                                    diary.mood === m 
                                      ? m === 'Happy' ? 'bg-emerald-100 text-emerald-800 ring-2 ring-emerald-400 shadow-sm' 
                                        : m === 'Quiet' ? 'bg-indigo-100 text-indigo-800 ring-2 ring-indigo-400 shadow-sm'
                                        : 'bg-rose-100 text-rose-800 ring-2 ring-rose-400 shadow-sm'
                                      : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
                                  }`}
                                >
                                  {m}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Activities Row */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center">
                            <Activity className="h-3 w-3 mr-1.5 text-rose-500" /> Activities Participated
                          </h4>
                          <div className="flex flex-wrap gap-3">
                            {AVAILABLE_ACTIVITIES.map((act) => {
                              const isActive = studentActivities.includes(act.name);
                              const Icon = act.icon;
                              return (
                                <button
                                  key={act.name}
                                  onClick={() => toggleActivity(student._id, act.name)}
                                  className={`flex items-center px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                                    isActive 
                                      ? `${act.color} ring-2 border-transparent shadow-sm` 
                                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300'
                                  }`}
                                >
                                  <Icon className={`h-3.5 w-3.5 mr-1.5 ${isActive ? '' : 'text-slate-400'}`} />
                                  {act.name}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Notes Field */}
                        <div>
                          <input 
                            type="text" 
                            placeholder="Add a quick note for the parents... (e.g., 'Loved the painting activity today!')"
                            className="w-full border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50 py-3 px-4"
                            value={diary.notes || ''}
                            onChange={(e) => handleUpdate(student._id, 'notes', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
