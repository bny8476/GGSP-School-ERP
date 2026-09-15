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
  Building2, LifeBuoy, ShoppingCart, QrCode
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import CommandPalette from '@/components/ui/CommandPalette';
import NotificationDrawer from '@/components/ui/NotificationDrawer';
import AcademyLogo from '@/components/AcademyLogo';
import GlobalAIAssistantWidget from '@/components/GlobalAIAssistantWidget';

function DashboardContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme, direction, setDirection } = useTheme();
  const { t } = useLanguage();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        setUser(parsed);
      } catch (e) {}
    }
  }, []);

  // Close mobile drawer on route navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const roleStr = typeof user?.role === 'string' ? user.role : (user?.role?.name || '');
  const r = roleStr.toLowerCase();
  
  const isSuperAdmin = r === 'superadmin' || r === 'admin';
  const isPrincipal = r === 'principal' || isSuperAdmin;
  const isTeacher = r === 'teacher' || isSuperAdmin;
  const isAccountant = r === 'accountant' || isSuperAdmin;
  const isReceptionist = r === 'receptionist' || isSuperAdmin;
  
  const portalName = isSuperAdmin ? 'Super Admin Workspace' 
    : r === 'principal' ? 'Principal Workspace'
    : r === 'teacher' ? 'Teacher Workspace'
    : r === 'accountant' ? 'Accounts Workspace'
    : 'Staff Workspace';

  const initial = user?.firstName ? user.firstName[0].toUpperCase() : 'A';
  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Administrator';

  const navCategories = [
    {
      category: 'Main',
      items: [
        { href: '/dashboard', label: t('nav.home', 'Main Dashboard'), icon: LayoutDashboard, show: true },
      ],
    },
    {
      category: 'Enterprise & Multi-Campus',
      items: [
        { href: '/dashboard/campuses', label: 'Campuses & Branches', icon: Building2, show: isSuperAdmin },
        { href: '/dashboard/academic-closing', label: 'Academic Year Closing', icon: Lock, show: isSuperAdmin || isPrincipal },
        { href: '/dashboard/master-data', label: 'Master Data Center', icon: Database, show: isSuperAdmin },
        { href: '/dashboard/business-config', label: 'Business Config Rules', icon: Sliders, show: isSuperAdmin },
        { href: '/dashboard/custom-fields', label: 'Custom Field Builder', icon: Sliders, show: isSuperAdmin },
        { href: '/dashboard/form-builder', label: 'Form Builder & Surveys', icon: FileText, show: true },
        { href: '/dashboard/approval-engine', label: 'Approval SLAs & Escalation', icon: ShieldCheck, show: isSuperAdmin || isPrincipal },
        { href: '/dashboard/service-center', label: 'Internal Service Requests', icon: LifeBuoy, show: true },
        { href: '/dashboard/procurement', label: 'Procurement & PO System', icon: ShoppingCart, show: isSuperAdmin || isAccountant },
        { href: '/dashboard/asset-qr', label: 'Asset QR & AMC Contracts', icon: QrCode, show: isSuperAdmin },
        { href: '/dashboard/financial-audit', label: 'Financial Period Lock', icon: DollarSign, show: isAccountant || isSuperAdmin },
        { href: '/dashboard/document-builder', label: 'Document Templates', icon: FileText, show: isSuperAdmin },
      ],
    },
    {
      category: 'Next-Gen AI & Tools',
      items: [
        { href: '/dashboard/ai-assistant', label: 'Global AI Assistant', icon: Sparkles, show: true },
        { href: '/dashboard/early-warning', label: 'Early-Warning Risk Hub', icon: AlertTriangle, show: isPrincipal || isTeacher },
        { href: '/dashboard/growth-profile', label: 'Growth & Portfolio', icon: GraduationCap, show: true },
        { href: '/dashboard/lesson-planner', label: 'Lesson Planner & Syllabus', icon: BookOpen, show: isTeacher || isPrincipal },
        { href: '/dashboard/digital-board', label: 'Digital Board & Live Polls', icon: Megaphone, show: isTeacher || isPrincipal },
        { href: '/dashboard/paper-generator', label: 'Question Paper Generator', icon: FileText, show: isTeacher || isPrincipal },
        { href: '/dashboard/seating-plan', label: 'Exam Seating Generator', icon: Users, show: isPrincipal || isSuperAdmin },
        { href: '/dashboard/emergency-center', label: 'Emergency Control Hub', icon: ShieldCheck, show: true },
        { href: '/dashboard/parent-booking', label: 'Parent-Teacher Booking', icon: Clock, show: true },
        { href: '/dashboard/house-system', label: 'House System & Rewards', icon: Trophy, show: true },
        { href: '/dashboard/workflows', label: 'Automation Rules Engine', icon: Zap, show: isSuperAdmin },
        { href: '/dashboard/feature-flags', label: 'Feature Control Flags', icon: Sliders, show: isSuperAdmin },
      ],
    },
    {
      category: 'Applications',
      items: [
        { href: '/dashboard/chat', label: 'Chat & Messenger', icon: Megaphone, show: true },
        { href: '/dashboard/call', label: 'Audio / Video Calls', icon: Activity, show: true },
        { href: '/dashboard/calendar', label: 'School Calendar', icon: Gift, show: true },
        { href: '/dashboard/email', label: 'Email Client', icon: FileText, show: true },
        { href: '/dashboard/todo', label: 'To-Do Tasks', icon: CheckCircle2, show: true },
        { href: '/dashboard/notes', label: 'Notes & Ideas', icon: FileText, show: true },
        { href: '/dashboard/file-manager', label: 'File Manager', icon: Package, show: true },
      ],
    },
    {
      category: 'People & Academics',
      items: [
        { href: '/dashboard/admissions', label: t('nav.admissions', 'Admissions Pipeline'), icon: FileText, show: isSuperAdmin || isReceptionist },
        { href: '/dashboard/students', label: t('footer.students', 'Student 360°'), icon: GraduationCap, show: isPrincipal || isTeacher },
        { href: '/dashboard/parents', label: 'Parents & Guardians', icon: Users, show: isPrincipal || isReceptionist },
        { href: '/dashboard/teachers', label: 'Teachers & Staff Roster', icon: BookOpen, show: isPrincipal },
        { href: '/dashboard/attendance', label: t('footer.attendance', 'Attendance Engine'), icon: UserCheck, show: isPrincipal || isTeacher },
        { href: '/dashboard/classes', label: 'Classes & Sections', icon: LayoutDashboard, show: isSuperAdmin },
        { href: '/dashboard/daily-activity', label: 'Daily Diary', icon: Activity, show: isPrincipal || isTeacher },
        { href: '/dashboard/classroom', label: 'Digital Classroom', icon: BookOpen, show: isPrincipal || isTeacher },
        { href: '/dashboard/curriculum', label: 'Curriculum & Syllabus', icon: BookOpen, show: isPrincipal || isTeacher },
        { href: '/dashboard/assessments', label: 'Exams & Assessment', icon: FileText, show: isPrincipal || isTeacher },
        { href: '/dashboard/online-exams', label: 'Online Exam Engine', icon: CheckCircle2, show: isPrincipal || isTeacher },
      ],
    },
    {
      category: 'Management & Operations',
      items: [
        { href: '/dashboard/fees', label: t('footer.fees', 'Fees & Financial Ledger'), icon: DollarSign, show: isAccountant || isPrincipal },
        { href: '/dashboard/payroll', label: t('footer.payroll', 'Staff Payroll'), icon: WalletCards, show: isSuperAdmin },
        { href: '/dashboard/inventory', label: 'Inventory & PO', icon: Package, show: isSuperAdmin || isAccountant },
        { href: '/dashboard/transport', label: 'Transport & GPS', icon: Bus, show: isSuperAdmin || isReceptionist },
        { href: '/dashboard/daycare', label: 'Day Care Logs', icon: Clock, show: isSuperAdmin || isTeacher },
        { href: '/dashboard/health', label: 'Health Records', icon: HeartPulse, show: isSuperAdmin || isReceptionist },
        { href: '/dashboard/sports', label: 'Sports & Teams', icon: Activity, show: true },
        { href: '/dashboard/discipline', label: 'Discipline Log', icon: ShieldCheck, show: isPrincipal || isSuperAdmin },
        { href: '/dashboard/visitors', label: 'Visitor Gate Pass', icon: ShieldCheck, show: isSuperAdmin || isReceptionist },
        { href: '/dashboard/approvals', label: 'Approval Center', icon: CheckCircle2, show: isSuperAdmin || isPrincipal },
      ],
    },
    {
      category: 'System & Reports',
      items: [
        { href: '/dashboard/reports', label: 'Reporting Center', icon: BarChart3, show: isPrincipal || isAccountant },
        { href: '/dashboard/timeline', label: 'Activity Stream', icon: Activity, show: isSuperAdmin || isPrincipal },
        { href: '/dashboard/audit-logs', label: 'Audit Log Trail', icon: Database, show: isSuperAdmin },
        { href: '/dashboard/security', label: 'Security Center', icon: Lock, show: isSuperAdmin },
        { href: '/dashboard/import-export', label: 'Bulk Import & Export', icon: Database, show: isSuperAdmin || isPrincipal },
        { href: '/dashboard/settings', label: 'Global Settings', icon: Settings, show: isSuperAdmin || isPrincipal },
      ],
    },
  ];

  return (
    <div className="flex h-screen bg-[#F7FAFE] dark:bg-[#000a1f] text-[#000E28] dark:text-white transition-colors duration-200 overflow-hidden font-sans">
      <CommandPalette />

      {/* Desktop Sidebar */}
      <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white dark:bg-[#000E28] border-r border-slate-200/80 dark:border-slate-800 flex flex-col hidden md:flex shrink-0 shadow-xs z-30 transition-all duration-300`}>
        
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
          {!isCollapsed && (
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <AcademyLogo size="sm" />
              <div className="leading-tight">
                <span className="text-base font-black tracking-tight text-[#000E28] dark:text-white">
                  E.A.S.<span className="text-[#0050CB]">Academy</span>
                </span>
              </div>
            </Link>
          )}
          {isCollapsed && (
            <div className="mx-auto">
              <AcademyLogo size="sm" />
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Toggle sidebar"
          >
            {isCollapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-4 custom-scrollbar">
          {navCategories.map((catGroup) => {
            const visibleItems = catGroup.items.filter((item) => item.show);
            if (visibleItems.length === 0) return null;

            return (
              <div key={catGroup.category} className="space-y-1">
                {!isCollapsed && (
                  <div className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                    {catGroup.category}
                  </div>
                )}
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={item.label}
                      className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-3.5'} py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                        isActive
                          ? 'bg-[#E5EEFF] dark:bg-[#0050CB]/20 text-[#0050CB] dark:text-[#38BDF8] shadow-xs'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/50 hover:text-[#0050CB] dark:hover:text-white'
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${isCollapsed ? '' : 'mr-3'} shrink-0 transition-colors ${
                        isActive ? 'text-[#0050CB] dark:text-[#38BDF8]' : 'text-slate-400 group-hover:text-[#0050CB]'
                      }`} strokeWidth={isActive ? 2.4 : 2} />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                      {!isCollapsed && isActive && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#0050CB] dark:bg-[#38BDF8] shrink-0" />
                      )}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer Settings & Logout */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1 shrink-0">
          <Link 
            href="/dashboard/settings" 
            title="Settings"
            className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-3.5'} py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/50 hover:text-[#0050CB] dark:hover:text-[#38BDF8] rounded-xl transition-colors`}
          >
            <Settings className={`h-4 w-4 ${isCollapsed ? '' : 'mr-3'} text-slate-400 shrink-0`} />
            {!isCollapsed && <span>Settings</span>}
          </Link>
          <button 
            onClick={handleLogout} 
            title="Sign Out"
            className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-3.5'} py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl transition-colors cursor-pointer`}
          >
            <LogOut className={`h-4 w-4 ${isCollapsed ? '' : 'mr-3'} text-slate-400 hover:text-rose-600 shrink-0`} />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Backdrop & Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-72 max-w-[85vw] bg-white dark:bg-[#000E28] h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <Link href="/dashboard" className="flex items-center gap-2.5">
                <AcademyLogo size="sm" />
                <div className="leading-tight">
                  <span className="text-base font-black tracking-tight text-[#000E28] dark:text-white">
                    E.A.S.<span className="text-[#0050CB]">Academy</span>
                  </span>
                </div>
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white"
                aria-label="Close navigation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav list */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-3 custom-scrollbar">
              {navCategories.map((catGroup) => {
                const visibleItems = catGroup.items.filter((item) => item.show);
                if (visibleItems.length === 0) return null;

                return (
                  <div key={catGroup.category} className="space-y-1">
                    <div className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                      {catGroup.category}
                    </div>
                    {visibleItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                            isActive
                              ? 'bg-[#E5EEFF] dark:bg-[#0050CB]/20 text-[#0050CB] dark:text-[#38BDF8]'
                              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
                          }`}
                        >
                          <Icon className={`h-4 w-4 mr-3 shrink-0 ${
                            isActive ? 'text-[#0050CB] dark:text-[#38BDF8]' : 'text-slate-400'
                          }`} />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                );
              })}
            </nav>

            {/* Drawer Footer */}
            <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-1 shrink-0">
              <button 
                onClick={handleLogout} 
                className="w-full flex items-center px-3.5 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4 mr-3 text-rose-600 shrink-0" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Dashboard Topbar */}
        <header className="h-16 sm:h-[70px] bg-white/95 dark:bg-[#000E28]/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-4 sm:px-8 shrink-0 sticky top-0 z-20 transition-colors shadow-2xs">
          
          {/* Left: Hamburger (mobile) + Portal Title & Live Badge */}
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block w-2.5 h-2.5 rounded-full bg-[#0050CB] ring-4 ring-[#0050CB]/15 shrink-0" />
                <h1 className="text-lg sm:text-[22px] font-extrabold text-[#000E28] dark:text-white tracking-tight truncate max-w-[220px] sm:max-w-none">
                  {portalName}
                </h1>
              </div>

              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5EEFF] dark:bg-[#0050CB]/20 border border-[#0050CB]/20 text-[#0050CB] dark:text-[#38BDF8] text-[11px] font-bold shadow-2xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Live Portal</span>
              </span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Search Trigger (180-220px command pill) */}
            <div 
              onClick={() => {
                const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true, bubbles: true });
                window.dispatchEvent(event);
              }}
              className="hidden md:flex items-center justify-between w-[180px] lg:w-[210px] h-9 px-3 bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 rounded-xl text-xs font-medium text-slate-500 dark:text-slate-400 cursor-pointer transition-all border border-slate-200/70 dark:border-slate-700 focus-within:ring-2 focus-within:ring-[#0050CB]/30"
              title="Search command (Ctrl+K)"
            >
              <div className="flex items-center gap-2">
                <Search className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-slate-600 dark:text-slate-300 font-medium">Search</span>
              </div>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-md border border-slate-200 dark:border-slate-600 shadow-2xs">
                Ctrl K
              </kbd>
            </div>

            {/* RTL / LTR Direction Toggle */}
            <button
              onClick={() => setDirection(direction === 'ltr' ? 'rtl' : 'ltr')}
              className="h-9 px-2.5 sm:px-3 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
              title="Toggle Layout Direction (LTR/RTL)"
            >
              {direction.toUpperCase()}
            </button>

            {/* Notification Drawer */}
            <NotificationDrawer />

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="h-9 w-9 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700"
              title="Toggle Dark/Light Mode"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2.5 pl-2.5 sm:pl-3 border-l border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 py-1 px-1.5 rounded-xl transition-colors cursor-pointer">
              <div className="relative">
                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#0050CB] to-[#38BDF8] flex items-center justify-center text-white font-extrabold shadow-sm text-xs sm:text-sm ring-2 ring-white dark:ring-[#001438]">
                  {initial}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#000E28]" />
              </div>
              <div className="hidden lg:block text-left leading-tight pr-1">
                <p className="text-xs font-extrabold text-[#000E28] dark:text-white truncate max-w-[130px]">
                  {userName}
                </p>
                <p className="text-[10px] text-[#0050CB] dark:text-[#38BDF8] font-bold uppercase tracking-wider">
                  {roleStr || 'Admin'}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-[#F7FAFE] via-white to-[#F6F9FE] dark:from-[#000a1f] dark:via-[#000E28] dark:to-[#000a1f] transition-colors flex flex-col justify-between">
          <div className="max-w-[1600px] w-full mx-auto space-y-6 sm:space-y-8">
            {children}
          </div>

          {/* Dashboard Application Footer */}
          <footer className="mt-12 pt-6 border-t border-slate-200/80 dark:border-slate-800 max-w-[1600px] w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#000E28] dark:text-white">E.A.S. Academy</span>
              <span>&copy; {new Date().getFullYear()} School ERP. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Portal Active
              </span>
              <span>•</span>
              <span>Support: admin@easacademy.com</span>
            </div>
          </footer>
        </div>

        {/* Global AI Assistant Floating Modal/Widget */}
        <GlobalAIAssistantWidget />

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
