"use client";

import React, { useState } from "react";
import { Folder, File, Upload, Download, Trash2, Search, HardDrive, Share2 } from "lucide-react";
import EmergencyBanner from "@/components/ui/EmergencyBanner";

export default function FileManagerPage() {
  const [files, setFiles] = useState([
    { id: 1, name: "Mathematics_Syllabus_2026.pdf", folder: "Curriculum", size: "2.4 MB", type: "PDF", date: "Sep 12, 2026" },
    { id: 2, name: "School_Campus_Photo.jpg", folder: "Media", size: "4.1 MB", type: "Image", date: "Sep 10, 2026" },
    { id: 3, name: "Grade_10_Attendance_Sheet.xlsx", folder: "Reports", size: "850 KB", type: "Excel", date: "Sep 08, 2026" },
  ]);

  const folders = ["Curriculum", "Media", "Reports", "Administrative", "Certificates"];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <EmergencyBanner />

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-[#000E28] dark:text-white flex items-center gap-3">
            <HardDrive className="w-8 h-8 text-[#0050CB] dark:text-[#38BDF8]" />
            Digital File Manager & Cloud Documents
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm font-medium">
            Centralized document storage, syllabus distribution, file sharing, and backups.
          </p>
        </div>

        <button className="px-5 py-2.5 bg-[#0050CB] hover:bg-[#0041A8] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer">
          <Upload className="w-4 h-4" />
          <span>Upload File</span>
        </button>
      </div>

      {/* Storage Breakdown Banner */}
      <div className="bg-gradient-to-r from-[#0050CB] to-[#002B7A] rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-black text-lg">Cloud Storage Usage</h3>
          <p className="text-xs text-blue-100 font-medium">14.2 GB used out of 100 GB Total Capacity</p>
        </div>
        <div className="w-full md:w-64 bg-white/20 h-3 rounded-full overflow-hidden">
          <div className="bg-[#FF690C] h-full w-[14%]" />
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Folder Directory Sidebar */}
        <div className="lg:col-span-3 bg-white dark:bg-[#000E28] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Folders</h3>
          <div className="space-y-1">
            {folders.map((f) => (
              <div
                key={f}
                className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-[#E5EEFF] dark:hover:bg-[#0050CB]/20 hover:text-[#0050CB] flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <Folder className="w-4 h-4 text-[#0050CB]" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* File Table */}
        <div className="lg:col-span-9 bg-white dark:bg-[#000E28] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">All Files</h3>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search file name..."
                className="pl-9 pr-4 py-1.5 bg-slate-50 dark:bg-[#001438] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-[#0050CB]"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {files.map((file) => (
              <div key={file.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#E5EEFF] dark:bg-[#0050CB]/20 text-[#0050CB]">
                    <File className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-800 dark:text-white">{file.name}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold">{file.folder} • {file.size} • {file.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg text-slate-400 hover:text-[#0050CB] transition-colors cursor-pointer" title="Download">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg text-slate-400 hover:text-[#0050CB] transition-colors cursor-pointer" title="Share">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
