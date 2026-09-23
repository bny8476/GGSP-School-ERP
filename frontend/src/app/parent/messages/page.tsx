"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  MessageSquare, Bell, Sparkles, FolderDown, HelpCircle, 
  Search, SlidersHorizontal, Phone, Video, MoreHorizontal, 
  Paperclip, Smile, Mic, Send, FileText, Image as ImageIcon, 
  Film, Pin, Download, CheckCheck, ChevronRight, User, 
  Calendar, BookOpen, Clock, ShieldCheck, CheckCircle2, ChevronDown
} from "lucide-react";
import toast from "react-hot-toast";

interface Message {
  id: string;
  sender: "teacher" | "parent";
  text: string;
  time: string;
  attachment?: {
    name: string;
    size: string;
    type: string;
  };
}

interface ConversationItem {
  id: string;
  name: string;
  role: string;
  avatar: string;
  isOnline?: boolean;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  category: "teachers" | "parents" | "groups" | "admin";
}

export default function CommunicationCenterPage() {
  const [activeTab, setActiveTab] = useState<"Messages" | "Announcements" | "Updates" | "Documents" | "FAQs">("Messages");
  const [activeSubFilter, setActiveSubFilter] = useState<"All" | "Teachers" | "Parents">("All");
  const [activeChatId, setActiveChatId] = useState<string>("conv-1");
  const [messageInput, setMessageInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m-1",
      sender: "teacher",
      text: "Good morning Mrs. Sharma!\nJust wanted to share that Aarav participated with great enthusiasm during today's math discovery.",
      time: "09:30 AM",
      attachment: {
        name: "Math_Activity_Photo.pdf",
        size: "2.4 MB",
        type: "PDF",
      },
    },
    {
      id: "m-2",
      sender: "parent",
      text: "Thank you so much Ms. Ananya!\nHe was looking forward to the numbers activity all morning. 😊",
      time: "10:15 AM",
    },
    {
      id: "m-3",
      sender: "teacher",
      text: "Aarav enjoyed today's sensory block counting session immensely! Have a wonderful weekend ahead.",
      time: "11:05 AM",
    },
    {
      id: "m-4",
      sender: "parent",
      text: "That's wonderful to hear!\nPlease let us know about tomorrow's activities.",
      time: "11:45 AM",
    },
  ]);

  const conversations: ConversationItem[] = [
    {
      id: "conv-1",
      name: "Ms. Ananya Roy",
      role: "Class Teacher - LKG A",
      avatar: "/teacher-ananya-roy.jpg",
      isOnline: true,
      lastMessage: "Aarav enjoyed today's sensory block...",
      time: "11:45 AM",
      unreadCount: 2,
      category: "teachers",
    },
    {
      id: "conv-2",
      name: "School Admin",
      role: "Administration",
      avatar: "admin",
      lastMessage: "School will remain closed on 20 June...",
      time: "09:30 AM",
      unreadCount: 1,
      category: "admin",
    },
    {
      id: "conv-3",
      name: "Coach Vikram",
      role: "Physical Education",
      avatar: "coach",
      lastMessage: "Sports Day uniform distribution will...",
      time: "Yesterday",
      unreadCount: 1,
      category: "teachers",
    },
    {
      id: "conv-4",
      name: "Central Admin Desk",
      role: "Admissions & Family Services",
      avatar: "central",
      lastMessage: "School photo-day proofs have been...",
      time: "15 Sep",
      unreadCount: 3,
      category: "admin",
    },
    {
      id: "conv-5",
      name: "Ms. Renu Kapoor",
      role: "Class Teacher - UKG B",
      avatar: "renu",
      lastMessage: "Reminder: Parent-Teacher meeting...",
      time: "14 Sep",
      unreadCount: 1,
      category: "teachers",
    },
    {
      id: "conv-6",
      name: "Transport Team",
      role: "Transport",
      avatar: "transport",
      lastMessage: "Route 04 bus will arrive 10 minutes...",
      time: "12 Sep",
      category: "admin",
    },
    {
      id: "conv-7",
      name: "Library Team",
      role: "Library",
      avatar: "library",
      lastMessage: "New books are available in the library...",
      time: "10 Sep",
      category: "admin",
    },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newMsg: Message = {
      id: `m-${Date.now()}`,
      sender: "parent",
      text: messageInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setMessageInput("");
    toast.success("Message sent to Ms. Ananya Roy");
  };

  const filteredConversations = conversations.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeSubFilter === "All") return matchesSearch;
    if (activeSubFilter === "Teachers") return matchesSearch && c.category === "teachers";
    if (activeSubFilter === "Parents") return matchesSearch && c.category === "parents";
    return matchesSearch;
  });

  return (
    <div className="space-y-4 pb-12 max-w-[1440px] mx-auto font-sans text-slate-800 dark:text-slate-100">

      {/* ========================================================
          1. TOP HERO BANNER & SLOGAN
      ======================================================== */}
      <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-r from-[#EFF6FF] via-[#E8F4FF] to-[#DDEEFF] dark:from-[#061530] dark:via-[#091D45] dark:to-[#0B2558] border border-blue-100/90 dark:border-white/10 p-5 sm:p-6 shadow-xs flex items-center justify-between min-h-[105px]">
        
        {/* Left Side: Icon + Heading + Subtitle */}
        <div className="relative z-10 flex items-center gap-4 max-w-2xl">
          <div className="w-12 h-12 rounded-full bg-[#0050CB] text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
            <BookOpen className="w-5 h-5 stroke-[2.2]" />
          </div>

          <div className="space-y-0.5">
            <h1 className="text-xl sm:text-2xl font-black text-[#000E28] dark:text-white tracking-tight">
              Communication Center
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-300">
              Stay connected with teachers, get updates, and be part of your child&apos;s learning journey.
            </p>
          </div>
        </div>

        {/* Right Side: Paper Airplane + Slogan: Better Communication Stronger Learning ♡ */}
        <div className="relative z-10 hidden md:flex items-center gap-5 pr-2">
          {/* Paper Airplane with Dashed Trail */}
          <div className="relative w-16 h-8 pointer-events-none">
            <svg viewBox="0 0 60 30" fill="none" className="w-full h-full">
              <path
                d="M 5 25 C 20 28, 30 15, 45 10"
                stroke="#0050CB"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                strokeLinecap="round"
                opacity="0.5"
              />
              <polygon points="45,10 58,5 50,18" fill="#0050CB" opacity="0.85" />
            </svg>
          </div>

          <div className="text-right leading-tight">
            <p className="text-xs font-serif italic text-[#0050CB] dark:text-blue-300 font-bold">
              Better Communication
            </p>
            <p className="text-xs font-serif italic text-[#0050CB] dark:text-blue-200 font-bold flex items-center justify-end gap-1 mt-0.5">
              <span>Stronger Learning</span>
              <span className="text-rose-500 not-italic text-sm">♡</span>
            </p>
          </div>
        </div>

      </div>

      {/* ========================================================
          2. CATEGORY TABS (Messages, Announcements, Updates, Documents, FAQs)
      ======================================================== */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { label: "Messages", icon: MessageSquare, badge: null },
          { label: "Announcements", icon: Bell, badge: 3 },
          { label: "Updates", icon: Sparkles, badge: null },
          { label: "Documents", icon: FolderDown, badge: null },
          { label: "FAQs", icon: HelpCircle, badge: null },
        ].map((tab) => {
          const isActive = activeTab === tab.label;
          const TabIcon = tab.icon;

          return (
            <button
              key={tab.label}
              onClick={() => {
                setActiveTab(tab.label as any);
                if (tab.label !== "Messages") {
                  toast(`Viewing ${tab.label}`);
                }
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 ${
                isActive
                  ? "bg-[#0050CB] text-white shadow-md shadow-blue-500/20"
                  : "bg-white dark:bg-[#07142F] text-slate-700 dark:text-slate-300 border border-slate-200/90 dark:border-white/10 hover:border-blue-300"
              }`}
            >
              <TabIcon className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="w-4.5 h-4.5 rounded-full bg-[#F43F5E] text-white text-[10px] font-black flex items-center justify-center shadow-2xs">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================
          3. MAIN THREE-COLUMN LAYOUT
      ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* ====================================================
            LEFT COLUMN (3 COLS): CONVERSATIONS LIST
        ==================================================== */}
        <div className="lg:col-span-3 space-y-3">
          
          <div className="bg-white dark:bg-[#07142F] rounded-[24px] p-4 border border-slate-200/80 dark:border-white/10 shadow-[0_2px_12px_rgba(0,14,40,0.02)] space-y-3.5">
            
            {/* Header: Title */}
            <div className="flex items-center justify-between px-1">
              <h2 className="text-base font-black text-[#000E28] dark:text-white">
                Messages
              </h2>
            </div>

            {/* Search Input Bar */}
            <div className="relative flex items-center">
              <Search className="absolute left-3 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-xs text-slate-700 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0050CB]"
              />
              <button 
                onClick={() => toast("Filter conversations")}
                className="absolute right-2.5 text-slate-400 hover:text-[#0050CB] cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Sub-Filter Pills (All, Teachers, Parents, Groups) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
              {[
                { label: "All", count: 12 },
                { label: "Teachers", count: 8 },
                { label: "Parents", count: 2 },
              ].map((sub) => {
                const isSubActive = activeSubFilter === sub.label;
                return (
                  <button
                    key={sub.label}
                    onClick={() => setActiveSubFilter(sub.label as any)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-bold transition-all cursor-pointer shrink-0 ${
                      isSubActive
                        ? "bg-[#0050CB] text-white shadow-xs"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50"
                    }`}
                  >
                    <span>{sub.label}</span>
                    {sub.count !== null && (
                      <span className={`px-1 rounded-full text-[9px] font-black ${
                        isSubActive ? "bg-[#2563EB] text-white" : "bg-rose-500 text-white"
                      }`}>
                        {sub.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Conversation List Items */}
            <div className="space-y-1 pt-1 max-h-[520px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-100 dark:scrollbar-thumb-slate-800">
              {filteredConversations.map((conv) => {
                const isActive = activeChatId === conv.id;

                return (
                  <div
                    key={conv.id}
                    onClick={() => setActiveChatId(conv.id)}
                    className={`relative p-3 rounded-2xl transition-all cursor-pointer flex items-start gap-3 group ${
                      isActive
                        ? "bg-[#EFF6FF] dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    {/* Active Left Indicator Bar */}
                    {isActive && (
                      <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-md bg-[#0050CB]" />
                    )}

                    {/* Avatar */}
                    <div className="relative shrink-0">
                      {conv.avatar.startsWith("/") ? (
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-blue-100 shadow-xs">
                          <Image
                            src={conv.avatar}
                            alt={conv.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/40 text-[#0050CB] flex items-center justify-center font-bold text-xs border border-blue-100">
                          {conv.avatar === "admin" && <ShieldCheck className="w-4.5 h-4.5" />}
                          {conv.avatar === "coach" && <User className="w-4.5 h-4.5" />}
                          {conv.avatar === "central" && <FileText className="w-4.5 h-4.5" />}
                          {conv.avatar === "renu" && "RK"}
                          {conv.avatar === "transport" && "🚌"}
                          {conv.avatar === "library" && <BookOpen className="w-4.5 h-4.5" />}
                        </div>
                      )}
                    </div>

                    {/* Name + Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <p className="text-xs font-extrabold text-[#000E28] dark:text-white truncate">
                            {conv.name}
                          </p>
                          {conv.isOnline && (
                            <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5 shrink-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <span className="hidden xl:inline text-[9.5px]">Online</span>
                            </span>
                          )}
                        </div>

                        <span className="text-[10px] font-semibold text-slate-400 shrink-0">
                          {conv.time}
                        </span>
                      </div>

                      <p className="text-[10.5px] font-semibold text-slate-400 dark:text-slate-400 truncate mt-0.5">
                        {conv.role}
                      </p>

                      <div className="flex items-center justify-between gap-1 mt-1">
                        <p className="text-[11px] text-slate-500 dark:text-slate-300 truncate">
                          {conv.lastMessage}
                        </p>
                        {conv.unreadCount && (
                          <span className={`w-4 h-4 rounded-full text-[9.5px] font-black text-white flex items-center justify-center shrink-0 ${
                            isActive ? "bg-[#0050CB]" : "bg-rose-500"
                          }`}>
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pinned Conversation Card at Bottom */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-50/70 to-indigo-50/40 dark:from-slate-800/60 dark:to-slate-800/40 border border-blue-100 dark:border-slate-700/60 space-y-2">
              <div className="flex items-center gap-1.5 text-[10.5px] font-black uppercase tracking-wider text-[#0050CB] dark:text-blue-300">
                <Pin className="w-3 h-3 rotate-45" />
                <span>Pinned Conversation</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-blue-200 shrink-0">
                    <Image
                      src="/teacher-ananya-roy.jpg"
                      alt="Ms. Ananya Roy"
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#000E28] dark:text-white truncate">
                      Ms. Ananya Roy
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      Aarav&apos;s progress and updates
                    </p>
                  </div>
                </div>

                <Pin className="w-3.5 h-3.5 text-[#0050CB] shrink-0" />
              </div>
            </div>

          </div>

        </div>

        {/* ====================================================
            MIDDLE COLUMN (6 COLS): ACTIVE CHAT THREAD
        ==================================================== */}
        <div className="lg:col-span-6 space-y-3">
          
          <div className="bg-white dark:bg-[#07142F] rounded-[24px] border border-slate-200/80 dark:border-white/10 shadow-[0_2px_12px_rgba(0,14,40,0.02)] flex flex-col h-[740px] overflow-hidden">
            
            {/* 1. Chat Header */}
            <div className="p-4 px-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-[#07142F]">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-blue-100 shadow-xs shrink-0">
                  <Image
                    src="/teacher-ananya-roy.jpg"
                    alt="Ms. Ananya Roy"
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#000E28] dark:text-white">
                    Ms. Ananya Roy
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                    <span className="text-emerald-500 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Online
                    </span>
                    <span>•</span>
                    <span>Class Teacher - LKG A</span>
                  </p>
                </div>
              </div>

              {/* Call, Video & More Actions */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => toast("Calling Ms. Ananya Roy...")}
                  className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#0050CB] hover:bg-blue-50 dark:hover:bg-blue-900/30 flex items-center justify-center transition-colors cursor-pointer"
                  title="Voice Call"
                >
                  <Phone className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => toast("Starting Video Call...")}
                  className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#0050CB] hover:bg-blue-50 dark:hover:bg-blue-900/30 flex items-center justify-center transition-colors cursor-pointer"
                  title="Video Call"
                >
                  <Video className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => toast("More chat options")}
                  className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#0050CB] hover:bg-blue-50 dark:hover:bg-blue-900/30 flex items-center justify-center transition-colors cursor-pointer"
                  title="More Options"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 2. Chat Messages Scroll Area */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-gradient-to-b from-[#FAFCFF] to-white dark:from-[#061229] dark:to-[#07142F] scrollbar-thin scrollbar-thumb-blue-100">
              
              {/* Date Stamp */}
              <div className="flex justify-center">
                <span className="px-3.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  Today, 18 Sep 2025
                </span>
              </div>

              {/* Messages Iteration */}
              {messages.map((msg) => {
                const isTeacher = msg.sender === "teacher";

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${isTeacher ? "justify-start" : "justify-end"}`}
                  >
                    {/* Left Teacher Avatar */}
                    {isTeacher && (
                      <div className="relative w-8 h-8 rounded-full overflow-hidden border border-blue-100 shrink-0 mt-1">
                        <Image
                          src="/teacher-ananya-roy.jpg"
                          alt="Ms. Ananya Roy"
                          fill
                          sizes="32px"
                          className="object-cover"
                        />
                      </div>
                    )}

                    {/* Message Bubble Container */}
                    <div className={`max-w-[78%] space-y-1 ${isTeacher ? "items-start" : "items-end"}`}>
                      
                      {/* Name & Time */}
                      <div className={`flex items-center gap-2 text-[10.5px] font-semibold text-slate-400 ${
                        isTeacher ? "" : "justify-end"
                      }`}>
                        {isTeacher && <span className="font-bold text-[#000E28] dark:text-white">Ms. Ananya Roy</span>}
                        <span>{msg.time}</span>
                      </div>

                      {/* Bubble Surface */}
                      <div
                        className={`p-3.5 rounded-2xl text-xs leading-relaxed space-y-2.5 shadow-2xs ${
                          isTeacher
                            ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700 rounded-tl-sm"
                            : "bg-[#0050CB] text-white rounded-tr-sm"
                        }`}
                      >
                        <p className="whitespace-pre-line">{msg.text}</p>

                        {/* Optional PDF Attachment inside Bubble */}
                        {msg.attachment && (
                          <div
                            onClick={() => toast.success(`Downloading ${msg.attachment?.name}`)}
                            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 cursor-pointer hover:border-blue-300 transition-all group"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-[10px] shrink-0 border border-rose-200">
                                PDF
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-[#000E28] dark:text-white truncate group-hover:text-[#0050CB]">
                                  {msg.attachment.name}
                                </p>
                                <p className="text-[10px] text-slate-400">
                                  {msg.attachment.size} • {msg.attachment.type}
                                </p>
                              </div>
                            </div>

                            <Download className="w-4 h-4 text-slate-400 group-hover:text-[#0050CB] shrink-0" />
                          </div>
                        )}
                      </div>

                      {/* Parent Read Receipt */}
                      {!isTeacher && (
                        <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400">
                          <CheckCheck className="w-3.5 h-3.5 text-[#0050CB]" />
                        </div>
                      )}

                    </div>

                    {/* Right Parent Avatar */}
                    {!isTeacher && (
                      <div className="relative w-8 h-8 rounded-full overflow-hidden border border-blue-200 shrink-0 mt-1">
                        <Image
                          src="/aarav-profile-avatar.png"
                          alt="Parent"
                          fill
                          sizes="32px"
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Typing Indicator */}
              <div className="flex items-center gap-2 pt-1 text-xs text-slate-400">
                <div className="relative w-6 h-6 rounded-full overflow-hidden border border-blue-100 shrink-0">
                  <Image
                    src="/teacher-ananya-roy.jpg"
                    alt="Ms. Ananya Roy"
                    fill
                    sizes="24px"
                    className="object-cover"
                  />
                </div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  Ms. Ananya Roy is typing
                </span>
                <span className="flex items-center gap-0.5">
                  <span className="w-1 h-1 rounded-full bg-[#0050CB] animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1 h-1 rounded-full bg-[#0050CB] animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1 h-1 rounded-full bg-[#0050CB] animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
              </div>

            </div>

            {/* 3. Chat Input Box & Attachment Actions */}
            <div className="p-3 px-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#07142F] space-y-2">
              
              {/* Main Input Line */}
              <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toast("Attach file from device")}
                  className="p-2 text-slate-400 hover:text-[#0050CB] transition-colors cursor-pointer"
                  title="Attach file"
                >
                  <Paperclip className="w-4.5 h-4.5" />
                </button>

                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 py-2 px-3 bg-transparent text-xs text-[#000E28] dark:text-white placeholder:text-slate-400 focus:outline-none"
                />

                <div className="flex items-center gap-1.5 text-slate-400">
                  <button
                    type="button"
                    onClick={() => setMessageInput((prev) => prev + " 😊")}
                    className="p-1 hover:text-[#0050CB] cursor-pointer"
                  >
                    <Smile className="w-4.5 h-4.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => toast("Recording voice note...")}
                    className="p-1 hover:text-[#0050CB] cursor-pointer"
                  >
                    <Mic className="w-4.5 h-4.5" />
                  </button>

                  <button
                    type="submit"
                    className="w-8 h-8 rounded-full bg-[#0050CB] hover:bg-[#0041A8] text-white flex items-center justify-center transition-transform hover:scale-105 shadow-sm shadow-blue-500/30 cursor-pointer"
                    title="Send Message"
                  >
                    <Send className="w-3.5 h-3.5 -rotate-45" />
                  </button>
                </div>
              </form>

              {/* Bottom Utility Bar: Document, Photo, Video, Voice Note, More & Character Counter */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => toast("Attach PDF / Word Document")}
                    className="flex items-center gap-1 hover:text-[#0050CB] cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#0050CB]" />
                    <span>Document</span>
                  </button>

                  <button 
                    onClick={() => toast("Attach Photo")}
                    className="flex items-center gap-1 hover:text-[#0050CB] cursor-pointer"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-sky-500" />
                    <span>Photo</span>
                  </button>

                  <button 
                    onClick={() => toast("Attach Video clip")}
                    className="flex items-center gap-1 hover:text-[#0050CB] cursor-pointer"
                  >
                    <Film className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Video</span>
                  </button>

                  <button 
                    onClick={() => toast("Record Audio Note")}
                    className="flex items-center gap-1 hover:text-[#0050CB] cursor-pointer"
                  >
                    <Mic className="w-3.5 h-3.5 text-rose-500" />
                    <span>Voice Note</span>
                  </button>

                  <button 
                    onClick={() => toast("More options")}
                    className="flex items-center gap-1 hover:text-[#0050CB] cursor-pointer"
                  >
                    <MoreHorizontal className="w-3.5 h-3.5" />
                    <span>More</span>
                  </button>
                </div>

                <span className="text-[10px] font-mono text-slate-400">
                  {messageInput.length}/2000
                </span>
              </div>

            </div>

          </div>

        </div>

        {/* ====================================================
            RIGHT COLUMN (3 COLS): TEACHER DETAILS & WIDGETS
        ==================================================== */}
        <div className="lg:col-span-3 space-y-3.5">
          
          {/* 1. TEACHER PROFILE CARD */}
          <div className="bg-white dark:bg-[#07142F] rounded-[24px] p-5 border border-slate-200/80 dark:border-white/10 shadow-[0_2px_12px_rgba(0,14,40,0.02)] text-center space-y-3">
            
            {/* Avatar with Online Badge */}
            <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden border-3 border-blue-100 shadow-md">
              <Image
                src="/teacher-ananya-roy.jpg"
                alt="Ms. Ananya Roy"
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 text-[10.5px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Online</span>
              </div>

              <h3 className="text-base font-black text-[#000E28] dark:text-white">
                Ms. Ananya Roy
              </h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Class Teacher - LKG A
              </p>
              <p className="text-[11px] font-bold text-[#0050CB] flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0050CB]" />
                <span>GGPS School</span>
              </p>
            </div>

            {/* Actions: Call, Message, More */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-xs font-bold">
              <button
                onClick={() => toast("Calling teacher office line...")}
                className="py-1.5 px-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-50 hover:text-[#0050CB] border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1 transition-all cursor-pointer"
              >
                <Phone className="w-3 h-3" />
                <span>Call</span>
              </button>

              <button
                className="py-1.5 px-2 rounded-xl bg-[#0050CB] text-white flex items-center justify-center gap-1 shadow-xs cursor-pointer"
              >
                <MessageSquare className="w-3 h-3" />
                <span>Message</span>
              </button>

              <button
                onClick={() => toast("View teacher profile & schedule")}
                className="py-1.5 px-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-50 hover:text-[#0050CB] border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1 transition-all cursor-pointer"
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
                <span>More</span>
              </button>
            </div>

          </div>

          {/* 2. CHILD & CLASS DETAILS */}
          <div className="bg-white dark:bg-[#07142F] rounded-[24px] p-4.5 border border-slate-200/80 dark:border-white/10 shadow-[0_2px_12px_rgba(0,14,40,0.02)] space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Child &amp; Class Details
            </h4>

            <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative w-9 h-9 rounded-full overflow-hidden border border-blue-200 shrink-0">
                  <Image
                    src="/aarav-profile-avatar.png"
                    alt="Aarav Sharma"
                    fill
                    sizes="36px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#000E28] dark:text-white">
                    Aarav Sharma
                  </p>
                  <p className="text-[11px] text-slate-400">
                    LKG - Section A
                  </p>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            <Link
              href="/parent/children"
              className="w-full py-2 rounded-xl border border-blue-200 dark:border-blue-900/60 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-[#0050CB] dark:text-blue-300 text-xs font-bold flex items-center justify-center transition-colors"
            >
              View Child Profile
            </Link>
          </div>

          {/* 3. QUICK ACTIONS GRID */}
          <div className="bg-white dark:bg-[#07142F] rounded-[24px] p-4.5 border border-slate-200/80 dark:border-white/10 shadow-[0_2px_12px_rgba(0,14,40,0.02)] space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Quick Actions
            </h4>

            <div className="grid grid-cols-3 gap-2">
              <Link
                href="/parent/children"
                className="p-2.5 rounded-2xl bg-[#EBF5FE]/70 hover:bg-[#E5EEFF] dark:bg-blue-950/40 text-center space-y-1.5 transition-colors group"
              >
                <div className="w-7 h-7 mx-auto rounded-lg bg-white dark:bg-slate-800 text-[#0050CB] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                  <User className="w-3.5 h-3.5" />
                </div>
                <p className="text-[10.5px] font-bold text-[#000E28] dark:text-white leading-tight">
                  View Child
                </p>
              </Link>

              <Link
                href="/parent/attendance"
                className="p-2.5 rounded-2xl bg-[#EBF5FE]/70 hover:bg-[#E5EEFF] dark:bg-blue-950/40 text-center space-y-1.5 transition-colors group"
              >
                <div className="w-7 h-7 mx-auto rounded-lg bg-white dark:bg-slate-800 text-[#0050CB] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <p className="text-[10.5px] font-bold text-[#000E28] dark:text-white leading-tight">
                  Attendance
                </p>
              </Link>

              <Link
                href="/parent/homework"
                className="p-2.5 rounded-2xl bg-[#EBF5FE]/70 hover:bg-[#E5EEFF] dark:bg-blue-950/40 text-center space-y-1.5 transition-colors group"
              >
                <div className="w-7 h-7 mx-auto rounded-lg bg-white dark:bg-slate-800 text-[#0050CB] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <p className="text-[10.5px] font-bold text-[#000E28] dark:text-white leading-tight">
                  Today&apos;s Work
                </p>
              </Link>

              <Link
                href="/parent/timetable"
                className="p-2.5 rounded-2xl bg-[#EBF5FE]/70 hover:bg-[#E5EEFF] dark:bg-blue-950/40 text-center space-y-1.5 transition-colors group"
              >
                <div className="w-7 h-7 mx-auto rounded-lg bg-white dark:bg-slate-800 text-[#0050CB] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <p className="text-[10.5px] font-bold text-[#000E28] dark:text-white leading-tight">
                  Schedule
                </p>
              </Link>

              <Link
                href="/parent/timetable"
                className="p-2.5 rounded-2xl bg-[#E6F8F6]/70 hover:bg-[#CCFBF1] dark:bg-teal-950/40 text-center space-y-1.5 transition-colors group"
              >
                <div className="w-7 h-7 mx-auto rounded-lg bg-white dark:bg-slate-800 text-[#0D9488] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <p className="text-[10.5px] font-bold text-[#000E28] dark:text-white leading-tight">
                  Schedule
                </p>
              </Link>
            </div>
          </div>

          {/* 4. SHARED FILES */}
          <div className="bg-white dark:bg-[#07142F] rounded-[24px] p-4.5 border border-slate-200/80 dark:border-white/10 shadow-[0_2px_12px_rgba(0,14,40,0.02)] space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-[#000E28] dark:text-white flex items-center gap-1">
                <span>Shared Files</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </h4>
              <Link href="/parent/documents" className="text-[11px] font-bold text-[#0050CB] hover:underline">
                View All &gt;
              </Link>
            </div>

            <div className="space-y-2">
              {[
                { name: "Math_Activity_Photo.pdf", size: "2.4 MB • 18 Sep 2025" },
                { name: "Weekly_Lesson_Plan.pdf", size: "1.8 MB • 16 Sep 2025" },
                { name: "Class_Notice.pdf", size: "756 KB • 12 Sep 2025" },
              ].map((file, i) => (
                <div
                  key={i}
                  onClick={() => toast.success(`Downloading ${file.name}`)}
                  className="p-2.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:border-blue-200 flex items-center justify-between gap-2 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-[9px] shrink-0 border border-rose-200">
                      PDF
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#000E28] dark:text-white truncate group-hover:text-[#0050CB]">
                        {file.name}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {file.size}
                      </p>
                    </div>
                  </div>

                  <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0050CB] shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* 5. RECENT UPDATES */}
          <div className="bg-white dark:bg-[#07142F] rounded-[24px] p-4.5 border border-slate-200/80 dark:border-white/10 shadow-[0_2px_12px_rgba(0,14,40,0.02)] space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-[#000E28] dark:text-white">
                Recent Updates
              </h4>
              <Link href="/parent/notifications" className="text-[11px] font-bold text-[#0050CB] hover:underline">
                View All &gt;
              </Link>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#000E28] dark:text-white leading-tight">
                    Homework assigned: Drawing Domestic Animals
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    2 hours ago
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#000E28] dark:text-white leading-tight">
                    Attendance updated for Aarav
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Yesterday
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
