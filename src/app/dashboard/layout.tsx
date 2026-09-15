"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Users, UserCheck, GraduationCap, 
  CalendarHeart, DollarSign, BookOpen, Clock, 
  Megaphone, Bus, HeartPulse, Image as ImageIcon, 
  WalletCards, BarChart3, Settings, LogOut, 
  FileText, Activity, Gift
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
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
  
  const portalName = isSuperAdmin ? 'Super Admin Portal' 
    : r === 'principal' ? 'Principal Portal'
    : r === 'teacher' ? 'Teacher Portal'
    : r === 'accountant' ? 'Accounts Portal'
    : 'Staff Portal';

  const initial = user?.firstName ? user.firstName[0].toUpperCase() : 'A';
  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Administrator';

  const navItems = [
    { href: '/dashboard', label: t('nav.home', 'Dashboard'), icon: LayoutDashboard, show: true },
    { href: '/dashboard/admissions', label: t('nav.admissions', 'Admissions'), icon: FileText, show: isSuperAdmin || isReceptionist },
    { href: '/dashboard/students', label: t('footer.students', 'Student Mgmt'), icon: GraduationCap, show: isPrincipal || isTeacher },
    { href: '/dashboard/parents', label: 'Parent Mgmt', icon: Users, show: isPrincipal || isReceptionist },
    { href: '/dashboard/attendance', label: t('footer.attendance', 'Attendance'), icon: UserCheck, show: isPrincipal || isTeacher },
    { href: '/dashboard/fees', label: t('footer.fees', 'Fee Mgmt'), icon: DollarSign, show: isAccountant || isPrincipal },
    { href: '/dashboard/teachers', label: 'Teacher Mgmt', icon: BookOpen, show: isPrincipal },
    { href: '/dashboard/classes', label: 'Class Mgmt', icon: LayoutDashboard, show: isSuperAdmin },
    { href: '/dashboard/daily-activity', label: 'Daily Activity', icon: Activity, show: isPrincipal || isTeacher },
    { href: '/dashboard/communication', label: 'Communication', icon: Megaphone, show: isPrincipal || isReceptionist },
    { href: '/dashboard/events', label: 'Events', icon: Gift, show: isPrincipal },
    { href: '/dashboard/transport', label: 'Transport', icon: Bus, show: isSuperAdmin || isReceptionist },
    { href: '/dashboard/daycare', label: 'Day Care', icon: Clock, show: isSuperAdmin || isTeacher },
    { href: '/dashboard/health', label: 'Health Records', icon: HeartPulse, show: isSuperAdmin || isReceptionist },
    { href: '/dashboard/gallery', label: 'Gallery', icon: ImageIcon, show: isSuperAdmin || isTeacher },
    { href: '/dashboard/payroll', label: t('footer.payroll', 'Staff Payroll'), icon: WalletCards, show: isSuperAdmin },
    { href: '/dashboard/reports', label: 'Reports', icon: BarChart3, show: isPrincipal || isAccountant },
  ];

  return (
    <div className="flex h-screen bg-[#F7FAFE] dark:bg-[#000a1f] text-[#000E28] dark:text-white transition-colors duration-200 overflow-hidden font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-[#000E28] border-r border-slate-200/80 dark:border-slate-800 flex flex-col hidden md:flex shrink-0 shadow-xs z-30 transition-colors">
        
        {/* Sidebar Nav Links */}
        <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-1 custom-scrollbar">
          {navItems.filter(item => item.show).map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#E5EEFF] dark:bg-[#0050CB]/20 text-[#0050CB] dark:text-[#38BDF8] shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/50 hover:text-[#0050CB] dark:hover:text-white'
                }`}
              >
                <Icon className={`h-4 w-4 mr-3 transition-colors ${
                  isActive ? 'text-[#0050CB] dark:text-[#38BDF8]' : 'text-slate-400 group-hover:text-[#0050CB]'
                }`} strokeWidth={isActive ? 2.4 : 2} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#0050CB] dark:bg-[#38BDF8]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer Settings & Logout */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1 shrink-0">
          <Link 
            href="/dashboard/settings" 
            className="flex items-center px-3.5 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/50 hover:text-[#0050CB] dark:hover:text-[#38BDF8] rounded-xl transition-colors"
          >
            <Settings className="h-4 w-4 mr-3 text-slate-400" />
            <span>Settings</span>
          </Link>
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center px-3.5 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4 mr-3 text-slate-400 hover:text-rose-600" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Dashboard Topbar */}
        <header className="h-16 bg-white/95 dark:bg-[#000E28]/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-6 sm:px-8 shrink-0 z-20 transition-colors">
          
          {/* Left: Portal Title & Role Pill */}
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-black text-[#000E28] dark:text-white tracking-tight">
              {portalName}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5EEFF] dark:bg-[#0050CB]/20 border border-[#0050CB]/20 text-[#0050CB] dark:text-[#38BDF8] text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Portal</span>
            </span>
          </div>

          {/* Right Controls: User Profile Pill */}
          <div className="flex items-center gap-3">
            {/* User Profile Pill */}
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#0050CB] to-[#38BDF8] flex items-center justify-center text-white font-black shadow-md text-sm ring-2 ring-white dark:ring-[#001438]">
                {initial}
              </div>
              <div className="hidden lg:block text-left leading-tight">
                <p className="text-xs font-bold text-[#000E28] dark:text-white truncate max-w-[120px]">
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
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 bg-gradient-to-b from-[#F7FAFE] via-white to-[#F6F9FE] dark:from-[#000a1f] dark:via-[#000E28] dark:to-[#000a1f] transition-colors">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </div>

      </main>
    </div>
  );
}
