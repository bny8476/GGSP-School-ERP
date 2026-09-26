"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  User, 
  Users, 
  GraduationCap, 
  HeartPulse, 
  FileCheck,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const STEPS = [
  { id: 1, label: 'Identity', icon: User, desc: 'Personal details' },
  { id: 2, label: 'Parent/Guardian', icon: Users, desc: 'Contact details' },
  { id: 3, label: 'Enrollment', icon: GraduationCap, desc: 'Class & section' },
  { id: 4, label: 'Health & Well-being', icon: HeartPulse, desc: 'Medical declaration' },
  { id: 5, label: 'Review', icon: FileCheck, desc: 'Verification' },
];

export default function AddStudentModal({
  isOpen,
  onClose,
  onSuccess,
}: AddStudentModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'Male',
    bloodGroup: 'O+',
    parentName: '',
    parentEmail: '',
    emergencyContact: '',
    address: '',
    grade: 'LKG',
    section: 'A',
    rollNumber: '',
    academicYear: '2025-2026',
    medicalNotes: '',
    status: 'Active',
  });

  if (!isOpen) return null;

  // Auto-calculated preview IDs
  const previewStudentId = `GGPS-2026-${formData.grade.replace(/\s+/g, '')}-001`;
  const previewAdmissionNo = `GGPS-2026Admin-${(formData.firstName.length * 37 + 101) % 900 + 100}`;

  const handleChange = (field: string, val: any) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        toast.error('First and last name are required.');
        return;
      }
    }
    if (currentStep === 2) {
      if (!formData.emergencyContact.trim()) {
        toast.error('Parent contact number is required.');
        return;
      }
    }
    setCurrentStep((prev) => Math.min(STEPS.length, prev + 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        admissionNumber: previewAdmissionNo,
        grade: formData.grade,
        section: formData.section,
        bloodGroup: formData.bloodGroup,
        medicalNotes: formData.medicalNotes,
        emergencyContact: formData.emergencyContact,
        status: formData.status,
      };

      const res = await fetch(`${apiBase}/api/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || ''}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(`Student ${formData.firstName} ${formData.lastName} enrolled successfully!`);
        onSuccess();
        onClose();
        setCurrentStep(1);
      } else {
        const err = await res.json();
        toast.error(err.message || 'Failed to enroll student.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error enrolling student.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07152F]/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#07152F] border border-slate-200 dark:border-slate-800 w-full max-w-2xl rounded-[28px] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-[#0B1F3A]/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0050CB] text-white flex items-center justify-center shadow-md shadow-[#0050CB]/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#000E28] dark:text-white">
                Add New Student
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official institutional enrollment wizard • GGPS ERP
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl transition-colors cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Tracker */}
        <div className="px-6 py-3.5 bg-slate-50/80 dark:bg-[#0B1F3A]/70 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
          <div className="flex items-center justify-between">
            {STEPS.map((s, idx) => {
              const Icon = s.icon;
              const isDone = currentStep > s.id;
              const isActive = currentStep === s.id;

              return (
                <React.Fragment key={s.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black transition-all ${
                        isDone
                          ? 'bg-emerald-500 text-white'
                          : isActive
                          ? 'bg-[#0050CB] text-white shadow-md shadow-[#0050CB]/30'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {isDone ? <Check className="w-3.5 h-3.5" /> : s.id}
                    </div>
                    <span
                      className={`text-xs font-bold hidden sm:inline ${
                        isActive
                          ? 'text-[#0050CB] dark:text-[#E5EEFF]'
                          : isDone
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 rounded-full transition-colors ${
                        currentStep > s.id
                          ? 'bg-emerald-500'
                          : 'bg-slate-200 dark:bg-slate-800'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Wizard Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-5">
          <AnimatePresence mode="wait">
            {/* Step 1: Personal & Identity */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <div className="p-3.5 rounded-2xl bg-[#E5EEFF] dark:bg-[#0050CB]/15 border border-[#0050CB]/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#0050CB] dark:text-[#E5EEFF]" />
                    <span className="text-xs font-bold text-[#0050CB] dark:text-[#E5EEFF]">
                      Auto-generated identifiers preview
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#000E28] dark:text-white bg-white/70 dark:bg-[#07152F] px-2.5 py-1 rounded-lg">
                    {previewStudentId}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#000E28] dark:text-slate-300 mb-1.5">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aarav"
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-[#000E28] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0050CB]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#000E28] dark:text-slate-300 mb-1.5">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sharma"
                      value={formData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-[#000E28] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0050CB]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#000E28] dark:text-slate-300 mb-1.5">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-[#000E28] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0050CB]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#000E28] dark:text-slate-300 mb-1.5">
                      Gender
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => handleChange('gender', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-[#000E28] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0050CB]/30"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#000E28] dark:text-slate-300 mb-1.5">
                      Blood Group
                    </label>
                    <select
                      value={formData.bloodGroup}
                      onChange={(e) => handleChange('bloodGroup', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-[#000E28] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0050CB]/30"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#000E28] dark:text-slate-300 mb-1.5">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleChange('status', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-[#000E28] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0050CB]/30"
                    >
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Parent/Guardian Details */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#000E28] dark:text-slate-300 mb-1.5">
                      Primary Parent / Guardian Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Vikram Sharma"
                      value={formData.parentName}
                      onChange={(e) => handleChange('parentName', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-[#000E28] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0050CB]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#000E28] dark:text-slate-300 mb-1.5">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.emergencyContact}
                      onChange={(e) => handleChange('emergencyContact', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-[#000E28] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0050CB]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#000E28] dark:text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="parent@example.com"
                      value={formData.parentEmail}
                      onChange={(e) => handleChange('parentEmail', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-[#000E28] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0050CB]/30"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#000E28] dark:text-slate-300 mb-1.5">
                      Residential Address
                    </label>
                    <textarea
                      rows={2}
                      placeholder="House No, Street, Landmark, City, PIN"
                      value={formData.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-[#000E28] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0050CB]/30 resize-none"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Enrollment */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#000E28] dark:text-slate-300 mb-1.5">
                      Class / Grade *
                    </label>
                    <select
                      value={formData.grade}
                      onChange={(e) => handleChange('grade', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-[#000E28] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0050CB]/30"
                    >
                      {['Pre-KG', 'LKG', 'UKG'].map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#000E28] dark:text-slate-300 mb-1.5">
                      Section
                    </label>
                    <select
                      value={formData.section}
                      onChange={(e) => handleChange('section', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-[#000E28] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0050CB]/30"
                    >
                      {['A', 'B', 'C', 'D'].map((sec) => (
                        <option key={sec} value={sec}>
                          Section {sec}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#000E28] dark:text-slate-300 mb-1.5">
                      Roll Number (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 14"
                      value={formData.rollNumber}
                      onChange={(e) => handleChange('rollNumber', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-[#000E28] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0050CB]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#000E28] dark:text-slate-300 mb-1.5">
                      Academic Year
                    </label>
                    <input
                      type="text"
                      disabled
                      value={formData.academicYear}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Health & Logistics */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-[#000E28] dark:text-slate-300 mb-1.5">
                    Medical Notes / Allergies
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Mild asthma inhaler in bag, allergic to peanuts"
                    value={formData.medicalNotes}
                    onChange={(e) => handleChange('medicalNotes', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-[#000E28] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0050CB]/30 resize-none"
                  />
                </div>


              </motion.div>
            )}

            {/* Step 5: Review & Submit */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B1F3A]/70 border border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Enrollment Summary Preview
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block">Student Name:</span>
                      <span className="font-bold text-[#000E28] dark:text-white">
                        {formData.firstName} {formData.lastName}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Student ID Preview:</span>
                      <span className="font-bold text-[#0050CB] dark:text-[#E5EEFF] font-mono">
                        {previewStudentId}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Class & Section:</span>
                      <span className="font-bold text-[#000E28] dark:text-white">
                        {formData.grade} • Section {formData.section}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Admission Number:</span>
                      <span className="font-bold text-[#000E28] dark:text-white font-mono">
                        {previewAdmissionNo}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Parent Phone:</span>
                      <span className="font-bold text-[#000E28] dark:text-white">
                        {formData.emergencyContact || '—'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-200">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>
                    Unique student ID and credentials will be permanently issued upon confirmation.
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-[#0B1F3A]/40 shrink-0">
          <button
            type="button"
            onClick={currentStep === 1 ? onClose : handleBack}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </button>

          <div className="flex items-center gap-2">
            {currentStep < STEPS.length ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0050CB] hover:bg-[#1469E8] text-white text-xs font-bold shadow-md shadow-[#0050CB]/25 transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0050CB] to-[#2563EB] hover:from-[#1469E8] hover:to-[#3b82f6] text-white text-xs font-bold shadow-lg shadow-[#0050CB]/30 disabled:opacity-50 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{isSubmitting ? 'Enrolling...' : 'Confirm & Enroll'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
