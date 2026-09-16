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

  const [expandedSubmenu, setExpandedSubmenu] = useState<string | null>('Form Builder & Surveys');

  const navCategories = [
    {
      category: 'MAIN',
      items: [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, show: true },
        { href: '/dashboard/calendar', label: 'School Calendar', icon: Gift, show: true },
        { href: '/dashboard/email', label: 'Email Client', icon: FileText, show: true },
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
        { href: '/dashboard/daily-activity', label: 'Daily Diary', icon: Activity, show: true },
        { href: '/dashboard/classroom', label: 'Digital Classroom', icon: BookOpen, show: true },
        { href: '/dashboard/curriculum', label: 'Curriculum & Syllabus', icon: BookOpen, show: true },
        { href: '/dashboard/assessments', label: 'Exams & Assessment', icon: FileText, show: true },
        { href: '/dashboard/online-exams', label: 'Online Exam Engine', icon: CheckCircle2, show: true },
      ],
    },
    {
      category: 'MANAGEMENT & OPERATIONS',
      items: [
        { href: '/dashboard/daycare', label: 'Day Care Logs', icon: Clock, show: true },
        { href: '/dashboard/sports', label: 'Sports & Teams', icon: Activity, show: true },
        { 
          href: '/dashboard/form-builder', 
          label: 'Form Builder & Surveys', 
          icon: FileText, 
          show: true,
          subItems: [
            { href: '/dashboard/form-builder', label: 'Form Builder' },
            { href: '/dashboard/surveys', label: 'Surveys' },
          ]
        },
        { href: '/dashboard/service-center', label: 'Internal Service Requests', icon: LifeBuoy, show: true },
        { href: '/dashboard/campuses', label: 'Campuses & Branches', icon: Building2, show: isSuperAdmin },
        { href: '/dashboard/academic-closing', label: 'Academic Year Closing', icon: Lock, show: isSuperAdmin || isPrincipal },
      ],
    },
  ];

  return (
    <div className="flex h-screen bg-[#F0F4FA] dark:bg-[#000a1f] text-[#000E28] dark:text-white transition-colors duration-200 overflow-hidden font-saas">
      <CommandPalette />

      {/* Desktop Sidebar */}
      <aside className={`${isCollapsed ? 'w-20' : 'w-68'} bg-[#07152F] text-white flex flex-col hidden md:flex shrink-0 shadow-2xl z-30 transition-all duration-300 ease-in-out border-r border-slate-800/60`}>
        
        {/* Sidebar Header with Gold Accent Emblem */}
        <div className="h-18 flex items-center justify-between px-4 border-b border-slate-800/80 shrink-0 bg-[#0B1F3A]/60">
          {!isCollapsed && (
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0757D5] to-[#2F80ED] flex items-center justify-center text-white shadow-lg ring-1 ring-[#C9A227]/40 group-hover:scale-105 transition-transform duration-200">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="leading-tight">
                <span className="text-sm font-black tracking-tight text-white block">
                  GLOBAL INTERNATIONAL
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black text-[#2F80ED] uppercase tracking-widest block">
                    SCHOOL ERP
                  </span>
                  <span className="text-[9px] font-bold text-[#C9A227] bg-[#C9A227]/15 px-1.5 py-0.2 rounded border border-[#C9A227]/30">
                    PRO
                  </span>
                </div>
              </div>
            </Link>
          )}
          {isCollapsed && (
            <div className="mx-auto">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0757D5] to-[#2F80ED] flex items-center justify-center text-white shadow-lg ring-1 ring-[#C9A227]/40">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer hover:bg-slate-800/60"
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
                          onClick={() => setExpandedSubmenu(isExpanded ? null : item.label)}
                          className={`w-full flex items-center justify-between ${isCollapsed ? 'justify-center px-2' : 'px-3.5'} py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer group hover:translate-x-1 ${
                            isItemActive
                              ? 'bg-[#0757D5] text-white shadow-lg shadow-[#0757D5]/30'
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
                              ? 'bg-[#0757D5] text-white shadow-lg shadow-[#0757D5]/30 ring-1 ring-blue-400/20'
                              : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                          }`}
                        >
                          <Icon className={`h-4 w-4 ${isCollapsed ? '' : 'mr-3'} shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                            isItemActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                          }`} strokeWidth={2} />
                          {!isCollapsed && <span className="truncate">{item.label}</span>}
                          {!isCollapsed && isItemActive && (
                            <span className="ml-auto w-2 h-2 rounded-full bg-[#2F80ED] shadow-xs shrink-0 animate-pulse" />
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
                                    ? 'text-white font-extrabold bg-white/10'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${isSubActive ? 'bg-[#2F80ED]' : 'bg-slate-500'}`} />
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

        {/* Sidebar Bottom Banner Widget */}
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
            className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-3.5'} py-2 text-xs font-bold text-slate-300 hover:bg-slate-800/60 hover:text-white rounded-xl transition-all hover:translate-x-0.5`}
          >
            <Settings className={`h-4 w-4 ${isCollapsed ? '' : 'mr-3'} text-slate-400 shrink-0`} />
            {!isCollapsed && <span>Settings</span>}
          </Link>
          <button 
            onClick={handleLogout} 
            title="Sign Out"
            className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-3.5'} py-2 text-xs font-bold text-slate-300 hover:bg-rose-950/40 hover:text-rose-400 rounded-xl transition-all hover:translate-x-0.5 cursor-pointer`}
          >
            <LogOut className={`h-4 w-4 ${isCollapsed ? '' : 'mr-3'} text-slate-400 hover:text-rose-400 shrink-0`} />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Backdrop & Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="relative w-72 max-w-[85vw] bg-[#000E28] text-white h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 shrink-0">
              <Link href="/dashboard" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#0050CB] to-[#38BDF8] flex items-center justify-center text-white">
                  <GraduationCap className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-black text-white">Global International ERP</span>
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                aria-label="Close navigation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-4 custom-scrollbar">
              {navCategories.map((catGroup) => {
                const visibleItems = catGroup.items.filter((item) => item.show);
                if (visibleItems.length === 0) return null;

                return (
                  <div key={catGroup.category} className="space-y-1">
                    <div className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                      {catGroup.category}
                    </div>
                    {visibleItems.map((item: any) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                            isActive
                              ? 'bg-[#0050CB] text-white shadow-xs'
                              : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                          }`}
                        >
                          <Icon className={`h-4 w-4 mr-3 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                );
              })}
            </nav>

            <div className="p-3 border-t border-slate-800 space-y-1 shrink-0">
              <button 
                onClick={handleLogout} 
                className="w-full flex items-center px-3.5 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4 mr-3 text-rose-400 shrink-0" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Dashboard Topbar */}
        <header className="h-16 bg-white dark:bg-[#000E28] border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-20 shadow-2xs">
          
          {/* Left: Hamburger (mobile) + Campus Pill & Academic Year Dropdowns */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Campus Selector Dropdown Pill */}
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-[#000E28] dark:text-white text-xs font-bold transition-all shadow-2xs cursor-pointer">
                <Building2 className="w-3.5 h-3.5 text-[#0050CB] dark:text-[#38BDF8]" />
                <span>Global International School</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
              </button>

              {/* Academic Year Selector Dropdown Pill */}
              <button className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-[#000E28] dark:text-white text-xs font-bold transition-all shadow-2xs cursor-pointer">
                <Calendar className="w-3.5 h-3.5 text-[#0050CB] dark:text-[#38BDF8]" />
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

            {/* Notification Bell with red badge 3 */}
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
              onClick={toggleTheme}
              className="h-9 w-9 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200/70 dark:border-slate-700"
              title="Toggle Dark/Light Mode"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>

            {/* Language / Globe Toggle */}
            <button
              onClick={() => setDirection(direction === 'ltr' ? 'rtl' : 'ltr')}
              className="h-9 w-9 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200/70 dark:border-slate-700"
              title="Language / Direction"
            >
              <Globe className="h-4 w-4 text-slate-600 dark:text-slate-300" />
            </button>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 py-1 px-1.5 rounded-full transition-colors cursor-pointer">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop"
                  alt="Mrs. Sarah Johnson"
                  className="h-9 w-9 rounded-full object-cover ring-2 ring-[#0050CB]/20"
                  onError={(e: any) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div className="h-9 w-9 rounded-full bg-[#0050CB] text-white font-bold flex items-center justify-center text-xs hidden">
                  SJ
                </div>
              </div>
              <div className="hidden sm:block text-left leading-tight pr-1">
                <p className="text-xs font-extrabold text-[#000E28] dark:text-white truncate">
                  Mrs. Sarah Johnson
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                  Teacher
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 bg-[#F4F7FC] dark:bg-[#000a1f] transition-colors flex flex-col justify-between">
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
