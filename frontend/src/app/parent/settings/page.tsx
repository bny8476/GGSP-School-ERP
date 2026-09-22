"use client";

import React, { useState } from "react";
import { Settings, Sun, Moon, Bell, Shield, Smartphone, Globe, CheckCircle2 } from "lucide-react";
import SpotlightCard from "@/components/teacher/SpotlightCard";
import { useTheme } from "@/context/ThemeContext";
import toast from "react-hot-toast";

export default function ParentSettingsPage() {
  const { theme, toggleTheme, setTheme } = useTheme();

  const [alerts, setAlerts] = useState({
    attendanceSms: true,
    homeworkWhatsApp: true,
    feeRemindersEmail: true,
    eventPushNotifs: true,
    emergencyBroadcasts: true,
  });

  const handleToggle = (key: keyof typeof alerts) => {
    setAlerts((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      toast.success("Notification preferences saved");
      return next;
    });
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-[22px] bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#0050CB]">
            Platform Customization
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#000E28] dark:text-white">
            Portal Preferences & Settings
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure appearance, delivery channels for school alerts, and security preferences.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Appearance Card */}
        <SpotlightCard className="p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-[#E5EEFF] dark:bg-[#0050CB]/20 text-[#0050CB] flex items-center justify-center">
              {theme === "dark" ? <Moon className="w-5 h-5 text-purple-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#000E28] dark:text-white">
                Display Theme
              </h2>
              <p className="text-xs text-slate-400">Choose between light luxury or high-contrast dark mode</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
            <button
              onClick={() => setTheme("light")}
              className={`p-3.5 rounded-xl border text-center font-bold transition-all ${
                theme === "light"
                  ? "border-[#0050CB] bg-[#E5EEFF]/40 text-[#0050CB] shadow-xs"
                  : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
              }`}
            >
              Light Luxury
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`p-3.5 rounded-xl border text-center font-bold transition-all ${
                theme === "dark"
                  ? "border-[#0050CB] bg-[#0050CB]/20 text-white shadow-xs"
                  : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
              }`}
            >
              Deep Navy Dark (#0B1020)
            </button>
          </div>
        </SpotlightCard>

        {/* Alerts & Notifications Card */}
        <SpotlightCard className="p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#000E28] dark:text-white">
                Notification Channels
              </h2>
              <p className="text-xs text-slate-400">Configure where you receive critical school updates</p>
            </div>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            {[
              { id: "attendanceSms", label: "Gate Arrival SMS Alerts", desc: "Instant SMS when child's bus tag reaches school" },
              { id: "homeworkWhatsApp", label: "WhatsApp Homework Digest", desc: "Evening digest of pending student assignments" },
              { id: "feeRemindersEmail", label: "Fee Invoices & Receipts via Email", desc: "Official PDF invoices dispatched to email" },
              { id: "emergencyBroadcasts", label: "Emergency Campus Alerts", desc: "Weather delays or urgent administrative advisories" },
            ].map((pref) => {
              const checked = (alerts as any)[pref.id];
              return (
                <div
                  key={pref.id}
                  onClick={() => handleToggle(pref.id as any)}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 cursor-pointer"
                >
                  <div>
                    <p className="font-bold text-[#000E28] dark:text-white">{pref.label}</p>
                    <p className="text-[11px] text-slate-400">{pref.desc}</p>
                  </div>
                  <div
                    className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 ${
                      checked ? "bg-[#0050CB]" : "bg-slate-300 dark:bg-slate-700"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        checked ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
}
