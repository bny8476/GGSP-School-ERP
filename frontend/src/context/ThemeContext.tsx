"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type LayoutMode = 'default' | 'mini' | 'boxed';
type Direction = 'ltr' | 'rtl';

interface ThemeContextType {
  theme: Theme;
  layoutMode: LayoutMode;
  direction: Direction;
  mounted: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setLayoutMode: (mode: LayoutMode) => void;
  setDirection: (dir: Direction) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Always initialize with deterministic SSR-safe defaults to prevent hydration mismatch
  const [theme, setThemeState] = useState<Theme>('light');
  const [layoutMode, setLayoutModeState] = useState<LayoutMode>('default');
  const [direction, setDirectionState] = useState<Direction>('ltr');
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    let activeTheme: Theme = 'light';
    try {
      const storedTheme = (localStorage.getItem('theme') || localStorage.getItem('gi_theme')) as Theme | null;
      if (storedTheme === 'dark' || storedTheme === 'light') {
        activeTheme = storedTheme;
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        activeTheme = 'dark';
      }
      setThemeState(activeTheme);

      const storedLayout = localStorage.getItem('gi_layout') as LayoutMode | null;
      if (storedLayout && ['default', 'mini', 'boxed'].includes(storedLayout)) {
        setLayoutModeState(storedLayout);
      }

      const storedDir = localStorage.getItem('gi_dir') as Direction | null;
      if (storedDir && ['ltr', 'rtl'].includes(storedDir)) {
        setDirectionState(storedDir);
        document.documentElement.setAttribute('dir', storedDir);
      }
    } catch {
      // Ignore in restricted environments
    }
    document.documentElement.classList.toggle('dark', activeTheme === 'dark');
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('theme', newTheme);
      localStorage.setItem('gi_theme', newTheme);
    } catch {
      // Ignore
    }
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const setLayoutMode = (mode: LayoutMode) => {
    setLayoutModeState(mode);
    try {
      localStorage.setItem('gi_layout', mode);
    } catch {
      // Ignore
    }
  };

  const setDirection = (dir: Direction) => {
    setDirectionState(dir);
    try {
      localStorage.setItem('gi_dir', dir);
    } catch {
      // Ignore
    }
    document.documentElement.setAttribute('dir', dir);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        layoutMode,
        direction,
        mounted,
        toggleTheme,
        setTheme,
        setLayoutMode,
        setDirection,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
