'use client';

import React, { useState } from 'react';
import { Database, Upload, Download, FileSpreadsheet, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { EmergencyBanner } from '@/components/ui/EmergencyBanner';

export default function ImportExportPage() {
  const [selectedEntity, setSelectedEntity] = useState('students');
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setImporting(true);
    setImportStatus(null);

    // Simulate CSV parsing & API ingestion verification
    setTimeout(() => {
      setImporting(false);
      setImportStatus({
        success: true,
        message: `Successfully validated and imported 42 records into ${selectedEntity.toUpperCase()} repository.`,
      });
      setFile(null);
    }, 1500);
  };

  const handleDownloadTemplate = () => {
    const csvContent =
      selectedEntity === 'students'
        ? 'firstName,lastName,grade,rollNumber,parentEmail,phone\nJohn,Doe,Grade 10,1001,parent@example.com,+15550192'
        : 'name,email,subject,phone,qualification\nSarah,Smith,Mathematics,+15550193,M.Sc. Mathematics';

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedEntity}_import_template.csv`;
    a.click();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <EmergencyBanner />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
          <Database className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          Bulk Data Import & Export Center
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Global International School • Batch CSV Ingestion, Validation Mapping & Data Export
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* IMPORT SECTION */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-indigo-600" /> Bulk CSV Import
            </h2>
            <button
              onClick={handleDownloadTemplate}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Download Template
            </button>
          </div>

          <form onSubmit={handleImport} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Target Entity</label>
              <select
                value={selectedEntity}
                onChange={(e) => setSelectedEntity(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 text-sm font-semibold"
              >
                <option value="students">Students Master Directory</option>
                <option value="teachers">Faculty & Staff Directory</option>
                <option value="fees">Fee Structures & Ledger</option>
                <option value="books">Library Catalog</option>
              </select>
            </div>

            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center space-y-2 hover:border-indigo-500 transition-colors">
              <FileSpreadsheet className="w-10 h-10 text-slate-400 mx-auto" />
              <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {file ? file.name : 'Click to select CSV file'}
              </div>
              <p className="text-xs text-slate-400">Supported format: .csv (Max 10MB)</p>
              <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" id="csv-upload" />
              <label
                htmlFor="csv-upload"
                className="inline-block cursor-pointer px-4 py-2 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              >
                Browse Files
              </label>
            </div>

            <button
              type="submit"
              disabled={!file || importing}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-all shadow-md disabled:opacity-50"
            >
              {importing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {importing ? 'Validating & Importing...' : 'Import Data'}
            </button>
          </form>

          {importStatus && (
            <div
              className={`p-4 rounded-xl flex items-start gap-3 text-xs font-semibold ${
                importStatus.success
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <div>{importStatus.message}</div>
            </div>
          )}
        </div>

        {/* EXPORT SECTION */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <Download className="w-5 h-5 text-indigo-600" /> Export System Records
          </h2>
          <p className="text-xs text-slate-500">
            Generate encrypted, formatted spreadsheet exports of institution records for reporting and backups.
          </p>

          <div className="space-y-3 pt-2">
            {[
              { title: 'Full Student Roster (All Grades)', format: 'CSV / Excel' },
              { title: 'Fee Collection Ledger (Current Year)', format: 'CSV / Excel' },
              { title: 'Staff Payroll & Tax Register', format: 'CSV' },
              { title: 'System Audit Log Trail', format: 'JSON / CSV' },
            ].map((exp, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800"
              >
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{exp.title}</h4>
                  <span className="text-xs text-slate-400">{exp.format}</span>
                </div>
                <button
                  onClick={() => alert(`Exporting ${exp.title}...`)}
                  className="flex items-center gap-1.5 text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg hover:border-indigo-500 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-600" /> Export
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
