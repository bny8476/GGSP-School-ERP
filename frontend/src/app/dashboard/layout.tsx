"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Users, UserCheck, GraduationCap, 
  DollarSign, BookOpen, Clock, Megaphone, Bus, 
  HeartPulse, Image as ImageIcon, WalletCards, 
  BarChart3, Settings, LogOut, FileText, Activity, 
  Gift, Globe, Sun, Moon, Search, PanelLeftClose, PanelLeft,
  Package, ShieldCheck, CheckCircle2, Lock, Database, Menu, X,
  Sparkles, Brain, Zap, AlertTriangle, Trophy, Sliders,
  Building2, LifeBuoy, ShoppingCart, QrCode, ChevronDown, ChevronRight,
  MessageSquare, Calendar
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import CommandPalette from '@/components/ui/CommandPalette';
import NotificationDrawer from '@/components/ui/NotificationDrawer';

function DashboardContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      try {
        const u = localStorage.getItem('user');
        return u ? JSON.parse(u) : null;
      } catch (e) {}
    }
    return null;
  });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [teacherProfileDropdownOpen, setTeacherProfileDropdownOpen] = useState(false);
  const { theme, toggleTheme, direction, setDirection } = useTheme();
  const { t } = useLanguage();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        setUser(parsed);
        const role = ((typeof parsed.role === 'string' ? parsed.role : parsed.role?.name) || '').toLowerCase();
        if (role === 'parent') {
          // Parents belong in the dedicated Parent Portal (/portal)
          router.push('/portal');
        }
      } catch (e) {}
    } else {
      router.push('/login');
    }
  }, [router]);

  // Close mobile menu on path change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
      await fetch(`${apiBase}/api/v1/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.warn("Logout request failed:", e);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
    }
  };

  const roleStr = typeof user?.role === 'string' ? user.role : (user?.role?.name || '');
  const r = roleStr.toLowerCase();
  
  const isSuperAdmin = r === 'superadmin' || r === 'admin';
  const isPrincipal = r === 'principal' || isSuperAdmin;
  const isTeacher = r === 'teacher' || isSuperAdmin;
  const isAccountant = r === 'accountant' || isSuperAdmin;

  const [expandedSubmenu, setExpandedSubmenu] = useState<string | null>('Form Builder & Surveys');

  const navCategories = [
    {
      category: 'MAIN',
      items: [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, show: true },
        { href: '/dashboard/calendar', label: 'School Calendar', icon: Calendar, show: true },
        { href: '/dashboard/todo', label: 'To-Do Tasks', icon: CheckCircle2, show: true },
        { href: '/dashboard/notes', label: 'Notes & Ideas', icon: FileText, show: true },
        { href: '/dashboard/file-manager', label: 'File Manager', icon: Package, show: true },
      ],
    },
    {
      category: 'PEOPLE & ACADEMICS',
      items: [
        { href: '/dashboard/students', label: 'Student 360°', icon: GraduationCap, show: true },
        { href: '/dashboard/attendance', label: 'Attendance Engine', icon: UserCheck, show: true },
        { href: '/dashboard/daily-activity', label: 'Daily Diary', icon: Activity, show: isTeacher || isPrincipal },
        { href: '/dashboard/classroom', label: 'Digital Classroom', icon: BookOpen, show: true },
        { href: '/dashboard/classes', label: 'Classes & Sections', icon: Building2, show: isSuperAdmin || isPrincipal },
        { href: '/dashboard/curriculum', label: 'Curriculum & Syllabus', icon: BookOpen, show: true },
        { href: '/dashboard/assessments', label: 'Exams & Assessment', icon: FileText, show: true },
        { href: '/dashboard/online-exams', label: 'Online Exam Engine', icon: CheckCircle2, show: true },
      ],
    },
    {
      category: 'ADMISSIONS & COMMUNITY',
      items: [
        { href: '/dashboard/admissions', label: 'Admissions Desk', icon: Sparkles, show: isSuperAdmin || isPrincipal },
        { href: '/dashboard/parents', label: 'Parent Directory', icon: Users, show: isSuperAdmin || isPrincipal || isTeacher },
      ],
    },
    {
      category: 'FINANCE & BILLING',
      items: [
        { href: '/dashboard/fees', label: 'Fee Collections', icon: DollarSign, show: isAccountant },
        { href: '/dashboard/financial-audit', label: 'Financial Audit', icon: WalletCards, show: isAccountant },
      ],
    },
    {
      category: 'STAFF & HUMAN RESOURCES',
      items: [
        { href: '/dashboard/teachers', label: 'Staff & Faculty', icon: Users, show: isSuperAdmin || isPrincipal },
        { href: '/dashboard/leaves', label: 'Leave Requests', icon: Clock, show: true },
        { href: '/dashboard/payroll', label: 'Payroll & Slips', icon: DollarSign, show: isSuperAdmin || isAccountant },
      ],
    },
    {
      category: 'OPERATIONS & LOGISTICS',
      items: [
        { href: '/dashboard/transport', label: 'Transport & Fleet', icon: Bus, show: isSuperAdmin || isPrincipal },
        { href: '/dashboard/inventory', label: 'Inventory & Supplies', icon: Package, show: isSuperAdmin || isPrincipal },
        { href: '/dashboard/asset-qr', label: 'Asset QR Codes', icon: QrCode, show: isSuperAdmin || isPrincipal },
        { href: '/dashboard/visitors', label: 'Campus Visitor Logs', icon: ShieldCheck, show: true },
        { href: '/dashboard/service-center', label: 'Service Requests', icon: LifeBuoy, show: true },
        { href: '/dashboard/sports', label: 'Sports & Teams', icon: Trophy, show: true },
      ],
    },
    {
      category: 'COMMUNICATION',
      items: [
        { href: '/dashboard/communication', label: 'Broadcasts & Circulars', icon: Megaphone, show: true },
        { href: '/dashboard/chat', label: 'Staff Chat', icon: MessageSquare, show: true },
        { href: '/dashboard/email', label: 'Email Client', icon: FileText, show: true },
      ],
    },
    {
      category: 'MANAGEMENT & SYSTEM',
      items: [
        { 
          href: '/dashboard/form-builder', 
          label: 'Form Builder & Surveys', 
          icon: FileText, 
          show: isSuperAdmin || isPrincipal,
          subItems: [
            { href: '/dashboard/form-builder', label: 'Form Builder' },
            { href: '/dashboard/surveys', label: 'Surveys' },
          ]
        },
        { href: '/dashboard/campuses', label: 'Campuses & Branches', icon: Building2, show: isSuperAdmin },
        { href: '/dashboard/academic-closing', label: 'Academic Year Closing', icon: Lock, show: isSuperAdmin || isPrincipal },
        { href: '/dashboard/audit-logs', label: 'Security Audit Logs', icon: ShieldCheck, show: isSuperAdmin },
        { href: '/dashboard/settings', label: 'System Settings', icon: Settings, show: isSuperAdmin || isPrincipal },
      ],
    },
  ];

  // Dedicated Teacher 15-Module Navigation Hierarchy
  const teacherNavCategories = [
    {
      category: 'CLASSROOM CORE',
      items: [
        { href: '/dashboard', label: 'Home', icon: LayoutDashboard, show: true },
        { 
          href: '/dashboard/students', 
          label: 'My Class', 
          icon: Users, 
          show: true,
          subItems: [
            { href: '/dashboard/students', label: 'Children Directory' },
            { href: '/dashboard/parents', label: 'Parent Details' },
            { href: '/dashboard/growth-profile', label: 'Child Growth Profile' },
          ]
        },
        { 
          href: '/dashboard/attendance', 
          label: 'Attendance', 
          icon: UserCheck, 
          show: true,
          subItems: [
            { href: '/dashboard/attendance', label: 'Mark Attendance' },
            { href: '/dashboard/attendance?tab=history', label: 'Attendance History' },
          ]
        },
        { 
          href: '/dashboard/daily-activity', 
          label: 'Class Work & Diary', 
          icon: Activity, 
          show: true,
          subItems: [
            { href: '/dashboard/daily-activity', label: "Today's Work & Diary" },
            { href: '/dashboard/gallery', label: 'Photos & Media' },
          ]
        },
        { 
          href: '/dashboard/lesson-planner', 
          label: 'Lesson Plan', 
          icon: BookOpen, 
          show: true,
          subItems: [
            { href: '/dashboard/lesson-planner', label: "Today's & Weekly Plan" },
            { href: '/dashboard/curriculum', label: 'Curriculum & Units' },
          ]
        },
      ],
    },
    {
      category: 'LEARNING & ACTIVITIES',
      items: [
        { 
          href: '/dashboard/classroom', 
          label: 'Activities', 
          icon: Sparkles, 
          show: true,
          subItems: [
            { href: '/dashboard/classroom', label: 'Class & Home Activities' },
            { href: '/dashboard/sports', label: 'Sports & Games' },
          ]
        },
        { 
          href: '/dashboard/assessments', 
          label: 'Assessment', 
          icon: CheckCircle2, 
          show: true,
          subItems: [
            { href: '/dashboard/assessments', label: 'Rubrics & Competencies' },
            { href: '/dashboard/assessments?tab=reports', label: 'Assessment Reports' },
          ]
        },
        { 
          href: '/dashboard/growth-profile', 
          label: 'Child Growth', 
          icon: HeartPulse, 
          show: true,
          subItems: [
            { href: '/dashboard/growth-profile', label: 'Development Milestones' },
            { href: '/dashboard/growth-profile?tab=habits', label: 'Daily Habits & Notes' },
          ]
        },
        { 
          href: '/dashboard/daily-activity', 
          label: 'Homework', 
          icon: FileText, 
          show: true,
          subItems: [
            { href: '/dashboard/daily-activity', label: 'Give Homework' },
            { href: '/dashboard/daily-activity?tab=status', label: 'Homework Status' },
          ]
        },
        { 
          href: '/dashboard/online-exams', 
          label: 'Exams & Marks', 
          icon: Trophy, 
          show: true,
          subItems: [
            { href: '/dashboard/online-exams', label: 'Upcoming Exams & Schedule' },
            { href: '/dashboard/assessments', label: 'Marks & Report Cards' },
          ]
        },
      ],
    },
    {
      category: 'COMMUNICATION & SUPPORT',
      items: [
        { 
          href: '/dashboard/parents', 
          label: 'Parents', 
          icon: Users, 
          show: true,
          subItems: [
            { href: '/dashboard/parents', label: 'Parent Directory' },
            { href: '/dashboard/chat', label: 'Parent Messages' },
            { href: '/dashboard/parent-booking', label: 'Parent Meetings' },
          ]
        },
        { 
          href: '/dashboard/calendar', 
          label: 'School Work', 
          icon: Calendar, 
          show: true,
          subItems: [
            { href: '/dashboard/calendar', label: 'Class Timetable' },
            { href: '/dashboard/communication', label: 'School Notices' },
            { href: '/dashboard/todo', label: 'Teacher Tasks' },
          ]
        },
        { 
          href: '/dashboard/leaves', 
          label: 'Leave Management', 
          icon: Clock, 
          show: true,
          subItems: [
            { href: '/dashboard/leaves', label: 'Apply Leave' },
            { href: '/dashboard/leaves?tab=status', label: 'Leave Status' },
          ]
        },
        { href: '/dashboard/communication', label: 'Notifications', icon: Megaphone, show: true },
        { 
          href: '/dashboard/settings', 
          label: 'My Account', 
          icon: Settings, 
          show: true,
          subItems: [
            { href: '/dashboard/settings', label: 'Profile & Security' },
            { href: '/dashboard/notes', label: 'Personal Notes' },
          ]
        },
      ],
    },
  ];

  const activeNavCategories = navCategories;
  const isTeacherOnly = r === 'teacher' && !isSuperAdmin;

  if (isTeacherOnly) {
    return (
      <div className="min-h-screen bg-[#F3F6FC] dark:bg-[#0B132B] text-[#172033] dark:text-[#F8FAFC] transition-colors duration-200 overflow-hidden font-saas">
        <CommandPalette />
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F0F4FA] dark:bg-[#000a1f] text-[#000E28] dark:text-white transition-colors duration-200 overflow-hidden font-saas">
      <CommandPalette />

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#07152F] text-white z-10 shadow-2xl">
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 bg-[#0B1F3A]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0050CB] flex items-center justify-center text-white shadow-md">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span className="text-xs font-black tracking-tight text-white">GLOBAL SCHOOL ERP</span>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
              {activeNavCategories.map((catGroup) => {
                const visibleItems = catGroup.items.filter((item) => item.show);
                if (visibleItems.length === 0) return null;
                return (
                  <div key={catGroup.category} className="space-y-1">
                    <div className="px-2 text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                      {catGroup.category}
                    </div>
                    {visibleItems.map((item: any) => {
                      const Icon = item.icon;
                      const isItemActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                            isItemActive
                              ? 'bg-[#0050CB] text-white shadow-md'
                              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                );
              })}
            </nav>
            <div className="p-3 border-t border-slate-800">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-950/40 rounded-xl cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar (260px expanded / 70px collapsed) */}
      <aside className={`${isCollapsed ? 'w-20' : 'w-68'} bg-[#07152F] text-white flex flex-col hidden md:flex shrink-0 shadow-2xl z-30 transition-all duration-300 ease-in-out border-r border-slate-800/80`}>
        
        {/* Sidebar Header with Emblem */}
        <div className="h-18 flex items-center justify-between px-4 border-b border-slate-800/80 shrink-0 bg-[#0B1F3A]/70">
          {!isCollapsed && (
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0050CB] to-[#2563eb] flex items-center justify-center text-white shadow-lg ring-1 ring-[#FF690C]/40 group-hover:scale-105 transition-transform duration-200">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="leading-tight">
                <span className="text-sm font-black tracking-tight text-white block">
                  GLOBAL INTERNATIONAL
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black text-[#E5EEFF] uppercase tracking-widest block">
                    {r === 'teacher' && !isSuperAdmin ? 'TEACHER PORTAL' : 'SCHOOL ERP'}
                  </span>
                  <span className="text-[9px] font-bold text-[#FF690C] bg-[#FF690C]/15 px-1.5 py-0.2 rounded border border-[#FF690C]/30">
                    PRO
                  </span>
                </div>
              </div>
            </Link>
          )}
          {isCollapsed && (
            <div className="mx-auto">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0050CB] to-[#2563eb] flex items-center justify-center text-white shadow-lg ring-1 ring-[#FF690C]/40">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer hover:bg-slate-800/60"
            title="Toggle sidebar"
          >
            {isCollapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-4 custom-scrollbar">
          {activeNavCategories.map((catGroup) => {
            const visibleItems = catGroup.items.filter((item) => item.show);
            if (visibleItems.length === 0) return null;

            return (
              <div key={catGroup.category} className="space-y-1">
                {!isCollapsed && (
                  <div className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                    {catGroup.category}
                  </div>
                )}
                {visibleItems.map((item: any) => {
                  const Icon = item.icon;
                  const isItemActive = pathname === item.href || item.subItems?.some((sub: any) => pathname === sub.href);
                  const hasSubItems = item.subItems && item.subItems.length > 0;
                  const isExpanded = expandedSubmenu === item.label || isItemActive;

                  return (
                    <div key={item.label} className="space-y-1">
                      {hasSubItems ? (
                        <button
                          type="button"
                          onClick={() => setExpandedSubmenu(isExpanded ? null : item.label)}
                          className={`w-full flex items-center justify-between ${isCollapsed ? 'justify-center px-2' : 'px-3.5'} py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer group hover:translate-x-1 ${
                            isItemActive
                              ? 'bg-[#0050CB] text-white shadow-lg shadow-[#0050CB]/30'
                              : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                          }`}
                          title={isCollapsed ? item.label : undefined}
                        >
                          <div className="flex items-center">
                            <Icon className={`h-4 w-4 ${isCollapsed ? '' : 'mr-3'} shrink-0 text-white group-hover:scale-105 transition-transform duration-200`} strokeWidth={2.2} />
                            {!isCollapsed && <span className="truncate">{item.label}</span>}
                          </div>
                          {!isCollapsed && (
                            <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                          )}
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          title={item.label}
                          className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-3.5'} py-2.5 rounded-xl text-xs font-bold transition-all duration-200 group hover:translate-x-1 ${
                            isItemActive
                              ? 'bg-[#0050CB] text-white shadow-lg shadow-[#0050CB]/30 ring-1 ring-[#0050CB]/30'
                              : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                          }`}
                        >
                          <Icon className={`h-4 w-4 ${isCollapsed ? '' : 'mr-3'} shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                            isItemActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                          }`} strokeWidth={2} />
                          {!isCollapsed && <span className="truncate">{item.label}</span>}
                          {!isCollapsed && isItemActive && (
                            <span className="ml-auto w-2 h-2 rounded-full bg-[#FF690C] shadow-xs shrink-0 animate-pulse" />
                          )}
                        </Link>
                      )}

                      {/* Render Submenu items */}
                      {hasSubItems && isExpanded && !isCollapsed && (
                        <div className="pl-9 pr-2 space-y-1 pt-1 animate-in fade-in duration-150">
                          {item.subItems.map((sub: any) => {
                            const isSubActive = pathname === sub.href;
                            return (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                  isSubActive
                                    ? 'text-white font-extrabold bg-[#0050CB]/40'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${isSubActive ? 'bg-[#FF690C]' : 'bg-slate-500'}`} />
                                <span>{sub.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Sidebar Bottom Emblem Card */}
        {!isCollapsed && (
          <div className="mx-3 my-2 p-3 rounded-xl bg-gradient-to-r from-[#0B1F3A] to-[#07152F] border border-[#C9A227]/20 text-white flex items-center gap-2.5 shadow-sm">
            <div className="w-7 h-7 rounded-lg bg-[#C9A227]/20 text-[#E4C766] flex items-center justify-center font-bold text-sm shrink-0">
              🎓
            </div>
            <div className="leading-tight">
              <p className="text-[11px] font-bold text-white">Global International</p>
              <p className="text-[10px] text-[#2F80ED] font-medium">Enterprise SaaS Edition</p>
            </div>
          </div>
        )}

        {/* Sidebar Footer Settings & Logout */}
        <div className="p-3 border-t border-slate-800 space-y-1 shrink-0">
          <Link 
            href="/dashboard/settings" 
            title="Settings"
            className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-3.5'} py-2 text-xs font-bold text-slate-300 hover:bg-slate-800/60 hover:text-white rounded-xl transition-all hover:translate-x-1`}
          >
            <Settings className={`h-4 w-4 ${isCollapsed ? '' : 'mr-3'} text-slate-400 shrink-0`} />
            {!isCollapsed && <span>Settings</span>}
          </Link>
          <button 
            type="button"
            onClick={handleLogout} 
            title="Sign Out"
            className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-3.5'} py-2 text-xs font-bold text-slate-300 hover:bg-rose-950/40 hover:text-rose-400 rounded-xl transition-all hover:translate-x-1 cursor-pointer`}
          >
            <LogOut className={`h-4 w-4 ${isCollapsed ? '' : 'mr-3'} text-slate-400 hover:text-rose-400 shrink-0`} />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Dashboard Topbar (72px) */}
        <header className="h-18 bg-white dark:bg-[#07152F] border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-20 shadow-2xs">
          
          {/* Left: Mobile Toggle + School Selector + Academic Year */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Campus Selector Dropdown Pill */}
            <div className="flex items-center gap-2">
              <button 
                type="button"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-[#07152F] dark:text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5 text-[#0757D5] dark:text-[#2F80ED]" />
                <span>Global International School</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
              </button>

              {/* Academic Year Selector Dropdown Pill */}
              <button 
                type="button"
                className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-[#07152F] dark:text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-[#0757D5] dark:text-[#2F80ED]" />
                <span>Academic Year 2025 - 2026</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
              </button>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Quick Search Bar Pill (Search anything... Ctrl + K) */}
            <div 
              onClick={() => {
                const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true, bubbles: true });
                window.dispatchEvent(event);
              }}
              className="hidden lg:flex items-center justify-between w-[220px] xl:w-[260px] h-9 px-3.5 bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 rounded-full text-xs font-medium text-slate-500 dark:text-slate-400 cursor-pointer transition-all border border-slate-200/70 dark:border-slate-700"
              title="Search command (Ctrl+K)"
            >
              <div className="flex items-center gap-2">
                <Search className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-slate-500 dark:text-slate-400 font-medium">Search anything...</span>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold">
                (Ctrl + K)
              </span>
            </div>

            {/* Notification Bell */}
            <div className="relative flex items-center justify-center">
              <NotificationDrawer />
            </div>

            {/* Messages Icon Button */}
            <Link
              href="/dashboard/chat"
              className="h-9 w-9 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200/70 dark:border-slate-700"
              title="Messages"
            >
              <MessageSquare className="h-4 w-4 text-slate-600 dark:text-slate-300" />
            </Link>

            {/* Dark/Light Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="h-9 w-9 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200/70 dark:border-slate-700"
              title="Toggle Dark/Light Mode"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>

            {/* Language / Globe Toggle */}
            <button
              type="button"
              onClick={() => setDirection(direction === 'ltr' ? 'rtl' : 'ltr')}
              className="h-9 w-9 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200/70 dark:border-slate-700"
              title="Language / Direction"
            >
              <Globe className="h-4 w-4 text-slate-600 dark:text-slate-300" />
            </button>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 py-1 px-1.5 rounded-full transition-colors cursor-pointer">
              <div className="relative">
                <div className="h-9 w-9 rounded-full bg-[#0050CB] text-white flex items-center justify-center font-black text-xs ring-2 ring-[#0050CB]/20 shadow-xs">
                  {user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
                </div>
              </div>
              <div className="hidden sm:block text-left leading-tight pr-1">
                <p className="text-xs font-black text-[#000E28] dark:text-white truncate">
                  {user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email : 'Staff Member'}
                </p>
                <p className="text-[10px] text-[#0050CB] dark:text-[#E5EEFF] font-bold uppercase tracking-wider">
                  {roleStr || 'Staff'}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-7 bg-[#F4F7FC] dark:bg-[#030A17] transition-colors flex flex-col justify-between">
          <div className="max-w-[1680px] w-full mx-auto space-y-6">
            {children}
          </div>
        </div>

      </main>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <DashboardContent>{children}</DashboardContent>
    </ThemeProvider>
  );
}
