"use client";

import React, { useState } from "react";
import { Mail, Inbox, Send, FileText, Star, Trash2, Plus, Search, Paperclip } from "lucide-react";
import EmergencyBanner from "@/components/ui/EmergencyBanner";

export default function EmailPage() {
  const [activeFolder, setActiveFolder] = useState("inbox");
  const [selectedMail, setSelectedMail] = useState<any>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  const emails = [
    {
      id: 1,
      sender: "Principal Office",
      email: "principal@globalinternationalschool.edu",
      subject: "Annual Academic Audit & Review Meeting Schedule",
      preview: "Dear Staff, Please note that the annual academic review meeting will be held this Friday...",
      time: "10:15 AM",
      unread: true,
    },
    {
      id: 2,
      sender: "Finance Department",
      email: "finance@globalinternationalschool.edu",
      subject: "Monthly Fee Reconciliation Report - August 2026",
      preview: "The fee reconciliation report for August 2026 has been generated. Please review...",
      time: "Yesterday",
      unread: false,
    },
    {
      id: 3,
      sender: "Patty Parent",
      email: "parent@school.com",
      subject: "Leave Request Confirmation for Sammy Student",
      preview: "Hello, I submitted a leave request for Sammy for next Tuesday due to a dental appointment...",
      time: "Sep 12",
      unread: false,
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <EmergencyBanner />

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-[#000E28] dark:text-white flex items-center gap-3">
            <Mail className="w-8 h-8 text-[#0050CB] dark:text-[#38BDF8]" />
            Official School Email Client
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm font-medium">
            Internal & external email communication suite for staff, parents, and administration.
          </p>
        </div>

        <button
          onClick={() => setIsComposeOpen(true)}
          className="px-5 py-2.5 bg-[#0050CB] hover:bg-[#0041A8] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Compose Email</span>
        </button>
      </div>

      {/* Main Mail Client Layout */}
      <div className="bg-white dark:bg-[#000E28] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        
        {/* Left Folder Nav */}
        <div className="lg:col-span-3 border-r border-slate-200 dark:border-slate-800 p-4 space-y-2 bg-slate-50/50 dark:bg-slate-900/30">
          <button
            onClick={() => setActiveFolder("inbox")}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
              activeFolder === "inbox" ? "bg-[#0050CB] text-white" : "text-slate-700 dark:text-slate-300 hover:bg-slate-200/50"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Inbox className="w-4 h-4" />
              <span>Inbox</span>
            </div>
            <span className="bg-[#FF690C] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">1</span>
          </button>

          <button
            onClick={() => setActiveFolder("sent")}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors cursor-pointer ${
              activeFolder === "sent" ? "bg-[#0050CB] text-white" : "text-slate-700 dark:text-slate-300 hover:bg-slate-200/50"
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Sent Mail</span>
          </button>

          <button
            onClick={() => setActiveFolder("drafts")}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors cursor-pointer ${
              activeFolder === "drafts" ? "bg-[#0050CB] text-white" : "text-slate-700 dark:text-slate-300 hover:bg-slate-200/50"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Drafts</span>
          </button>
        </div>

        {/* Middle Mail List */}
        <div className="lg:col-span-4 border-r border-slate-200 dark:border-slate-800 p-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search emails..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-[#001438] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-[#0050CB]"
            />
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {emails.map((mail) => (
              <div
                key={mail.id}
                onClick={() => setSelectedMail(mail)}
                className={`p-3.5 rounded-2xl transition-all cursor-pointer space-y-1 ${
                  selectedMail?.id === mail.id
                    ? "bg-[#E5EEFF] dark:bg-[#0050CB]/20 border border-[#0050CB]/30"
                    : "hover:bg-slate-50 dark:hover:bg-slate-900/60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className={`text-xs font-extrabold ${mail.unread ? "text-[#0050CB] dark:text-[#38BDF8]" : "text-slate-800 dark:text-slate-200"}`}>
                    {mail.sender}
                  </h4>
                  <span className="text-[10px] text-slate-400">{mail.time}</span>
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{mail.subject}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-normal">{mail.preview}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Mail Reader View */}
        <div className="lg:col-span-5 p-6 flex flex-col justify-between">
          {selectedMail ? (
            <div className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4 space-y-2">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">{selectedMail.subject}</h3>
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span>From: <strong className="text-slate-800 dark:text-slate-200">{selectedMail.sender}</strong> ({selectedMail.email})</span>
                  <span>{selectedMail.time}</span>
                </div>
              </div>

              <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal space-y-3">
                <p>{selectedMail.preview}</p>
                <p>Please contact the administration office if you require further clarification.</p>
                <p className="pt-4 text-slate-400 font-semibold">Best Regards,<br />Global International School Admin Team</p>
              </div>
            </div>
          ) : (
            <div className="my-auto text-center space-y-2 text-slate-400 py-20">
              <Mail className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600" />
              <p className="text-xs font-bold">Select an email from the list to read details.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
