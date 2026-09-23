"use client";

import { useState, useEffect } from 'react';
import { UserCheck, Stethoscope, ShieldCheck, CheckCircle2, Clock, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OperationsPage() {
  const [activeTab, setActiveTab] = useState<'pickup' | 'health'>('pickup');
  const [pickupLogs, setPickupLogs] = useState<any[]>([]);
  const [healthLogs, setHealthLogs] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [pickupForm, setPickupForm] = useState({
    studentId: '', routeNumber: 'Gate 1 (Main Entrance)', pickupTime: new Date().toISOString().slice(0, 16),
    status: 'Picked Up By Parent', authorizedPersonName: '', authorizedPersonRel: '', authorizedPersonContact: '', idVerified: false
  });

  const [healthForm, setHealthForm] = useState({
    studentId: '', temperature: '', symptoms: [] as string[], allergiesAlert: false, notes: ''
  });

  const availableSymptoms = ['Cough', 'Runny Nose', 'Rash', 'Vomiting', 'Headache', 'Lethargy'];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [transportRes, healthRes, studentRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/operations/transport`, { headers }).catch(() => null),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/operations/health`, { headers }).catch(() => null),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students`, { headers }).catch(() => null)
      ]);
      
      if (transportRes && transportRes.ok) setPickupLogs(await transportRes.json());
      if (healthRes && healthRes.ok) setHealthLogs(await healthRes.json());
      if (studentRes && studentRes.ok) setStudents(await studentRes.json());
    } catch (error) {
      console.error('Error fetching operations data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreatePickup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      
      const payload: any = {
        studentId: pickupForm.studentId,
        routeNumber: pickupForm.routeNumber || 'Gate 1 (Main Entrance)',
        pickupTime: pickupForm.pickupTime,
        status: pickupForm.status
      };

      if (pickupForm.status === 'Picked Up By Parent') {
        payload.authorizedPerson = {
          name: pickupForm.authorizedPersonName,
          relationship: pickupForm.authorizedPersonRel,
          contactNumber: pickupForm.authorizedPersonContact,
          idVerified: pickupForm.idVerified
        };
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/operations/transport`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        toast.success('Pickup event logged!');
        setShowPickupModal(false);
        setPickupForm({ studentId: '', routeNumber: 'Gate 1 (Main Entrance)', pickupTime: new Date().toISOString().slice(0, 16), status: 'Picked Up By Parent', authorizedPersonName: '', authorizedPersonRel: '', authorizedPersonContact: '', idVerified: false });
        fetchData();
      } else {
        const err = await res.json();
        toast.error(`Error: ${err.message}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Network error creating pickup log');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSymptom = (symptom: string) => {
    setHealthForm(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom) ? prev.symptoms.filter(s => s !== symptom) : [...prev.symptoms, symptom]
    }));
  };

  const handleCreateHealth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/operations/health`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          studentId: healthForm.studentId,
          temperature: Number(healthForm.temperature),
          symptoms: healthForm.symptoms,
          allergiesAlert: healthForm.allergiesAlert,
          notes: healthForm.notes
        })
      });
      
      if (res.ok) {
        toast.success('Health event logged!');
        setShowHealthModal(false);
        setHealthForm({ studentId: '', temperature: '', symptoms: [], allergiesAlert: false, notes: '' });
        fetchData();
      } else {
        const err = await res.json();
        toast.error(`Error: ${err.message}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Network error creating health log');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Operations & Safety</h1>
          <p className="text-slate-500 mt-1">Manage student dismissal & pickup logs and monitor health records.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div 
          onClick={() => setActiveTab('pickup')}
          className={`p-6 rounded-3xl border-2 cursor-pointer transition-all ${activeTab === 'pickup' ? 'border-indigo-500 bg-indigo-50/50 shadow-md transform scale-[1.02]' : 'border-slate-100 bg-white hover:border-indigo-200 hover:bg-slate-50'}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-4 rounded-2xl ${activeTab === 'pickup' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-slate-100 text-slate-500'}`}>
              <UserCheck className="h-7 w-7" />
            </div>
            {activeTab === 'pickup' && <CheckCircle2 className="h-6 w-6 text-indigo-500" />}
          </div>
          <h3 className={`text-xl font-bold mb-2 ${activeTab === 'pickup' ? 'text-indigo-900' : 'text-slate-800'}`}>Dismissal & Pickup</h3>
          <p className="text-sm font-medium text-slate-500 leading-relaxed">Log authorized parent pickups, check dismissal gates, and ensure every child goes home safely.</p>
        </div>

        <div 
          onClick={() => setActiveTab('health')}
          className={`p-6 rounded-3xl border-2 cursor-pointer transition-all ${activeTab === 'health' ? 'border-rose-500 bg-rose-50/50 shadow-md transform scale-[1.02]' : 'border-slate-100 bg-white hover:border-rose-200 hover:bg-slate-50'}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-4 rounded-2xl ${activeTab === 'health' ? 'bg-rose-600 text-white shadow-md shadow-rose-200' : 'bg-slate-100 text-slate-500'}`}>
              <Stethoscope className="h-7 w-7" />
            </div>
            {activeTab === 'health' && <CheckCircle2 className="h-6 w-6 text-rose-500" />}
          </div>
          <h3 className={`text-xl font-bold mb-2 ${activeTab === 'health' ? 'text-rose-900' : 'text-slate-800'}`}>Health & Medical</h3>
          <p className="text-sm font-medium text-slate-500 leading-relaxed">Monitor daily temperatures, log symptoms, and track allergy alerts.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
        {activeTab === 'pickup' ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-5">
              <h2 className="text-xl font-bold text-slate-800">Recent Pickup Logs</h2>
              <button onClick={() => setShowPickupModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md shadow-indigo-200 flex items-center transform hover:-translate-y-0.5">
                <Plus className="h-4 w-4 mr-1.5" /> Log New Pickup
              </button>
            </div>
            
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-12"><div className="animate-spin h-8 w-8 text-indigo-500 border-4 border-indigo-200 border-t-indigo-600 rounded-full"></div></div>
              ) : pickupLogs.length > 0 ? (
                pickupLogs.map((log) => (
                  <div key={log._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-slate-100 rounded-2xl hover:border-indigo-100 hover:bg-slate-50 transition-all gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-indigo-100 text-indigo-700 font-bold rounded-full flex items-center justify-center shrink-0 border border-indigo-200 shadow-inner">
                        {log.studentId?.firstName?.[0]}{log.studentId?.lastName?.[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-lg">{log.studentId ? `${log.studentId.firstName} ${log.studentId.lastName}` : 'Unknown'}</h4>
                        <p className="text-xs font-semibold text-slate-500 flex items-center mt-1">
                          <Clock className="h-3.5 w-3.5 mr-1" /> {log.status || 'Dismissed'} at {new Date(log.pickupTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>
                    <div className="sm:text-right bg-white p-3 rounded-xl border border-slate-100">
                      {log.authorizedPerson && log.authorizedPerson.name ? (
                        <>
                          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider text-[10px] mb-1">Authorized Pickup</p>
                          <p className="text-sm font-bold text-slate-800">{log.authorizedPerson.name} <span className="text-slate-500 font-medium">({log.authorizedPerson.relationship})</span></p>
                          {log.authorizedPerson.idVerified && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 mt-1.5 border border-emerald-200">
                              <ShieldCheck className="h-3 w-3 mr-1" /> ID Verified
                            </span>
                          )}
                        </>
                      ) : (
                        <div>
                          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider text-[10px] mb-1">Status</p>
                          <p className="text-sm font-bold text-indigo-600">{log.status}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                  <UserCheck className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">No pickup logs found for today.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-5">
              <h2 className="text-xl font-bold text-slate-800">Daily Health Logs</h2>
              <button onClick={() => setShowHealthModal(true)} className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md shadow-rose-200 flex items-center transform hover:-translate-y-0.5">
                <Plus className="h-4 w-4 mr-1.5" /> Log Health Check
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {isLoading ? (
                <div className="flex justify-center py-12 col-span-2"><div className="animate-spin h-8 w-8 text-rose-500 border-4 border-rose-200 border-t-rose-600 rounded-full"></div></div>
              ) : healthLogs.length > 0 ? (
                healthLogs.map((log) => (
                  <div key={log._id} className={`p-5 border-2 ${log.temperature >= 99 || log.allergiesAlert ? 'border-rose-200 bg-rose-50/50' : 'border-slate-100 bg-white hover:border-slate-200'} rounded-2xl transition-colors`}>
                    <div className="flex justify-between items-start mb-4 border-b border-slate-100 pb-3">
                      <div>
                        <h4 className="font-bold text-slate-800 text-lg">{log.studentId ? `${log.studentId.firstName} ${log.studentId.lastName}` : 'Unknown'}</h4>
                        <p className="text-xs font-semibold text-slate-500 mt-0.5">Logged at {new Date(log.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      </div>
                      <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-md border ${
                        log.temperature >= 99 ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      }`}>
                        {log.temperature >= 99 ? 'Feverish' : 'Healthy'}
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-100">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Temperature</span>
                        <span className={`font-black ${log.temperature >= 99 ? 'text-rose-600' : 'text-slate-800'}`}>{log.temperature}°F</span>
                      </div>
                      <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-100">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Symptoms</span>
                        <span className="text-sm font-semibold text-slate-800">{log.symptoms?.length ? log.symptoms.join(', ') : 'None'}</span>
                      </div>
                      {log.allergiesAlert && (
                        <div className="bg-rose-600 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center justify-center animate-pulse">
                          ⚠️ EMERGENCY ALLERGY ALERT
                        </div>
                      )}
                      {log.notes && (
                        <p className="text-xs text-slate-500 italic mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100">"{log.notes}"</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300 col-span-2">
                  <Stethoscope className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">No health logs found for today.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* PICKUP MODAL */}
      {showPickupModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-indigo-100 flex justify-between items-center bg-indigo-50">
              <h3 className="font-bold text-xl text-indigo-900 flex items-center"><UserCheck className="h-5 w-5 mr-2 text-indigo-600"/> Log Student Pickup</h3>
              <button onClick={() => setShowPickupModal(false)} className="text-indigo-400 hover:text-indigo-700"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleCreatePickup} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Select Student</label>
                  <select required className="w-full rounded-xl border-slate-300 py-2.5 px-3 focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 text-sm font-medium" value={pickupForm.studentId} onChange={e => setPickupForm({...pickupForm, studentId: e.target.value})}>
                    <option value="">-- Choose student --</option>
                    {students.map(s => <option key={s._id} value={s._id}>{s.firstName} {s.lastName}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Status</label>
                  <select required className="w-full rounded-xl border-slate-300 py-2.5 px-3 focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 text-sm font-medium" value={pickupForm.status} onChange={e => setPickupForm({...pickupForm, status: e.target.value})}>
                    <option>Picked Up By Parent</option><option>Dropped Off</option><option>Self Dismissal</option><option>Absent</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Time</label>
                  <input required type="datetime-local" className="w-full rounded-xl border-slate-300 py-2.5 px-3 focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 text-sm font-medium" value={pickupForm.pickupTime} onChange={e => setPickupForm({...pickupForm, pickupTime: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Exit Gate</label>
                  <input required type="text" placeholder="e.g. Gate 1 (Main Entrance)" className="w-full rounded-xl border-slate-300 py-2.5 px-3 focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 text-sm font-medium" value={pickupForm.routeNumber} onChange={e => setPickupForm({...pickupForm, routeNumber: e.target.value})} />
                </div>
              </div>

              {pickupForm.status === 'Picked Up By Parent' && (
                <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-800">Authorized Pickup Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Name</label>
                      <input required type="text" className="w-full rounded-lg border-slate-300 py-2 px-3 text-sm" value={pickupForm.authorizedPersonName} onChange={e => setPickupForm({...pickupForm, authorizedPersonName: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Relationship</label>
                      <input required type="text" placeholder="e.g. Mother, Uncle" className="w-full rounded-lg border-slate-300 py-2 px-3 text-sm" value={pickupForm.authorizedPersonRel} onChange={e => setPickupForm({...pickupForm, authorizedPersonRel: e.target.value})} />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Contact Number</label>
                      <input required type="text" className="w-full rounded-lg border-slate-300 py-2 px-3 text-sm" value={pickupForm.authorizedPersonContact} onChange={e => setPickupForm({...pickupForm, authorizedPersonContact: e.target.value})} />
                    </div>
                    <div className="flex items-center mt-5">
                      <input type="checkbox" id="idVerify" className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" checked={pickupForm.idVerified} onChange={e => setPickupForm({...pickupForm, idVerified: e.target.checked})} />
                      <label htmlFor="idVerify" className="ml-2 text-sm font-bold text-slate-700">Gov. ID Verified</label>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-3">
                <button type="submit" disabled={isSaving} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 transition-all flex justify-center items-center">
                  {isSaving ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div> : 'Save Pickup Log'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HEALTH MODAL */}
      {showHealthModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-rose-100 flex justify-between items-center bg-rose-50">
              <h3 className="font-bold text-xl text-rose-900 flex items-center"><Stethoscope className="h-5 w-5 mr-2 text-rose-600"/> Log Health Check</h3>
              <button onClick={() => setShowHealthModal(false)} className="text-rose-400 hover:text-rose-700"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleCreateHealth} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Select Student</label>
                  <select required className="w-full rounded-xl border-slate-300 py-2.5 px-3 focus:border-rose-500 focus:ring-rose-500 bg-slate-50 text-sm font-medium" value={healthForm.studentId} onChange={e => setHealthForm({...healthForm, studentId: e.target.value})}>
                    <option value="">-- Choose student --</option>
                    {students.map(s => <option key={s._id} value={s._id}>{s.firstName} {s.lastName}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Temperature (°F)</label>
                  <input required type="number" step="0.1" placeholder="e.g. 98.6" className="w-full rounded-xl border-slate-300 py-2.5 px-3 focus:border-rose-500 focus:ring-rose-500 bg-slate-50 text-sm font-medium" value={healthForm.temperature} onChange={e => setHealthForm({...healthForm, temperature: e.target.value})} />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Observed Symptoms</label>
                <div className="flex flex-wrap gap-2">
                  {availableSymptoms.map(sym => (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => toggleSymptom(sym)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        healthForm.symptoms.includes(sym) ? 'bg-rose-500 text-white border-rose-600 shadow-sm' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-rose-50 p-4 rounded-xl border border-rose-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-rose-900">Severe Allergy Alert</p>
                  <p className="text-xs font-medium text-rose-700 mt-0.5">Toggle if child had an allergic reaction</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={healthForm.allergiesAlert} onChange={e => setHealthForm({...healthForm, allergiesAlert: e.target.checked})} />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Additional Notes</label>
                <input type="text" placeholder="e.g. Applied ice pack to knee" className="w-full rounded-xl border-slate-300 py-2.5 px-3 focus:border-rose-500 focus:ring-rose-500 bg-slate-50 text-sm font-medium" value={healthForm.notes} onChange={e => setHealthForm({...healthForm, notes: e.target.value})} />
              </div>

              <div className="pt-3">
                <button type="submit" disabled={isSaving} className="w-full bg-rose-600 hover:bg-rose-700 disabled:opacity-70 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-rose-200 transition-all flex justify-center items-center">
                  {isSaving ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div> : 'Save Health Check'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
