"use client";

import React, { useState } from "react";
import { MessageSquare, Send, Paperclip, CheckCircle2, User, Search, ShieldCheck } from "lucide-react";
import SpotlightCard from "@/components/teacher/SpotlightCard";
import { useParent } from "@/context/ParentContext";
import toast from "react-hot-toast";

interface Message {
  id: string;
  sender: "teacher" | "parent";
  text: string;
  time: string;
}

export default function CommunicationCenterPage() {
  const { selectedChild } = useParent();
  const [activeThreadId, setActiveThreadId] = useState("t1");
  const [replyText, setReplyText] = useState("");

  const child = selectedChild || {
    firstName: "Aarav",
    lastName: "Sharma",
    grade: "LKG",
  };

  const contacts = [
    {
      id: "t1",
      name: "Ms. Ananya Roy",
      role: "Lead Class Mentor (LKG)",
      avatar: "AR",
      lastMessage: "Aarav enjoyed today's sensory block counting session immensely!",
      time: "11:45 AM",
      unread: true,
      messages: [
        { id: "m1", sender: "teacher", text: "Good morning Mrs. Sharma! Just wanted to share that Aarav participated with great enthusiasm during today's math discovery.", time: "10:30 AM" },
        { id: "m2", sender: "parent", text: "Thank you so much Ms. Ananya! He was looking forward to the numbers activity all morning.", time: "11:05 AM" },
        { id: "m3", sender: "teacher", text: "Aarav enjoyed today's sensory block counting session immensely! Have a wonderful weekend ahead.", time: "11:45 AM" },
      ] as Message[],
    },
    {
      id: "t2",
      name: "Coach Vikram",
      role: "Physical Education Coordinator",
      avatar: "CV",
      lastMessage: "Sports Day uniform distribution will begin next Tuesday.",
      time: "Yesterday",
      unread: false,
      messages: [
        { id: "m1", sender: "teacher", text: "Sports Day uniform distribution will begin next Tuesday. Please ensure sports shoe sizing is confirmed.", time: "Yesterday" },
      ] as Message[],
    },
    {
      id: "t3",
      name: "Central Admin Desk",
      role: "Admissions & Family Services",
      avatar: "AD",
      lastMessage: "School photo day proofs have been archived into your document vault.",
      time: "15 Sep",
      unread: false,
      messages: [
        { id: "m1", sender: "teacher", text: "School photo day proofs have been archived into your document vault. You may download them at your convenience.", time: "15 Sep" },
      ] as Message[],
    },
  ];

  const activeContact = contacts.find((c) => c.id === activeThreadId) || contacts[0];
  const [threads, setThreads] = useState(contacts);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newMsg: Message = {
      id: `m-${Date.now()}`,
      sender: "parent",
      text: replyText.trim(),
      time: "Just now",
    };

    setThreads((prev) =>
      prev.map((c) =>
        c.id === activeThreadId
          ? { ...c, messages: [...c.messages, newMsg], lastMessage: newMsg.text, time: "Just now" }
          : c
      )
    );

    setReplyText("");
    toast.success("Message delivered to educator");
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-[22px] bg-white dark:bg-[#07142F] border border-[#E7EAF0] dark:border-white/10 shadow-sm">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#3157D5]">
            Family-School Partnership
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#07142F] dark:text-white">
            Communication Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Direct, secure, and professional correspondence with GGPS educators and staff.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-100 dark:bg-white/5 px-3.5 py-2 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-[#3157D5]" />
          <span>Encrypted Faculty Channel</span>
        </div>
      </div>

      {/* Two-Panel Messenger Layout */}
      <SpotlightCard className="p-0 overflow-hidden grid grid-cols-1 md:grid-cols-3 min-h-[580px]">
        {/* Left: Contact Conversations List */}
        <div className="border-r border-slate-100 dark:border-slate-800 flex flex-col">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">
              Conversations ({threads.length})
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {threads.map((contact) => {
              const isSelected = contact.id === activeThreadId;
              return (
                <button
                  key={contact.id}
                  onClick={() => setActiveThreadId(contact.id)}
                  className={`w-full p-4 text-left transition-colors flex items-start gap-3.5 ${
                    isSelected
                      ? "bg-[#E5EEFF]/60 dark:bg-[#3157D5]/20"
                      : "hover:bg-slate-50 dark:hover:bg-white/5"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-[#3157D5] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {contact.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-bold text-[#07142F] dark:text-white truncate">
                        {contact.name}
                      </p>
                      <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                        {contact.time}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#3157D5] dark:text-blue-400 font-medium truncate">
                      {contact.role}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-1">
                      {contact.lastMessage}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Message Thread & Composer */}
        <div className="md:col-span-2 flex flex-col justify-between bg-white dark:bg-[#07142F]">
          {/* Thread Header */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#3157D5] text-white font-bold text-xs flex items-center justify-center">
                {activeContact.avatar}
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#07142F] dark:text-white">
                  {activeContact.name}
                </h2>
                <p className="text-[11px] text-slate-400">
                  {activeContact.role} • Regarding <strong>{child.firstName}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {activeContact.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "parent" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === "parent"
                      ? "bg-[#3157D5] text-white rounded-br-none shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-[#07142F] dark:text-slate-200 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1 font-mono">
                  {msg.time}
                </span>
              </div>
            ))}
          </div>

          {/* Message Composer */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 bg-slate-50/50 dark:bg-[#07142F]/50"
          >
            <button
              type="button"
              onClick={() => toast("Attachment upload ready")}
              className="p-2.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              title="Attach Document or Image"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              type="text"
              placeholder={`Write a message to ${activeContact.name}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-[#3157D5]"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-[#3157D5] hover:bg-[#2444B5] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#3157D5]/20 transition-all shrink-0 cursor-pointer"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </SpotlightCard>
    </div>
  );
}
