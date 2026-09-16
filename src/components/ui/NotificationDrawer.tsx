"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, X, CheckCheck, AlertCircle, Info, AlertTriangle, ArrowRight } from 'lucide-react';

interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  read: boolean;
  link?: string;
  createdAt: string;
}

export default function NotificationDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (e) {
      console.error('Failed to load notifications', e);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((item) => (item._id === id ? { ...item, read: true } : item))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      }
    } catch (e) {}
  };

  const handleMarkAllRead = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/mark-all-read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
        setUnreadCount(0);
      }
    } catch (e) {}
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        title="Notification Center"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-[10px] font-black text-white shadow-sm animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Slide-over Drawer Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-250">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-[#0050CB] dark:text-[#38BDF8]" />
                <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100">
                  Notification Center
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs font-bold text-[#0050CB] dark:text-[#38BDF8] hover:underline flex items-center cursor-pointer"
                  >
                    <CheckCheck className="h-3.5 w-3.5 mr-1" /> Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {loading ? (
                <div className="p-8 text-center text-slate-400 text-sm font-medium animate-pulse">
                  Loading notifications...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-sm font-medium">
                  No notifications to display.
                </div>
              ) : (
                notifications.map((item) => {
                  const isUrgent = item.priority === 'urgent' || item.priority === 'high';
                  return (
                    <div
                      key={item._id}
                      className={`p-4 rounded-2xl border transition-all ${
                        !item.read
                          ? 'bg-[#E5EEFF]/60 dark:bg-[#0050CB]/15 border-blue-200 dark:border-[#0050CB]/30'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          {isUrgent ? (
                            <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0" />
                          ) : (
                            <Info className="h-4 w-4 text-indigo-500 shrink-0" />
                          )}
                          <span className="font-extrabold text-sm text-slate-800 dark:text-slate-100 leading-tight">
                            {item.title}
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 ml-2">
                          {item.type}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed font-medium">
                        {item.message}
                      </p>

                      <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-200/50 dark:border-slate-700/50 text-[10px]">
                        <span className="text-slate-400">
                          {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <div className="flex items-center space-x-2">
                          {!item.read && (
                            <button
                              onClick={() => handleMarkAsRead(item._id)}
                              className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                              Mark read
                            </button>
                          )}
                          {item.link && (
                            <Link
                              href={item.link}
                              onClick={() => setIsOpen(false)}
                              className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"
                            >
                              View &rarr;
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
              Global International Notification Dispatcher
            </div>
          </div>
        </div>
      )}
    </>
  );
}
