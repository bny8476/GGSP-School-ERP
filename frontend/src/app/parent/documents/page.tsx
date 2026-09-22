"use client";

import React, { useState } from "react";
import { FileText, Download, Eye, ShieldCheck, Award, Receipt, School, Folder } from "lucide-react";
import SpotlightCard from "@/components/teacher/SpotlightCard";
import ReportCardModal from "@/components/parent/ReportCardModal";
import { useParent } from "@/context/ParentContext";
import toast from "react-hot-toast";

interface DocumentRecord {
  id: string;
  title: string;
  category: "Report Cards" | "Receipts" | "Certificates" | "School Documents";
  date: string;
  fileType: string;
  size: string;
}

export default function DocumentVaultPage() {
  const { selectedChild } = useParent();
  const [filter, setFilter] = useState("All");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const child = selectedChild || {
    _id: "c-01",
    firstName: "Aarav",
    lastName: "Sharma",
    grade: "LKG",
    section: "Section A",
  };

  const documents: DocumentRecord[] = [
    {
      id: "doc-1",
      title: `Official Term 1 Academic Progress Report Card - ${child.firstName}`,
      category: "Report Cards",
      date: "15 Sep 2026",
      fileType: "PDF Document",
      size: "1.8 MB",
    },
    {
      id: "doc-2",
      title: "Fee Payment Receipt #GGPS-RCP-902811",
      category: "Receipts",
      date: "28 Jun 2026",
      fileType: "Tax Receipt PDF",
      size: "420 KB",
    },
    {
      id: "doc-3",
      title: "Kindergarten Star Performer Award Certificate",
      category: "Certificates",
      date: "10 Aug 2026",
      fileType: "Color Certificate",
      size: "2.4 MB",
    },
    {
      id: "doc-4",
      title: "School Academic Calendar & Holiday Schedule 2025-26",
      category: "School Documents",
      date: "01 Jun 2026",
      fileType: "Official Policy PDF",
      size: "3.1 MB",
    },
    {
      id: "doc-5",
      title: "Student Health, Immunization & Pediatric Declaration",
      category: "School Documents",
      date: "04 May 2026",
      fileType: "Medical Record",
      size: "890 KB",
    },
    {
      id: "doc-6",
      title: "Transport Route #4 Transit Pass & RFID Security Card",
      category: "School Documents",
      date: "02 Jun 2026",
      fileType: "Transit Pass",
      size: "650 KB",
    },
  ];

  const categories = ["All", "Report Cards", "Receipts", "Certificates", "School Documents"];

  const filtered = filter === "All"
    ? documents
    : documents.filter((d) => d.category === filter);

  const handleDownload = (doc: DocumentRecord) => {
    if (doc.category === "Report Cards") {
      setIsReportModalOpen(true);
      return;
    }
    toast.success(`Downloading "${doc.title}"`);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-[22px] bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#0050CB]">
            Secure Family Archive
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#000E28] dark:text-white">
            Official Documents Vault: {child.firstName} {child.lastName}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Download certified report cards, official fee receipts, health records, and school circulars.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3.5 py-2 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Digitally Signed & Validated</span>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              filter === cat
                ? "bg-[#0050CB] text-white shadow-xs"
                : "bg-white dark:bg-[#111827] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((doc) => (
          <SpotlightCard key={doc.id} className="p-5 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-[#E5EEFF] dark:bg-[#0050CB]/20 text-[#0050CB] flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {doc.category}
                  </span>
                  <span className="text-[11px] text-slate-400">{doc.date}</span>
                </div>
                <h2 className="text-xs sm:text-sm font-bold text-[#000E28] dark:text-white mt-1 line-clamp-2">
                  {doc.title}
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {doc.fileType} • {doc.size}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-center">
              <button
                onClick={() => handleDownload(doc)}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                title="Download Document"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </SpotlightCard>
        ))}
      </div>

      <ReportCardModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        child={child}
      />
    </div>
  );
}
