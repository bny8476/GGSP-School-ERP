"use client";

import { useState } from 'react';
import { ShieldCheck, ShieldAlert, KeyRound, Smartphone, Monitor, LogOut, CheckCircle2, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SecurityCenter() {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [ipBans, setIpBans] = useState<string[]>(['192.168.1.105 (Suspicious Login Attempts)']);

  const handleSignOutOtherSessions = () => {
    toast.success('Successfully revoked all other active sessions!');
  };

  const handleToggle2FA = () => {
    setIs2FAEnabled(!is2FAEnabled);
    toast.success(!is2FAEnabled ? 'Two-Factor Authentication activated!' : 'Two-Factor Authentication disabled.');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Enterprise Security Center</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
          Manage active user sessions, 2FA credentials, failed login monitoring, and IP access rules.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Session Management */}
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center">
              <Monitor className="h-5 w-5 mr-2 text-indigo-600" /> Active Device Sessions
            </h2>
            <button
              onClick={handleSignOutOtherSessions}
              className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold text-xs rounded-xl hover:bg-rose-100 transition-colors flex items-center"
            >
              <LogOut className="h-3.5 w-3.5 mr-1" /> Sign Out Other Sessions
            </button>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div>
                <p className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">Chrome on macOS (Current Session)</p>
                <p className="text-xs text-slate-400">IP: 127.0.0.1 • Active Now</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">Active</span>
            </div>
          </div>
        </div>

        {/* 2FA Architecture */}
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center">
            <KeyRound className="h-5 w-5 mr-2 text-indigo-600" /> Two-Factor Authentication (2FA)
          </h2>

          <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            Protect your administrator account with time-based OTP authenticator app verification.
          </p>

          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-3">
              <Smartphone className="h-6 w-6 text-indigo-600" />
              <div>
                <p className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">Authenticator App (TOTP)</p>
                <p className="text-xs text-slate-400">Google Authenticator or Authy</p>
              </div>
            </div>
            <button
              onClick={handleToggle2FA}
              className={`px-4 py-2 font-bold text-xs rounded-xl shadow-sm transition-all ${
                is2FAEnabled ? 'bg-rose-600 text-white hover:bg-rose-500' : 'bg-indigo-600 text-white hover:bg-indigo-500'
              }`}
            >
              {is2FAEnabled ? 'Disable 2FA' : 'Enable 2FA'}
            </button>
          </div>
        </div>
      </div>

      {/* IP Ban List */}
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center">
          <ShieldAlert className="h-5 w-5 mr-2 text-rose-500" /> Restricted IP Address Rules
        </h2>
        <div className="space-y-2">
          {ipBans.map((ip, idx) => (
            <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs font-mono text-slate-700 dark:text-slate-300 flex justify-between items-center">
              <span>{ip}</span>
              <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">Banned</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
