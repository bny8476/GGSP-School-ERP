"use client";

import { useState, useEffect, useMemo } from 'react';
import { Calendar, CheckCircle2, XCircle, Clock, AlertCircle, Search, CheckSquare, Users, GraduationCap, UsersRound } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState<'students' | 'staff'>('students');
  const [selectedClass, setSelectedClass] = useState('LKG');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [students, setStudents] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [attendanceData, setAttendanceData] = useState<Record<string, string>>({});
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchClassData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const entityType = activeTab === 'students' ? 'Student' : 'User';

      const [entitiesRes, attRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${activeTab === 'students' ? 'students' : 'users'}`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/attendance?date=${selectedDate}&entityType=${entityType}`, { headers })
      ]);
      
      if (entitiesRes.ok) {
        const allEntities = await entitiesRes.json();
        if (activeTab === 'students') {
          const classStudents = allEntities.filter((s: any) => s.grade === selectedClass);
          setStudents(classStudents);
        } else {
          setStaff(allEntities);
        }
      }

      if (attRes.ok) {
        const existingAtt = await attRes.json();
        const attMap: Record<string, string> = {};
        existingAtt.forEach((record: any) => {
          const id = typeof record.entityId === 'object' ? record.entityId._id : record.entityId;
          attMap[id] = record.status;
        });
        setAttendanceData(attMap);
      } else {
        setAttendanceData({});
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClassData();
  }, [selectedClass, selectedDate, activeTab]);

  const handleMark = (id: string, status: string) => {
    setAttendanceData(prev => ({
      ...prev,
      [id]: status
    }));
  };

  const handleMarkAllPresent = () => {
    const newAttData = { ...attendanceData };
    const list = activeTab === 'students' ? students : staff;
    list.forEach(item => {
      newAttData[item._id] = 'Present';
    });
    setAttendanceData(newAttData);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' 
      };

      const entityType = activeTab === 'students' ? 'Student' : 'User';

      const records = Object.keys(attendanceData).map(id => ({
        date: selectedDate,
        entityType,
        entityId: id,
        status: attendanceData[id]
      }));

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/attendance`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ records })
      });

      if (res.ok) {
        toast.success('Attendance saved successfully!');
      } else {
        const err = await res.json();
        toast.error(`Failed to save attendance: ${err.message}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Network error while saving attendance.');
    } finally {
      setIsSaving(false);
    }
  };

  const currentList = activeTab === 'students' ? students : staff;

  const filteredList = useMemo(() => {
    if (!searchQuery) return currentList;
    const lowerQ = searchQuery.toLowerCase();
    return currentList.filter(item => 
      item.firstName.toLowerCase().includes(lowerQ) || 
      item.lastName.toLowerCase().includes(lowerQ)
    );
  }, [currentList, searchQuery]);

  const metrics = useMemo(() => {
    let present = 0, absent = 0, late = 0, halfDay = 0;
    currentList.forEach(item => {
      const status = attendanceData[item._id];
      if (status === 'Present') present++;
      else if (status === 'Absent') absent++;
      else if (status === 'Late') late++;
      else if (status === 'Half-Day') halfDay++;
    });
    return { present, absent, late, halfDay, total: currentList.length };
  }, [attendanceData, currentList]);

  const getStatusButtonClass = (id: string, status: string, baseColor: string) => {
    const isSelected = attendanceData[id] === status;
    if (!isSelected) return 'bg-slate-50 border border-slate-200 text-slate-400 hover:bg-slate-100 hover:border-slate-300';
    
    switch(baseColor) {
      case 'emerald': return 'bg-emerald-500 border-emerald-600 text-white shadow-md shadow-emerald-200 transform scale-110';
      case 'rose': return 'bg-rose-500 border-rose-600 text-white shadow-md shadow-rose-200 transform scale-110';
      case 'amber': return 'bg-amber-500 border-amber-600 text-white shadow-md shadow-amber-200 transform scale-110';
      case 'indigo': return 'bg-indigo-500 border-indigo-600 text-white shadow-md shadow-indigo-200 transform scale-110';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Daily Attendance</h1>
          <p className="text-slate-500 mt-1">Mark, track, and manage student and staff attendance.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving || Object.keys(attendanceData).length === 0}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 flex justify-center items-center transform hover:-translate-y-0.5"
        >
          {isSaving ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div> : 'Save Register'}
        </button>
      </div>

      {/* METRICS DASHBOARD */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <div className="flex items-center text-slate-500 mb-1">
            <Users className="h-4 w-4 mr-1.5" /> <span className="text-xs font-bold uppercase tracking-wider">Total {activeTab === 'students' ? 'Students' : 'Staff'}</span>
          </div>
          <span className="text-3xl font-black text-slate-800">{metrics.total}</span>
        </div>
        <div className="bg-emerald-50 p-5 rounded-3xl border border-emerald-100 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10 text-emerald-600"><CheckCircle2 className="h-24 w-24" /></div>
          <div className="flex items-center text-emerald-800 mb-1 relative z-10">
            <CheckCircle2 className="h-4 w-4 mr-1.5" /> <span className="text-xs font-bold uppercase tracking-wider">Present</span>
          </div>
          <span className="text-3xl font-black text-emerald-600 relative z-10">{metrics.present}</span>
        </div>
        <div className="bg-rose-50 p-5 rounded-3xl border border-rose-100 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10 text-rose-600"><XCircle className="h-24 w-24" /></div>
          <div className="flex items-center text-rose-800 mb-1 relative z-10">
            <XCircle className="h-4 w-4 mr-1.5" /> <span className="text-xs font-bold uppercase tracking-wider">Absent</span>
          </div>
          <span className="text-3xl font-black text-rose-600 relative z-10">{metrics.absent}</span>
        </div>
        <div className="bg-amber-50 p-5 rounded-3xl border border-amber-100 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10 text-amber-600"><Clock className="h-24 w-24" /></div>
          <div className="flex items-center text-amber-800 mb-1 relative z-10">
            <Clock className="h-4 w-4 mr-1.5" /> <span className="text-xs font-bold uppercase tracking-wider">Late</span>
          </div>
          <span className="text-3xl font-black text-amber-600 relative z-10">{metrics.late}</span>
        </div>
        <div className="bg-indigo-50 p-5 rounded-3xl border border-indigo-100 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10 text-indigo-600"><AlertCircle className="h-24 w-24" /></div>
          <div className="flex items-center text-indigo-800 mb-1 relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider">Half-Day</span>
          </div>
          <span className="text-3xl font-black text-indigo-600 relative z-10">{metrics.halfDay}</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/50">
          <button 
            onClick={() => setActiveTab('students')}
            className={`flex-1 flex justify-center items-center py-4 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'students' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <GraduationCap className="h-5 w-5 mr-2" /> Student Attendance
          </button>
          <button 
            onClick={() => setActiveTab('staff')}
            className={`flex-1 flex justify-center items-center py-4 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'staff' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <UsersRound className="h-5 w-5 mr-2" /> Staff Attendance
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {/* Controls */}
          <div className="flex flex-col lg:flex-row gap-6 mb-8 border-b border-slate-100 pb-8">
            <div className="flex-1">
              {activeTab === 'students' ? (
                <>
                  <label className="block text-sm font-bold text-slate-700 mb-2.5">Select Class</label>
                  <div className="flex flex-wrap gap-2">
                    {['Pre-KG', 'LKG', 'UKG'].map(grade => (
                      <button
                        key={grade}
                        onClick={() => setSelectedClass(grade)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${selectedClass === grade ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                      >
                        {grade}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-sm font-bold text-slate-500 mt-2">Showing all staff members for attendance.</div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2.5">Select Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-slate-400" />
                </div>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="pl-11 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm font-bold text-slate-700 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 w-full sm:w-auto" 
                />
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <button 
              onClick={handleMarkAllPresent}
              disabled={isLoading || currentList.length === 0}
              className="w-full sm:w-auto flex items-center justify-center px-5 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded-xl font-bold text-sm transition-colors disabled:opacity-50"
            >
              <CheckSquare className="h-4 w-4 mr-2" /> Mark All Present
            </button>
          </div>

          {/* Grid */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            {isLoading ? (
              <div className="py-20 text-center text-slate-500 flex flex-col items-center bg-slate-50">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-200 border-t-indigo-600 mb-4"></div>
                <p className="font-bold">Loading register...</p>
              </div>
            ) : filteredList.length === 0 ? (
              <div className="py-20 text-center text-slate-500 flex flex-col items-center bg-slate-50">
                <AlertCircle className="h-12 w-12 text-slate-300 mb-3" />
                <p className="font-bold text-lg text-slate-600">No records found</p>
                <p className="text-sm mt-1">Try adjusting your search.</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="py-4 px-6 text-left text-xs font-black uppercase tracking-wider text-slate-500 w-1/3">Name</th>
                    <th className="py-4 text-center text-xs font-black uppercase tracking-wider text-emerald-600">Present</th>
                    <th className="py-4 text-center text-xs font-black uppercase tracking-wider text-rose-600">Absent</th>
                    <th className="py-4 text-center text-xs font-black uppercase tracking-wider text-amber-600">Late</th>
                    <th className="py-4 text-center text-xs font-black uppercase tracking-wider text-indigo-600">Half-Day</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {filteredList.map(item => {
                    const hasStatus = !!attendanceData[item._id];
                    return (
                      <tr key={item._id} className={`transition-colors ${hasStatus ? 'bg-white' : 'bg-slate-50/50 hover:bg-slate-50'}`}>
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm mr-4 border ${hasStatus ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-slate-200 text-slate-500 border-slate-300'}`}>
                              {item.firstName[0]}{item.lastName[0]}
                            </div>
                            <div>
                              <span className="font-bold text-slate-800 text-[15px]">{item.firstName} {item.lastName}</span>
                              {!hasStatus && <p className="text-[10px] uppercase font-bold text-amber-500 tracking-wider mt-0.5">Unmarked</p>}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-center">
                          <button 
                            onClick={() => handleMark(item._id, 'Present')}
                            className={`w-11 h-11 rounded-full flex items-center justify-center mx-auto transition-all duration-200 ease-out ${getStatusButtonClass(item._id, 'Present', 'emerald')}`}
                          >
                            <CheckCircle2 className="h-5 w-5" />
                          </button>
                        </td>
                        <td className="py-4 text-center">
                          <button 
                            onClick={() => handleMark(item._id, 'Absent')}
                            className={`w-11 h-11 rounded-full flex items-center justify-center mx-auto transition-all duration-200 ease-out ${getStatusButtonClass(item._id, 'Absent', 'rose')}`}
                          >
                            <XCircle className="h-5 w-5" />
                          </button>
                        </td>
                        <td className="py-4 text-center">
                          <button 
                            onClick={() => handleMark(item._id, 'Late')}
                            className={`w-11 h-11 rounded-full flex items-center justify-center mx-auto transition-all duration-200 ease-out ${getStatusButtonClass(item._id, 'Late', 'amber')}`}
                          >
                            <Clock className="h-5 w-5" />
                          </button>
                        </td>
                        <td className="py-4 text-center">
                          <button 
                            onClick={() => handleMark(item._id, 'Half-Day')}
                            className={`w-11 h-11 rounded-full flex items-center justify-center mx-auto transition-all duration-200 ease-out font-black text-sm ${getStatusButtonClass(item._id, 'Half-Day', 'indigo')}`}
                          >
                            1/2
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
