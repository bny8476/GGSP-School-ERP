"use client";

import React, { useState } from "react";
import { MessageSquare, Send, Paperclip, Search, Users, UserCheck, Circle } from "lucide-react";
import EmergencyBanner from "@/components/ui/EmergencyBanner";

export default function ChatPage() {
  const [activeChannel, setActiveChannel] = useState("general");
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([
    { id: 1, sender: "System Admin", text: "Welcome to the Global International School Chat!", time: "09:00 AM", role: "SuperAdmin" },
    { id: 2, sender: "Tom Teacher", text: "Math exam revision notes have been uploaded to Digital Classroom.", time: "09:15 AM", role: "Teacher" },
    { id: 3, sender: "Patty Parent", text: "Thank you Mr. Tom! Will verify with Sammy today.", time: "09:20 AM", role: "Parent" },
  ]);

  const channels = [
    { id: "general", name: "# General Announcements", unread: 2 },
    { id: "staff-room", name: "# Staff & Faculty Lounge", unread: 0 },
    { id: "grade-10-parents", name: "# Grade 10 Parents Group", unread: 5 },
    { id: "event-planning", name: "# Annual Sports Day 2026", unread: 1 },
  ];

  const directMessages = [
    { id: "u1", name: "Tom Teacher", status: "online", role: "Lead Instructor" },
    { id: "u2", name: "Patty Parent", status: "online", role: "Parent Guardian" },
    { id: "u3", name: "Sammy Student", status: "offline", role: "Grade 10-A" },
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setChatLog((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "You",
        text: message,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        role: "Active User",
      },
    ]);
    setMessage("");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <EmergencyBanner />

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#000E28] dark:text-white flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-[#0050CB] dark:text-[#38BDF8]" />
          Real-Time School Messenger & Channels
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm font-medium">
          Instant communication across faculty, parents, students, and administration rooms.
        </p>
      </div>

      {/* Main Chat Grid */}
      <div className="bg-white dark:bg-[#000E28] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        
        {/* Left Sidebar: Channels & DMs */}
        <div className="lg:col-span-4 border-r border-slate-200 dark:border-slate-800 p-4 space-y-6 bg-slate-50/50 dark:bg-slate-900/30">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#001438] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-[#0050CB]"
            />
          </div>

          {/* Channels */}
          <div>
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2 px-1 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> Rooms & Channels
            </h4>
            <div className="space-y-1">
              {channels.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setActiveChannel(ch.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                    activeChannel === ch.id
                      ? "bg-[#0050CB] text-white shadow-xs"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <span className="truncate">{ch.name}</span>
                  {ch.unread > 0 && activeChannel !== ch.id && (
                    <span className="bg-[#FF690C] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                      {ch.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Direct Messages */}
          <div>
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2 px-1 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5" /> Direct Messages
            </h4>
            <div className="space-y-1">
              {directMessages.map((dm) => (
                <div
                  key={dm.id}
                  className="px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between hover:bg-slate-200/50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Circle className={`w-2.5 h-2.5 fill-current ${dm.status === 'online' ? 'text-emerald-500' : 'text-slate-400'}`} />
                    <div>
                      <p className="font-bold text-slate-800 dark:text-white leading-tight">{dm.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{dm.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Main Chat Window */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-900/20">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                {channels.find((c) => c.id === activeChannel)?.name || "# Channel"}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                Official School Communication Room • Authorized Members
              </p>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[440px]">
            {chatLog.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "You" ? "items-end" : "items-start"}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{msg.sender}</span>
                  <span className="text-[10px] text-[#0050CB] dark:text-[#38BDF8] font-bold bg-[#E5EEFF] dark:bg-[#0050CB]/20 px-2 py-0.5 rounded-md">
                    {msg.role}
                  </span>
                  <span className="text-[10px] text-slate-400">{msg.time}</span>
                </div>
                <div
                  className={`max-w-md px-4 py-2.5 rounded-2xl text-xs font-medium leading-relaxed ${
                    msg.sender === "You"
                      ? "bg-[#0050CB] text-white rounded-br-none shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200/60 dark:border-slate-700"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSend} className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <button
              type="button"
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-[#0050CB] transition-colors cursor-pointer"
              title="Attach File"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-[#001438] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-[#0050CB]"
            />

            <button
              type="submit"
              className="px-5 py-2.5 bg-[#0050CB] hover:bg-[#0041A8] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
