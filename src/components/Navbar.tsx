"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Menu, X, Sun, Moon, Globe, ChevronDown, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import AcademyLogo from '@/components/AcademyLogo';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage, type LanguageCode } from '@/context/LanguageContext';
import { InteractiveHoverButton } from "@/registry/magicui/interactive-hover-button";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { language, currentLanguage, setLanguage, languages, t } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const pathname = usePathname();
  const langRef = useRef<HTMLDivElement>(null);

  // Close language dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (pathname === '/login') {
    return null;
  }

  const isDark = theme === 'dark';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#000E28]/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <AcademyLogo size="md" />
          <span className="text-2xl font-black tracking-tight text-[#000E28] dark:text-white transition-colors">
            E.A.S.<span className="text-[#0050CB]">Academy</span>
          </span>
        </Link>

        {/* Center Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm tracking-wide transition-all ${
              pathname === '/'
                ? 'text-[#0050CB] font-bold border-b-2 border-[#0050CB] pb-1'
                : 'text-slate-700 dark:text-slate-200 hover:text-[#0050CB] dark:hover:text-[#E5EEFF] font-semibold pb-1 hover:border-b-2 hover:border-blue-300'
            }`}
          >
            {t('nav.home', 'Home')}
          </Link>

          <span className="text-slate-300 dark:text-slate-700 font-light text-sm select-none">|</span>

          <Link
            href="/admissions"
            className={`text-sm tracking-wide transition-all ${
              pathname === '/admissions'
                ? 'text-[#0050CB] font-bold border-b-2 border-[#0050CB] pb-1'
                : 'text-slate-700 dark:text-slate-200 hover:text-[#0050CB] dark:hover:text-[#E5EEFF] font-semibold pb-1 hover:border-b-2 hover:border-blue-300'
            }`}
          >
            {t('nav.admissions', 'Admissions')}
          </Link>

          <span className="text-slate-300 dark:text-slate-700 font-light text-sm select-none">|</span>

          <Link
            href="/login"
            className={`text-sm tracking-wide transition-all ${
              pathname === '/login'
                ? 'text-[#0050CB] font-bold border-b-2 border-[#0050CB] pb-1'
                : 'text-slate-700 dark:text-slate-200 hover:text-[#0050CB] dark:hover:text-[#E5EEFF] font-semibold pb-1 hover:border-b-2 hover:border-blue-300'
            }`}
          >
            {t('nav.adminPortal', 'Admin Portal')}
          </Link>
        </div>

        {/* Right Desktop Controls */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle Pill */}
          <div className="flex items-center bg-white dark:bg-[#001438] border border-slate-200/90 dark:border-slate-700 rounded-full p-1 shadow-xs hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                !isDark
                  ? 'bg-[#E5EEFF] text-[#0050CB] shadow-xs'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
              title="Light mode"
              aria-label="Light mode"
            >
              <Sun className="w-4 h-4" strokeWidth={2.2} />
            </button>
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                isDark
                  ? 'bg-[#0050CB] text-white shadow-xs'
                  : 'text-slate-500 hover:text-[#000E28] dark:hover:text-white'
              }`}
              title="Dark mode"
              aria-label="Dark mode"
            >
              <Moon className="w-3.5 h-3.5" strokeWidth={2.2} />
            </button>
          </div>

          {/* Language Selector Dropdown Pill */}
          <div className="relative" ref={langRef}>
            <button
              type="button"
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#001438] border border-slate-200/90 dark:border-slate-700 text-[#000E28] dark:text-white hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/80 dark:hover:bg-slate-800/80 transition-all shadow-xs text-sm font-semibold cursor-pointer"
              aria-haspopup="true"
              aria-expanded={isLangOpen}
            >
              <Globe className="w-4 h-4 text-slate-600 dark:text-slate-300" strokeWidth={2} />
              <span>{currentLanguage.nativeName}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#001438] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3.5 py-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  {t('nav.selectLanguage', 'Select Language')}
                </div>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsLangOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between hover:bg-[#E5EEFF] dark:hover:bg-[#0050CB]/25 hover:text-[#0050CB] dark:hover:text-blue-300 transition-colors cursor-pointer ${
                      language === lang.code ? 'text-[#0050CB] dark:text-blue-400 font-bold bg-[#E5EEFF]/60 dark:bg-[#0050CB]/20' : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span>{lang.nativeName}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{lang.label}</span>
                    </div>
                    {language === lang.code && (
                      <Check className="w-4 h-4 text-[#0050CB] dark:text-blue-400" strokeWidth={2.5} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Enroll Now CTA Button with Magic UI Interactive Hover Effect */}
          <InteractiveHoverButton href="/admissions" className="ml-1">
            {t('nav.enrollNow', 'Enroll Now')}
          </InteractiveHoverButton>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-slate-700 dark:text-slate-200 hover:text-[#0050CB] focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-[#000E28] border-b border-slate-200 dark:border-slate-800 px-6 py-5 flex flex-col gap-4 shadow-xl animate-in slide-in-from-top duration-200">
          <Link
            href="/"
            className="text-slate-800 dark:text-slate-100 font-semibold py-2 hover:text-[#0050CB]"
            onClick={() => setIsOpen(false)}
          >
            {t('nav.home', 'Home')}
          </Link>
          <Link
            href="/admissions"
            className="text-[#0050CB] font-bold py-2"
            onClick={() => setIsOpen(false)}
          >
            {t('nav.admissions', 'Admissions')}
          </Link>
          <Link
            href="/login"
            className="text-slate-700 dark:text-slate-300 font-semibold py-2 hover:text-[#0050CB]"
            onClick={() => setIsOpen(false)}
          >
            {t('nav.adminPortal', 'Admin Portal')}
          </Link>
          
          {/* Mobile Theme & Language Controls */}
          <div className="flex flex-col gap-3 pt-3 pb-1 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Theme</span>
              <div className="flex items-center bg-slate-100 dark:bg-[#001438] border border-slate-200 dark:border-slate-700 rounded-full p-1">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    !isDark ? 'bg-[#E5EEFF] text-[#0050CB] shadow-xs' : 'text-slate-400 dark:text-slate-500'
                  }`}
                  aria-label="Light mode"
                >
                  <Sun className="w-4 h-4" strokeWidth={2.2} />
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    isDark ? 'bg-[#0050CB] text-white shadow-xs' : 'text-slate-500 hover:text-[#000E28]'
                  }`}
                  aria-label="Dark mode"
                >
                  <Moon className="w-3.5 h-3.5" strokeWidth={2.2} />
                </button>
              </div>
            </div>

            {/* Language Selection row on mobile */}
            <div>
              <span className="text-xs text-slate-500 font-medium block mb-2">{t('nav.selectLanguage', 'Select Language')}</span>
              <div className="grid grid-cols-3 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setLanguage(lang.code);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold text-center transition-all ${
                      language === lang.code
                        ? 'bg-[#0050CB] text-white border-[#0050CB]'
                        : 'bg-slate-50 dark:bg-[#001438] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {lang.nativeName}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <InteractiveHoverButton 
            href="/admissions" 
            className="w-full mt-1 justify-center"
            onClick={() => setIsOpen(false)}
          >
            {t('nav.enrollNow', 'Enroll Now')}
          </InteractiveHoverButton>
        </div>
      )}
    </nav>
  );
}

