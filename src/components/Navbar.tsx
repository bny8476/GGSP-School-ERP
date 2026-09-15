"use client";

import Link from 'next/link';
import { Globe, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto glass-panel-heavy rounded-2xl flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="bg-indigo-600 p-2.5 rounded-xl group-hover:rotate-12 transition-transform text-white shadow-md shadow-indigo-600/30">
            <Globe className="h-6 w-6" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-slate-900">
            Global<span className="text-indigo-600">International</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 font-medium">
          <Link href="/" className="text-slate-600 hover:text-violet-600 transition-colors">Home</Link>
          <Link href="/admissions" className="text-slate-600 hover:text-violet-600 transition-colors">Admissions</Link>
          <Link href="/login" className="text-slate-600 hover:text-violet-600 transition-colors">Admin Portal</Link>
          <Link 
            href="/admissions" 
            className="px-6 py-2.5 rounded-xl bg-violet-600 text-white font-bold hover:bg-violet-500 shadow-lg shadow-violet-500/30 transition-all hover:-translate-y-0.5"
          >
            Enroll Now
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-slate-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-24 left-4 right-4 glass-panel-heavy rounded-2xl p-4 flex flex-col gap-4 shadow-xl">
          <Link href="/" className="p-3 text-slate-700 font-medium hover:bg-violet-50 rounded-xl" onClick={() => setIsOpen(false)}>Home</Link>
          <Link href="/admissions" className="p-3 text-slate-700 font-medium hover:bg-violet-50 rounded-xl" onClick={() => setIsOpen(false)}>Admissions</Link>
          <Link href="/login" className="p-3 text-slate-700 font-medium hover:bg-violet-50 rounded-xl" onClick={() => setIsOpen(false)}>Admin Portal</Link>
          <Link 
            href="/admissions" 
            className="p-3 mt-2 text-center rounded-xl bg-violet-600 text-white font-bold"
            onClick={() => setIsOpen(false)}
          >
            Enroll Now
          </Link>
        </div>
      )}
    </nav>
  );
}
