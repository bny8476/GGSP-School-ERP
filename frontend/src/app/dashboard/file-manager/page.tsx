"use client";

import React, { useState, useRef } from "react";
import { Folder, File, Upload, Download, Trash2, Search, HardDrive, Share2, Check } from "lucide-react";
import EmergencyBanner from "@/components/ui/EmergencyBanner";
import toast from "react-hot-toast";

export default function FileManagerPage() {
  const [files, setFiles] = useState([
    { id: 1, name: "Mathematics_Syllabus_2026.pdf", folder: "Curriculum", size: "2.4 MB", type: "PDF", date: "Sep 12, 2026" },
    { id: 2, name: "School_Campus_Photo.jpg", folder: "Media", size: "4.1 MB", type: "Image", date: "Sep 10, 2026" },
    { id: 3, name: "Grade_10_Attendance_Sheet.xlsx", folder: "Reports", size: "850 KB", type: "Excel", date: "Sep 08, 2026" },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("All Folders");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const folders = ["All Folders", "Curriculum", "Media", "Reports", "Administrative", "Certificates"];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    const newFile = {
      id: Date.now(),
      name: file.name,
      folder: selectedFolder === "All Folders" ? "Curriculum" : selectedFolder,
      size: `${sizeMB === "0.0" ? "120 KB" : `${sizeMB} MB`}`,
      type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    };
    setFiles(prev => [newFile, ...prev]);
    toast.success(`Uploaded "${file.name}" to ${newFile.folder}`);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDownload = (file: any) => {
    const blob = new Blob([`Content of ${file.name}\nGenerated on ${file.date}\nGGPS School ERP`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloading ${file.name}`);
  };

  const handleShare = (file: any) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/dashboard/file-manager?file=${encodeURIComponent(file.name)}`);
      toast.success(`Share link for "${file.name}" copied to clipboard!`);
    } else {
      toast.success(`Link generated for "${file.name}"`);
    }
  };

  const handleDelete = (id: number, name: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    toast.success(`Deleted "${name}"`);
  };

  const filteredFiles = files.filter(f => {
    const matchesFolder = selectedFolder === "All Folders" || f.folder === selectedFolder;
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.folder.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <EmergencyBanner />

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />

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

        <button 
          onClick={() => fileInputRef.current?.click()}
          className="px-5 py-2.5 bg-[#0050CB] hover:bg-[#0041A8] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
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
              <button
                key={f}
                type="button"
                onClick={() => setSelectedFolder(f)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer text-left ${
                  selectedFolder === f
                    ? "bg-[#E5EEFF] dark:bg-[#0050CB]/20 text-[#0050CB] dark:text-[#38BDF8]"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Folder className="w-4 h-4 text-[#0050CB] shrink-0" />
                  <span>{f}</span>
                </div>
                {selectedFolder === f && <Check className="w-3.5 h-3.5 text-[#0050CB]" />}
              </button>
            ))}
          </div>
        </div>

        {/* File Table */}
        <div className="lg:col-span-9 bg-white dark:bg-[#000E28] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
              {selectedFolder === "All Folders" ? "All Files" : `${selectedFolder} Files`} ({filteredFiles.length})
            </h3>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search file name..."
                className="pl-9 pr-4 py-1.5 bg-slate-50 dark:bg-[#001438] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-[#0050CB]"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredFiles.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs font-bold">
                No files found in {selectedFolder}.
              </div>
            ) : (
              filteredFiles.map((file) => (
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

                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleDownload(file)}
                      className="p-2 rounded-lg text-slate-400 hover:text-[#0050CB] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer" 
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleShare(file)}
                      className="p-2 rounded-lg text-slate-400 hover:text-[#0050CB] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer" 
                      title="Share link"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(file.id, file.name)}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer" 
                      title="Delete file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
