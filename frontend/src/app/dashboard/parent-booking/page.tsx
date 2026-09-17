"use client";

import React, { useState } from "react";
import { Clock, Calendar, Users, CheckCircle2, User, Video, Plus } from "lucide-react";

export default function ParentBookingPage() {
  const [selectedTeacher, setSelectedTeacher] = useState("Dr. Robert Vance (Physics)");
  const [selectedDate, setSelectedDate] = useState("2026-09-22");
  const [selectedTime, setSelectedTime] = useState("15:00 - 15:15 PM");
  const [note, setNote] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const [appointments, setAppointments] = useState([
    {
      id: "PTM-101",
      teacher: "Dr. Robert Vance",
      subject: "Physics",
      student: "Alexander Wright (10-A)",
      dateTime: "Sep 22, 2026 at 3:00 PM",
      mode: "In-Person (Room 204)",
      status: "Confirmed",
    },
    {
      id: "PTM-102",
      teacher: "Ms. Elena Rostova",
      subject: "English Literature",
      student: "Alexander Wright (10-A)",
      dateTime: "Sep 24, 2026 at 4:15 PM",
      mode: "Virtual Video Call",
      status: "Pending Teacher Confirmation",
    },
  ]);

  const handleBookSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const newAppt = {
      id: `PTM-${Date.now()}`,
      teacher: selectedTeacher.split("(")[0].trim(),
      subject: selectedTeacher.includes("Physics") ? "Physics" : "General",
      student: "Alexander Wright (10-A)",
      dateTime: `${selectedDate} at ${selectedTime}`,
      mode: "Virtual Video Call",
      status: "Confirmed",
    };
    setAppointments([newAppt, ...appointments]);
    setBookingSuccess(true);
    setTimeout(() => setBookingSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#000E28] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-[#0050CB] dark:text-[#38BDF8] font-bold text-xs uppercase tracking-wider mb-1">
            <Clock className="h-4 w-4" />
            <span>Parent Engagement & Appointments</span>
          </div>
          <h1 className="text-2xl font-black text-[#000E28] dark:text-white tracking-tight">
            Parent-Teacher Meeting Booking Portal
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Book dedicated 15-minute conference slots with class teachers, view availability calendars, and access virtual meeting links.
          </p>
        </div>
      </div>

      {bookingSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500 text-white font-bold text-xs flex items-center gap-3 shadow-md">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>Meeting booked successfully! Calendar invite dispatched to teacher and parent email.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Booking Form */}
        <div className="lg:col-span-1 bg-white dark:bg-[#000E28] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-sm font-black text-[#000E28] dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#0050CB]" />
            Book Conference Slot
          </h2>

          <form onSubmit={handleBookSlot} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Select Teacher & Subject</label>
              <select
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#0050CB]"
              >
                <option value="Dr. Robert Vance (Physics)">Dr. Robert Vance (Physics)</option>
                <option value="Ms. Elena Rostova (English)">Ms. Elena Rostova (English)</option>
                <option value="Mr. David Miller (Math)">Mr. David Miller (Math)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Meeting Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
                className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Time Slot</label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              >
                <option value="15:00 - 15:15 PM">3:00 PM - 3:15 PM</option>
                <option value="15:15 - 15:30 PM">3:15 PM - 3:30 PM</option>
                <option value="15:30 - 15:45 PM">3:30 PM - 3:45 PM</option>
                <option value="16:00 - 16:15 PM">4:00 PM - 4:15 PM</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Agenda / Discussion Note</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="e.g. Discussing Q1 physics exam results and homework habits..."
                className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#0050CB]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#0050CB] hover:bg-[#003da3] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Plus className="h-4 w-4" />
              <span>Confirm Meeting Reservation</span>
            </button>
          </form>
        </div>

        {/* Right Appointments List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-black text-[#000E28] dark:text-white uppercase tracking-wider">
            Your Scheduled Conferences ({appointments.length})
          </h2>

          <div className="space-y-3">
            {appointments.map((appt) => (
              <div
                key={appt.id}
                className="p-5 rounded-2xl bg-white dark:bg-[#000E28] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3 hover:border-[#0050CB] transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold text-[#000E28] dark:text-white">{appt.teacher}</h3>
                    <p className="text-xs text-[#0050CB] dark:text-[#38BDF8] font-semibold">{appt.subject} Department</p>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase ${
                      appt.status.includes("Confirmed")
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                    }`}
                  >
                    {appt.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl text-xs text-slate-600 dark:text-slate-300 font-medium">
                  <div>Date & Time: <span className="font-bold text-[#000E28] dark:text-white">{appt.dateTime}</span></div>
                  <div>Mode: <span className="font-bold text-[#000E28] dark:text-white">{appt.mode}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
