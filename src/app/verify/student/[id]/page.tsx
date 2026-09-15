"use client";

import { useEffect, useState, use } from 'react';
import { ShieldCheck, GraduationCap, CheckCircle2, AlertCircle, Globe } from 'lucide-react';
import Link from 'next/link';

export default function PublicStudentVerification({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const studentId = resolvedParams.id;

  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPublicStudent = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students/${studentId}`);
        if (res.ok) {
          const data = await res.json();
          setStudent(data);
        } else {
          setError(true);
        }
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchPublicStudent();
    }
  }, [studentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-slate-500 font-bold text-sm animate-pulse flex items-center space-x-2">
          <Globe className="h-5 w-5 text-indigo-600 animate-spin" />
          <span>Verifying Official Global International Student Credentials...</span>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full p-8 rounded-3xl border border-slate-200 shadow-xl text-center space-y-4">
          <div className="h-16 w-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-800">Invalid Credentials</h2>
          <p className="text-slate-500 text-sm font-medium">
            This student ID record could not be verified in the Global International registry.
          </p>
          <Link href="/" className="inline-block px-6 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Verification Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-700 p-6 text-white text-center relative">
          <div className="inline-flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm text-xs font-extrabold uppercase tracking-wider mb-3">
            <ShieldCheck className="h-4 w-4 text-emerald-300" />
            <span>Official Identity Record</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Global International</h1>
          <p className="text-xs text-indigo-200 font-bold tracking-widest uppercase mt-0.5">Student Credentials Verification</p>
        </div>

        {/* Verification Details */}
        <div className="p-6 text-center space-y-6">
          <div className="relative inline-block">
            <div className="h-28 w-28 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-black text-4xl flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-xl mx-auto">
              {student.firstName ? student.firstName[0] : 'S'}
            </div>
            <div className="absolute bottom-0 right-0 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-white">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              {student.firstName} {student.lastName}
            </h2>
            <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-1 uppercase tracking-wider">
              Enrolled Student • Active Status
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2 text-left text-sm">
            <div className="flex justify-between py-1.5 border-b border-slate-200/60 dark:border-slate-700/60">
              <span className="text-slate-400 font-bold text-xs">Admission ID</span>
              <span className="font-extrabold text-slate-800 dark:text-slate-100">{student.admissionNumber || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-200/60 dark:border-slate-700/60">
              <span className="text-slate-400 font-bold text-xs">Grade / Class</span>
              <span className="font-extrabold text-indigo-600 dark:text-indigo-400">{student.grade}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400 font-bold text-xs">Blood Group</span>
              <span className="font-extrabold text-rose-600">{student.bloodGroup || 'N/A'}</span>
            </div>
          </div>

          <div className="pt-2 text-center text-xs text-slate-400 font-medium">
            <p>&copy; {new Date().getFullYear()} Global International Registry</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Verified via Digital Identity Protocol</p>
          </div>
        </div>
      </div>
    </div>
  );
}
