"use client";

import { useState, useEffect } from 'react';
import { CalendarHeart, Search } from 'lucide-react';

export default function PortalDiaryPage() {
  const [diaries, setDiaries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDiaries();
  }, []);

  const fetchDiaries = async () => {
    try {
      const token = localStorage.getItem('token');
      // Notice we are NOT passing a specific date, so it should fetch history
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/daily-diary`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setDiaries(await res.json());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20 text-indigo-600">
        <div className="animate-spin h-10 w-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-slate-800">Daily Diary History</h1>
        <p className="text-slate-500 font-medium">A chronological record of activities and well-being.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {diaries.length === 0 ? (
          <div className="p-16 text-center text-slate-500">
            <CalendarHeart className="h-12 w-12 mx-auto text-slate-300 mb-4" />
            <p className="font-bold text-lg text-slate-600">No diaries found.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {diaries.map(diary => (
              <div key={diary._id} className="p-6 sm:p-8 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">
                      {new Date(diary.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </h3>
                    {diary.studentId && (
                      <p className="text-sm font-medium text-slate-500">Student: {diary.studentId.firstName}</p>
                    )}
                  </div>
                  {diary.teacherId && (
                    <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-xs font-bold border border-indigo-100">
                      By {diary.teacherId.firstName} {diary.teacherId.lastName}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <div className="text-xs font-bold text-slate-500 uppercase">Meals</div>
                    <div className="font-bold text-slate-800">{diary.meals || '-'}</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <div className="text-xs font-bold text-slate-500 uppercase">Nap Time</div>
                    <div className="font-bold text-slate-800">{diary.napTime || '-'}</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <div className="text-xs font-bold text-slate-500 uppercase">Mood</div>
                    <div className="font-bold text-slate-800">{diary.mood || '-'}</div>
                  </div>
                </div>

                {diary.notes && (
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                    <p className="text-sm font-medium text-amber-900 italic">"{diary.notes}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
