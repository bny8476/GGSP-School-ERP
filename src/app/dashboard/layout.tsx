"use client";

import Link from 'next/link';
import { 
  LayoutDashboard, Users, UserCheck, GraduationCap, 
  DollarSign, BookOpen, Clock, Megaphone, Bus, 
  HeartPulse, Image as ImageIcon, WalletCards, 
  BarChart3, Settings, LogOut, FileText, Activity, 
  Gift, Globe, Sun, Moon, Search, PanelLeftClose, PanelLeft,
  Package, ShieldCheck, CheckCircle2, Lock, Database
} from 'lucide-react';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import CommandPalette from '@/components/ui/CommandPalette';
import NotificationDrawer from '@/components/ui/NotificationDrawer';

function DashboardContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme, toggleTheme, direction, setDirection } = useTheme();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        setUser(parsed);
      } catch (e) {}
    }
  }, []);

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

  const initial = user?.firstName ? user.firstName[0].toUpperCase() : 'G';

  const navItemClass = (href: string) => {
    const isActive = pathname === href;
    return `flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-3'} py-2.5 rounded-xl font-medium transition-all ${
      isActive 
        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-indigo-600 dark:hover:text-indigo-400'
    }`;
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <CommandPalette />

      {/* Sidebar */}
      <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col hidden md:flex transition-all duration-300`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
          {!isCollapsed && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
                <Globe className="h-5 w-5" />
              </div>
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                Global<span className="text-indigo-600 dark:text-indigo-400">Intl</span>
              </span>
            </Link>
          )}
          {isCollapsed && (
            <div className="mx-auto bg-indigo-600 p-2 rounded-lg text-white">
              <Globe className="h-5 w-5" />
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
            title="Toggle sidebar"
          >
            {isCollapsed ? <PanelLeft className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <Link href="/dashboard" className={navItemClass('/dashboard')} title="Dashboard">
            <LayoutDashboard className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span className="ml-3">Dashboard</span>}
          </Link>

          {(isSuperAdmin || isReceptionist) && (
            <Link href="/dashboard/admissions" className={navItemClass('/dashboard/admissions')} title="Admissions">
              <FileText className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span className="ml-3">Admissions</span>}
            </Link>
          )}

          {(isPrincipal || isTeacher) && (
            <Link href="/dashboard/students" className={navItemClass('/dashboard/students')} title="Student Mgmt">
              <GraduationCap className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span className="ml-3">Student 360°</span>}
            </Link>
          )}

          {(isPrincipal || isReceptionist) && (
            <Link href="/dashboard/parents" className={navItemClass('/dashboard/parents')} title="Parent Mgmt">
              <Users className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span className="ml-3">Parents & Guardians</span>}
            </Link>
          )}

          {(isPrincipal || isTeacher) && (
            <Link href="/dashboard/attendance" className={navItemClass('/dashboard/attendance')} title="Attendance">
              <UserCheck className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span className="ml-3">Attendance</span>}
            </Link>
          )}

          {(isAccountant || isPrincipal) && (
            <Link href="/dashboard/fees" className={navItemClass('/dashboard/fees')} title="Fee Mgmt">
              <DollarSign className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span className="ml-3">Fees & Collections</span>}
            </Link>
          )}

          {(isPrincipal) && (
            <Link href="/dashboard/teachers" className={navItemClass('/dashboard/teachers')} title="Teacher Mgmt">
              <BookOpen className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span className="ml-3">Staff Roster</span>}
            </Link>
          )}

          {(isSuperAdmin) && (
            <Link href="/dashboard/classes" className={navItemClass('/dashboard/classes')} title="Class Mgmt">
              <LayoutDashboard className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span className="ml-3">Classes & Sections</span>}
            </Link>
          )}

          {(isPrincipal || isTeacher) && (
            <Link href="/dashboard/daily-activity" className={navItemClass('/dashboard/daily-activity')} title="Daily Activity">
              <Activity className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span className="ml-3">Daily Diary</span>}
            </Link>
          )}

          {(isPrincipal || isReceptionist) && (
            <Link href="/dashboard/communication" className={navItemClass('/dashboard/communication')} title="Communication">
              <Megaphone className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span className="ml-3">Notices & Chat</span>}
            </Link>
          )}

          {(isPrincipal) && (
            <Link href="/dashboard/events" className={navItemClass('/dashboard/events')} title="Events">
              <Gift className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span className="ml-3">Events & Calendar</span>}
            </Link>
          )}

          {(isSuperAdmin || isReceptionist) && (
            <Link href="/dashboard/transport" className={navItemClass('/dashboard/transport')} title="Transport">
              <Bus className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span className="ml-3">Transport</span>}
            </Link>
          )}

          {(isSuperAdmin || isTeacher) && (
            <Link href="/dashboard/daycare" className={navItemClass('/dashboard/daycare')} title="Day Care">
              <Clock className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span className="ml-3">Daycare</span>}
            </Link>
          )}

          {(isSuperAdmin || isReceptionist) && (
            <Link href="/dashboard/health" className={navItemClass('/dashboard/health')} title="Health Records">
              <HeartPulse className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span className="ml-3">Health Logs</span>}
            </Link>
          )}

          {(isSuperAdmin || isTeacher) && (
            <Link href="/dashboard/gallery" className={navItemClass('/dashboard/gallery')} title="Gallery">
              <ImageIcon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span className="ml-3">Gallery</span>}
            </Link>
          )}

          {(isSuperAdmin) && (
            <Link href="/dashboard/payroll" className={navItemClass('/dashboard/payroll')} title="Staff Payroll">
              <WalletCards className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span className="ml-3">Payroll</span>}
            </Link>
          )}

          {(isPrincipal || isAccountant) && (
            <Link href="/dashboard/reports" className={navItemClass('/dashboard/reports')} title="Reports">
              <BarChart3 className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span className="ml-3">Reports</span>}
            </Link>
          )}

          {(isSuperAdmin || isPrincipal) && (
            <Link href="/dashboard/timeline" className={navItemClass('/dashboard/timeline')} title="Activity Stream">
              <Activity className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span className="ml-3">Activity Stream</span>}
            </Link>
          )}

          {(isPrincipal || isTeacher) && (
            <Link href="/dashboard/classroom" className={navItemClass('/dashboard/classroom')} title="Classroom & Courseware">
              <BookOpen className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span className="ml-3">Digital Classroom</span>}
            </Link>
          )}

          {(isSuperAdmin || isAccountant) && (
            <Link href="/dashboard/inventory" className={navItemClass('/dashboard/inventory')} title="Inventory & Procurement">
              <Package className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span className="ml-3">Inventory & PO</span>}
            </Link>
          )}

          {(isSuperAdmin || isReceptionist) && (
            <Link href="/dashboard/visitors" className={navItemClass('/dashboard/visitors')} title="Gate Pass & Visitors">
              <ShieldCheck className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span className="ml-3">Visitor Gate Pass</span>}
            </Link>
          )}

          {(isSuperAdmin || isPrincipal) && (
            <Link href="/dashboard/approvals" className={navItemClass('/dashboard/approvals')} title="Approval Center">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span className="ml-3">Approval Center</span>}
            </Link>
          )}

          {(isSuperAdmin) && (
            <Link href="/dashboard/security" className={navItemClass('/dashboard/security')} title="Security Center">
              <Lock className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span className="ml-3">Security Center</span>}
            </Link>
          )}

          {(isSuperAdmin || isPrincipal) && (
            <Link href="/dashboard/import-export" className={navItemClass('/dashboard/import-export')} title="Data Import / Export">
              <Database className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span className="ml-3">Import & Export</span>}
            </Link>
          )}
        </nav>


        <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-1 shrink-0">
          <Link href="/dashboard/settings" className={navItemClass('/dashboard/settings')} title="Settings">
            <Settings className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span className="ml-3">Settings</span>}
          </Link>
          <button 
            onClick={handleLogout} 
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : ''} px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl transition-colors`}
            title="Sign Out"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span className="ml-3 font-medium text-sm">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto flex flex-col">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{portalName}</h2>
            <div className="hidden sm:inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-100 dark:border-indigo-900">
              Global International ERP
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Quick Cmd+K Search Trigger */}
            <div className="hidden lg:flex items-center px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-medium text-slate-400 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <Search className="h-3.5 w-3.5 mr-2 text-slate-400" />
              <span>Search (Cmd+K)</span>
            </div>

            {/* RTL Toggle */}
            <button
              onClick={() => setDirection(direction === 'ltr' ? 'rtl' : 'ltr')}
              className="px-2.5 py-1 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
              title="Toggle Layout Direction (LTR/RTL)"
            >
              {direction.toUpperCase()}
            </button>

            {/* Notification Drawer 2.0 */}
            <NotificationDrawer />

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Toggle Dark/Light Mode"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>

            {/* User Profile Badge */}
            <div className="flex items-center space-x-3 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-600/30">
                {initial}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                  {user?.firstName || 'User'} {user?.lastName || ''}
                </div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  {roleStr || 'Staff'}
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 md:p-8 flex-1">
          {children}
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
