"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Users,
  CalendarCheck,
  FileText,
  Calendar,
  Smile,
  CheckSquare,
  TrendingUp,
  BookMarked,
  FileSpreadsheet,
  Briefcase,
  Clock,
  Bell,
  Settings,
  Search,
  MessageSquare,
  Moon,
  Sun,
  ChevronRight,
  ChevronDown,
  LogOut,
  Plus,
  ArrowRight,
  SlidersHorizontal,
  Phone,
  User,
  CheckCircle2,
  Calendar as CalendarIcon,
  X,
  UserCheck,
  Target,
  Zap,
  ShoppingBag,
  Activity,
  MoreHorizontal,
  Menu,
  BookOpen,
  Award,
  Sparkles,
  Check,
  PanelLeftClose,
  PanelLeft,
  HelpCircle,
  Layers,
  GraduationCap,
  ClipboardList,
  BarChart3,
  Send,
  MoreVertical,
  XCircle
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import NotificationDrawer from '@/components/ui/NotificationDrawer';
import AnimatedNumber from '@/components/ui/AnimatedNumber';
import SpotlightCard from './SpotlightCard';
import TeacherCommandPalette from './TeacherCommandPalette';
import ChildProfileDrawer from './ChildProfileDrawer';
import {
  PremiumCard,
  CardHeader,
  CardTitle,
  CardDescription,
  StatCard,
  ActionCard,
  StudentCard,
  ScheduleCard,
  ProgressCard,
  ProgressRingCard,
  ActivityCard,
  HomeworkCard,
  NotificationCard,
  ParentMessageCard,
  EmptyStateCard,
} from '@/components/cards';

export type TeacherTab =
  | 'HOME'
  | 'MY CLASS'
  | 'ATTENDANCE'
  | 'CLASS WORK'
  | 'LESSON PLAN'
  | 'ACTIVITIES'
  | 'ASSESSMENT'
  | 'CHILD GROWTH'
  | 'HOMEWORK'
  | 'EXAMS & MARKS'
  | 'PARENTS'
  | 'SCHOOL WORK'
  | 'LEAVE'
  | 'NOTIFICATIONS'
  | 'MY ACCOUNT';

interface StudentCardData {
  id: string;
  rollNo: string;
  name: string;
  photo: string;
  status: 'Present' | 'Absent' | 'Late';
  age: string;
  gender: 'Male' | 'Female';
  parentLabel: string;
  parentName: string;
  phone: string;
  attendanceRate: number;
}

const mockStudentsList: StudentCardData[] = [
  {
    id: 's-01',
    rollNo: '01',
    name: 'Aarav Sharma',
    photo: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&auto=format&fit=crop&q=80',
    status: 'Present',
    age: '4 years 2 months',
    gender: 'Male',
    parentLabel: 'Father',
    parentName: 'Rohit Sharma',
    phone: '+91 98765 43210',
    attendanceRate: 94
  },
  {
    id: 's-02',
    rollNo: '02',
    name: 'Ananya Patel',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    status: 'Present',
    age: '4 years 1 month',
    gender: 'Female',
    parentLabel: 'Mother',
    parentName: 'Neha Patel',
    phone: '+91 87654 32109',
    attendanceRate: 98
  },
  {
    id: 's-03',
    rollNo: '03',
    name: 'Vivaan Gupta',
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    status: 'Present',
    age: '4 years 3 months',
    gender: 'Male',
    parentLabel: 'Father',
    parentName: 'Amit Gupta',
    phone: '+91 99887 66554',
    attendanceRate: 96
  },
  {
    id: 's-04',
    rollNo: '04',
    name: 'Diya Verma',
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    status: 'Absent',
    age: '4 years 5 months',
    gender: 'Female',
    parentLabel: 'Mother',
    parentName: 'Pooja Verma',
    phone: '+91 91234 56789',
    attendanceRate: 78
  },
  {
    id: 's-05',
    rollNo: '05',
    name: 'Kabir Mehta',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'Late',
    age: '4 years 4 months',
    gender: 'Male',
    parentLabel: 'Father',
    parentName: 'Sanjay Mehta',
    phone: '+91 98765 43211',
    attendanceRate: 85
  },
  {
    id: 's-06',
    rollNo: '06',
    name: 'Saanvi Iyer',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'Present',
    age: '4 years 6 months',
    gender: 'Female',
    parentLabel: 'Father',
    parentName: 'Rajesh Iyer',
    phone: '+91 90987 65432',
    attendanceRate: 92
  },
  {
    id: 's-07',
    rollNo: '07',
    name: 'Ishita Roy',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    status: 'Present',
    age: '4 years 3 months',
    gender: 'Female',
    parentLabel: 'Father',
    parentName: 'Anil Roy',
    phone: '+91 87654 32108',
    attendanceRate: 95
  },
  {
    id: 's-08',
    rollNo: '08',
    name: 'Rohan Singh',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'Present',
    age: '4 years 2 months',
    gender: 'Male',
    parentLabel: 'Father',
    parentName: 'Vikram Singh',
    phone: '+91 99876 54321',
    attendanceRate: 91
  },
  {
    id: 's-09',
    rollNo: '09',
    name: 'Reyansh Gupta',
    photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    status: 'Present',
    age: '4 years 5 months',
    gender: 'Male',
    parentLabel: 'Father',
    parentName: 'Sanjay Gupta',
    phone: '+91 98765 43218',
    attendanceRate: 87
  },
  {
    id: 's-10',
    rollNo: '10',
    name: 'Ishita Roy',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    status: 'Present',
    age: '4 years 1 month',
    gender: 'Female',
    parentLabel: 'Mother',
    parentName: 'Pooja Roy',
    phone: '+91 91234 56780',
    attendanceRate: 90
  }
];

const sidebarNavItems = [
  { id: 'HOME', label: 'Home', icon: Home, hasChevron: false },
  { id: 'MY CLASS', label: 'My Class', icon: Users, hasChevron: true },
  { id: 'ATTENDANCE', label: 'Attendance', icon: CalendarCheck, hasChevron: true },
  { id: 'CLASS WORK', label: 'Class Work', icon: FileText, hasChevron: true },
  { id: 'LESSON PLAN', label: 'Lesson Plan', icon: Calendar, hasChevron: true },
  { id: 'ACTIVITIES', label: 'Activities', icon: Smile, hasChevron: true },
  { id: 'ASSESSMENT', label: 'Assessment', icon: CheckSquare, hasChevron: true },
  { id: 'CHILD GROWTH', label: 'Child Growth', icon: TrendingUp, hasChevron: true },
  { id: 'HOMEWORK', label: 'Homework', icon: BookMarked, hasChevron: true },
  { id: 'EXAMS & MARKS', label: 'Exams & Marks', icon: FileSpreadsheet, hasChevron: true },
  { id: 'PARENTS', label: 'Parents', icon: Users, hasChevron: true },
  { id: 'SCHOOL WORK', label: 'School Work', icon: Briefcase, hasChevron: true },
  { id: 'LEAVE', label: 'Leave', icon: Clock, hasChevron: true },
  { id: 'NOTIFICATIONS', label: 'Notifications', icon: Bell, hasChevron: false, badge: 3 },
  { id: 'MY ACCOUNT', label: 'My Account', icon: Settings, hasChevron: true }
];

interface TeacherWorkspaceProps {
  user?: any;
  stats?: any;
  onRefresh?: () => void;
}

export default function TeacherWorkspace({ user, stats }: TeacherWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<TeacherTab>('HOME');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [childProfileDrawerOpen, setChildProfileDrawerOpen] = useState(false);
  const [selectedChildForProfile, setSelectedChildForProfile] = useState<StudentCardData | null>(null);
  const [subTab, setSubTab] = useState<'children' | 'details' | 'parents'>('children');
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState<StudentCardData[]>(mockStudentsList);
  const [selectedStudent, setSelectedStudent] = useState<StudentCardData | null>(null);

  // Attendance Screen State
  const [attendanceSubTab, setAttendanceSubTab] = useState<'MARK' | 'ABSENT' | 'LATE' | 'HISTORY'>('MARK');
  const [attendanceSearchQuery, setAttendanceSearchQuery] = useState('');
  const [attendanceStatusFilter, setAttendanceStatusFilter] = useState('ALL');

  const attendanceStudents = useMemo(() => {
    return students.filter((s) => {
      if (attendanceSubTab === 'ABSENT' && s.status !== 'Absent') return false;
      if (attendanceSubTab === 'LATE' && s.status !== 'Late') return false;
      if (attendanceStatusFilter !== 'ALL' && s.status !== attendanceStatusFilter) return false;
      if (attendanceSearchQuery.trim()) {
        const q = attendanceSearchQuery.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.rollNo.toLowerCase().includes(q) ||
          s.parentName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [students, attendanceSubTab, attendanceStatusFilter, attendanceSearchQuery]);

  const presentCount = useMemo(() => students.filter((s) => s.status === 'Present').length, [students]);
  const absentCount = useMemo(() => students.filter((s) => s.status === 'Absent').length, [students]);
  const lateCount = useMemo(() => students.filter((s) => s.status === 'Late').length, [students]);

  const handleUpdateStudentStatus = (id: string, newStatus: 'Present' | 'Absent' | 'Late') => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
    toast.success(`Updated status to ${newStatus}`, { duration: 1500 });
  };

  const handleMarkAll = (status: 'Present' | 'Absent') => {
    setStudents((prev) => prev.map((s) => ({ ...s, status })));
    toast.success(`Marked all 28 students as ${status}!`);
  };

  // Modals
  const [attendanceDrawerOpen, setAttendanceDrawerOpen] = useState(false);
  const [classWorkDrawerOpen, setClassWorkDrawerOpen] = useState(false);
  const [activityDrawerOpen, setActivityDrawerOpen] = useState(false);
  const [homeworkDrawerOpen, setHomeworkDrawerOpen] = useState(false);
  const [messageParentDrawerOpen, setMessageParentDrawerOpen] = useState(false);
  const [remarkDrawerOpen, setRemarkDrawerOpen] = useState(false);
  const [timetableModalOpen, setTimetableModalOpen] = useState(false);
  const [addChildModalOpen, setAddChildModalOpen] = useState(false);

  // New Student Form
  const [newRollNo, setNewRollNo] = useState('');
  const [newName, setNewName] = useState('');
  const [newGender, setNewGender] = useState<'Male' | 'Female'>('Male');
  const [newParentName, setNewParentName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  // Header & Theme
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    if (typeof document !== 'undefined') {
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newRollNo.trim()) return;

    const newStudent: StudentCardData = {
      id: `s-${Date.now()}`,
      rollNo: newRollNo,
      name: newName,
      photo: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&auto=format&fit=crop&q=80',
      status: 'Present',
      age: '4 years 3 months',
      gender: newGender,
      parentLabel: 'Parent',
      parentName: newParentName || 'Guardian',
      phone: newPhone || '+91 98765 00000',
      attendanceRate: 100
    };

    setStudents((prev) => [newStudent, ...prev]);
    toast.success(`Child "${newName}" enrolled in LKG - Section A successfully!`);
    setAddChildModalOpen(false);
    setNewRollNo('');
    setNewName('');
    setNewParentName('');
    setNewPhone('');
  };

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    const q = searchQuery.toLowerCase();
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.rollNo.toLowerCase().includes(q) ||
        s.parentName.toLowerCase().includes(q)
    );
  }, [students, searchQuery]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F6F8FC] dark:bg-[#0B132B] text-slate-800 dark:text-slate-100 font-saas selection:bg-blue-500 selection:text-white">
      {/* ========================================================================= */}
      {/* 1. MOBILE SIDEBAR DRAWER (ON SMALL SCREENS)                              */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="relative w-64 max-w-[82vw] h-full bg-[#0B132B] text-slate-300 flex flex-col justify-between p-4 z-10 shadow-2xl overflow-y-auto custom-scrollbar"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between px-1 pt-1">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#3157D5] to-[#6366F1] flex items-center justify-center text-white shadow-md">
                      <span className="text-lg">🎓</span>
                    </div>
                    <div className="leading-tight">
                      <span className="text-sm font-black tracking-wide text-white block">GGPS</span>
                      <span className="text-[10px] font-semibold text-[#818CF8] tracking-wider block">School ERP</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {sidebarNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id as TeacherTab);
                          setIsMobileSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white shadow-md shadow-blue-600/30 font-bold'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                          <span className="truncate">{item.label}</span>
                        </div>

                        {item.badge ? (
                          <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                            {item.badge}
                          </span>
                        ) : item.hasChevron && !isActive ? (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        ) : null}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 pb-1 text-center select-none pointer-events-none">
                <p className="font-serif italic text-slate-300 text-xs tracking-wider font-medium">
                  Better Learning<br />Brighter Future
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 2. PERMANENT DESKTOP DARK LEFT SIDEBAR (COLLAPSIBLE 260px <-> 82px)        */}
      {/* ========================================================================= */}
      <motion.aside
        animate={{ width: isSidebarCollapsed ? 82 : 260 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="hidden md:flex flex-col justify-between shrink-0 bg-[#0B132B] text-slate-300 p-3 h-screen border-r border-slate-800/80 select-none overflow-y-auto custom-scrollbar z-40"
      >
        {/* Top Branding & Collapse Button */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1 pt-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#3157D5] to-[#6366F1] flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
                <span className="text-xl">🎓</span>
              </div>
              {!isSidebarCollapsed && (
                <div className="leading-tight truncate">
                  <span className="text-base font-black tracking-wide text-white block">GGPS</span>
                  <span className="text-[11px] font-semibold text-[#818CF8] tracking-wider block">School ERP</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title={isSidebarCollapsed ? "Expand Sidebar (260px)" : "Collapse Sidebar (82px)"}
            >
              {isSidebarCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {sidebarNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as TeacherTab)}
                  title={isSidebarCollapsed ? item.label : undefined}
                  className={`w-full flex items-center ${
                    isSidebarCollapsed ? "justify-center px-0 py-2.5" : "justify-between px-3.5 py-2"
                  } rounded-xl text-xs font-semibold transition-all cursor-pointer relative group ${
                    isActive
                      ? "bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white shadow-md shadow-blue-600/30 font-bold"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className={`flex items-center ${isSidebarCollapsed ? "justify-center" : "gap-3"} min-w-0`}>
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                      }`}
                    />
                    {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {!isSidebarCollapsed && (
                    item.badge ? (
                      <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                        {item.badge}
                      </span>
                    ) : item.hasChevron && !isActive ? (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    ) : null
                  )}

                  {/* Collapsed Tooltip */}
                  {isSidebarCollapsed && (
                    <div className="absolute left-full ml-3 px-2.5 py-1 bg-[#172033] text-white text-xs font-bold rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap border border-slate-700">
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Artwork & Mini Profile */}
        <div className="pt-4 border-t border-slate-800/80">
          {!isSidebarCollapsed ? (
            <div>
              {/* Artwork */}
              <div className="relative mx-auto w-24 h-18 flex flex-col items-center justify-end select-none pointer-events-none mb-3">
                <div className="absolute top-0 right-1">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-sky-400 rotate-12">
                    <path
                      d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="absolute top-1 z-10 flex items-center justify-center">
                  <svg width="20" height="24" viewBox="0 0 24 28" fill="none">
                    <path d="M12 28V12" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M12 14C8 9 3 11 3 16C3 21 10 19 12 16" fill="#34D399" />
                    <path d="M12 11C16 6 21 8 21 13C21 18 14 16 12 13" fill="#10B981" />
                  </svg>
                </div>
                <div className="flex flex-col items-center gap-0.5 w-16">
                  <div className="w-10 h-2 rounded-xs bg-[#F59E0B]" />
                  <div className="w-12 h-2 rounded-xs bg-[#EF4444]" />
                  <div className="w-14 h-2 rounded-xs bg-[#3B82F6]" />
                  <div className="w-16 h-2 rounded-xs bg-[#10B981]" />
                </div>
              </div>
              <p className="font-serif italic text-slate-300 text-[11px] tracking-wider text-center font-medium leading-tight mb-3">
                Better Learning<br />Brighter Future
              </p>

              {/* Teacher Mini Profile */}
              <div className="p-2 rounded-2xl bg-white/5 flex items-center justify-between gap-2 border border-white/5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
                    alt="Teacher"
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-blue-400/40 shrink-0"
                  />
                  <div className="truncate leading-tight">
                    <span className="text-xs font-bold text-white block truncate">Priya Sharma</span>
                    <span className="text-[10px] text-blue-400 block truncate">LKG - Section A</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
                alt="Teacher"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/30"
                title="Priya Sharma (LKG - Section A)"
              />
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </motion.aside>

      {/* ========================================================================= */}
      {/* 3. RIGHT CONTENT PANE: TOP HEADER + MAIN CONTENT                          */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Sticky Top Header */}
        <header className="h-16 shrink-0 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between shadow-2xs z-30">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 md:hidden rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors cursor-pointer"
              title="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Navigation on Desktop */}
            <div className="hidden lg:flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-bold">GGPS</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-400 font-medium">Classroom</span>
              <span className="text-slate-300">/</span>
              <span className="font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-md">
                {activeTab}
              </span>
            </div>

            {/* Global Search Box with ⌘ K */}
            <div
              onClick={() => setIsSearchModalOpen(true)}
              className="flex items-center justify-between w-52 sm:w-80 lg:w-96 h-9 px-3 bg-slate-100/80 dark:bg-slate-800/80 rounded-xl text-xs text-slate-500 dark:text-slate-400 cursor-pointer border border-slate-200/60 dark:border-slate-700/50 hover:bg-slate-200/60 transition-colors"
            >
              <div className="flex items-center gap-2 truncate">
                <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">Search children, activities, homework, reports...</span>
              </div>
              <kbd className="hidden sm:inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 shadow-2xs shrink-0">
                ⌘ K
              </kbd>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <NotificationDrawer />
            </div>

            {/* Chat Bubble with Badge */}
            <Link
              href="/dashboard/chat"
              className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Messages"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white shadow-xs">
                2
              </span>
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title="Toggle Light/Dark Theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Teacher Profile Pill */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
                  alt="Teacher"
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/20"
                />
                <div className="text-left leading-tight hidden sm:block">
                  <span className="text-xs font-bold text-slate-800 dark:text-white block">Priya Sharma</span>
                  <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 block">LKG - Section A</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-800 dark:text-white">Priya Sharma</p>
                    <p className="text-[10px] text-slate-400">teacher@school.com</p>
                  </div>
                  <div className="py-1 text-xs font-semibold">
                    <button
                      onClick={() => {
                        setActiveTab('HOME');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <Home className="w-3.5 h-3.5" />
                      <span>Home Dashboard</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Scrollable Body */}
        <main className="flex-1 overflow-y-auto p-5 lg:p-6 space-y-6 custom-scrollbar">
          {/* ========================================================================= */}
          {/* VIEW 1: HOME WORKSPACE (EXACT MATCH TO DASHBOARD SCREENSHOT)              */}
          {/* ========================================================================= */}
          {activeTab === 'HOME' && (
            <>
              {/* HERO GREETING BANNER */}
              <div className="rounded-3xl p-6 lg:p-7 bg-gradient-to-r from-[#EBF2FF] via-[#F4EFFF] to-[#FDF8FE] dark:from-slate-800/90 dark:via-indigo-950/40 dark:to-purple-950/30 border border-blue-100/80 dark:border-slate-700/60 shadow-xs relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-2 max-w-xl">
                  <h1 className="text-2xl lg:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                    Good Morning, Priya! 👋
                  </h1>
                  <p className="text-xs lg:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    Your classroom is ready for another great day of learning.
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-2.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-slate-800/80 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 shadow-2xs">
                      <CalendarIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      Friday, 18 September 2026
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      LKG - Section A
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-xs font-bold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      <Users className="w-3.5 h-3.5" />
                      28 Children
                    </span>
                  </div>
                </div>

                <div className="hidden xl:flex flex-col items-center justify-center text-center px-4">
                  <span className="text-sm font-serif italic text-purple-700 dark:text-purple-300 leading-snug">
                    “Small steps<br />today,<br />big dreams<br />tomorrow.”
                  </span>
                  <span className="text-xs mt-1">✨ 💜</span>
                </div>

                <div className="relative shrink-0 w-full sm:w-80 h-36 rounded-2xl overflow-hidden shadow-sm border border-white/80 dark:border-slate-700">
                  <img src="/teacher-hero-desk.jpg" alt="Classroom Desk" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* 4 TOP METRIC CARDS - EXACT REFERENCE CARD DESIGN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {/* 1. Total Subjects */}
                <StatCard
                  label="Total Subjects"
                  value={10}
                  subtitle="LKG - Section A"
                  icon={Layers}
                  color="purple"
                  trend={{ text: "+2 this term", positive: true, arrow: "up-right" }}
                  footer={{
                    icon: GraduationCap,
                    label: "100% completion",
                  }}
                  onArrowClick={() => setActiveTab('MY CLASS')}
                />

                {/* 2. Present Today */}
                <StatCard
                  label="Present Today"
                  value={8}
                  subtitle="92.8% Attendance"
                  icon={CalendarIcon}
                  color="emerald"
                  badgeButton={{
                    icon: "↗",
                    onClick: () => setActiveTab('ATTENDANCE'),
                  }}
                  progressBar={{
                    percentage: 92.8,
                  }}
                  footer={{
                    icon: Users,
                    label: "On Time",
                  }}
                  onArrowClick={() => setActiveTab('ATTENDANCE')}
                />

                {/* 3. Absent Today */}
                <StatCard
                  label="Absent Today"
                  value={1}
                  subtitle="2 on medical leave"
                  icon={X}
                  color="rose"
                  badgeAction={{
                    text: "Call Parents →",
                    onClick: () => setMessageParentDrawerOpen(true),
                  }}
                  footer={{
                    icon: Phone,
                    label: "Contact Parents",
                  }}
                  onArrowClick={() => setActiveTab('ATTENDANCE')}
                />

                {/* 4. Pending Tasks */}
                <StatCard
                  label="Pending Tasks"
                  value={3}
                  subtitle="Homework review, Diary"
                  icon={Clock}
                  color="amber"
                  trend={{ text: "Priority" }}
                  footer={{
                    icon: ClipboardList,
                    label: "To Do",
                  }}
                  onArrowClick={() => setClassWorkDrawerOpen(true)}
                />
              </div>

              {/* MIDDLE ROW (3 COLUMNS) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Column 1: Today's Class Schedule with ScheduleCards */}
                <PremiumCard className="lg:col-span-4 flex flex-col justify-between">
                  <div>
                    <CardHeader>
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-[14px] bg-blue-50 dark:bg-blue-950/50 text-[#3157D5] flex items-center justify-center shrink-0">
                          <CalendarIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <CardTitle>Today&apos;s Class Schedule</CardTitle>
                          <CardDescription>Plan and milestones for today</CardDescription>
                        </div>
                      </div>
                      <button
                        onClick={() => setTimetableModalOpen(true)}
                        className="text-xs font-bold text-[#3157D5] dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        View Full →
                      </button>
                    </CardHeader>

                    <div className="pt-4 space-y-2.5">
                      <ScheduleCard
                        time="08:30 AM"
                        title="Morning Assembly & Circle Time"
                        status="Completed"
                        iconText="☀️"
                        color="emerald"
                        description="Welcome & Weather discussion"
                      />
                      <ScheduleCard
                        time="09:00 AM"
                        title="Numbers & Counting"
                        status="In Progress"
                        iconText="🔢"
                        color="blue"
                        description="1-10 counting with blocks"
                      />
                      <ScheduleCard
                        time="10:00 AM"
                        title="Drawing & Color Mixing"
                        status="Upcoming"
                        iconText="🎨"
                        color="purple"
                        description="Art Studio activity"
                      />
                      <ScheduleCard
                        time="11:00 AM"
                        title="Story Circle & English Phonics"
                        status="Upcoming"
                        iconText="🎵"
                        color="amber"
                        description="Library circle time"
                      />
                      <ScheduleCard
                        time="12:00 PM"
                        title="Lunch & Rest Period"
                        status="Upcoming"
                        iconText="🍎"
                        color="blue"
                        description="Early years dining room"
                      />
                    </div>
                  </div>
                </PremiumCard>

                {/* Column 2: Quick Actions with ActionCards */}
                <PremiumCard className="lg:col-span-4 flex flex-col justify-between">
                  <div>
                    <CardHeader>
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-[14px] bg-amber-50 dark:bg-amber-950/50 text-[#F79009] flex items-center justify-center shrink-0">
                          <Zap className="w-5 h-5" />
                        </div>
                        <div>
                          <CardTitle>Quick Actions</CardTitle>
                          <CardDescription>One-click classroom operations</CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    <div className="grid grid-cols-2 gap-2.5 pt-4">
                      <ActionCard
                        title="Mark Attendance"
                        description="Record daily roll-call"
                        icon={UserCheck}
                        color="blue"
                        onClick={() => setAttendanceDrawerOpen(true)}
                      />
                      <ActionCard
                        title="Add Class Work"
                        description="Publish daily diary"
                        icon={FileText}
                        color="blue"
                        onClick={() => setClassWorkDrawerOpen(true)}
                      />
                      <ActionCard
                        title="Create Activity"
                        description="Plan creative session"
                        icon={Smile}
                        color="purple"
                        onClick={() => setActivityDrawerOpen(true)}
                      />
                      <ActionCard
                        title="Give Homework"
                        description="Assign worksheet"
                        icon={BookMarked}
                        color="amber"
                        onClick={() => setHomeworkDrawerOpen(true)}
                      />
                      <ActionCard
                        title="Message Parents"
                        description="Send announcements"
                        icon={MessageSquare}
                        color="rose"
                        onClick={() => setMessageParentDrawerOpen(true)}
                      />
                      <ActionCard
                        title="Add Remark"
                        description="Observation notes"
                        icon={CheckSquare}
                        color="teal"
                        onClick={() => setRemarkDrawerOpen(true)}
                      />
                    </div>
                  </div>

                  <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between gap-3">
                    <span className="text-xl">🌿</span>
                    <p className="text-[11px] font-medium text-emerald-900 dark:text-emerald-200 italic leading-snug flex-1">
                      “Every child is a unique flower and together we make a beautiful garden.”
                      <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-bold not-italic mt-0.5">— Teacher</span>
                    </p>
                    <span className="text-xl">🌸</span>
                  </div>
                </PremiumCard>

                {/* Column 3: Today's Focus & Attendance Overview & Class Preview */}
                <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
                  {/* Today's Focus */}
                  <PremiumCard className="p-5 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-[#3157D5]" />
                        <h4 className="font-bold text-sm text-slate-800 dark:text-white">Today&apos;s Focus</h4>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">Fri, 18 Sep 2026</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      {[
                        { title: 'Mark Attendance', time: '09:00 AM' },
                        { title: 'Numbers & Counting', time: '09:00 AM' },
                        { title: 'Drawing Activity', time: '10:00 AM' },
                        { title: 'Story & Rhymes', time: '11:00 AM' }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-slate-700 dark:text-slate-300 py-0.5">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">✓</div>
                            <span className="font-medium">{item.title}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-semibold">{item.time}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setTimetableModalOpen(true)}
                      className="w-full py-2 bg-gradient-to-r from-[#3157D5] to-[#6366F1] hover:opacity-95 text-white rounded-xl text-xs font-bold shadow-xs text-center cursor-pointer transition-opacity"
                    >
                      View Full Timetable →
                    </button>
                  </PremiumCard>

                  {/* Attendance Overview Ring */}
                  <ProgressRingCard
                    title="Attendance Overview"
                    subtitle="Live classroom presence"
                    percentage={92}
                    label="Present"
                    detail="26 of 28 Children Present"
                    onViewDetails={() => setActiveTab('ATTENDANCE')}
                  />

                  {/* My Class Preview */}
                  <PremiumCard className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#3157D5]" /> My Class Preview
                      </span>
                      <button onClick={() => setActiveTab('MY CLASS')} className="text-[10px] font-bold text-[#3157D5] dark:text-blue-400 hover:underline cursor-pointer">
                        View All →
                      </button>
                    </div>

                    <div className="grid grid-cols-5 gap-1.5 text-center pt-1">
                      {students.slice(0, 5).map((child) => (
                        <div
                          key={child.id}
                          onClick={() => setSelectedStudent(child)}
                          className="p-1 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                        >
                          <img src={child.photo} alt={child.name} className="w-8 h-8 rounded-full object-cover mx-auto ring-1 ring-slate-200 dark:ring-slate-700" />
                          <span className="font-bold text-[10px] text-slate-800 dark:text-white block truncate mt-1">{child.name}</span>
                          <span className="text-[8px] text-slate-400 block">Roll: {child.rollNo}</span>
                          <span className={`inline-block px-1 py-0.2 rounded-sm text-[8px] font-bold mt-0.5 ${
                            child.status === 'Present' ? 'bg-emerald-50 text-emerald-600' : child.status === 'Absent' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            • {child.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </PremiumCard>
                </div>
              </div>

              {/* BOTTOM ROW (3 COLUMNS) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Recent Activity */}
                <PremiumCard className="lg:col-span-4 p-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#3157D5] flex items-center justify-center">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-800 dark:text-white leading-none">Recent Activity</h3>
                        <p className="text-[10px] text-slate-400 mt-1">Latest updates from your class</p>
                      </div>
                    </div>
                    <button className="text-[11px] font-bold text-[#3157D5] dark:text-blue-400 hover:underline cursor-pointer">View All →</button>
                  </div>
                  <div className="pt-3 space-y-3">
                    {[
                      { text: 'Attendance marked for 26 children', time: '2 hours ago', icon: '🧑‍🎓' },
                      { text: 'New activity added - Drawing Competition', time: '3 hours ago', icon: '🎨' },
                      { text: "Parent message from Aarav's parent", time: '4 hours ago', icon: '💬' },
                      { text: 'Homework submitted by Diya', time: '5 hours ago', icon: '📝' }
                    ].map((act, i) => (
                      <div key={i} className="flex items-center gap-3 text-xs">
                        <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs shrink-0">{act.icon}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-800 dark:text-slate-200 truncate">{act.text}</p>
                          <span className="text-[10px] text-slate-400">{act.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </PremiumCard>

                {/* Upcoming Exams & Marks */}
                <PremiumCard className="lg:col-span-4 p-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#3157D5] flex items-center justify-center">
                        <FileSpreadsheet className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-800 dark:text-white leading-none">Upcoming Exams & Marks</h3>
                        <p className="text-[10px] text-slate-400 mt-1">Next 7 days</p>
                      </div>
                    </div>
                    <button onClick={() => setActiveTab('EXAMS & MARKS')} className="text-[11px] font-bold text-[#3157D5] dark:text-blue-400 hover:underline cursor-pointer">View All →</button>
                  </div>
                  <div className="pt-3 space-y-3">
                    {[
                      { date: '22', month: 'SEP', title: 'Mid Term Assessment', sub: 'LKG-A • English' },
                      { date: '25', month: 'SEP', title: 'Maths Test', sub: 'LKG-A • Numbers' },
                      { date: '28', month: 'SEP', title: 'Oral Assessment', sub: 'LKG-A • Speaking' }
                    ].map((ex, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 flex flex-col items-center justify-center font-bold leading-tight">
                            <span className="text-xs">{ex.date}</span>
                            <span className="text-[8px] uppercase">{ex.month}</span>
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 dark:text-white block">{ex.title}</span>
                            <span className="text-[10px] text-slate-400">{ex.sub}</span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold">Upcoming</span>
                      </div>
                    ))}
                  </div>
                </PremiumCard>

                {/* Quick Stats + Inspire Card */}
                <div className="lg:col-span-4 space-y-4">
                  <PremiumCard className="p-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-[#3157D5]" />
                        <div>
                          <h3 className="font-bold text-xs text-slate-800 dark:text-white leading-none">Quick Stats</h3>
                          <p className="text-[9px] text-slate-400">This Month</p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 pt-2 text-center">
                      <div>
                        <span className="text-sm font-black text-slate-800 dark:text-white block">98%</span>
                        <span className="text-[9px] text-slate-400 block">Attendance</span>
                        <span className="text-[9px] font-bold text-emerald-600">↑ 2%</span>
                      </div>
                      <div>
                        <span className="text-sm font-black text-slate-800 dark:text-white block">12</span>
                        <span className="text-[9px] text-slate-400 block">Activities</span>
                        <span className="text-[9px] font-bold text-purple-600">↑ 4</span>
                      </div>
                      <div>
                        <span className="text-sm font-black text-slate-800 dark:text-white block">8</span>
                        <span className="text-[9px] text-slate-400 block">Homework</span>
                        <span className="text-[9px] font-bold text-blue-600">↑ 2</span>
                      </div>
                      <div>
                        <span className="text-sm font-black text-slate-800 dark:text-white block">5</span>
                        <span className="text-[9px] text-slate-400 block">Messages</span>
                        <span className="text-[9px] font-bold text-amber-600">↑ 3</span>
                      </div>
                    </div>
                  </PremiumCard>

                  <div className="rounded-[20px] overflow-hidden border border-purple-100 dark:border-slate-800 shadow-xs relative h-28">
                    <img src="/inspire-grow-art.jpg" alt="Inspire Encourage Grow" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 via-transparent to-transparent flex items-end p-3 pointer-events-none">
                      <p className="font-serif italic text-white text-xs font-bold drop-shadow">Inspire • Encourage • Grow</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ========================================================================= */}
          {/* VIEW 2: MY CLASS WORKSPACE (EXACT MATCH TO "MY AMAZING CLASS" SCREENSHOT)  */}
          {/* ========================================================================= */}
          {activeTab === 'MY CLASS' && (
            <div className="space-y-6">
              {/* HERO: "My Amazing Class 💜" + Class Overview */}
              <div className="rounded-3xl p-6 lg:p-7 bg-gradient-to-r from-[#EBF2FF] via-[#F3EFFF] to-[#FDF8FE] dark:from-slate-800/90 dark:via-indigo-950/40 dark:to-purple-950/30 border border-blue-100/80 dark:border-slate-700/60 shadow-xs relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-2 max-w-xl">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-100/70 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-bold">
                    <Users className="w-3.5 h-3.5" />
                    <span>My Class</span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-800 dark:text-white tracking-tight">
                    My Amazing <span className="text-[#6366F1]">Class</span> 💜
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                    Little learners, big dreams, brighter future.
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-2.5">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800/80 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 shadow-2xs">
                      <span className="text-blue-600">🏷️</span> LKG - Section A
                    </span>
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800/80 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 shadow-2xs">
                      <User className="w-3.5 h-3.5 text-blue-600" />
                      Priya Sharma <span className="text-slate-400 font-normal">Class Teacher</span>
                    </span>
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800/80 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 shadow-2xs">
                      <Users className="w-3.5 h-3.5 text-blue-600" />
                      28 Children <span className="text-slate-400 font-normal">Total Students</span>
                    </span>
                  </div>
                </div>

                <div className="hidden xl:flex flex-col items-center justify-center text-center px-4">
                  <span className="text-sm font-serif italic text-purple-700 dark:text-purple-300 leading-snug">
                    Small<br />Steps<br />✨ Big<br />Dreams
                  </span>
                  <span className="text-sm mt-1">💜</span>
                </div>

                <div className="relative shrink-0 w-44 lg:w-56 h-36 rounded-2xl overflow-hidden shadow-xs border border-white/80 dark:border-slate-700 hidden sm:block">
                  <img src="/teacher-hero-desk.jpg" alt="Classroom Desk" className="w-full h-full object-cover" />
                </div>

                {/* Class Overview Card */}
                <div className="bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700 shadow-xs w-full lg:w-72 space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-xs text-slate-800 dark:text-white">Class Overview</span>
                    </div>
                    <button onClick={() => setActiveTab('ATTENDANCE')} className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer">
                      View All
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="p-2 rounded-xl bg-blue-50/60 dark:bg-blue-950/30">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-1">
                        <Users className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm font-black text-slate-800 dark:text-white block">28</span>
                      <span className="text-[9px] text-slate-400 font-medium">Total</span>
                    </div>

                    <div className="p-2 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm font-black text-slate-800 dark:text-white block">26</span>
                      <span className="text-[9px] text-slate-400 font-medium">Present</span>
                    </div>

                    <div className="p-2 rounded-xl bg-rose-50/60 dark:bg-rose-950/30">
                      <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-1">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm font-black text-slate-800 dark:text-white block">1</span>
                      <span className="text-[9px] text-slate-400 font-medium">Absent</span>
                    </div>

                    <div className="p-2 rounded-xl bg-amber-50/60 dark:bg-amber-950/30">
                      <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-1">
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm font-black text-slate-800 dark:text-white block">1</span>
                      <span className="text-[9px] text-slate-400 font-medium">Late</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub-Nav Toolbar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-6 border-b sm:border-b-0 border-slate-200 dark:border-slate-800 w-full sm:w-auto">
                  <button
                    onClick={() => setSubTab('children')}
                    className={`flex items-center gap-2 pb-2 text-xs font-bold transition-all cursor-pointer ${
                      subTab === 'children'
                        ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>Children</span>
                  </button>

                  <button
                    onClick={() => setSubTab('details')}
                    className={`flex items-center gap-2 pb-2 text-xs font-bold transition-all cursor-pointer ${
                      subTab === 'details'
                        ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>Child Details</span>
                  </button>

                  <button
                    onClick={() => setSubTab('parents')}
                    className={`flex items-center gap-2 pb-2 text-xs font-bold transition-all cursor-pointer ${
                      subTab === 'parents'
                        ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>Parent Details</span>
                  </button>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-72">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name, roll number..."
                      className="w-full pl-9 pr-3 py-2 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <button className="p-2 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors cursor-pointer">
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setAddChildModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Child</span>
                  </button>
                </div>
              </div>

              {/* Student Cards Grid (Matching Reference Design) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStudents.map((child, idx) => (
                  <StudentCard
                    key={child.id}
                    id={child.id}
                    rollNo={child.rollNo}
                    name={child.name}
                    photo={child.photo}
                    status={child.status as any}
                    age={child.age}
                    gender={child.gender}
                    parentLabel={child.parentLabel}
                    parentName={child.parentName}
                    phone={child.phone}
                    attendanceRate={child.attendanceRate}
                    theme={idx % 2 === 0 ? "rose" : "blue"}
                    onViewProfile={() => setSelectedStudent(child)}
                    onMenuClick={() => toast.success(`Options for ${child.name}`)}
                  />
                ))}
              </div>

              {/* Pagination Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200/80 dark:border-slate-800 text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  Showing {filteredStudents.length} of 28 children
                </span>

                <div className="flex items-center gap-1.5">
                  <button className="w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111827] text-slate-600 font-bold flex items-center justify-center hover:bg-slate-50 cursor-pointer">‹</button>
                  <button className="w-8 h-8 rounded-xl bg-[#2563EB] text-white font-black flex items-center justify-center shadow-xs">1</button>
                  <button className="w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111827] text-slate-600 font-bold flex items-center justify-center hover:bg-slate-50 cursor-pointer">2</button>
                  <button className="w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111827] text-slate-600 font-bold flex items-center justify-center hover:bg-slate-50 cursor-pointer">3</button>
                  <button className="w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111827] text-slate-600 font-bold flex items-center justify-center hover:bg-slate-50 cursor-pointer">›</button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <span>Per page:</span>
                    <select className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 font-bold text-slate-700">
                      <option>10</option>
                      <option>20</option>
                      <option>28</option>
                    </select>
                  </div>
                  <div className="hidden md:flex items-center gap-1 text-purple-600 dark:text-purple-400 font-serif italic text-xs">
                    <span>Together We Grow</span>
                    <span>💜</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 3: ATTENDANCE REGISTER (EXACT SCREENSHOT DESIGN)                     */}
          {/* ========================================================================= */}
          {activeTab === 'ATTENDANCE' && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              {/* --------------------------------------------------------------------- */}
              {/* LEFT COLUMN: HERO BANNER, CONTROLS, ROLL-CALL TABLE, PAGINATION       */}
              {/* --------------------------------------------------------------------- */}
              <div className="xl:col-span-8 space-y-5">
                {/* 1. Top Hero Banner */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#DBEAFE] via-[#EDE9FE] to-[#FCE7F3] dark:from-slate-900 dark:via-indigo-950/40 dark:to-purple-950/40 border border-blue-200/70 dark:border-slate-800 p-6 shadow-xs">
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="max-w-md">
                      {/* Attendance Pill Badge */}
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/85 dark:bg-slate-800/85 backdrop-blur-xs border border-blue-200/50 text-[#0050CB] dark:text-blue-400 text-xs font-semibold mb-2.5 shadow-xs">
                        <Calendar className="w-3.5 h-3.5 text-[#0050CB] dark:text-blue-400" />
                        <span>Attendance</span>
                      </div>

                      {/* Heading */}
                      <h1 className="text-2xl sm:text-3xl font-black text-[#000E28] dark:text-white tracking-tight flex items-baseline gap-2 flex-wrap">
                        <span>Class Roll-Call</span>
                        <span className="font-serif italic font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600">Register</span>
                      </h1>

                      {/* Subtitle */}
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">
                        Mark attendance, track presence and keep your classroom connected.
                      </p>

                      {/* Metadata Badges */}
                      <div className="flex flex-wrap items-center gap-2 mt-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-slate-800/90 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-xs border border-slate-200/70 dark:border-slate-700">
                          <Calendar className="w-3.5 h-3.5 text-[#0050CB]" />
                          <span>Friday, 18 September 2026</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-slate-800/90 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-xs border border-slate-200/70 dark:border-slate-700">
                          <GraduationCap className="w-3.5 h-3.5 text-[#0050CB]" />
                          <span>LKG - Section A</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-slate-800/90 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-xs border border-slate-200/70 dark:border-slate-700">
                          <Users className="w-3.5 h-3.5 text-[#0050CB]" />
                          <span>28 Children</span>
                        </span>
                      </div>
                    </div>

                    {/* Right Artwork & Quote */}
                    <div className="relative flex items-center justify-end pr-2 select-none pointer-events-none">
                      <div className="flex items-center gap-4">
                        <div className="relative flex items-end gap-2">
                          {/* Sprout plant in mug */}
                          <div className="flex flex-col items-center">
                            <svg width="34" height="42" viewBox="0 0 34 42" fill="none">
                              <path d="M17 38V18" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
                              <path d="M17 24C11 18 5 21 5 27C5 33 14 31 17 27" fill="#34D399" />
                              <path d="M17 19C23 13 29 16 29 22C29 28 20 26 17 22" fill="#10B981" />
                              <rect x="9" y="34" width="16" height="8" rx="2" fill="#3B82F6" opacity="0.8" />
                            </svg>
                          </div>
                          {/* Pencil Pot */}
                          <div className="flex flex-col items-center">
                            <div className="flex items-end gap-0.5 mb-0.5">
                              <div className="w-1.5 h-7 bg-amber-400 rounded-t-xs" />
                              <div className="w-1.5 h-9 bg-rose-500 rounded-t-xs" />
                              <div className="w-1.5 h-8 bg-blue-500 rounded-t-xs" />
                              <div className="w-1.5 h-6 bg-emerald-400 rounded-t-xs" />
                              <div className="w-1.5 h-8 bg-purple-500 rounded-t-xs" />
                            </div>
                            <div className="w-9 h-7 rounded-sm bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xs" />
                          </div>
                          {/* Stacked books */}
                          <div className="flex flex-col items-center gap-0.5">
                            <div className="w-12 h-2.5 rounded-xs bg-[#3B82F6] shadow-xs" />
                            <div className="w-14 h-3 rounded-xs bg-[#10B981] shadow-xs" />
                          </div>
                        </div>

                        {/* Calligraphy Quote: Small steps Big dreams ♡ */}
                        <div className="text-right leading-tight pr-2">
                          <div className="font-serif italic text-base text-indigo-900/90 dark:text-indigo-200 font-semibold tracking-wide">
                            Small steps
                          </div>
                          <div className="font-serif italic text-xl text-indigo-950 dark:text-white font-black tracking-wider flex items-center justify-end gap-1">
                            <span>Big dreams</span>
                            <span className="text-rose-500 text-sm">♡</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Mode Pills & Date Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  {/* Left Pill Navigation */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                    <button
                      onClick={() => setAttendanceSubTab('MARK')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                        attendanceSubTab === 'MARK'
                          ? 'bg-[#0050CB] text-white shadow-md shadow-blue-500/20'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark Attendance</span>
                    </button>
                    <button
                      onClick={() => setAttendanceSubTab('ABSENT')}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                        attendanceSubTab === 'ABSENT'
                          ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Absent</span>
                      {absentCount > 0 && (
                        <span className="ml-1 px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
                          {absentCount}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => setAttendanceSubTab('LATE')}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                        attendanceSubTab === 'LATE'
                          ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Late</span>
                      {lateCount > 0 && (
                        <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold">
                          {lateCount}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => setAttendanceSubTab('HISTORY')}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                        attendanceSubTab === 'HISTORY'
                          ? 'bg-slate-800 text-white'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>History</span>
                    </button>
                  </div>

                  {/* Right: Date Selector & Bulk Action */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2 hover:bg-slate-50 shadow-xs cursor-pointer">
                      <Calendar className="w-3.5 h-3.5 text-[#0050CB]" />
                      <span>Friday, 18 Sep 2026</span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </button>
                    <button
                      onClick={() => handleMarkAll('Present')}
                      className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 shadow-xs cursor-pointer"
                    >
                      Bulk Action
                    </button>
                  </div>
                </div>

                {/* 3. Search & Filter Bar */}
                <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shadow-xs">
                  {/* Search Input */}
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={attendanceSearchQuery}
                      onChange={(e) => setAttendanceSearchQuery(e.target.value)}
                      placeholder="Search child by name or roll number..."
                      className="w-full pl-9.5 pr-4 py-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs border border-transparent focus:border-blue-500 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>

                  {/* Status Dropdown */}
                  <div className="relative">
                    <select
                      value={attendanceStatusFilter}
                      onChange={(e) => setAttendanceStatusFilter(e.target.value)}
                      className="appearance-none pl-3 pr-8 py-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 border border-transparent focus:border-blue-500 focus:outline-none cursor-pointer"
                    >
                      <option value="ALL">All Status</option>
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                      <option value="Late">Late</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* Sections Dropdown */}
                  <div className="relative">
                    <select className="appearance-none pl-3 pr-8 py-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 border border-transparent focus:border-blue-500 focus:outline-none cursor-pointer">
                      <option>All Sections</option>
                      <option>Section A</option>
                      <option>Section B</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* Filter Action Button */}
                  <button className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700 transition-colors cursor-pointer self-end sm:self-auto">
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>
                </div>

                {/* 4. Roll-Call Table */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50/80 dark:bg-slate-800/40 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800">
                        <tr>
                          <th className="px-4 py-3.5 w-10 text-center">
                            <input
                              type="checkbox"
                              className="rounded-xs border-slate-300 text-[#0050CB] focus:ring-0 cursor-pointer"
                            />
                          </th>
                          <th className="px-3 py-3.5 w-12 text-slate-500">#</th>
                          <th className="px-4 py-3.5 text-slate-600 dark:text-slate-300">Child Details</th>
                          <th className="px-4 py-3.5 text-slate-600 dark:text-slate-300">Parent Contact</th>
                          <th className="px-4 py-3.5 text-center text-slate-600 dark:text-slate-300">Present</th>
                          <th className="px-4 py-3.5 text-center text-slate-600 dark:text-slate-300">Absent</th>
                          <th className="px-4 py-3.5 text-center text-slate-600 dark:text-slate-300">Late</th>
                          <th className="px-4 py-3.5 text-center text-slate-600 dark:text-slate-300">Status</th>
                          <th className="px-4 py-3.5 text-center text-slate-600 dark:text-slate-300">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                        {attendanceStudents.slice(0, 8).map((c) => (
                          <tr
                            key={c.id}
                            className="hover:bg-blue-50/30 dark:hover:bg-slate-800/40 transition-colors group"
                          >
                            {/* Checkbox */}
                            <td className="px-4 py-3 text-center">
                              <input
                                type="checkbox"
                                className="rounded-xs border-slate-300 text-[#0050CB] focus:ring-0 cursor-pointer"
                              />
                            </td>

                            {/* Roll Number Index */}
                            <td className="px-3 py-3 font-semibold text-slate-400 dark:text-slate-500 text-xs">
                              {c.rollNo}
                            </td>

                            {/* Child Details */}
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={c.photo}
                                  alt={c.name}
                                  className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/15"
                                />
                                <div>
                                  <span className="font-bold text-slate-800 dark:text-white block text-xs group-hover:text-[#0050CB] transition-colors">
                                    {c.name}
                                  </span>
                                  <span className="text-[11px] text-slate-400 font-medium">
                                    Roll No: {c.rollNo}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Parent Contact */}
                            <td className="px-4 py-3">
                              <div className="text-xs">
                                <span className="text-slate-700 dark:text-slate-300 font-semibold block">
                                  {c.parentName}
                                </span>
                                <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                  <Phone className="w-2.5 h-2.5 text-slate-400" />
                                  <span>{c.phone}</span>
                                </span>
                              </div>
                            </td>

                            {/* PRESENT RADIO */}
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => handleUpdateStudentStatus(c.id, 'Present')}
                                className="inline-flex items-center justify-center p-1 cursor-pointer group/btn"
                                title="Mark Present"
                              >
                                {c.status === 'Present' ? (
                                  <div className="w-5 h-5 rounded-full border-2 border-emerald-500 flex items-center justify-center bg-white dark:bg-slate-900 transition-transform active:scale-90">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                  </div>
                                ) : (
                                  <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 hover:border-emerald-400 transition-colors" />
                                )}
                              </button>
                            </td>

                            {/* ABSENT RADIO */}
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => handleUpdateStudentStatus(c.id, 'Absent')}
                                className="inline-flex items-center justify-center p-1 cursor-pointer group/btn"
                                title="Mark Absent"
                              >
                                {c.status === 'Absent' ? (
                                  <div className="w-5 h-5 rounded-full border-2 border-rose-500 flex items-center justify-center bg-white dark:bg-slate-900 transition-transform active:scale-90">
                                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                                  </div>
                                ) : (
                                  <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 hover:border-rose-400 transition-colors" />
                                )}
                              </button>
                            </td>

                            {/* LATE RADIO */}
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => handleUpdateStudentStatus(c.id, 'Late')}
                                className="inline-flex items-center justify-center p-1 cursor-pointer group/btn"
                                title="Mark Late"
                              >
                                {c.status === 'Late' ? (
                                  <div className="w-5 h-5 rounded-full border-2 border-amber-500 flex items-center justify-center bg-white dark:bg-slate-900 transition-transform active:scale-90">
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                  </div>
                                ) : (
                                  <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 hover:border-amber-400 transition-colors" />
                                )}
                              </button>
                            </td>

                            {/* STATUS BADGE */}
                            <td className="px-4 py-3 text-center">
                              <span
                                className={`inline-block min-w-[72px] px-3 py-1 rounded-full text-[11px] font-bold border text-center ${
                                  c.status === 'Present'
                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800'
                                    : c.status === 'Absent'
                                    ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/40 dark:border-rose-800'
                                    : 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800'
                                }`}
                              >
                                {c.status}
                              </span>
                            </td>

                            {/* ACTION BUTTON */}
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => setSelectedStudent(c)}
                                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                                title="Actions"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 5. Pagination Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 text-xs text-slate-500">
                  <span>
                    Showing 1 to {Math.min(8, attendanceStudents.length)} of 28 children
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 flex items-center justify-center cursor-pointer transition-colors text-xs">
                      ‹
                    </button>
                    <button className="w-7 h-7 rounded-lg bg-[#0050CB] text-white font-bold flex items-center justify-center cursor-pointer shadow-xs text-xs">
                      1
                    </button>
                    <button className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 flex items-center justify-center cursor-pointer transition-colors text-xs">
                      2
                    </button>
                    <button className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 flex items-center justify-center cursor-pointer transition-colors text-xs">
                      3
                    </button>
                    <button className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 flex items-center justify-center cursor-pointer transition-colors text-xs">
                      ›
                    </button>
                  </div>
                </div>
              </div>

              {/* --------------------------------------------------------------------- */}
              {/* RIGHT COLUMN: TODAY'S ATTENDANCE, QUICK ACTIONS, OVERVIEW, QUOTE      */}
              {/* --------------------------------------------------------------------- */}
              <div className="xl:col-span-4 space-y-5">
                {/* WIDGET 1: Today's Attendance Radial Ring */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-[#0050CB]">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-slate-800 dark:text-white text-sm">
                        Today's Attendance
                      </h3>
                    </div>
                    <button className="w-7 h-7 rounded-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Radial Gauge & Legend */}
                  <div className="flex items-center justify-between gap-4 py-2">
                    {/* SVG Circular Ring Gauge */}
                    <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                        {/* Background track circle */}
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          stroke="currentColor"
                          strokeWidth="9"
                          fill="transparent"
                          className="text-slate-100 dark:text-slate-800"
                        />
                        {/* Active emerald progress circle */}
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          stroke="#10B981"
                          strokeWidth="9"
                          strokeDasharray={314.16}
                          strokeDashoffset={314.16 * (1 - (presentCount / 28))}
                          strokeLinecap="round"
                          fill="transparent"
                          className="transition-all duration-700 ease-out"
                        />
                      </svg>
                      {/* Center Gauge Text */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-xl font-extrabold text-slate-800 dark:text-white leading-none">
                          {presentCount}/28
                        </span>
                        <span className="text-[11px] font-medium text-slate-400 mt-0.5">
                          Present
                        </span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                          {Math.round((presentCount / 28) * 100)}%
                        </span>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="space-y-3 flex-1 pr-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                          <span className="font-semibold text-slate-600 dark:text-slate-300">Present</span>
                        </div>
                        <span className="font-extrabold text-slate-800 dark:text-white">{presentCount}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                          <span className="font-semibold text-slate-600 dark:text-slate-300">Absent</span>
                        </div>
                        <span className="font-extrabold text-slate-800 dark:text-white">{absentCount}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                          <span className="font-semibold text-slate-600 dark:text-slate-300">Late</span>
                        </div>
                        <span className="font-extrabold text-slate-800 dark:text-white">{lateCount}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* WIDGET 2: Quick Actions (6 Action Tiles) */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
                  {/* Header */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-[#0050CB]">
                        <Zap className="w-3.5 h-3.5" />
                      </div>
                      <h3 className="font-bold text-slate-800 dark:text-white text-sm">
                        Quick Actions
                      </h3>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 pl-8">
                      One click tools for attendance
                    </p>
                  </div>

                  {/* 2x3 Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Mark All Present */}
                    <button
                      onClick={() => handleMarkAll('Present')}
                      className="p-3 rounded-xl bg-emerald-50/60 hover:bg-emerald-50 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 text-left transition-all cursor-pointer group flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 leading-tight">
                          Mark All Present
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-emerald-500 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </button>

                    {/* Mark All Absent */}
                    <button
                      onClick={() => handleMarkAll('Absent')}
                      className="p-3 rounded-xl bg-rose-50/60 hover:bg-rose-50 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 border border-rose-200/60 dark:border-rose-800/60 text-left transition-all cursor-pointer group flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0">
                          <X className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 leading-tight">
                          Mark All Absent
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-rose-500 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </button>

                    {/* Mark Late */}
                    <button
                      onClick={() => {
                        setStudents((prev) => prev.map((s, i) => (i === 4 ? { ...s, status: 'Late' } : s)));
                        toast.success('Updated late arrivals');
                      }}
                      className="p-3 rounded-xl bg-amber-50/60 hover:bg-amber-50 dark:bg-amber-950/20 dark:hover:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60 text-left transition-all cursor-pointer group flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
                          <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
                        </div>
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 leading-tight">
                          Mark Late
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-amber-500 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </button>

                    {/* Send Report to Parents */}
                    <button
                      onClick={() => setMessageParentDrawerOpen(true)}
                      className="p-3 rounded-xl bg-blue-50/60 hover:bg-blue-50 dark:bg-blue-950/20 dark:hover:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/60 text-left transition-all cursor-pointer group flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-[#0050CB] text-white flex items-center justify-center shrink-0">
                          <Send className="w-3 h-3" />
                        </div>
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 leading-tight">
                          Send Report to Parents
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[#0050CB] opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </button>

                    {/* View Attendance Report */}
                    <button
                      onClick={() => toast('Exporting Daily Roll-Call report...', { icon: '📊' })}
                      className="p-3 rounded-xl bg-indigo-50/60 hover:bg-indigo-50 dark:bg-indigo-950/20 dark:hover:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 text-left transition-all cursor-pointer group flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                          <BarChart3 className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 leading-tight">
                          View Attendance Report
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-indigo-600 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </button>

                    {/* Add Remark */}
                    <button
                      onClick={() => setRemarkDrawerOpen(true)}
                      className="p-3 rounded-xl bg-purple-50/60 hover:bg-purple-50 dark:bg-purple-950/20 dark:hover:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/60 text-left transition-all cursor-pointer group flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                          <ClipboardList className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 leading-tight">
                          Add Remark
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-purple-600 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  </div>
                </div>

                {/* WIDGET 3: Attendance Overview (Last 7 Days Bar Chart) */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-[#0050CB]">
                        <Calendar className="w-3.5 h-3.5" />
                      </div>
                      <h3 className="font-bold text-slate-800 dark:text-white text-sm">
                        Attendance Overview
                      </h3>
                    </div>
                    <button className="text-[11px] font-bold text-slate-500 hover:text-[#0050CB] flex items-center gap-1 cursor-pointer">
                      <span>Last 7 Days</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* 7-Bar Chart with Y-Axis */}
                  <div className="flex items-end gap-2 pt-2">
                    {/* Y-axis Ticks */}
                    <div className="flex flex-col justify-between h-28 text-[9px] font-bold text-slate-400 pb-5 pr-1">
                      <span>28</span>
                      <span>20</span>
                      <span>10</span>
                      <span>0</span>
                    </div>

                    {/* 7 Bars */}
                    <div className="flex-1 grid grid-cols-7 gap-2 items-end h-28 pb-5 border-b border-slate-100 dark:border-slate-800">
                      {/* Mon: 24 (Lavender/Purple) */}
                      <div className="flex flex-col items-center h-full justify-end group">
                        <div
                          style={{ height: '72%' }}
                          className="w-full max-w-[18px] bg-[#A78BFA] rounded-t-sm group-hover:opacity-80 transition-opacity"
                          title="Mon: 24 Present"
                        />
                      </div>
                      {/* Tue: 25 (Indigo/Blue) */}
                      <div className="flex flex-col items-center h-full justify-end group">
                        <div
                          style={{ height: '78%' }}
                          className="w-full max-w-[18px] bg-[#818CF8] rounded-t-sm group-hover:opacity-80 transition-opacity"
                          title="Tue: 25 Present"
                        />
                      </div>
                      {/* Wed: 27 (Pink/Magenta) */}
                      <div className="flex flex-col items-center h-full justify-end group">
                        <div
                          style={{ height: '88%' }}
                          className="w-full max-w-[18px] bg-[#F472B6] rounded-t-sm group-hover:opacity-80 transition-opacity"
                          title="Wed: 27 Present"
                        />
                      </div>
                      {/* Thu: 26 (Sky Blue) */}
                      <div className="flex flex-col items-center h-full justify-end group">
                        <div
                          style={{ height: '82%' }}
                          className="w-full max-w-[18px] bg-[#38BDF8] rounded-t-sm group-hover:opacity-80 transition-opacity"
                          title="Thu: 26 Present"
                        />
                      </div>
                      {/* Fri: 28 (Mint/Teal) */}
                      <div className="flex flex-col items-center h-full justify-end group">
                        <div
                          style={{ height: '94%' }}
                          className="w-full max-w-[18px] bg-[#34D399] rounded-t-sm group-hover:opacity-80 transition-opacity"
                          title="Fri: 28 Present"
                        />
                      </div>
                      {/* Sat: 23 (Green) */}
                      <div className="flex flex-col items-center h-full justify-end group">
                        <div
                          style={{ height: '68%' }}
                          className="w-full max-w-[18px] bg-[#4ADE80] rounded-t-sm group-hover:opacity-80 transition-opacity"
                          title="Sat: 23 Present"
                        />
                      </div>
                      {/* Sun: 26 (Amber) */}
                      <div className="flex flex-col items-center h-full justify-end group">
                        <div
                          style={{ height: '82%' }}
                          className="w-full max-w-[18px] bg-[#FBBF24] rounded-t-sm group-hover:opacity-80 transition-opacity"
                          title="Sun: 26 Present"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Days of week labels */}
                  <div className="grid grid-cols-7 gap-2 pl-6 text-center text-[10px] font-semibold text-slate-400 -mt-3.5">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </div>

                {/* WIDGET 4: Motivational Calligraphy Quote Card */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50/90 via-indigo-50/60 to-purple-50/80 dark:from-slate-900 dark:via-indigo-950/30 dark:to-slate-900 border border-blue-100 dark:border-slate-800 p-4 shadow-xs">
                  <div className="flex items-center gap-4">
                    {/* Art sprout & books */}
                    <div className="relative flex items-end gap-1 shrink-0 select-none pointer-events-none">
                      <div className="flex flex-col items-center">
                        <svg width="28" height="34" viewBox="0 0 34 42" fill="none">
                          <path d="M17 38V18" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
                          <path d="M17 24C11 18 5 21 5 27C5 33 14 31 17 27" fill="#34D399" />
                          <path d="M17 19C23 13 29 16 29 22C29 28 20 26 17 22" fill="#10B981" />
                        </svg>
                        <div className="flex flex-col items-center gap-0.5">
                          <div className="w-8 h-2 rounded-xs bg-[#3B82F6]" />
                          <div className="w-10 h-2.5 rounded-xs bg-[#10B981]" />
                        </div>
                      </div>
                    </div>

                    {/* Calligraphy text */}
                    <div className="leading-snug">
                      <p className="font-serif italic text-xs text-indigo-900/80 dark:text-indigo-200 font-medium">
                        Attendance builds habits,
                      </p>
                      <p className="font-serif italic text-sm text-indigo-950 dark:text-white font-black tracking-wide flex items-center gap-1">
                        <span>habits build success</span>
                        <span className="text-rose-500 text-xs">♡</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 4: CLASS WORK & DAILY DIARY                                          */}
          {/* ========================================================================= */}
          {activeTab === 'CLASS WORK' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-slate-800 dark:text-white">Daily Class Work & Diary</h2>
                  <p className="text-xs text-slate-500">Class: LKG - Section A • Friday, 18 September 2026</p>
                </div>
                <button
                  onClick={() => setClassWorkDrawerOpen(true)}
                  className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Class Work</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  {
                    subject: 'English & Phonics',
                    topic: 'Alphabet Tracing: Letters A, B, C & Phonic Sounds',
                    time: '09:00 AM - 09:45 AM',
                    status: 'Completed',
                    notes: 'Children practiced phonics sounds /æ/, /b/, /k/ with flash cards. Traced uppercase letters in practice books.',
                    color: 'blue'
                  },
                  {
                    subject: 'Early Mathematics',
                    topic: 'Numbers & Counting: 1 to 10 with Color Beads',
                    time: '10:00 AM - 10:45 AM',
                    status: 'In Progress',
                    notes: 'Counting real objects and beads. Associating quantity with numeric symbols 1-5.',
                    color: 'emerald'
                  },
                  {
                    subject: 'Art & Fine Motor Skills',
                    topic: 'Finger Painting & Color Mixing (Red + Yellow = Orange)',
                    time: '11:15 AM - 12:00 PM',
                    status: 'Upcoming',
                    notes: 'Sensory finger painting on chart paper. Enhances grip strength and hand-eye coordination.',
                    color: 'purple'
                  },
                  {
                    subject: 'Rhymes & Storytelling',
                    topic: 'The Lion and the Mouse & Action Rhymes',
                    time: '12:30 PM - 01:15 PM',
                    status: 'Upcoming',
                    notes: 'Interactive puppet storytelling and singing action rhymes with movements.',
                    color: 'amber'
                  }
                ].map((item, i) => (
                  <PremiumCard key={i} variant="interactive" accentColor={item.color as any}>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-xl border border-blue-200/50">
                          {item.subject}
                        </span>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          item.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30'
                            : item.status === 'In Progress'
                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/30'
                            : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                        }`}>
                          • {item.status}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-slate-800 dark:text-white">{item.topic}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.notes}</p>
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1.5 font-medium"><Clock className="w-3.5 h-3.5 text-blue-500" /> {item.time}</span>
                        <button
                          onClick={() => setRemarkDrawerOpen(true)}
                          className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <span>Add Observation</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </PremiumCard>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 5: LESSON PLAN                                                       */}
          {/* ========================================================================= */}
          {activeTab === 'LESSON PLAN' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-slate-800 dark:text-white">Weekly Teaching Plan</h2>
                  <p className="text-xs text-slate-500">LKG - Section A • Week 3 (September 2026)</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                    Syllabus On Track (78%)
                  </span>
                </div>
              </div>

              {/* Syllabus Progress Card */}
              <ProgressCard
                title="Academic Term 1 Syllabus Coverage"
                subtitle="Kindergarten Curriculum 2026-2027 • 4 of 5 Units Completed"
                items={[
                  { label: "Unit 1: Self & Family Exploration", percentage: 100, valueText: "100% • Mastered", color: "emerald" },
                  { label: "Unit 2: Colors & Daily Shapes", percentage: 100, valueText: "100% • Mastered", color: "emerald" },
                  { label: "Unit 3: Phonics Sounds A through G", percentage: 85, valueText: "85% • In Progress", color: "blue" },
                  { label: "Unit 4: Jungle Animals & Habitats", percentage: 70, valueText: "70% • Ongoing", color: "amber" },
                ]}
                action={{
                  label: "Download Syllabus PDF →",
                  onClick: () => toast.success("Downloading Academic Term Syllabus..."),
                }}
              />

              <div className="space-y-4">
                {[
                  { day: 'Monday, 14 Sep', unit: 'Unit 4: Jungle Animals & Habitats', desc: 'Introduced wild vs domestic animals using animal miniatures and sound clips.', status: 'Completed' },
                  { day: 'Tuesday, 15 Sep', unit: 'Unit 4: Shapes & Spatial Awareness', desc: 'Circles, squares and triangles. Sorting shapes game with floor mats.', status: 'Completed' },
                  { day: 'Wednesday, 16 Sep', unit: 'Unit 5: Letter Sounds & Vocabulary', desc: 'Letter D and E exploration with tactile sand trays.', status: 'Completed' },
                  { day: 'Thursday, 17 Sep', unit: 'Unit 5: Rhyme Time & Body Percussion', desc: 'Clapping rhythms and singing animal rhymes with rhythm sticks.', status: 'Completed' },
                  { day: 'Friday, 18 Sep', unit: 'Unit 5: Review & Craft Day', desc: 'Animal paper plate masks and counting games from 1 to 10.', status: 'In Progress' }
                ].map((item, idx) => (
                  <PremiumCard key={idx} variant="bordered" className="p-5">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1 max-w-xl">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-400">{item.day}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{item.unit}</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{item.desc}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${
                        item.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/30'
                          : 'bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-950/30'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </PremiumCard>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 6: ACTIVITIES                                                        */}
          {/* ========================================================================= */}
          {activeTab === 'ACTIVITIES' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-slate-800 dark:text-white">Class & Home Activities</h2>
                  <p className="text-xs text-slate-500">Interactive play and creative discovery for young learners</p>
                </div>
                <button
                  onClick={() => setActivityDrawerOpen(true)}
                  className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Activity</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[
                  { id: 'act-1', title: 'Sensory Bin Exploration', domain: 'Sensory Play', date: 'Today', time: '10:00 AM', icon: '🌾', materials: 'Sand, dry pasta, sorting scoops' },
                  { id: 'act-2', title: 'Animal Mask Crafting', domain: 'Fine Motor', date: 'Yesterday', time: '11:15 AM', icon: '🎨', materials: 'Paper plates, washable paints' },
                  { id: 'act-3', title: 'Building Block Towers', domain: 'Cognitive', date: '16 Sep', time: '09:30 AM', icon: '🧱', materials: 'Wooden geometry blocks' },
                  { id: 'act-4', title: 'Music & Movement Dance', domain: 'Gross Motor', date: '15 Sep', time: '01:00 PM', icon: '🎵', materials: 'Rhythm sticks, animal beats' },
                  { id: 'act-5', title: 'Color Sorting Challenge', domain: 'Early Logic', date: '14 Sep', time: '10:30 AM', icon: '🌈', materials: 'Colored rings & counting bowls' },
                  { id: 'act-6', title: 'Nature Walk & Leaf Rubbing', domain: 'Outdoors', date: '12 Sep', time: '08:45 AM', icon: '🍁', materials: 'Wax crayons, sketch pads' }
                ].map((act) => (
                  <ActivityCard
                    key={act.id}
                    id={act.id}
                    title={act.title}
                    domain={act.domain}
                    date={act.date}
                    time={act.time}
                    icon={act.icon}
                    materials={act.materials}
                    onSchedule={() => toast.success(`Scheduled session: ${act.title}`)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 7: ASSESSMENT                                                        */}
          {/* ========================================================================= */}
          {activeTab === 'ASSESSMENT' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-slate-800 dark:text-white">Formative Assessment Rubrics</h2>
                  <p className="text-xs text-slate-500">LKG - Section A • Term 1 Continuous Evaluation</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
                    28 Children Evaluated
                  </span>
                </div>
              </div>

              {/* Developmental Competency ProgressCard */}
              <ProgressCard
                title="Developmental Competency Progress"
                subtitle="Continuous Teacher Assessment • LKG Section A (Term 1)"
                items={[
                  { label: "Language & Communication (Rhymes, Phonics, Story Responding)", percentage: 88, valueText: "88% • Proficient", color: "blue" },
                  { label: "Early Mathematics & Logic (Number Sorting, Counting 1-10)", percentage: 82, valueText: "82% • Proficient", color: "emerald" },
                  { label: "Fine Motor & Creative Expression (Crayon Grip, Paper Folding)", percentage: 94, valueText: "94% • Exemplary", color: "purple" },
                  { label: "Gross Motor & Balance (Hopping, Running, Ball Throwing)", percentage: 91, valueText: "91% • Exemplary", color: "blue" },
                  { label: "Social & Emotional Development (Sharing, Taking Turns, Empathy)", percentage: 85, valueText: "85% • Proficient", color: "amber" }
                ]}
                action={{
                  label: "Export Rubrics →",
                  onClick: () => toast.success("Exporting assessment rubrics...")
                }}
              />
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 8: CHILD GROWTH                                                      */}
          {/* ========================================================================= */}
          {activeTab === 'CHILD GROWTH' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-slate-800 dark:text-white">Child Growth & Milestone Tracker</h2>
                  <p className="text-xs text-slate-500">Physical growth, developmental metrics and health records</p>
                </div>
                <button
                  onClick={() => setActiveTab('MY CLASS')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20"
                >
                  View Individual Student Profiles →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <StatCard
                  label="Average Class Height"
                  value={102}
                  subtitle="WHO 50th Percentile • Healthy Range"
                  icon={Target}
                  color="blue"
                  trend={{ text: "+1.4 cm this term", positive: true }}
                  progressBar={{ percentage: 76, label: "Height Target: 104 cm" }}
                />
                <StatCard
                  label="Average Class Weight"
                  value={16}
                  subtitle="BMI Normal Index across cohort"
                  icon={Activity}
                  color="emerald"
                  trend={{ text: "Normal Range", positive: true }}
                  progressBar={{ percentage: 70, label: "Weight Target: 17 kg" }}
                />
                <StatCard
                  label="Milestones Achieved"
                  value={96}
                  subtitle="27 of 28 pupils meeting target age goals"
                  icon={Award}
                  color="purple"
                  trend={{ text: "96.4% on track", positive: true }}
                  progressBar={{ percentage: 96, label: "Goal: 100% On-Track" }}
                />
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 9: HOMEWORK                                                          */}
          {/* ========================================================================= */}
          {activeTab === 'HOMEWORK' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-slate-800 dark:text-white">Home Practice & Homework</h2>
                  <p className="text-xs text-slate-500">Gentle home reinforcement for kindergarten students</p>
                </div>
                <button
                  onClick={() => setHomeworkDrawerOpen(true)}
                  className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Give Homework</span>
                </button>
              </div>

              <div className="space-y-4">
                {[
                  {
                    id: 'hw-1',
                    title: 'Tracing Letters A to E in Red Activity Workbook',
                    subject: 'English & Phonics',
                    instructions: 'Trace uppercase and lowercase letters on pages 14-16. Color the picture matching letter A (Apple).',
                    assignedDate: 'Friday, 18 Sep',
                    dueDate: 'Monday, 21 Sep',
                    submittedCount: 26,
                    totalCount: 28
                  },
                  {
                    id: 'hw-2',
                    title: 'Find & Count 5 Round Objects at Home (Take a photo)',
                    subject: 'Early Mathematics',
                    instructions: 'Identify circles and spheres around the home with parents. Count together from 1 to 5.',
                    assignedDate: 'Friday, 18 Sep',
                    dueDate: 'Tuesday, 22 Sep',
                    submittedCount: 24,
                    totalCount: 28
                  },
                  {
                    id: 'hw-3',
                    title: 'Color the Butterfly using Primary Colors',
                    subject: 'Art & Creativity',
                    instructions: 'Color symmetrically within the wings using bright red, yellow, and blue crayons.',
                    assignedDate: 'Thursday, 17 Sep',
                    dueDate: 'Wednesday, 23 Sep',
                    submittedCount: 28,
                    totalCount: 28
                  }
                ].map((hw) => (
                  <HomeworkCard
                    key={hw.id}
                    id={hw.id}
                    title={hw.title}
                    subject={hw.subject}
                    instructions={hw.instructions}
                    assignedDate={hw.assignedDate}
                    dueDate={hw.dueDate}
                    submittedCount={hw.submittedCount}
                    totalCount={hw.totalCount}
                    onReview={() => toast.success(`Reviewing submissions for ${hw.subject}`)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 10: EXAMS & MARKS                                                    */}
          {/* ========================================================================= */}
          {activeTab === 'EXAMS & MARKS' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-slate-800 dark:text-white">Upcoming Exams & Evaluation Timetable</h2>
                  <p className="text-xs text-slate-500">LKG - Section A • Term 1 Diagnostic Assessments</p>
                </div>
                <button
                  onClick={() => toast.success("Exporting term marks ledger...")}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                >
                  Download Marks Ledger ↓
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { time: '22 SEP • 09:30 AM', title: 'English Reading & Phonics', status: 'Upcoming', description: 'Oral sound matching and alphabet letter naming assessment.', color: 'blue' },
                  { time: '25 SEP • 10:00 AM', title: 'Maths Skill Test', status: 'Upcoming', description: 'Object counting 1-10 and basic 2D geometric shape recognition.', color: 'emerald' },
                  { time: '28 SEP • 11:15 AM', title: 'Oral Assessment & Recitation', status: 'Upcoming', description: 'Nursery rhymes recitation and short story answering.', color: 'purple' }
                ].map((ex, i) => (
                  <ScheduleCard
                    key={i}
                    time={ex.time}
                    title={ex.title}
                    room="Room 102 (Classroom)"
                    status={ex.status as any}
                    description={ex.description}
                    color={ex.color as any}
                    onClick={() => toast.success(`Exam details: ${ex.title}`)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 11: PARENTS                                                          */}
          {/* ========================================================================= */}
          {activeTab === 'PARENTS' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-slate-800 dark:text-white">Parent Contact Directory</h2>
                  <p className="text-xs text-slate-500">Direct connection to parents of LKG - Section A</p>
                </div>
                <button
                  onClick={() => setMessageParentDrawerOpen(true)}
                  className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Broadcast to Parents</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {students.map((st) => (
                  <ParentMessageCard
                    key={st.id}
                    id={String(st.id)}
                    parentName={st.parentName}
                    parentLabel={st.parentLabel}
                    childName={st.name}
                    rollNo={st.rollNo}
                    phone={st.phone}
                    avatar={st.photo}
                    unreadCount={st.status === 'Absent' ? 1 : 0}
                    lastMessage={st.status === 'Absent' ? 'Reported illness for today' : 'All assignments submitted'}
                    time={st.status === 'Absent' ? '08:15 AM' : 'Yesterday'}
                    onSendMessage={() => setMessageParentDrawerOpen(true)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 12: SCHOOL WORK                                                      */}
          {/* ========================================================================= */}
          {activeTab === 'SCHOOL WORK' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-slate-800 dark:text-white">Faculty Duties & School Schedule</h2>
                <p className="text-xs text-slate-500">Teacher Priya Sharma weekly assignments and duties</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { duty: 'Morning Gate Greeting Duty', time: '08:00 AM - 08:30 AM', day: 'Mondays & Thursdays', icon: '🏫', color: 'blue' },
                  { duty: 'Recess & Playground Supervision', time: '12:00 PM - 12:30 PM', day: 'Daily', icon: '🛝', color: 'emerald' },
                  { duty: 'Kindergarten Department Meeting', time: '03:30 PM - 04:15 PM', day: 'Fridays', icon: '📋', color: 'purple' }
                ].map((d, i) => (
                  <PremiumCard key={i} variant="bordered" accentColor={d.color as any} className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{d.icon}</span>
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-0.5 rounded-full border border-blue-200/50">
                        {d.day}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-white">{d.duty}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-blue-500" /> {d.time}
                      </p>
                    </div>
                  </PremiumCard>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 13: LEAVE                                                            */}
          {/* ========================================================================= */}
          {activeTab === 'LEAVE' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-slate-800 dark:text-white">Teacher Leave Management</h2>
                  <p className="text-xs text-slate-500">Academic Year 2026-2027 leave balance and requests</p>
                </div>
                <button
                  onClick={() => toast.success("Opening leave application form...")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20"
                >
                  + Apply Leave
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <StatCard
                  label="Casual Leave (CL)"
                  value={8}
                  subtitle="8 of 12 days remaining"
                  icon={CalendarIcon}
                  color="blue"
                  trend={{ text: "4 Used", positive: true }}
                  progressBar={{ percentage: 66.7, label: "66.7% Balance" }}
                />
                <StatCard
                  label="Sick Leave (SL)"
                  value={5}
                  subtitle="5 of 7 days remaining"
                  icon={Activity}
                  color="emerald"
                  trend={{ text: "2 Used", positive: true }}
                  progressBar={{ percentage: 71.4, label: "71.4% Balance" }}
                />
                <StatCard
                  label="Earned Leave (EL)"
                  value={12}
                  subtitle="12 of 15 days remaining"
                  icon={Award}
                  color="purple"
                  trend={{ text: "3 Used", positive: true }}
                  progressBar={{ percentage: 80, label: "80% Balance" }}
                />
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 14: NOTIFICATIONS                                                    */}
          {/* ========================================================================= */}
          {activeTab === 'NOTIFICATIONS' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-800 dark:text-white">Staff Notifications & Bulletins</h2>
                  <p className="text-xs text-slate-500">Stay updated on school announcements and deadlines</p>
                </div>
                <span className="text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-3 py-1 rounded-xl border border-rose-200 dark:border-rose-800/60">
                  3 Unread
                </span>
              </div>

              <div className="space-y-3">
                {[
                  {
                    id: 'notif-1',
                    title: 'Annual Sports Day 2026 Preparation Schedule',
                    message: 'All class teachers must submit event participants list to Physical Education Department by Monday.',
                    timestamp: '2 hours ago',
                    isRead: false,
                    category: 'Urgent' as const
                  },
                  {
                    id: 'notif-2',
                    title: 'LKG Section A Term 1 Report Cards Submission Deadline',
                    message: 'Formative assessment observations and attendance registers must be finalized by Friday noon.',
                    timestamp: '5 hours ago',
                    isRead: false,
                    category: 'Academic' as const
                  },
                  {
                    id: 'notif-3',
                    title: 'Parent-Teacher Meeting (PTM) Timing Notice',
                    message: 'PTM scheduled for next Saturday from 09:00 AM to 01:00 PM. Time slots shared with parents.',
                    timestamp: 'Yesterday',
                    isRead: false,
                    category: 'Notice' as const
                  },
                  {
                    id: 'notif-4',
                    title: 'New Art & Craft Supplies Stocked in Room 104',
                    message: 'Washable tempera paints, large drawing sheets, safety scissors, and clay sets are ready for pickup.',
                    timestamp: '2 days ago',
                    isRead: true,
                    category: 'Event' as const
                  }
                ].map((notif) => (
                  <NotificationCard
                    key={notif.id}
                    id={notif.id}
                    title={notif.title}
                    message={notif.message}
                    timestamp={notif.timestamp}
                    isRead={notif.isRead}
                    category={notif.category}
                    onMarkAsRead={() => toast.success(`Marked as read: ${notif.title}`)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 15: MY ACCOUNT                                                       */}
          {/* ========================================================================= */}
          {activeTab === 'MY ACCOUNT' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-slate-800 dark:text-white">Teacher Profile & Settings</h2>
                <p className="text-xs text-slate-500">Your faculty credentials and classroom authorization</p>
              </div>

              <PremiumCard variant="featured" className="p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
                      alt="Teacher"
                      className="w-16 h-16 rounded-2xl object-cover ring-4 ring-blue-500/20 shadow-md"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-black text-slate-800 dark:text-white">Priya Sharma</h3>
                        <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-black">✓</span>
                      </div>
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-bold">Class Teacher • LKG - Section A</p>
                      <span className="text-[11px] text-slate-400 font-medium">Employee ID: GGPS-FAC-2024-042 • Joined: June 2022</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200/80 dark:bg-emerald-950/40">
                    Active Faculty Member
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 font-medium block">Official Email</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">priya.sharma@schoolerp.com</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 font-medium block">Assigned Section</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">Lower Kindergarten (Section A)</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 font-medium block">Teaching Subjects</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">English, Mathematics, Rhymes, Drawing</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 font-medium block">Security Status</span>
                    <span className="font-bold text-emerald-600 text-sm">Active • RBAC Level 2 Verified</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-xs cursor-pointer transition-colors"
                  >
                    Sign Out of Portal
                  </button>
                  <button
                    onClick={() => setActiveTab('HOME')}
                    className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-md shadow-blue-500/20 transition-all"
                  >
                    Back to Home Dashboard
                  </button>
                </div>
              </PremiumCard>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* 3. MODALS & DRAWERS                                                       */}
      {/* ========================================================================= */}

      {/* MODAL 1: ADD CHILD MODAL */}
      <AnimatePresence>
        {addChildModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-sm text-slate-800 dark:text-white">Add Child to LKG - Section A</h3>
                </div>
                <button onClick={() => setAddChildModalOpen(false)} className="p-1 text-slate-400 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateStudent} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Roll Number</label>
                  <input
                    type="text"
                    required
                    value={newRollNo}
                    onChange={(e) => setNewRollNo(e.target.value)}
                    placeholder="e.g. 11"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Child Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Advait Nair"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Gender</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Parent / Guardian Name</label>
                  <input
                    type="text"
                    value={newParentName}
                    onChange={(e) => setNewParentName(e.target.value)}
                    placeholder="e.g. Suresh Nair"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="e.g. +91 98765 11223"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setAddChildModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-400 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer">
                    Enroll Student
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: 8-TAB LUXURY CHILD PROFILE DRAWER */}
      <ChildProfileDrawer
        student={selectedStudent}
        isOpen={Boolean(selectedStudent)}
        onClose={() => setSelectedStudent(null)}
        onMessageParent={(child) => toast.success(`Messaging parent of ${child.name} via SMS/WhatsApp`)}
      />

      {/* MODAL 3: ATTENDANCE ROLL CALL */}
      <AnimatePresence>
        {attendanceDrawerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-black text-sm text-slate-800 dark:text-white">Daily Attendance Roll-Call</h3>
                </div>
                <button onClick={() => setAttendanceDrawerOpen(false)} className="p-1 text-slate-400 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {students.map((child) => (
                  <div key={child.id} className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <img src={child.photo} alt={child.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <span className="font-bold text-xs text-slate-800 dark:text-white block">{child.name}</span>
                        <span className="text-[10px] text-slate-400">Roll: {child.rollNo}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {(['Present', 'Absent', 'Late'] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => {
                            setStudents((prev) =>
                              prev.map((c) => (c.id === child.id ? { ...c, status: st } : c))
                            );
                          }}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                            child.status === st
                              ? st === 'Present'
                                ? 'bg-emerald-500 text-white'
                                : st === 'Absent'
                                ? 'bg-rose-500 text-white'
                                : 'bg-amber-500 text-white'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  onClick={() => setAttendanceDrawerOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    toast.success('Attendance register submitted & parents updated!');
                    setAttendanceDrawerOpen(false);
                  }}
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer hover:bg-emerald-700"
                >
                  Save & Notify Parents
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 4: CLASS WORK */}
      <AnimatePresence>
        {classWorkDrawerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-bold text-sm text-slate-800 dark:text-white">Add Class Work / Daily Diary</h3>
                <button onClick={() => setClassWorkDrawerOpen(false)} className="p-1 text-slate-400 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Subject</label>
                  <input type="text" defaultValue="Numbers & Counting" className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent" />
                </div>
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Topic Covered</label>
                  <input type="text" defaultValue="Counting blocks from 1 to 10" className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent" />
                </div>
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Teacher Notes</label>
                  <textarea rows={3} defaultValue="All students actively participated in building block towers." className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setClassWorkDrawerOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-400 cursor-pointer">Cancel</button>
                <button
                  onClick={() => {
                    toast.success('Class work published to parent portal & daily diary!');
                    setClassWorkDrawerOpen(false);
                  }}
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-blue-700"
                >
                  Publish to Parents
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 5: TIMETABLE MODAL */}
      <AnimatePresence>
        {timetableModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-800 dark:text-white">LKG - Section A Full Weekly Timetable</h3>
                  <p className="text-xs text-slate-400">Class Teacher: Priya Sharma • Room 102</p>
                </div>
                <button onClick={() => setTimetableModalOpen(false)} className="p-1 text-slate-400 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 text-xs">
                {[
                  { time: '08:30 - 09:00', title: 'Morning Assembly & Circle Time', room: 'Classroom 102' },
                  { time: '09:00 - 09:45', title: 'Numbers & Counting / Shapes', room: 'Classroom 102' },
                  { time: '09:45 - 10:15', title: 'Healthy Snack & Outdoor Play', room: 'Play Area' },
                  { time: '10:15 - 11:00', title: 'Drawing, Painting & Craft', room: 'Art Studio' },
                  { time: '11:00 - 11:45', title: 'Story Circle & English Phonics', room: 'Library / Room 102' },
                  { time: '12:00 - 01:00', title: 'Lunch & Rest Period', room: 'Early Years Dining' }
                ].map((slot, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-white block">{slot.title}</span>
                      <span className="text-[10px] text-slate-400">{slot.room}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 font-bold text-[10px]">
                      {slot.time}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  onClick={() => setTimetableModalOpen(false)}
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 6: CREATE ACTIVITY DRAWER */}
      <AnimatePresence>
        {activityDrawerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Smile className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-sm text-slate-800 dark:text-white">Plan New Classroom Activity</h3>
                </div>
                <button onClick={() => setActivityDrawerOpen(false)} className="p-1 text-slate-400 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Activity Title</label>
                  <input type="text" defaultValue="Clay Modeling & Animal Shapes" className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent" />
                </div>
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Domain</label>
                  <select defaultValue="Fine Motor Skills" className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent">
                    <option value="Fine Motor Skills">Fine Motor Skills</option>
                    <option value="Creative Arts">Creative Arts</option>
                    <option value="Social & Emotional">Social & Emotional</option>
                    <option value="Gross Motor & Play">Gross Motor & Play</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Materials Needed</label>
                  <input type="text" defaultValue="Non-toxic modeling clay, rolling pins, cutters" className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setActivityDrawerOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-400 cursor-pointer">Cancel</button>
                <button
                  onClick={() => {
                    toast.success('Activity scheduled and published to timeline!');
                    setActivityDrawerOpen(false);
                  }}
                  className="px-5 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-purple-700"
                >
                  Schedule Activity
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 7: ASSIGN HOMEWORK */}
      <AnimatePresence>
        {homeworkDrawerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <BookMarked className="w-5 h-5 text-amber-600" />
                  <h3 className="font-bold text-sm text-slate-800 dark:text-white">Assign Homework</h3>
                </div>
                <button onClick={() => setHomeworkDrawerOpen(false)} className="p-1 text-slate-400 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Subject</label>
                  <input type="text" defaultValue="English Phonics" className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent" />
                </div>
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Instructions / Worksheet</label>
                  <textarea rows={3} defaultValue="Practice tracing letter 'C' on workbook page 12. Circle objects starting with 'C'." className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent" />
                </div>
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Submission Due Date</label>
                  <input type="date" defaultValue="2026-09-21" className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setHomeworkDrawerOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-400 cursor-pointer">Cancel</button>
                <button
                  onClick={() => {
                    toast.success('Homework assigned and notified to all parents!');
                    setHomeworkDrawerOpen(false);
                  }}
                  className="px-5 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-amber-700"
                >
                  Assign Homework
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 8: MESSAGE PARENTS */}
      <AnimatePresence>
        {messageParentDrawerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-rose-600" />
                  <h3 className="font-bold text-sm text-slate-800 dark:text-white">Broadcast Parent Message</h3>
                </div>
                <button onClick={() => setMessageParentDrawerOpen(false)} className="p-1 text-slate-400 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Recipients</label>
                  <select defaultValue="all" className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent">
                    <option value="all">All LKG - Section A Parents (28)</option>
                    <option value="absent">Absent Children Parents Only (2)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Subject</label>
                  <input type="text" defaultValue="Grandparents Day Celebration Notice" className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent" />
                </div>
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Message Content</label>
                  <textarea rows={3} defaultValue="Dear Parents, We are excited to celebrate Grandparents Day on Monday. Please send family photos by Friday." className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setMessageParentDrawerOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-400 cursor-pointer">Cancel</button>
                <button
                  onClick={() => {
                    toast.success('Broadcast dispatched to 28 parents via SMS & App!');
                    setMessageParentDrawerOpen(false);
                  }}
                  className="px-5 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-rose-700"
                >
                  Send Broadcast
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 9: CHILD REMARK / OBSERVATION */}
      <AnimatePresence>
        {remarkDrawerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-teal-600" />
                  <h3 className="font-bold text-sm text-slate-800 dark:text-white">Add Child Observation / Remark</h3>
                </div>
                <button onClick={() => setRemarkDrawerOpen(false)} className="p-1 text-slate-400 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Select Child</label>
                  <select defaultValue={students[0]?.id} className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent">
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>{s.name} (Roll {s.rollNo})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Category</label>
                  <select defaultValue="Cognitive" className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent">
                    <option value="Cognitive">Cognitive & Learning</option>
                    <option value="Behavioral">Behavioral & Social</option>
                    <option value="Motor">Motor Skills & Physical</option>
                    <option value="Creative">Creative Expression</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Observation Note</label>
                  <textarea rows={3} defaultValue="Demonstrated exceptional sharing behavior during morning playtime." className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setRemarkDrawerOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-400 cursor-pointer">Cancel</button>
                <button
                  onClick={() => {
                    toast.success('Observation note logged to pupil record!');
                    setRemarkDrawerOpen(false);
                  }}
                  className="px-5 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-teal-700"
                >
                  Save Remark
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GLOBAL ⌘K COMMAND PALETTE */}
      <TeacherCommandPalette
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setIsSearchModalOpen(false);
        }}
        onSelectStudent={(studentName) => {
          const found = students.find((s) => s.name.toLowerCase().includes(studentName.toLowerCase()));
          if (found) {
            setSelectedStudent(found);
          } else {
            toast.success(`Selected student: ${studentName}`);
          }
          setIsSearchModalOpen(false);
        }}
        onOpenAction={(actionName) => {
          setIsSearchModalOpen(false);
          if (actionName.includes('Attendance')) setAttendanceDrawerOpen(true);
          else if (actionName.includes('Class Work')) setClassWorkDrawerOpen(true);
          else if (actionName.includes('Activity')) setActivityDrawerOpen(true);
          else if (actionName.includes('Homework')) setHomeworkDrawerOpen(true);
          else if (actionName.includes('Message')) setMessageParentDrawerOpen(true);
          else if (actionName.includes('Remark')) setRemarkDrawerOpen(true);
          else toast.success(`Opened: ${actionName}`);
        }}
      />

      {/* GLOBAL TOAST CONTAINER */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#0B132B',
            color: '#fff',
            borderRadius: '14px',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
            fontSize: '13px',
            fontWeight: 600,
          },
        }}
      />
    </div>
  );
}
