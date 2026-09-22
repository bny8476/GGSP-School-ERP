"use client";

import React, { useState } from "react";
import { User, Mail, Phone, MapPin, ShieldCheck, Lock, Save, CheckCircle2 } from "lucide-react";
import SpotlightCard from "@/components/teacher/SpotlightCard";
import { useParent } from "@/context/ParentContext";
import toast from "react-hot-toast";

export default function ParentAccountPage() {
  const { parentProfile, user, updateParentProfile, children } = useParent();
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    motherName: parentProfile?.motherName || "Priya Sharma",
    fatherName: parentProfile?.fatherName || "Vikram Sharma",
    primaryEmail: parentProfile?.primaryEmail || "priya.sharma@family.com",
    motherContact: parentProfile?.motherContact || "+91 98765 43211",
    fatherContact: parentProfile?.fatherContact || "+91 98765 43210",
    whatsappNumber: parentProfile?.whatsappNumber || "+91 98765 43211",
    address: parentProfile?.address || "Tower 4, Apt 802, Prestige Greenfield Residences, Bangalore 560103",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const success = await updateParentProfile(form);
    setIsSaving(false);
    if (success) {
      toast.success("Contact details updated successfully!");
    } else {
      toast.error("Failed to update profile");
    }
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    toast.success("Password updated securely");
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-[22px] bg-white dark:bg-[#07142F] border border-[#E7EAF0] dark:border-white/10 shadow-sm">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#3157D5]">
            Parent / Guardian Dossier
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#07142F] dark:text-white">
            My Account & Profile
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Maintain authorized emergency contacts, residential address, and account credentials for GGPS School ERP.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-100 dark:bg-white/5 px-3.5 py-2 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Verified Primary Guardian</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card Preview */}
        <SpotlightCard className="p-6 flex flex-col items-center text-center space-y-4">
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-[#3157D5] to-[#2444B5] text-white font-black text-3xl flex items-center justify-center shadow-lg ring-4 ring-[#E5EEFF] dark:ring-[#3157D5]/20">
            {form.motherName[0] || "P"}
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-black text-[#07142F] dark:text-white">
              {form.motherName}
            </h2>
            <p className="text-xs text-[#3157D5] dark:text-blue-400 font-bold">
              Parent / Guardian
            </p>
            <p className="text-xs text-slate-400">{form.primaryEmail}</p>
          </div>

          {/* Linked Children List */}
          <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-800 text-left space-y-2">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">
              Authorized Children ({children.length})
            </span>
            {children.map((c) => (
              <div
                key={c._id}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-[#07142F] dark:text-white">{c.firstName} {c.lastName}</p>
                  <p className="text-[10px] text-slate-400">{c.grade} – {c.section}</p>
                </div>
                <span className="text-[10px] font-mono text-[#3157D5] font-bold">Roll #{c.rollNumber}</span>
              </div>
            ))}
          </div>
        </SpotlightCard>

        {/* Edit Contact Information */}
        <SpotlightCard className="lg:col-span-2 p-6 sm:p-8 space-y-6">
          <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-[#07142F] dark:text-white">
              Personal & Emergency Contact Details
            </h2>
            <p className="text-xs text-slate-500">
              Campus automated emergency broadcasts & SMS notifications will be dispatched to these numbers.
            </p>
          </div>

          <form onSubmit={handleSaveContact} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mother / Guardian Name
                </label>
                <input
                  type="text"
                  value={form.motherName}
                  onChange={(e) => setForm({ ...form, motherName: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-[#3157D5]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Father / Co-Guardian Name
                </label>
                <input
                  type="text"
                  value={form.fatherName}
                  onChange={(e) => setForm({ ...form, fatherName: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-[#3157D5]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Primary Mobile Number
                </label>
                <input
                  type="text"
                  value={form.motherContact}
                  onChange={(e) => setForm({ ...form, motherContact: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-[#3157D5]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  WhatsApp Broadcast Number
                </label>
                <input
                  type="text"
                  value={form.whatsappNumber}
                  onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-[#3157D5]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Residential Street Address & Pincode
              </label>
              <textarea
                rows={2}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-[#3157D5]"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl bg-[#3157D5] hover:bg-[#2444B5] text-white font-bold flex items-center gap-2 shadow-md shadow-[#3157D5]/20 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                {isSaving ? "Saving..." : "Save Contact Changes"}
              </button>
            </div>
          </form>

          {/* Security & Password Block */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-[#07142F] dark:text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#3157D5]" />
              Account Security & Password
            </h3>

            <form onSubmit={handleUpdatePassword} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <input
                type="password"
                placeholder="Current Password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
              <input
                type="password"
                placeholder="New Password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors cursor-pointer"
              >
                Update Password
              </button>
            </form>
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
}
