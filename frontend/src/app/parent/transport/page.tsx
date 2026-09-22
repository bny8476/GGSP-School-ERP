"use client";

import React from "react";
import { Bus, MapPin, Clock, Phone, ShieldCheck, UserCheck, CheckCircle2, AlertCircle } from "lucide-react";
import SpotlightCard from "@/components/teacher/SpotlightCard";
import { useParent } from "@/context/ParentContext";

export default function ParentTransportPage() {
  const { selectedChild } = useParent();

  const child = selectedChild || {
    firstName: "Aarav",
    lastName: "Sharma",
    grade: "LKG",
  };

  const transportInfo = {
    routeNumber: "Route #04 (Greenfield Corridor)",
    busNumber: "KA-01-GG-2026 (Bus 08)",
    driverName: "Mr. Ramesh Gowda",
    driverPhone: "+91 98450 11223",
    attendantName: "Mrs. Manjula S.",
    attendantPhone: "+91 98450 11224",
    pickupStop: "Prestige Greenfield Main Gate",
    scheduledPickup: "07:50 AM",
    scheduledDrop: "03:10 PM",
    seatNumber: "Seat 04 (Front Care Bay)",
    status: "Operational & On Schedule",
  };

  const routeStops = [
    { stop: "Campus Bus Bay Terminal", time: "07:15 AM", type: "Depot Departure" },
    { stop: "Palm Meadows Circle", time: "07:30 AM", type: "Intermediate Stop" },
    { stop: "Prestige Greenfield Main Gate", time: "07:50 AM", type: "Child Designated Pickup", isStudentStop: true },
    { stop: "Silver County Crossing", time: "08:05 AM", type: "Intermediate Stop" },
    { stop: "GGPS Campus Gate 2 Arrival", time: "08:20 AM", type: "School Campus Gate" },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-[22px] bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#0050CB]">
            Fleet & Transit Services
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#000E28] dark:text-white">
            School Transport: {child.firstName} {child.lastName}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Verified route coordinates, designated transit stops, driver credentials, and timings.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-3.5 py-2 rounded-xl">
          <ShieldCheck className="w-4 h-4" />
          <span>{transportInfo.status}</span>
        </div>
      </div>

      {/* Driver & Bus Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <SpotlightCard className="p-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-[#E5EEFF] dark:bg-[#0050CB]/20 text-[#0050CB] flex items-center justify-center shrink-0">
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400">Assigned Bus</span>
              <p className="text-sm font-bold text-[#000E28] dark:text-white">{transportInfo.busNumber}</p>
            </div>
          </div>
          <div className="pt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <p><strong>Route:</strong> {transportInfo.routeNumber}</p>
            <p><strong>Designated Seat:</strong> {transportInfo.seatNumber}</p>
            <p><strong>Vehicle Safety:</strong> GPS Speed Governor, CCTV & First Aid</p>
          </div>
        </SpotlightCard>

        <SpotlightCard className="p-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400">Lead Pilot (Driver)</span>
              <p className="text-sm font-bold text-[#000E28] dark:text-white">{transportInfo.driverName}</p>
            </div>
          </div>
          <div className="pt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <p className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#0050CB]" />
              <strong>Contact:</strong>
              <a href={`tel:${transportInfo.driverPhone}`} className="text-[#0050CB] hover:underline">
                {transportInfo.driverPhone}
              </a>
            </p>
            <p><strong>Experience:</strong> 12+ Years Commercial Safety Record</p>
            <p><strong>Police Verification:</strong> Complete & Cleared</p>
          </div>
        </SpotlightCard>

        <SpotlightCard className="p-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400">Transit Timings</span>
              <p className="text-sm font-bold text-[#000E28] dark:text-white">{transportInfo.pickupStop}</p>
            </div>
          </div>
          <div className="pt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <p><strong>Morning Pickup:</strong> <span className="font-bold text-[#0050CB]">{transportInfo.scheduledPickup}</span></p>
            <p><strong>Afternoon Drop:</strong> <span className="font-bold text-[#0050CB]">{transportInfo.scheduledDrop}</span></p>
            <p><strong>Female Bus Caregiver:</strong> {transportInfo.attendantName}</p>
          </div>
        </SpotlightCard>
      </div>

      {/* Route Stops Schedule */}
      <SpotlightCard className="p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-[#000E28] dark:text-white">Designated Route Stops Sequence</h2>
            <p className="text-xs text-slate-500">Official schedule maintained by the Central Fleet Operations Desk.</p>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          {routeStops.map((item, idx) => (
            <div key={idx} className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              item.isStudentStop
                ? "bg-[#E5EEFF]/40 dark:bg-[#0050CB]/15 border-[#0050CB] shadow-xs"
                : "bg-slate-50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800"
            }`}>
              <div className="flex items-center gap-3.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-mono text-xs font-bold ${
                  item.isStudentStop
                    ? "bg-[#0050CB] text-white"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                }`}>
                  {idx + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs sm:text-sm font-bold text-[#000E28] dark:text-white">
                      {item.stop}
                    </p>
                    {item.isStudentStop && (
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#0050CB] text-white">
                        Your Child&rsquo;s Boarding Point
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.type}</p>
                </div>
              </div>

              <span className="text-xs font-black text-[#0050CB] dark:text-blue-400 font-mono self-end sm:self-center">
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </SpotlightCard>
    </div>
  );
}
