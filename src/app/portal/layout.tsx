"use client";

import Link from 'next/link';
import { Home, CalendarHeart, UserCheck, Wallet, Settings, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        setUser(parsed);
      } catch (e) {}
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const initial = user?.firstName ? user.firstName[0].toUpperCase() : 'P';
  const role = user?.role || 'Parent';

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-900 border-r border-indigo-800 flex flex-col hidden md:flex text-white">
        <div className="h-20 flex items-center px-6 border-b border-indigo-800/50">
          <span className="text-xl font-black tracking-tight text-white">E.A.S. Academy School Portal</span>
        </div>
        
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-lg border-2 border-indigo-400">
              {initial}
            </div>
            <div>
              <div className="font-bold">{user?.firstName} {user?.lastName}</div>
              <div className="text-xs text-indigo-300 font-medium uppercase tracking-wider">{role}</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-2">
          <Link href="/portal" className={`flex items-center px-4 py-3 rounded-xl font-bold transition-colors ${pathname === '/portal' ? 'bg-indigo-600 text-white' : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'}`}>
            <Home className="h-5 w-5 mr-3" />
            Dashboard
          </Link>
          <Link href="/portal/diary" className={`flex items-center px-4 py-3 rounded-xl font-bold transition-colors ${pathname === '/portal/diary' ? 'bg-indigo-600 text-white' : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'}`}>
            <CalendarHeart className="h-5 w-5 mr-3" />
            Daily Diary
          </Link>
          <Link href="/portal/attendance" className={`flex items-center px-4 py-3 rounded-xl font-bold transition-colors ${pathname === '/portal/attendance' ? 'bg-indigo-600 text-white' : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'}`}>
            <UserCheck className="h-5 w-5 mr-3" />
            Attendance
          </Link>
          <Link href="/portal/finance" className={`flex items-center px-4 py-3 rounded-xl font-bold transition-colors ${pathname === '/portal/finance' ? 'bg-indigo-600 text-white' : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'}`}>
            <Wallet className="h-5 w-5 mr-3" />
            Fee Status
          </Link>
        </nav>
        
        <div className="p-4 border-t border-indigo-800/50 space-y-2">
          <Link href="/portal/settings" className={`flex items-center px-4 py-3 rounded-xl font-bold transition-colors ${pathname === '/portal/settings' ? 'bg-indigo-600 text-white' : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'}`}>
            <Settings className="h-5 w-5 mr-3" />
            Settings
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center px-4 py-3 text-indigo-200 hover:bg-rose-500/20 hover:text-rose-300 rounded-xl font-bold transition-colors">
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-end px-8 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center space-x-4">
             <div className="text-sm font-bold text-slate-600">Need Help? Contact Admin</div>
          </div>
        </header>
        <div className="p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
