"use client";

import { useState, useEffect } from 'react';
import { 
  Users, GraduationCap, Calendar, Wallet, UserCheck, 
  Cake, Clock, AlertTriangle, FileText, Image as ImageIcon, 
  HeartPulse, CheckCircle2, TrendingUp, BookOpen, Award
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardOverview() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="p-12 text-center text-slate-500 dark:text-slate-400 font-medium animate-pulse">
        Loading Global International Analytics & Metrics...
      </div>
    );
  }

  // ==========================================
  // PARENT PORTAL UI
  // ==========================================
  if (stats?.isParentPortal) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Global International Parent Workspace</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Welcome! Track your linked children's academic progress, attendance, and fee history.</p>
        </div>

        {stats.error ? (
          <div className="bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 p-6 rounded-2xl border border-amber-200 dark:border-amber-900 shadow-sm font-medium">
            {stats.error} Please contact Global International administration to link your child to this parent account.
          </div>
        ) : (
          <>
            {/* My Children Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.myChildren?.map((child: any) => (
                <div key={child._id} className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 shadow-xl text-white relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-all"></div>
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-black border-2 border-white/30 shrink-0">
                      {child.firstName ? child.firstName[0] : 'C'}
                    </div>
                    <div>
                      <h3 className="text-xl font-black leading-tight">{child.firstName} {child.lastName}</h3>
                      <p className="text-xs text-indigo-200 font-bold uppercase tracking-wider mt-0.5">
                        Grade: {child.grade} • ID: {child.admissionNumber || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3 pt-4 border-t border-white/20">
                    <div className="bg-black/10 rounded-xl p-3 backdrop-blur-sm">
                      <span className="text-[10px] uppercase font-bold text-indigo-200 block">Status</span>
                      <span className="text-sm font-bold text-emerald-300">{child.status || 'Active'}</span>
                    </div>
                    <div className="bg-black/10 rounded-xl p-3 backdrop-blur-sm">
                      <span className="text-[10px] uppercase font-bold text-indigo-200 block">Blood Group</span>
                      <span className="text-sm font-bold text-rose-200">{child.bloodGroup || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Links for Parent */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Link href="/portal/attendance" className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-500 transition-all text-center">
                <UserCheck className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
                <span className="font-bold text-sm text-slate-800 dark:text-slate-200">Attendance</span>
              </Link>
              <Link href="/portal/diary" className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-500 transition-all text-center">
                <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
                <span className="font-bold text-sm text-slate-800 dark:text-slate-200">Daily Diary</span>
              </Link>
              <Link href="/portal/finance" className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-500 transition-all text-center">
                <Wallet className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
                <span className="font-bold text-sm text-slate-800 dark:text-slate-200">Fee Status</span>
              </Link>
              <Link href="/dashboard/communication" className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-500 transition-all text-center">
                <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
                <span className="font-bold text-sm text-slate-800 dark:text-slate-200">Messages</span>
              </Link>
            </div>
          </>
        )}
      </div>
    );
  }

  // ==========================================
  // ADMIN & STAFF WORKSPACE UI
  // ==========================================
  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Global International Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Enterprise operational overview and realtime institutional performance metrics.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link href="/dashboard/students" className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/30 hover:bg-indigo-500 transition-all">
            + Admit Student
          </Link>
          <Link href="/dashboard/fees" className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
            Collect Fees
          </Link>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Enrolled Students</p>
            <p className="text-3xl font-black text-slate-800 dark:text-white">{stats?.totalStudents || 0}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Faculty & Staff</p>
            <p className="text-3xl font-black text-slate-800 dark:text-white">{stats?.totalUsers || 0}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
          <div className="p-4 rounded-2xl bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Admissions Pending</p>
            <p className="text-3xl font-black text-slate-800 dark:text-white">{stats?.pendingAdmissions || 0}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
            <Wallet className="w-8 h-8" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Fees Collected</p>
            <p className="text-3xl font-black text-slate-800 dark:text-white">
              ₹{(stats?.feeCollectionSummary || 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Attendance & Fees Due) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Attendance Summary */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center">
                <UserCheck className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" /> Today's Attendance Summary
              </h2>
              <Link href="/dashboard/attendance" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors">
                Mark Attendance &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
                <p className="text-slate-500 dark:text-slate-400 font-bold mb-1 text-xs uppercase tracking-wider">Students Present</p>
                <div className="flex items-end space-x-2">
                  <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400">{stats?.attendanceSummary?.studentsPresent || 0}</span>
                  <span className="text-slate-400 font-medium pb-1">/ {stats?.totalStudents || 0}</span>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
                <p className="text-slate-500 dark:text-slate-400 font-bold mb-1 text-xs uppercase tracking-wider">Staff Present</p>
                <div className="flex items-end space-x-2">
                  <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400">{stats?.attendanceSummary?.staffPresent || 0}</span>
                  <span className="text-slate-400 font-medium pb-1">Total Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Fee Due List */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-rose-500" /> Outstanding Fee Alerts
              </h2>
              <Link href="/dashboard/fees" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors">
                View Fee Ledger &rarr;
              </Link>
            </div>
            
            {stats?.feesDue?.length === 0 ? (
              <div className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900 font-bold flex items-center">
                All scheduled fee installments are fully cleared!
              </div>
            ) : (
              <div className="space-y-3">
                {stats?.feesDue?.map((fee: any) => (
                  <div key={fee._id} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">
                        {fee.studentId ? `${fee.studentId.firstName} ${fee.studentId.lastName}` : 'Student Record'}
                      </p>
                      <p className="text-xs font-bold text-rose-500 uppercase tracking-wider mt-0.5">
                        {fee.feeType} • Due {new Date(fee.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-slate-800 dark:text-white">₹{(fee.totalAmount - fee.amountPaid).toLocaleString()}</p>
                      <span className="text-[10px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded-full">{fee.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Upcoming Events & Birthdays) */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" /> Academic Calendar
              </h2>
            </div>
            
            {stats?.upcomingEvents?.length === 0 ? (
              <p className="text-slate-400 dark:text-slate-500 text-sm font-medium italic">No upcoming events scheduled.</p>
            ) : (
              <div className="space-y-4">
                {stats?.upcomingEvents?.map((event: any) => (
                  <div key={event._id} className="flex space-x-4">
                    <div className="flex flex-col items-center justify-center bg-indigo-50 dark:bg-indigo-950/50 w-14 h-14 rounded-xl border border-indigo-100 dark:border-indigo-900 shrink-0">
                      <span className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                      <span className="text-lg font-black text-indigo-700 dark:text-indigo-300">{new Date(event.date).getDate()}</span>
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200 leading-tight">{event.title}</p>
                      <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-1">{event.type} • {event.audience}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Birthday Reminders */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl border border-indigo-500 shadow-xl p-6 md:p-8 text-white">
            <div className="flex items-center mb-6">
              <Cake className="w-6 h-6 mr-3 text-pink-300" />
              <h2 className="text-xl font-extrabold">Birthday Celebrations</h2>
            </div>
            
            {stats?.birthdays?.length === 0 ? (
              <p className="text-indigo-200 text-sm font-medium">No birthdays scheduled for this month.</p>
            ) : (
              <div className="space-y-4">
                {stats?.birthdays?.map((bday: any) => {
                  const bDate = new Date(bday.date);
                  const isToday = bDate.getDate() === new Date().getDate();
                  
                  return (
                    <div key={bday._id} className={`flex items-center justify-between p-3 rounded-xl backdrop-blur-sm ${isToday ? 'bg-white/20 border border-white/30' : 'bg-black/10'}`}>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
                          {bday.name ? bday.name[0] : 'B'}
                        </div>
                        <div>
                          <p className="font-bold">{bday.name}</p>
                          <p className="text-xs font-medium text-indigo-200 opacity-90">
                            {isToday ? '🎉 Today!' : bDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                          </p>
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
    </div>
  );
}
