"use client";

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { 
  GraduationCap, UserCheck, DollarSign, Calendar, HeartPulse, 
  Bus, FileText, ArrowLeft, Download, ShieldCheck, Mail, Phone, MapPin, Clock
} from 'lucide-react';

export default function Student360Profile({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const studentId = resolvedParams.id;

  const [student, setStudent] = useState<any>(null);
  const [parentInfo, setParentInfo] = useState<any>(null);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [fees, setFees] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'academic' | 'fees' | 'health' | 'timeline'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent360 = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        // Fetch Student Record
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students/${studentId}`, { headers });
        if (res.ok) {
          const data = await res.json();
          setStudent(data);
          setParentInfo(data.parentId);
        }

        // Fetch Attendance
        const attRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/attendance?studentId=${studentId}`, { headers });
        if (attRes.ok) {
          const attData = await attRes.json();
          setAttendance(Array.isArray(attData) ? attData : []);
        }

        // Fetch Fees
        const feeRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/finance/fees?studentId=${studentId}`, { headers });
        if (feeRes.ok) {
          const feeData = await feeRes.json();
          setFees(Array.isArray(feeData) ? feeData : []);
        }

        // Fetch Assessments
        const assRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assessments?childId=${studentId}`, { headers });
        if (assRes.ok) {
          const assData = await assRes.json();
          setAssessments(Array.isArray(assData) ? assData : []);
        }
      } catch (err) {
        console.error('Failed to load Student 360 profile', err);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchStudent360();
    }
  }, [studentId]);

  const handleDownloadPayslipOrReport = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assessments/report-card/${studentId}/pdf`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report_card_${student?.firstName || 'student'}.pdf`;
        a.click();
      }
    } catch (err) {
      console.error('PDF download error', err);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 font-medium animate-pulse">
        Loading Global International Student 360° Profile...
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-12 text-center">
        <p className="text-rose-500 font-bold mb-4">Student record not found.</p>
        <Link href="/dashboard/students" className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl">
          &larr; Back to Student Directory
        </Link>
      </div>
    );
  }

  const presentCount = attendance.filter((a) => a.status === 'Present').length;
  const totalAtt = attendance.length || 1;
  const attRate = Math.round((presentCount / totalAtt) * 100);

  return (
    <div className="space-y-8">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard/students" className="inline-flex items-center text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-3 py-1.5 rounded-xl hover:bg-indigo-100 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Student Roster
        </Link>

        <button
          onClick={handleDownloadPayslipOrReport}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-indigo-500 transition-all"
        >
          <Download className="h-4 w-4 mr-2" /> Download Report Card PDF
        </button>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-6">
          <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-indigo-600/30 border-2 border-white dark:border-slate-800 shrink-0">
            {student.firstName ? student.firstName[0] : 'S'}
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
                {student.firstName} {student.lastName}
              </h1>
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                {student.status || 'Active'}
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
              Admission ID: <span className="text-slate-800 dark:text-slate-200 font-bold">{student.admissionNumber || 'N/A'}</span> • Grade: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{student.grade}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Attendance Rate</span>
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{attRate}%</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Blood Group</span>
            <span className="text-2xl font-black text-rose-500">{student.bloodGroup || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Overview & Bio
        </button>
        <button
          onClick={() => setActiveTab('academic')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'academic' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Exams & Assessments ({assessments.length})
        </button>
        <button
          onClick={() => setActiveTab('fees')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'fees' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Fee History ({fees.length})
        </button>
        <button
          onClick={() => setActiveTab('health')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'health' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Health & Medical
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'timeline' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Activity Timeline
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100 flex items-center">
              <GraduationCap className="h-5 w-5 mr-2 text-indigo-600" /> Student Profile Details
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 font-bold">Full Name</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{student.firstName} {student.lastName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 font-bold">Date of Birth</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 font-bold">Grade Level</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{student.grade}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 font-bold">Medical Notes</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{student.medicalNotes || 'None'}</span>
              </div>
            </div>
          </div>

          {/* Parent / Guardian Info */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100 flex items-center">
              <ShieldCheck className="h-5 w-5 mr-2 text-indigo-600" /> Parent & Guardian Profile
            </h3>
            {parentInfo ? (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 font-bold">Father's Name</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{parentInfo.fatherName || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 font-bold">Mother's Name</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{parentInfo.motherName || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 font-bold">Contact Phone</span>
                  <span className="font-bold text-indigo-600">{parentInfo.fatherContact || parentInfo.whatsappNumber || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 font-bold">Address</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{parentInfo.address || 'N/A'}</span>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-sm font-medium italic">No detailed parent record linked.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'academic' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">Assessments & Term Rubrics</h3>
          {assessments.length === 0 ? (
            <p className="text-slate-400 text-sm italic">No assessment records found for this student.</p>
          ) : (
            <div className="space-y-4">
              {assessments.map((ass) => (
                <div key={ass._id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-indigo-600 dark:text-indigo-400">{ass.term}</span>
                    <span className="text-xs font-semibold text-slate-400">{new Date(ass.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{ass.teacherComments || 'No teacher comments.'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'fees' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">Student Fee History</h3>
          {fees.length === 0 ? (
            <p className="text-slate-400 text-sm italic">No fee records found.</p>
          ) : (
            <div className="space-y-3">
              {fees.map((fee) => (
                <div key={fee._id} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{fee.feeType}</p>
                    <p className="text-xs text-slate-400">Due: {new Date(fee.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-800 dark:text-white">₹{fee.totalAmount}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${fee.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {fee.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'health' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">Medical Notes & Health Alerts</h3>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Blood Group: <span className="text-rose-600">{student.bloodGroup || 'Not specified'}</span></p>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Allergies / Special Instructions: {student.medicalNotes || 'No registered allergies.'}</p>
          </div>
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">Student Activity Timeline</h3>
          <div className="space-y-4 border-l-2 border-indigo-200 dark:border-indigo-900 pl-4">
            <div className="relative">
              <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-indigo-600"></div>
              <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">Admitted to Global International</p>
              <p className="text-xs text-slate-400">Official Student Registration Completed</p>
            </div>
            <div className="relative">
              <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-emerald-500"></div>
              <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">Assigned Grade {student.grade}</p>
              <p className="text-xs text-slate-400">Current Academic Term Active</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
