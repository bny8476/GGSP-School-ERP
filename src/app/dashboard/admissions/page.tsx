"use client";

import { useState, useEffect, useMemo } from 'react';
import { Search, ChevronRight, CheckCircle2, XCircle, Clock, Calendar, Mail, Phone, Home, Sparkles, MoveRight, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdmissionsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admissions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setApplications(await res.json());
      }
    } catch (error) {
      console.error('Failed to fetch admissions', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admissions/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        fetchApplications();
        if (status === 'Admission Confirmed') {
          toast.success('Applicant Confirmed! You can now add them to the student directory.');
        } else {
          toast.success(`Application status updated to ${status}`);
        }
      } else {
        const err = await res.json();
        toast.error(`Failed to update: ${err.message}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Network error updating status');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New Inquiry': return <span className="px-3 py-1.5 inline-flex text-xs font-black uppercase tracking-wider rounded-md bg-slate-100 text-slate-600 border border-slate-200">New Inquiry</span>;
      case 'Follow-up Pending': return <span className="px-3 py-1.5 inline-flex text-xs font-black uppercase tracking-wider rounded-md bg-blue-50 text-blue-700 border border-blue-200">Follow-up Pending</span>;
      case 'Demo Class Scheduled': return <span className="px-3 py-1.5 inline-flex text-xs font-black uppercase tracking-wider rounded-md bg-amber-50 text-amber-700 border border-amber-200">Demo Scheduled</span>;
      case 'Interested': return <span className="px-3 py-1.5 inline-flex text-xs font-black uppercase tracking-wider rounded-md bg-purple-50 text-purple-700 border border-purple-200">Interested</span>;
      case 'Admission Confirmed': return <span className="px-3 py-1.5 inline-flex text-xs font-black uppercase tracking-wider rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">Confirmed</span>;
      case 'Not Interested': return <span className="px-3 py-1.5 inline-flex text-xs font-black uppercase tracking-wider rounded-md bg-rose-50 text-rose-700 border border-rose-200">Not Interested</span>;
      default: return <span className="px-3 py-1.5 inline-flex text-xs font-black uppercase tracking-wider rounded-md bg-slate-100 text-slate-600 border border-slate-200">{status || 'Unknown'}</span>;
    }
  };

  const filteredApps = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch = (app.childFirstName + ' ' + app.childLastName + ' ' + app.parentName).toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === 'All' || app.status === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [applications, searchQuery, activeFilter]);

  const metrics = useMemo(() => {
    return {
      total: applications.length,
      newInquiry: applications.filter(a => a.status === 'New Inquiry').length,
      demoScheduled: applications.filter(a => a.status === 'Demo Class Scheduled').length,
      interested: applications.filter(a => a.status === 'Interested').length,
      confirmed: applications.filter(a => a.status === 'Admission Confirmed').length,
    };
  }, [applications]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Inquiry Pipeline</h1>
          <p className="text-slate-500 mt-1">Track and convert prospective students.</p>
        </div>
      </div>

      {/* METRICS DASHBOARD */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <div className="flex items-center text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total Inquiries</span>
          </div>
          <span className="text-3xl font-black text-slate-800">{metrics.total}</span>
        </div>
        <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 flex flex-col justify-center">
          <div className="flex items-center text-slate-600 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">New</span>
          </div>
          <span className="text-3xl font-black text-slate-700">{metrics.newInquiry}</span>
        </div>
        <div className="bg-amber-50 p-5 rounded-3xl border border-amber-200 flex flex-col justify-center">
          <div className="flex items-center text-amber-800 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Demos Scheduled</span>
          </div>
          <span className="text-3xl font-black text-amber-600">{metrics.demoScheduled}</span>
        </div>
        <div className="bg-purple-50 p-5 rounded-3xl border border-purple-200 flex flex-col justify-center">
          <div className="flex items-center text-purple-800 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Interested</span>
          </div>
          <span className="text-3xl font-black text-purple-600">{metrics.interested}</span>
        </div>
        <div className="bg-emerald-50 p-5 rounded-3xl border border-emerald-200 flex flex-col justify-center">
          <div className="flex items-center text-emerald-800 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Confirmed</span>
          </div>
          <span className="text-3xl font-black text-emerald-600">{metrics.confirmed}</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Filters & Search */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50">
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
            {['All', 'New Inquiry', 'Follow-up Pending', 'Demo Class Scheduled', 'Interested', 'Admission Confirmed', 'Not Interested'].map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                  activeFilter === filter 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input 
              type="text" 
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:ring-indigo-500 focus:border-indigo-500" 
              placeholder="Search parent or child name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* List */}
        <div className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="p-16 text-center text-slate-500 flex flex-col items-center">
              <div className="animate-spin h-8 w-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full mb-4"></div>
              <p className="font-bold">Loading pipeline...</p>
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="p-16 text-center text-slate-500">
              <p className="font-bold text-lg text-slate-600">No applications found</p>
              <p className="text-sm mt-1">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Applicant Profile</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Parent Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Program / Details</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Pipeline Status</th>
                  <th className="px-6 py-4 text-right text-xs font-black text-slate-500 uppercase tracking-wider">Next Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {filteredApps.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-lg border border-indigo-100 shadow-inner">
                          {app.childFirstName[0]}{app.childLastName[0]}
                        </div>
                        <div className="ml-4">
                          <div className="text-[15px] font-bold text-slate-900">{app.childFirstName} {app.childLastName}</div>
                          <div className="text-xs font-medium text-slate-500 mt-1 flex items-center">
                            <Calendar className="h-3 w-3 mr-1" /> DOB: {app.dateOfBirth ? new Date(app.dateOfBirth).toLocaleDateString() : 'N/A'}
                          </div>
                          <div className="text-xs font-medium text-slate-400 mt-0.5">
                            Gender: {app.gender || 'Not specified'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-bold text-slate-800 mb-1">{app.parentName}</div>
                      <div className="text-xs font-medium text-slate-600 flex items-center mb-1"><Mail className="h-3 w-3 mr-1.5 text-slate-400"/> {app.email}</div>
                      <div className="text-xs font-medium text-slate-600 flex items-center"><Phone className="h-3 w-3 mr-1.5 text-slate-400"/> {app.contactNumber}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="inline-flex px-2.5 py-1 text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-md mb-2">
                        Grade: {app.gradeAppliedFor}
                      </span>
                      <div className="text-[11px] font-medium text-slate-500 truncate max-w-[200px] flex items-center" title={app.address}>
                        <Home className="h-3 w-3 mr-1 flex-shrink-0" /> {app.address || 'No address provided'}
                      </div>
                      <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-1">
                        Inquiry Date: {new Date(app.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right">
                      {/* Interactive Pipeline Actions */}
                      {app.status === 'New Inquiry' && (
                        <button onClick={() => updateStatus(app._id, 'Follow-up Pending')} className="inline-flex items-center text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 px-3 py-2 rounded-xl transition-all">
                          Mark for Follow-up <MoveRight className="ml-1.5 h-3 w-3" />
                        </button>
                      )}
                      {(app.status === 'New Inquiry' || app.status === 'Follow-up Pending') && (
                        <div className="mt-2">
                          <button onClick={() => updateStatus(app._id, 'Demo Class Scheduled')} className="inline-flex items-center text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100 px-3 py-2 rounded-xl transition-all">
                            Schedule Demo <Calendar className="ml-1.5 h-3 w-3" />
                          </button>
                        </div>
                      )}
                      {app.status === 'Demo Class Scheduled' && (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => updateStatus(app._id, 'Interested')} className="inline-flex items-center text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 hover:bg-purple-100 px-3 py-2 rounded-xl transition-all">
                            Mark Interested <Sparkles className="ml-1.5 h-3 w-3" />
                          </button>
                          <button onClick={() => updateStatus(app._id, 'Not Interested')} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors" title="Not Interested">
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                      {app.status === 'Interested' && (
                        <button onClick={() => updateStatus(app._id, 'Admission Confirmed')} className="inline-flex items-center text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-200 px-3 py-2 rounded-xl transition-all transform hover:-translate-y-0.5">
                          Confirm Admission <CheckCircle2 className="ml-1.5 h-3 w-3" />
                        </button>
                      )}
                      {(app.status === 'Admission Confirmed' || app.status === 'Not Interested') && (
                        <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">Pipeline Closed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
