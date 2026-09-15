"use client";

import { useState, useEffect } from 'react';
import { BarChart3, Users, DollarSign, Download, AlertTriangle, UserCheck, CalendarDays } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState<'fees' | 'admissions' | 'attendance'>('fees');
  
  const [feeData, setFeeData] = useState<any[]>([]);
  const [admData, setAdmData] = useState<any>(null);
  const [attData, setAttData] = useState<any>(null);
  
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchReportData(activeReport);
  }, [activeReport]);

  const fetchReportData = async (type: string) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      if (type === 'fees') {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/fee-defaulters`, { headers });
        if (res.ok) setFeeData(await res.json());
      } else if (type === 'admissions') {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/admissions`, { headers });
        if (res.ok) setAdmData(await res.json());
      } else if (type === 'attendance') {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/attendance`, { headers });
        if (res.ok) setAttData(await res.json());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (activeReport === 'fees') {
      const headers = ['Student Name', 'Admission No', 'Fee Type', 'Total Amount', 'Amount Paid', 'Due Date', 'Status'];
      const csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n"
        + feeData.map(f => {
          const name = f.studentId ? `${f.studentId.firstName} ${f.studentId.lastName}` : 'Unknown';
          const admNo = f.studentId?.admissionNumber || 'N/A';
          const date = new Date(f.dueDate).toLocaleDateString();
          return `"${name}","${admNo}","${f.feeType}","${f.totalAmount}","${f.amountPaid}","${date}","${f.status}"`;
        }).join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "fee_defaulters_report.csv");
      document.body.appendChild(link);
      link.click();
      toast.success("Fee defaulters CSV downloaded!");
    } else {
      toast.error("CSV export is currently available for the Fee Defaulters tabular report.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Reports & Analytics</h1>
          <p className="text-slate-500 mt-1">Generate deep insights and tabular data for administration.</p>
        </div>
        <button 
          onClick={handleExportCSV}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center transition-all shadow-md shadow-indigo-200"
        >
          <Download className="h-4 w-4 mr-2" /> Export to CSV
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        <button 
          onClick={() => setActiveReport('fees')}
          className={`flex-shrink-0 px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center ${activeReport === 'fees' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
        >
          <DollarSign className="h-4 w-4 mr-2" /> Fee Defaulters
        </button>
        <button 
          onClick={() => setActiveReport('admissions')}
          className={`flex-shrink-0 px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center ${activeReport === 'admissions' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
        >
          <Users className="h-4 w-4 mr-2" /> Admission Conversion
        </button>
        <button 
          onClick={() => setActiveReport('attendance')}
          className={`flex-shrink-0 px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center ${activeReport === 'attendance' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
        >
          <CalendarDays className="h-4 w-4 mr-2" /> Attendance Summary
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-16 text-center text-slate-500 font-medium">Generating report data...</div>
        ) : (
          <>
            {activeReport === 'fees' && (
              <div>
                <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                  <h2 className="text-lg font-bold text-slate-800 flex items-center">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                    Pending & Overdue Fees
                  </h2>
                  <span className="bg-rose-100 text-rose-700 font-bold px-3 py-1 rounded-full text-xs">
                    {feeData.length} Records Found
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                        <th className="p-4 font-bold">Student</th>
                        <th className="p-4 font-bold">Fee Type</th>
                        <th className="p-4 font-bold">Due Date</th>
                        <th className="p-4 font-bold">Total (₹)</th>
                        <th className="p-4 font-bold">Paid (₹)</th>
                        <th className="p-4 font-bold">Balance (₹)</th>
                        <th className="p-4 font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {feeData.map((fee, idx) => {
                        const bal = fee.totalAmount - fee.amountPaid;
                        return (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors">
                            <td className="p-4">
                              <div className="font-bold text-slate-800 text-sm">{fee.studentId?.firstName} {fee.studentId?.lastName}</div>
                              <div className="text-xs text-slate-500">{fee.studentId?.admissionNumber || 'N/A'}</div>
                            </td>
                            <td className="p-4 text-sm font-medium text-slate-700">{fee.feeType}</td>
                            <td className="p-4 text-sm font-medium text-slate-700">{new Date(fee.dueDate).toLocaleDateString()}</td>
                            <td className="p-4 text-sm font-bold text-slate-800">{fee.totalAmount}</td>
                            <td className="p-4 text-sm font-bold text-emerald-600">{fee.amountPaid}</td>
                            <td className="p-4 text-sm font-bold text-rose-600">{bal}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded text-xs font-bold ${fee.status === 'Overdue' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                                {fee.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                      {feeData.length === 0 && (
                        <tr><td colSpan={7} className="p-8 text-center text-slate-500">No defaulters found! Excellent collection rate.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeReport === 'admissions' && admData && (
              <div className="p-6 md:p-8">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                  <BarChart3 className="h-6 w-6 text-indigo-500 mr-2" />
                  Inquiry to Admission Funnel
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {['New Inquiry', 'Demo Class Scheduled', 'Interested', 'Admission Confirmed'].map(status => (
                    <div key={status} className="bg-slate-50 border border-slate-200 p-5 rounded-2xl">
                      <div className="text-slate-500 text-xs font-bold uppercase mb-2">{status}</div>
                      <div className="text-3xl font-black text-indigo-600">{admData.counts[status] || 0}</div>
                    </div>
                  ))}
                </div>

                <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Recent Inquiries</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {admData.recent?.map((adm: any) => (
                    <div key={adm._id} className="p-4 border border-slate-200 rounded-xl flex justify-between items-center bg-white shadow-sm hover:border-indigo-200 transition-colors">
                      <div>
                        <div className="font-bold text-sm text-slate-800">{adm.childName}</div>
                        <div className="text-xs text-slate-500 mt-1">Parent: {adm.parentName} • {new Date(adm.applicationDate).toLocaleDateString()}</div>
                      </div>
                      <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2 py-1 rounded">
                        {adm.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeReport === 'attendance' && attData && (
              <div className="p-6 md:p-8 text-center">
                 <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-indigo-500 mr-2" />
                  Student Attendance Overview
                </h2>
                <div className="inline-flex flex-col sm:flex-row gap-6 mx-auto">
                  <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-3xl min-w-[200px]">
                    <div className="text-emerald-600 text-sm font-bold uppercase mb-2">Total Present</div>
                    <div className="text-5xl font-black text-emerald-700">{attData.counts['Present'] || 0}</div>
                  </div>
                  <div className="bg-rose-50 border border-rose-200 p-8 rounded-3xl min-w-[200px]">
                    <div className="text-rose-600 text-sm font-bold uppercase mb-2">Total Absent</div>
                    <div className="text-5xl font-black text-rose-700">{attData.counts['Absent'] || 0}</div>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 p-8 rounded-3xl min-w-[200px]">
                    <div className="text-amber-600 text-sm font-bold uppercase mb-2">Total Late / Half-Day</div>
                    <div className="text-5xl font-black text-amber-700">{(attData.counts['Late'] || 0) + (attData.counts['Half-day'] || 0)}</div>
                  </div>
                </div>
                <p className="text-slate-500 mt-8 max-w-lg mx-auto text-sm">
                  These statistics provide an aggregate view of student attendance records logged in the system.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
