"use client";

import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Download, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  accessor?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  exportFileName?: string;
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  searchPlaceholder = 'Search records...',
  loading = false,
  emptyMessage = 'No records found.',
  onRowClick,
  exportFileName = 'export',
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter
  const filteredData = data.filter((item) =>
    columns.some((col) => {
      const val = item[col.key];
      if (val === null || val === undefined) return false;
      return String(val).toLowerCase().includes(searchTerm.toLowerCase());
    })
  );

  // Sort
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const handleExportCSV = () => {
    if (data.length === 0) return;
    const headers = columns.map((c) => c.header).join(',');
    const rows = data.map((item) =>
      columns
        .map((c) => {
          const val = item[c.key];
          return `"${String(val ?? '').replace(/"/g, '""')}"`;
        })
        .join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${exportFileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-[#07152F] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-200">
      {/* Table Controls */}
      <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/60 dark:bg-[#0B1F3A]/40">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#07152F] border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 input-focus-glow font-medium"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center px-3.5 py-2 text-xs font-bold bg-white dark:bg-[#07152F] text-slate-700 dark:text-slate-200 hover:text-[#0050CB] dark:hover:text-[#38BDF8] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all border border-slate-200 dark:border-slate-700/80 cursor-pointer shadow-2xs btn-interactive"
          >
            <Download className="h-3.5 w-3.5 mr-2 text-[#0050CB] dark:text-[#38BDF8]" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-100/90 dark:bg-[#0B1F3A] text-[11px] text-slate-700 dark:text-slate-300 uppercase font-bold tracking-wider border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 select-none">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  className={`px-6 py-3.5 transition-colors duration-150 ${col.sortable !== false ? 'cursor-pointer hover:text-[#0050CB] dark:hover:text-[#38BDF8]' : ''}`}
                >
                  <div className="flex items-center space-x-1.5">
                    <span>{col.header}</span>
                    {col.sortable !== false && (
                      <ArrowUpDown className={`h-3.5 w-3.5 transition-transform duration-200 ${sortKey === col.key ? 'text-[#0050CB] dark:text-[#38BDF8] scale-110' : 'opacity-40'}`} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {columns.map((col, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 shimmer-skeleton rounded-lg w-24"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-14 text-center">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-1">
                      <Search className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {emptyMessage}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                      Try changing your search keyword or clearing active filters to view records.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((item, idx) => (
                <tr
                  key={idx}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={`hover:bg-blue-50/50 dark:hover:bg-[#001945]/70 table-row-hover ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                      {col.accessor ? col.accessor(item) : item[col.key] ?? '-'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 bg-slate-50/60 dark:bg-[#0B1F3A]/40">
        <div className="font-medium">
          Showing <span className="font-bold text-slate-800 dark:text-slate-200">{paginatedData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</span> to{' '}
          <span className="font-bold text-slate-800 dark:text-slate-200">{Math.min(currentPage * pageSize, sortedData.length)}</span> of{' '}
          <span className="font-bold text-slate-800 dark:text-slate-200">{sortedData.length}</span> entries
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#07152F] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all btn-interactive"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="px-3 py-1 rounded-lg font-bold text-xs bg-white dark:bg-[#07152F] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#07152F] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all btn-interactive"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
