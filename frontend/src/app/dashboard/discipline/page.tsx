"use client";

import React, { useState } from "react";
import { ShieldCheck, AlertTriangle, Plus, CheckCircle2, UserCheck, X } from "lucide-react";
import EmergencyBanner from "@/components/ui/EmergencyBanner";
import toast from "react-hot-toast";

export default function DisciplinePage() {
  const [incidents, setIncidents] = useState([
    { id: 1, student: "Sammy Student (SEED-001)", category: "Behavioral", severity: "Medium", date: "Sep 12, 2026", description: "Disrupted classroom instruction during Math period.", action: "Counseling session scheduled with Vice Principal.", parentNotified: true, status: "Under Investigation" },
    { id: 2, student: "Alex Johnson (GR-1002)", category: "Attendance", severity: "Low", date: "Sep 10, 2026", description: "Unexcused absence for 3 consecutive morning assemblies.", action: "Written warning issued to parent.", parentNotified: true, status: "Resolved" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [student, setStudent] = useState("");
  const [category, setCategory] = useState("Behavioral");
  const [severity, setSeverity] = useState("Medium");
  const [description, setDescription] = useState("");
  const [action, setAction] = useState("");
  const [parentNotified, setParentNotified] = useState(true);

  const handleLogIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!student.trim() || !description.trim()) {
      toast.error("Please enter student details and incident description");
      return;
    }
    const newIncident = {
      id: Date.now(),
      student,
      category,
      severity,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      description,
      action: action.trim() || "Under review by discipline committee",
      parentNotified,
      status: "Under Investigation"
    };
    setIncidents(prev => [newIncident, ...prev]);
    toast.success("Disciplinary incident logged successfully");
    setStudent("");
    setDescription("");
    setAction("");
    setShowModal(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <EmergencyBanner />

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-[#000E28] dark:text-white flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-[#0050CB] dark:text-[#38BDF8]" />
            Student Discipline & Counseling Case Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm font-medium">
            Record behavioral incidents, track disciplinary actions, notify parents, and log counseling cases.
          </p>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 bg-[#0050CB] hover:bg-[#0041A8] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Log New Incident</span>
        </button>
      </div>

      {/* Incidents Table Container */}
      <div className="bg-white dark:bg-[#000E28] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Recorded Discipline Cases</h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {incidents.map((inc) => (
            <div key={inc.id} className="py-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className={`w-4 h-4 ${inc.severity === 'Medium' ? 'text-amber-500' : 'text-slate-400'}`} />
                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">{inc.student}</h4>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {inc.category}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-400">{inc.date}</span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 font-normal leading-relaxed">{inc.description}</p>

              <div className="pt-2 flex items-center justify-between text-[11px] font-semibold">
                <span className="text-[#0050CB] dark:text-[#38BDF8]">Action: <strong>{inc.action}</strong></span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                  inc.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
                }`}>
                  {inc.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log New Incident Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#000E28] w-full max-w-md p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#0050CB] dark:text-[#38BDF8]" />
                <h2 className="text-base font-black text-[#000E28] dark:text-white">Log Behavioral Incident</h2>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLogIncident} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Student Name & ID</label>
                <input
                  type="text"
                  value={student}
                  onChange={(e) => setStudent(e.target.value)}
                  placeholder="e.g. Alex Johnson (GR-1002)"
                  required
                  className="w-full mt-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-[#0050CB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                  >
                    <option value="Behavioral">Behavioral</option>
                    <option value="Attendance">Attendance</option>
                    <option value="Academic Integrity">Academic Integrity</option>
                    <option value="Dress Code">Dress Code</option>
                    <option value="Property Damage">Property Damage</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Severity Level</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Incident Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the incident details..."
                  required
                  rows={3}
                  className="w-full mt-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-[#0050CB]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Action Plan / Follow-up</label>
                <input
                  type="text"
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  placeholder="e.g. Mandatory session with school counselor"
                  className="w-full mt-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="notifyParent"
                  checked={parentNotified}
                  onChange={(e) => setParentNotified(e.target.checked)}
                  className="rounded border-slate-300 text-[#0050CB] focus:ring-[#0050CB]"
                />
                <label htmlFor="notifyParent" className="font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Notify parent via SMS & Parent Portal alert
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0050CB] hover:bg-[#0041A8] text-white font-bold rounded-xl shadow-md cursor-pointer transition-colors"
                >
                  Save Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
