"use client";

import React, { useState } from "react";
import { Phone, Video, Mic, MicOff, VideoOff, PhoneOff, Users, Clock } from "lucide-react";
import EmergencyBanner from "@/components/ui/EmergencyBanner";

export default function CallPage() {
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const recentCalls = [
    { id: 1, name: "Parent-Teacher Conference (Grade 10)", type: "Video Call", duration: "24m 12s", date: "Today, 10:30 AM", status: "Completed" },
    { id: 2, name: "Principal Office Sync", type: "Audio Call", duration: "12m 45s", date: "Yesterday, 04:15 PM", status: "Completed" },
    { id: 3, name: "Science Department Meeting", type: "Video Call", duration: "45m 00s", date: "Sep 12, 2026", status: "Missed" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <EmergencyBanner />

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-[#000E28] dark:text-white flex items-center gap-3">
            <Video className="w-8 h-8 text-[#0050CB] dark:text-[#38BDF8]" />
            Audio & Video Conference Room
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm font-medium">
            Virtual classrooms, parent consultation calls, and administrative meetings.
          </p>
        </div>

        {!isInCall && (
          <button
            onClick={() => setIsInCall(true)}
            className="px-5 py-2.5 bg-[#0050CB] hover:bg-[#0041A8] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Video className="w-4 h-4" />
            <span>Start New Conference Call</span>
          </button>
        )}
      </div>

      {/* Active Call Container */}
      {isInCall ? (
        <div className="bg-[#000E28] rounded-3xl p-6 shadow-2xl space-y-6 text-white border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              <div>
                <h3 className="font-extrabold text-lg">Grade 10 Parent Consultation & Feedback</h3>
                <p className="text-xs text-slate-400 font-semibold">3 Participants Connected • Encrypted Call Session</p>
              </div>
            </div>
            <span className="bg-slate-800 text-xs font-bold px-3 py-1 rounded-full text-slate-300">
              00:14:22
            </span>
          </div>

          {/* Video Grid Simulation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[360px]">
            <div className="bg-slate-900 rounded-2xl p-4 flex flex-col justify-between border border-slate-800 relative overflow-hidden">
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold">
                Host: System Admin
              </div>
              <div className="my-auto text-center space-y-2">
                <div className="w-20 h-20 rounded-full bg-[#0050CB] mx-auto flex items-center justify-center font-black text-2xl border-4 border-white/20">
                  SA
                </div>
                <p className="text-xs font-bold text-slate-300">Speaking...</p>
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl p-4 flex flex-col justify-between border border-slate-800 relative overflow-hidden">
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold">
                Patty Parent (Guest)
              </div>
              <div className="my-auto text-center space-y-2">
                <div className="w-20 h-20 rounded-full bg-[#FF690C] mx-auto flex items-center justify-center font-black text-2xl border-4 border-white/20">
                  PP
                </div>
                <p className="text-xs font-bold text-slate-400">Audio Only</p>
              </div>
            </div>
          </div>

          {/* Call Control Toolbar */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-4 rounded-full transition-all cursor-pointer ${
                isMuted ? "bg-rose-600 text-white" : "bg-slate-800 hover:bg-slate-700 text-white"
              }`}
              title={isMuted ? "Unmute Mic" : "Mute Mic"}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`p-4 rounded-full transition-all cursor-pointer ${
                isVideoOff ? "bg-rose-600 text-white" : "bg-slate-800 hover:bg-slate-700 text-white"
              }`}
              title={isVideoOff ? "Turn On Camera" : "Turn Off Camera"}
            >
              {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsInCall(false)}
              className="p-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all cursor-pointer"
              title="Leave Call"
            >
              <PhoneOff className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        /* Call Log & History */
        <div className="bg-white dark:bg-[#000E28] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#0050CB]" />
            Recent Call History & Logs
          </h3>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentCalls.map((call) => (
              <div key={call.id} className="py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#E5EEFF] dark:bg-[#0050CB]/20 text-[#0050CB]">
                    {call.type.includes("Video") ? <Video className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-800 dark:text-white">{call.name}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold">{call.date} • {call.duration}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    call.status === "Completed"
                      ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                      : "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
                  }`}>
                    {call.status}
                  </span>

                  <button
                    onClick={() => setIsInCall(true)}
                    className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#0050CB] rounded-lg transition-colors cursor-pointer"
                    title="Rejoin Call"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
