"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, Users, GraduationCap, DollarSign, BookOpen, 
  Calendar, Settings, FileText, CheckSquare, X, Zap, 
  PlusCircle, FilePlus, ArrowRight
} from 'lucide-react';

interface NavigationItem {
  title: string;
  category: 'Quick Actions' | 'People' | 'Academic' | 'Finance' | 'Operations' | 'Admin';
  href: string;
  icon: any;
  isQuickAction?: boolean;
}

const NAV_ITEMS: NavigationItem[] = [
  // Quick Actions
  { title: 'Add New Student', category: 'Quick Actions', href: '/dashboard/students?action=new', icon: PlusCircle, isQuickAction: true },
  { title: 'Create School Event', category: 'Quick Actions', href: '/dashboard/events?action=new', icon: Calendar, isQuickAction: true },
  { title: 'Collect Student Fee', category: 'Quick Actions', href: '/dashboard/fees?action=collect', icon: DollarSign, isQuickAction: true },
  { title: 'Create Assignment', category: 'Quick Actions', href: '/dashboard/classroom?tab=assignments', icon: FilePlus, isQuickAction: true },
  
  // Navigation
  { title: 'Student 360° Directory', category: 'People', href: '/dashboard/students', icon: GraduationCap },
  { title: 'Parents & Guardians', category: 'People', href: '/dashboard/parents', icon: Users },
  { title: 'Teacher Roster', category: 'People', href: '/dashboard/teachers', icon: Users },
  { title: 'Class & Section Roster', category: 'Academic', href: '/dashboard/classes', icon: BookOpen },
  { title: 'Academic Calendar & Routines', category: 'Academic', href: '/dashboard/calendar', icon: Calendar },
  { title: 'Fee Collection & History', category: 'Finance', href: '/dashboard/fees', icon: DollarSign },
  { title: 'Staff Payroll & Ledger', category: 'Finance', href: '/dashboard/payroll', icon: DollarSign },
  { title: 'Assessments & Examinations', category: 'Academic', href: '/dashboard/assessments', icon: FileText },
  { title: 'Attendance Engine & Reports', category: 'Operations', href: '/dashboard/attendance', icon: CheckSquare },
  { title: 'System Configurations', category: 'Admin', href: '/dashboard/settings', icon: Settings },
];

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  const filtered = query.trim() === ''
    ? NAV_ITEMS
    : NAV_ITEMS.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (!isOpen) return;

      if (e.key === 'Escape') {
        setIsOpen(false);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
      } else if (e.key === 'Enter' && filtered[selectedIndex]) {
        e.preventDefault();
        handleSelect(filtered[selectedIndex].href);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex]);

  if (!isOpen) return null;

  const handleSelect = (href: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 bg-[#07152F]/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0B1F3A] border border-slate-200/80 dark:border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#07152F]/40">
          <Search className="h-5 w-5 text-[#0757D5] dark:text-[#2F80ED] mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Search students, pages, quick actions... (Ctrl + K)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none text-sm sm:text-base font-medium"
            autoFocus
          />
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Command Items List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400 font-medium">
              <Zap className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
              No matching modules or quick actions found for "{query}".
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(item.href)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all group text-left cursor-pointer ${
                    isSelected
                      ? 'bg-[#0757D5] text-white shadow-md'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-3 truncate">
                    <div className={`p-2 rounded-lg shrink-0 transition-colors ${
                      isSelected 
                        ? 'bg-white/20 text-white' 
                        : item.isQuickAction 
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' 
                          : 'bg-[#0757D5]/10 text-[#0757D5] dark:text-[#2F80ED]'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="truncate">
                      <div className={`font-bold text-sm truncate ${isSelected ? 'text-white' : 'text-slate-900 dark:text-slate-100'}`}>
                        {item.title}
                      </div>
                      <div className={`text-xs ${isSelected ? 'text-blue-100' : 'text-slate-400 dark:text-slate-400'}`}>
                        {item.category}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-3">
                    {item.isQuickAction && !isSelected && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full">
                        Action
                      </span>
                    )}
                    <span className={`text-xs font-semibold flex items-center gap-1 ${
                      isSelected ? 'text-white' : 'text-slate-400 dark:text-slate-500'
                    }`}>
                      Open <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-[#07152F]/60 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-[10px] font-mono shadow-2xs">↑↓</kbd> Navigate</span>
            <span><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-[10px] font-mono shadow-2xs">↵</kbd> Select</span>
          </div>
          <span>Press <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-[10px] font-mono shadow-2xs">ESC</kbd> to exit</span>
        </div>
      </div>
    </div>
  );
}
