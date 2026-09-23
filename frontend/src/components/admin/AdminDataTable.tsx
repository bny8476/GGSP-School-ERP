"use client";

import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Filter, 
  SlidersHorizontal,
  ArrowUpDown,
  Inbox
} from 'lucide-react';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T | string;
  sortable?: boolean;
  cell?: (row: T, index: number) => React.ReactNode;
  className?: string;
}

export interface AdminDataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  isLoading?: boolean;
  searchPlaceholder?: string;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  filters?: React.ReactNode;
  bulkActions?: (selectedIds: string[]) => React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  pageSize?: number;
  pagination?: boolean;
}

export default function AdminDataTable<T>({
  data,
  columns,
  keyExtractor,
  isLoading = false,
  searchPlaceholder = 'Search records...',
  searchQuery,
  onSearchChange,
  filters,
  bulkActions,
  emptyTitle = 'No records found',
  emptyDescription = 'There are no items matching your current filters or query.',
  emptyAction,
  pageSize = 10,
  pagination = true,
}: AdminDataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Sorting
  const sortedData = React.useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a: any, b: any) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (valA === valB) return 0;
      if (valA == null) return 1;
      if (valB == null) return -1;
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      return sortOrder === 'asc' ? 1 : -1;
    });
  }, [data, sortKey, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = pagination
    ? sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : sortedData;

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedData.map(keyExtractor));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSort = (columnKey: string) => {
    if (sortKey === columnKey) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(columnKey);
      setSortOrder('asc');
    }
  };

  const isAllSelected =
    paginatedData.length > 0 &&
    paginatedData.every((item) => selectedIds.includes(keyExtractor(item)));

  return (
    <div className="bg-white dark:bg-[#07152F] rounded-[22px] border border-[#E6EAF2] dark:border-slate-800 shadow-[0_4px_24px_rgba(0,14,40,0.03)] overflow-hidden transition-all duration-200">
      {/* Table Toolbar */}
      {(onSearchChange || filters || bulkActions) && (
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-[#07152F]">
          {/* Left: Search Bar & Bulk Actions */}
          <div className="flex flex-wrap items-center gap-2.5 flex-1 max-w-xl">
            {onSearchChange && (
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery || ''}
                  onChange={(e) => {
                    onSearchChange(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-[#000E28] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0050CB]/30 focus:border-[#0050CB] transition-all"
                />
              </div>
            )}

            {selectedIds.length > 0 && bulkActions && (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold text-[#0050CB] dark:text-[#E5EEFF] bg-[#E5EEFF] dark:bg-[#0050CB]/30 px-2 py-1 rounded-lg">
                  {selectedIds.length} selected
                </span>
                {bulkActions(selectedIds)}
              </div>
            )}
          </div>

          {/* Right: Filters & Controls */}
          {filters && (
            <div className="flex flex-wrap items-center gap-2 self-end md:self-auto">
              {filters}
            </div>
          )}
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-[#0B1F3A]/70 border-b border-slate-100 dark:border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 sticky top-0 z-10 backdrop-blur-xs">
              {bulkActions && (
                <th className="py-3.5 px-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded text-[#0050CB] focus:ring-[#0050CB] border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 cursor-pointer"
                  />
                </th>
              )}
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`py-3.5 px-4 font-black ${col.className || ''}`}
                >
                  {col.sortable && col.accessorKey ? (
                    <button
                      type="button"
                      onClick={() => handleSort(String(col.accessorKey))}
                      className="inline-flex items-center gap-1.5 hover:text-[#0050CB] dark:hover:text-white transition-colors cursor-pointer"
                    >
                      <span>{col.header}</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </button>
                  ) : (
                    <span>{col.header}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs sm:text-sm">
            {isLoading ? (
              // Loading Skeleton Rows
              Array.from({ length: pageSize > 5 ? 5 : pageSize }).map((_, rIdx) => (
                <tr key={rIdx} className="animate-pulse">
                  {bulkActions && (
                    <td className="py-4 px-4 text-center">
                      <div className="w-4 h-4 bg-slate-200 dark:bg-slate-800 rounded mx-auto" />
                    </td>
                  )}
                  {columns.map((_, cIdx) => (
                    <td key={cIdx} className="py-4 px-4">
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              // Empty State
              <tr>
                <td
                  colSpan={columns.length + (bulkActions ? 1 : 0)}
                  className="py-14 px-4 text-center"
                >
                  <div className="max-w-sm mx-auto flex flex-col items-center justify-center space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-400">
                      <Inbox className="w-7 h-7" strokeWidth={1.5} />
                    </div>
                    <h4 className="text-base font-bold text-[#000E28] dark:text-white">
                      {emptyTitle}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {emptyDescription}
                    </p>
                    {emptyAction && <div className="pt-2">{emptyAction}</div>}
                  </div>
                </td>
              </tr>
            ) : (
              // Data Rows
              paginatedData.map((row, rIdx) => {
                const rowId = keyExtractor(row);
                const isSelected = selectedIds.includes(rowId);

                return (
                  <tr
                    key={rowId || rIdx}
                    className={`transition-colors duration-150 group ${
                      isSelected
                        ? 'bg-[#E5EEFF]/60 dark:bg-[#0050CB]/15'
                        : 'hover:bg-slate-50/70 dark:hover:bg-[#0A1A3A]/50'
                    }`}
                  >
                    {bulkActions && (
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(rowId)}
                          className="w-4 h-4 rounded text-[#0050CB] focus:ring-[#0050CB] border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 cursor-pointer"
                        />
                      </td>
                    )}
                    {columns.map((col, cIdx) => (
                      <td
                        key={cIdx}
                        className={`py-3.5 px-4 text-[#000E28] dark:text-slate-200 ${
                          col.className || ''
                        }`}
                      >
                        {col.cell
                          ? col.cell(row, rIdx)
                          : col.accessorKey
                          ? String((row as any)[col.accessorKey] ?? '—')
                          : '—'}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && sortedData.length > 0 && (
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 bg-slate-50/30 dark:bg-[#07152F]">
          <div>
            Showing{' '}
            <span className="font-bold text-[#000E28] dark:text-white">
              {Math.min((currentPage - 1) * pageSize + 1, sortedData.length)}
            </span>{' '}
            to{' '}
            <span className="font-bold text-[#000E28] dark:text-white">
              {Math.min(currentPage * pageSize, sortedData.length)}
            </span>{' '}
            of{' '}
            <span className="font-bold text-[#000E28] dark:text-white">
              {sortedData.length}
            </span>{' '}
            entries
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 font-bold text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-[#000E28] dark:text-white">
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              title="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
