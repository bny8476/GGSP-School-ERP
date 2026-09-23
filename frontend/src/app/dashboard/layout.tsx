"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from "@/stores/authStore";
import { 
  LayoutDashboard, 
  GraduationCap, 
  Users, 
  BookOpen, 
  DollarSign, 
  UserCheck, 
  Megaphone, 
  BarChart3, 
  Settings, 
  LogOut, 
  FileText, 
  Activity, 
  Globe, 
  Sun, 
  Moon, 
  Search, 
  PanelLeftClose, 
  PanelLeft,
  Package, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Menu, 
  X,
  Sparkles, 
  Trophy, 
  Building2, 
  LifeBuoy, 
  ChevronDown, 
  ChevronRight,
  MessageSquare, 
  Calendar,
  Layers,
  Inbox,
  Clock,
  QrCode,
  FileSpreadsheet,
  WalletCards,
  Sliders,
  Shield,
  HelpCircle,
  Briefcase
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import CommandPalette from '@/components/ui/CommandPalette';
import NotificationDrawer from '@/components/ui/NotificationDrawer';

interface NavSubItem {
  href: string;
  label: string;
  badge?: string;
}

interface NavItem {
  href: string;
  label: string;
  icon: any;
  show: boolean;
  badge?: string;
  subItems?: NavSubItem[];
}

interface NavCategory {
  category: string;
  items: NavItem[];
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const { theme, toggleTheme, direction, setDirection } = useTheme();
  const { t } = useLanguage();

  useEffect(() => {
    setMounted(true);
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        setUser(parsed);
        const role = ((typeof parsed.role === 'string' ? parsed.role : parsed.role?.name) || '').toLowerCase();
        if (role === 'parent') {
          router.push('/portal');
        }
      } catch (e) {}
    } else {
      router.push('/login');
    }
  }, [router]);

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
      useAuthStore.getState().logout();
    }
  };

  const roleStr = typeof user?.role === 'string' ? user.role : (user?.role?.name || '');
  const r = roleStr.toLowerCase();
  
  const isSuperAdmin = r === 'superadmin' || r === 'admin';
  const isPrincipal = r === 'principal' || isSuperAdmin;
  const isTeacher = r === 'teacher' || isSuperAdmin;
  const isAccountant = r === 'accountant' || isSuperAdmin;

  // The 10 Major Enterprise Modules Specification
  const adminNavCategories: NavCategory[] = useMemo(() => [
    {
      category: '1. CORE DASHBOARD',
      items: [
        { 
          href: '/dashboard', 
          label: 'Dashboard', 
          icon: LayoutDashboard, 
          show: true,
          subItems: [
            { href: '/dashboard', label: 'Executive Overview' },
            { href: '/dashboard/calendar', label: 'Institutional Calendar' },
            { href: '/dashboard/todo', label: 'Admin Tasks' },
            { href: '/dashboard/notes', label: 'Executive Notes' },
            { href: '/dashboard/file-manager', label: 'File Archive' },
          ]
        },
      ],
    },
    {
      category: '2. ADMISSIONS',
      items: [
        { 
          href: '/dashboard/admissions', 
          label: 'Admissions Desk', 
          icon: Sparkles, 
          show: isSuperAdmin || isPrincipal,
          badge: '42 New',
          subItems: [
            { href: '/dashboard/admissions', label: 'Pipeline Command' },
            { href: '/dashboard/admissions?tab=inquiries', label: 'New Enquiries' },
            { href: '/dashboard/admissions?tab=interviews', label: 'Interviews & Demo' },
            { href: '/dashboard/admissions?tab=confirmed', label: 'Confirmed Enrolled' },
          ]
        },
      ],
    },
    {
      category: '3. STUDENTS',
      items: [
        { 
          href: '/dashboard/students', 
          label: 'Students 360°', 
          icon: GraduationCap, 
          show: true,
          subItems: [
            { href: '/dashboard/students', label: 'Student Directory' },
            { href: '/dashboard/parents', label: 'Parents & Guardians' },
            { href: '/dashboard/growth-profile', label: 'Growth Profiles' },
            { href: '/dashboard/discipline', label: 'Behavioral Logs' },
          ]
        },
      ],
    },
    {
      category: '4. ACADEMICS',
      items: [
        { 
          href: '/dashboard/academic', 
          label: 'Academics Workspace', 
          icon: BookOpen, 
          show: true,
          subItems: [
            { href: '/dashboard/classes', label: 'Classes & Sections' },
            { href: '/dashboard/curriculum', label: 'Curriculum & Units' },
            { href: '/dashboard/academic', label: 'Timetable Matrix' },
            { href: '/dashboard/assessments', label: 'Examinations & Marks' },
            { href: '/dashboard/online-exams', label: 'Online Exam Engine' },
            { href: '/dashboard/lesson-planner', label: 'Lesson Planner' },
          ]
        },
      ],
    },
    {
      category: '5. FINANCE & LEDGER',
      items: [
        { 
          href: '/dashboard/fees', 
          label: 'Finance Command', 
          icon: DollarSign, 
          show: isAccountant || isSuperAdmin,
          subItems: [
            { href: '/dashboard/fees', label: 'Fee Collections' },
            { href: '/dashboard/financial-audit', label: 'Financial Audit' },
            { href: '/dashboard/procurement', label: 'Procurement & Vendors' },
            { href: '/dashboard/payroll', label: 'Staff Payroll Ledger' },
          ]
        },
      ],
    },
    {
      category: '6. OPERATIONS & LOGISTICS',
      items: [
        { 
          href: '/dashboard/inventory', 
          label: 'Operations & Logistics', 
          icon: Package, 
          show: isSuperAdmin || isPrincipal,
          subItems: [
            { href: '/dashboard/inventory', label: 'Supplies & Inventory' },
            { href: '/dashboard/asset-qr', label: 'Asset QR Codes' },
            { href: '/dashboard/visitors', label: 'Campus Visitor Logs' },
            { href: '/dashboard/daycare', label: 'Daycare Management' },
            { href: '/dashboard/sports', label: 'Sports & Houses' },
          ]
        },
      ],
    },
    {
      category: '7. STAFF & HR',
      items: [
        { 
          href: '/dashboard/teachers', 
          label: 'Staff & Human Resources', 
          icon: Users, 
          show: isSuperAdmin || isPrincipal,
          subItems: [
            { href: '/dashboard/teachers', label: 'Faculty Directory' },
            { href: '/dashboard/leaves', label: 'Leave Requests' },
            { href: '/dashboard/attendance', label: 'Attendance Roll-Call' },
          ]
        },
      ],
    },
    {
      category: '8. COMMUNICATION',
      items: [
        { 
          href: '/dashboard/communication', 
          label: 'Communication Hub', 
          icon: Megaphone, 
          show: true,
          subItems: [
            { href: '/dashboard/communication', label: 'Circulars & Broadcasts' },
            { href: '/dashboard/chat', label: 'Staff Chat' },
            { href: '/dashboard/email', label: 'Institutional Email' },
            { href: '/dashboard/emergency-center', label: 'Emergency Broadcast' },
          ]
        },
      ],
    },
    {
      category: '9. REPORTS & AUDITS',
      items: [
        { 
          href: '/dashboard/reports', 
          label: 'Reports & Analytics', 
          icon: BarChart3, 
          show: true,
          subItems: [
            { href: '/dashboard/reports', label: 'Executive Reports' },
            { href: '/dashboard/audit-logs', label: 'Security Audit Logs' },
          ]
        },
      ],
    },
    {
      category: '10. MORE / SYSTEM',
      items: [
        { 
          href: '/dashboard/settings', 
          label: 'System Administration', 
          icon: Settings, 
          show: isSuperAdmin || isPrincipal,
          subItems: [
            { href: '/dashboard/settings', label: 'General Settings' },
            { href: '/dashboard/campuses', label: 'Branches & Campuses' },
            { href: '/dashboard/master-data', label: 'Master Data Config' },
            { href: '/dashboard/workflows', label: 'Workflow Automations' },
            { href: '/dashboard/form-builder', label: 'Form Builder' },
            { href: '/dashboard/ai-assistant', label: 'GGPS AI Assistant' },
            { href: '/dashboard/security', label: 'Security & Access' },
          ]
        },
      ],
    },
  ], [isSuperAdmin, isPrincipal, isAccountant]);

  // Compute breadcrumb title from pathname
  const currentBreadcrumbs = useMemo(() => {
    const parts = pathname.replace('/dashboard', '').split('/').filter(Boolean);
    if (parts.length === 0) return [{ label: 'Executive Dashboard' }];

    return parts.map((part, index) => {
      const formatted = part
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
      const href = `/dashboard/${parts.slice(0, index + 1).join('/')}`;
      return {
        label: formatted,
        href: index === parts.length - 1 ? undefined : href,
      };
    });
  }, [pathname]);

  if (!mounted) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#F6F8FC] dark:bg-[#07152F]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0050CB] text-white flex items-center justify-center shadow-lg shadow-[#0050CB]/25 animate-pulse">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#0050CB] animate-bounce [animation-delay:-0.3s]" />
            <div className="w-2 h-2 rounded-full bg-[#FF690C] animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2 h-2 rounded-full bg-[#0050CB] animate-bounce" />
          </div>
        </div>
      </div>
    );
  }

  // Teacher-only accounts render without the admin sidebar, preserving TeacherWorkspace
  const isTeacherOnly = r === 'teacher' && !isSuperAdmin;
  if (isTeacherOnly) {
    return (
      <div className="min-h-screen bg-[#F3F6FC] dark:bg-[#07152F] text-[#172033] dark:text-[#F8FAFC] transition-colors duration-200 overflow-hidden font-saas">
        <CommandPalette />
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F6F8FC] dark:bg-[#040C1A] text-[#000E28] dark:text-white transition-colors duration-200 overflow-hidden font-saas">
      <CommandPalette />

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-[#07152F]/75 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#08152F] text-white z-10 shadow-2xl border-r border-slate-800">
            {/* Mobile Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 bg-[#0B1735]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#0050CB] flex items-center justify-center text-white shadow-md">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-black tracking-tight text-white block">GGPS SCHOOL ERP</span>
                  <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider">Admin Console</span>
                </div>
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

            {/* Mobile Navigation List */}
            <nav className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
              {adminNavCategories.map((group) => (
                <div key={group.category} className="space-y-1">
                  <div className="px-2 text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                    {group.category}
                  </div>
                  {group.items.filter((item) => item.show).map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

                    return (
                      <div key={item.label} className="space-y-1">
                        <Link
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                            isActive
                              ? 'bg-[#0050CB] text-white shadow-md'
                              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </div>
                          {item.badge && (
                            <span className="text-[9px] font-black bg-[#FF690C] text-white px-1.5 py-0.5 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </div>
                    );
                  })}
                </div>
              ))}
            </nav>

            {/* Mobile Logout */}
            <div className="p-3 border-t border-slate-800 bg-[#0B1735]">
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

      {/* Desktop Luxury Sidebar (260px expanded / 72px collapsed) */}
      <aside
        className={`${
          isCollapsed ? 'w-20' : 'w-68'
        } bg-[#08152F] text-white flex flex-col hidden md:flex shrink-0 shadow-[4px_0_30px_rgba(0,14,40,0.15)] z-30 transition-all duration-300 ease-in-out border-r border-slate-800/80`}
      >
        {/* Sidebar Brand Header */}
        <div className="h-18 flex items-center justify-between px-4 border-b border-slate-800/80 shrink-0 bg-[#0B1735]">
          {!isCollapsed && (
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0050CB] to-[#2563EB] flex items-center justify-center text-white shadow-lg shadow-[#0050CB]/30 ring-1 ring-white/20 group-hover:scale-105 transition-transform duration-200">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="leading-tight">
                <span className="text-sm font-black tracking-tight text-white block font-saas">
                  GGPS SCHOOL ERP
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest block">
                    ADMIN SUITE
                  </span>
                  <span className="text-[9px] font-black text-[#FF690C] bg-[#FF690C]/15 px-1.5 py-0.2 rounded border border-[#FF690C]/30">
                    PRO
                  </span>
                </div>
              </div>
            </Link>
          )}

          {isCollapsed && (
            <div className="mx-auto">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0050CB] to-[#2563EB] flex items-center justify-center text-white shadow-lg ring-1 ring-white/20">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer hover:bg-slate-800/60"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>

        {/* Sidebar Navigation Links (Scrollable) */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-3.5 custom-scrollbar">
          {adminNavCategories.map((group) => {
            const visibleItems = group.items.filter((item) => item.show);
            if (visibleItems.length === 0) return null;

            return (
              <div key={group.category} className="space-y-1">
                {!isCollapsed && (
                  <div className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400/90 mb-1">
                    {group.category}
                  </div>
                )}

                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const isItemActive =
                    pathname === item.href ||
                    (item.href !== '/dashboard' && pathname.startsWith(item.href)) ||
                    item.subItems?.some((sub) => pathname === sub.href);
                  const hasSubItems = item.subItems && item.subItems.length > 0;
                  const isExpanded = openSubmenu === item.label || (openSubmenu === null && isItemActive);

                  return (
                    <div key={item.label} className="space-y-1">
                      {hasSubItems ? (
                        <button
                          type="button"
                          onClick={() => setOpenSubmenu(isExpanded ? '__closed__' : item.label)}
                          className={`w-full flex items-center justify-between ${
                            isCollapsed ? 'justify-center px-2' : 'px-3.5'
                          } py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer group ${
                            isItemActive
                              ? 'bg-[#0050CB] text-white shadow-md shadow-[#0050CB]/35 ring-1 ring-white/10'
                              : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                          }`}
                          title={isCollapsed ? item.label : undefined}
                        >
                          <div className="flex items-center">
                            <Icon
                              className={`h-4 w-4 ${isCollapsed ? '' : 'mr-3'} shrink-0 text-white group-hover:scale-105 transition-transform duration-200`}
                              strokeWidth={2.2}
                            />
                            {!isCollapsed && <span className="truncate">{item.label}</span>}
                          </div>
                          {!isCollapsed && (
                            <div className="flex items-center gap-1.5">
                              {item.badge && (
                                <span className="text-[9px] font-black bg-[#FF690C] text-white px-1.5 py-0.2 rounded-full">
                                  {item.badge}
                                </span>
                              )}
                              <ChevronDown
                                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                                  isExpanded ? 'rotate-180 text-white' : 'text-slate-400'
                                }`}
                              />
                            </div>
                          )}
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          title={item.label}
                          className={`flex items-center justify-between ${
                            isCollapsed ? 'justify-center px-2' : 'px-3.5'
                          } py-2.5 rounded-xl text-xs font-bold transition-all duration-200 group ${
                            isItemActive
                              ? 'bg-[#0050CB] text-white shadow-md shadow-[#0050CB]/35 ring-1 ring-white/10'
                              : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center">
                            <Icon
                              className={`h-4 w-4 ${isCollapsed ? '' : 'mr-3'} shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                                isItemActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                              }`}
                              strokeWidth={2.2}
                            />
                            {!isCollapsed && <span className="truncate">{item.label}</span>}
                          </div>
                          {!isCollapsed && item.badge && (
                            <span className="text-[9px] font-black bg-[#FF690C] text-white px-1.5 py-0.2 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      )}

                      {/* Submenu Expansion */}
                      {hasSubItems && isExpanded && !isCollapsed && (
                        <div className="pl-9 pr-2 space-y-1 pt-1 animate-in fade-in duration-150">
                          {item.subItems!.map((sub) => {
                            const isSubActive = pathname === sub.href;
                            return (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                  isSubActive
                                    ? 'text-white font-bold bg-[#0050CB]/35'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      isSubActive ? 'bg-[#FF690C]' : 'bg-slate-500'
                                    }`}
                                  />
                                  <span>{sub.label}</span>
                                </div>
                                {sub.badge && (
                                  <span className="text-[9px] bg-slate-700 text-slate-200 px-1 rounded">
                                    {sub.badge}
                                  </span>
                                )}
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

        {/* Sidebar Footer Admin Profile & Actions */}
        <div className="p-3 border-t border-slate-800/80 bg-[#0B1735]/70 space-y-1 shrink-0">
          <Link
            href="/dashboard/settings"
            title="System Settings"
            className={`flex items-center ${
              isCollapsed ? 'justify-center px-2' : 'px-3'
            } py-2 text-xs font-bold text-slate-300 hover:bg-slate-800/80 hover:text-white rounded-xl transition-all`}
          >
            <Settings className={`h-4 w-4 ${isCollapsed ? '' : 'mr-2.5'} text-slate-400 shrink-0`} />
            {!isCollapsed && <span>System Settings</span>}
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            title="Sign Out"
            className={`w-full flex items-center ${
              isCollapsed ? 'justify-center px-2' : 'px-3'
            } py-2 text-xs font-bold text-slate-300 hover:bg-rose-950/40 hover:text-rose-400 rounded-xl transition-all cursor-pointer`}
          >
            <LogOut className={`h-4 w-4 ${isCollapsed ? '' : 'mr-2.5'} text-slate-400 hover:text-rose-400 shrink-0`} />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header Bar (72px) */}
        <header className="h-18 bg-white dark:bg-[#07152F] border-b border-[#E6EAF2] dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-20 shadow-[0_2px_12px_rgba(0,14,40,0.03)]">
          {/* Left: Mobile Menu + Campus Selector + Academic Year */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Campus Selector Pill */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700 text-[#000E28] dark:text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5 text-[#0050CB] dark:text-[#E5EEFF]" />
                <span className="hidden sm:inline">GGPS Main Campus</span>
                <span className="sm:hidden">GGPS</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* Academic Year Selector Pill */}
              <button
                type="button"
                className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700 text-[#000E28] dark:text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-[#0050CB] dark:text-[#E5EEFF]" />
                <span>AY 2025 - 2026</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Global Search Pill (Cmd + K) */}
            <button
              type="button"
              onClick={() => {
                const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true, bubbles: true });
                window.dispatchEvent(event);
              }}
              className="hidden md:flex items-center justify-between w-[220px] xl:w-[280px] h-9 px-3.5 bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 rounded-full text-xs font-medium text-slate-500 dark:text-slate-400 cursor-pointer transition-all border border-slate-200/80 dark:border-slate-700 shadow-2xs"
            >
              <div className="flex items-center gap-2 truncate">
                <Search className="h-3.5 w-3.5 text-[#0050CB] dark:text-[#E5EEFF] shrink-0" />
                <span className="truncate">Search students, admissions...</span>
              </div>
              <span className="text-[10px] text-slate-400 font-bold bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded shadow-2xs shrink-0">
                ⌘ K
              </span>
            </button>

            {/* Notification Drawer */}
            <NotificationDrawer />

            {/* Messages Quick Action */}
            <Link
              href="/dashboard/chat"
              className="h-9 w-9 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200/80 dark:border-slate-700 shadow-2xs"
              title="Staff Messages"
            >
              <MessageSquare className="h-4 w-4 text-slate-600 dark:text-slate-300" />
            </Link>

            {/* Dark/Light Mode Switcher */}
            <button
              type="button"
              onClick={toggleTheme}
              className="h-9 w-9 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200/80 dark:border-slate-700 shadow-2xs"
              title="Toggle Dark/Light Mode"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>

            {/* Language / Direction Toggle */}
            <button
              type="button"
              onClick={() => setDirection(direction === 'ltr' ? 'rtl' : 'ltr')}
              className="hidden sm:flex h-9 w-9 items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200/80 dark:border-slate-700 shadow-2xs"
              title="Toggle Language / Direction"
            >
              <Globe className="h-4 w-4 text-slate-600 dark:text-slate-300" />
            </button>

            {/* Admin Profile Dropdown Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 py-1 px-1.5 rounded-full transition-colors cursor-pointer"
              >
                <div className="h-9 w-9 rounded-full bg-[#0050CB] text-white flex items-center justify-center font-black text-xs ring-2 ring-[#0050CB]/20 shadow-xs">
                  {user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="hidden sm:block text-left leading-tight pr-1">
                  <p className="text-xs font-black text-[#000E28] dark:text-white truncate max-w-[130px]">
                    {user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email : 'Administrator'}
                  </p>
                  <p className="text-[10px] text-[#0050CB] dark:text-[#E5EEFF] font-bold uppercase tracking-wider">
                    {roleStr || 'Super Admin'}
                  </p>
                </div>
                <ChevronDown className="hidden sm:block w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#08152F] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-black text-[#000E28] dark:text-white">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                  </div>
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>System Settings</span>
                  </Link>
                  <Link
                    href="/dashboard/audit-logs"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  >
                    <ShieldCheck className="w-4 h-4 text-slate-400" />
                    <span>Security Audit Logs</span>
                  </Link>
                  <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8 bg-[#F6F8FC] dark:bg-[#040C1A] transition-colors flex flex-col justify-between">
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
