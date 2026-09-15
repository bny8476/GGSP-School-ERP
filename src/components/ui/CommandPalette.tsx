"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Users, GraduationCap, DollarSign, BookOpen, Calendar, Settings, FileText, CheckSquare, X } from 'lucide-react';

interface NavigationItem {
  title: string;
  category: string;
  href: string;
  icon: any;
}

const NAV_ITEMS: NavigationItem[] = [
  { title: 'All Students', category: 'People', href: '/dashboard/students', icon: GraduationCap },
  { title: 'Parents & Guardians', category: 'People', href: '/dashboard/parents', icon: Users },
  { title: 'Teacher Roster', category: 'People', href: '/dashboard/teachers', icon: Users },
  { title: 'Class Management', category: 'Academic', href: '/dashboard/classes', icon: BookOpen },
  { title: 'Academic Routines', category: 'Academic', href: '/dashboard/academic', icon: Calendar },
  { title: 'Fee Collection & History', category: 'Finance', href: '/dashboard/fees', icon: DollarSign },
  { title: 'Staff Payroll', category: 'Finance', href: '/dashboard/payroll', icon: DollarSign },
  { title: 'Assessments & Exams', category: 'Academic', href: '/dashboard/assessments', icon: FileText },
  { title: 'Attendance Analytics', category: 'Operations', href: '/dashboard/attendance', icon: CheckSquare },
  { title: 'System Settings', category: 'Admin', href: '/dashboard/settings', icon: Settings },
];

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = query.trim() === ''
    ? NAV_ITEMS
    : NAV_ITEMS.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );

  const handleSelect = (href: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center px-4 py-3 border-b border-slate-200 dark:border-slate-800">
          <Search className="h-5 w-5 text-slate-400 mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Type a command or search students, fees, classes... (Cmd+K)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none text-base"
            autoFocus
          />
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400 font-medium">
              No matching modules or resources found.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(item.href)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors group text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-100 text-sm">{item.title}</div>
                      <div className="text-xs text-slate-400 dark:text-slate-500">{item.category}</div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-600 uppercase tracking-wider group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    Jump to &rarr;
                  </span>
                </button>
              );
            })
          )}
        </div>

        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Global International Command Palette</span>
          <span>Press <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-[10px] font-mono">ESC</kbd> to close</span>
        </div>
      </div>
    </div>
  );
}
