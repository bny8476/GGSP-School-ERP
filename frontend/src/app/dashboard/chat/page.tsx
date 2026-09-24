"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { MessageSquare, Send, Paperclip, Search, Users, UserCheck, Circle, ShieldCheck, Check, Clock } from "lucide-react";
import EmergencyBanner from "@/components/ui/EmergencyBanner";
import toast from "react-hot-toast";
import { getSocket, joinRoom, leaveRoom } from "@/lib/socket";
import { getApiBaseUrl } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  role: string;
  isMe?: boolean;
}

interface ConversationItem {
  _id: string;
  participant?: {
    name: string;
    role: string;
    email: string;
  };
  student?: {
    name: string;
    grade: string;
  };
  lastMessage?: {
    message: string;
    createdAt: string;
  };
  unreadCount?: number;
}

export default function ChatPage() {
  const { user } = useAuthStore();
  const [activeChannel, setActiveChannel] = useState("general");
  const [activeConvId, setActiveConvId] = useState<string>("");
  const [message, setMessage] = useState("");
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const channels = [
    { id: "general", name: "# General Announcements", unread: 0 },
    { id: "staff-room", name: "# Staff & Faculty Lounge", unread: 0 },
    { id: "grade-parents", name: "# Grade 4 Parents Group", unread: 0 },
    { id: "event-planning", name: "# Annual Sports Day 2026", unread: 0 },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatLog]);

  // Load conversations
  const loadConversations = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const apiBase = getApiBaseUrl();
      const res = await fetch(`${apiBase}/api/v1/messages/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setConversations(json.data);
          if (json.data.length > 0 && !activeConvId) {
            setActiveConvId(json.data[0]._id);
          }
        }
      }
    } catch (e) {
      console.warn("Admin conversations load notice:", e);
    } finally {
      setIsLoading(false);
    }
  }, [activeConvId]);

  // Load messages
  const loadMessages = useCallback(async (convId: string) => {
    if (!convId) return;
    try {
      const token = localStorage.getItem("token");
      const apiBase = getApiBaseUrl();
      const res = await fetch(`${apiBase}/api/v1/messages?conversationId=${convId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const currentUserId = user?._id || user?.id;
          const mapped: ChatMessage[] = json.data.map((m: any) => {
            const senderId = m.sender?._id || m.sender;
            const isMe = String(senderId) === String(currentUserId);
            const senderName = m.sender?.firstName 
              ? `${m.sender.firstName} ${m.sender.lastName || ""}`.trim()
              : (m.senderRole || "Member");

            return {
              id: m._id || `msg-${Date.now()}`,
              sender: isMe ? "You" : senderName,
              text: m.message,
              time: m.createdAt
                ? new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : "Just now",
              role: m.senderRole || m.sender?.role || "Staff",
              isMe,
            };
          });
          setChatLog(mapped);
        }
      }
    } catch (e) {
      console.warn("Messages load notice:", e);
    }
  }, [user]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (!activeConvId) return;
    loadMessages(activeConvId);

    const socket = getSocket();
    if (!socket) return;

    joinRoom(`conversation:${activeConvId}`);

    const handleNewMessage = (msg: any) => {
      if (String(msg.conversationId) === String(activeConvId)) {
        const currentUserId = user?._id || user?.id;
        const senderId = msg.sender?._id || msg.sender;
        const isMe = String(senderId) === String(currentUserId);
        const senderName = msg.sender?.firstName 
          ? `${msg.sender.firstName} ${msg.sender.lastName || ""}`.trim()
          : (msg.senderRole || "Member");

        setChatLog((prev) => [
          ...prev,
          {
            id: msg._id,
            sender: isMe ? "You" : senderName,
            text: msg.message,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            role: msg.senderRole || "Staff",
            isMe,
          },
        ]);
      }
    };

    socket.on("chat:message:new", handleNewMessage);
    socket.on("message:new", handleNewMessage);

    return () => {
      leaveRoom(`conversation:${activeConvId}`);
      socket.off("chat:message:new", handleNewMessage);
      socket.off("message:new", handleNewMessage);
    };
  }, [activeConvId, loadMessages, user]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !activeConvId) return;

    const textToSend = message.trim();
    setMessage("");

    // Optimistic UI update
    setChatLog((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        sender: "You",
        text: textToSend,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        role: user?.role || "Admin",
        isMe: true,
      },
    ]);

    try {
      const token = localStorage.getItem("token");
      const apiBase = getApiBaseUrl();
      const res = await fetch(`${apiBase}/api/v1/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          conversationId: activeConvId,
          message: textToSend,
        }),
      });

      if (!res.ok) {
        toast.error("Failed to send message");
      }
    } catch (err) {
      toast.error("Error sending message");
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <EmergencyBanner />

      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#000E28] dark:text-white flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-[#0050CB] dark:text-[#38BDF8]" />
          Real-Time School Messenger & Admin Channels
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm font-medium">
          Instant communication across faculty, parents, and administrative staff rooms.
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
                </button>
              ))}
            </div>
          </div>

          {/* Direct Messages with Parents & Teachers */}
          <div>
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2 px-1 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5" /> Direct Communications
            </h4>
            <div className="space-y-1 max-h-56 overflow-y-auto">
              {conversations.map((dm) => (
                <div
                  key={dm._id}
                  onClick={() => setActiveConvId(dm._id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors ${
                    activeConvId === dm._id
                      ? "bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800"
                      : "hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Circle className="w-2.5 h-2.5 fill-current text-emerald-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 dark:text-white leading-tight truncate">
                        {dm.participant?.name || "School Contact"}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium truncate">
                        {dm.student ? `Child: ${dm.student.name}` : dm.participant?.role}
                      </p>
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
                {conversations.find((c) => c._id === activeConvId)?.participant?.name || "# Official Channel"}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                Official School Communication Room • Authorized Members
              </p>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[440px]">
            {chatLog.length === 0 ? (
              <div className="py-20 text-center text-xs text-slate-400">
                No messages yet. Send a message below.
              </div>
            ) : (
              chatLog.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.isMe ? "items-end" : "items-start"}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{msg.sender}</span>
                    <span className="text-[10px] text-[#0050CB] dark:text-[#38BDF8] font-bold bg-[#E5EEFF] dark:bg-[#0050CB]/20 px-2 py-0.5 rounded-md">
                      {msg.role}
                    </span>
                    <span className="text-[10px] text-slate-400">{msg.time}</span>
                  </div>
                  <div
                    className={`p-3.5 rounded-2xl max-w-lg text-xs leading-relaxed shadow-2xs ${
                      msg.isMe
                        ? "bg-[#0050CB] text-white rounded-tr-sm"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Composer */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#000E28]">
            <form onSubmit={handleSend} className="flex items-center gap-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a verified message to authorized participants..."
                className="flex-1 py-2.5 px-4 bg-slate-50 dark:bg-[#001438] border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#0050CB]"
              />

              <button
                type="submit"
                disabled={!message.trim()}
                className="px-5 py-2.5 rounded-2xl bg-[#0050CB] hover:bg-[#0041A8] disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-transform hover:scale-105 cursor-pointer"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
