"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type LayoutMode = 'default' | 'mini' | 'boxed';
type Direction = 'ltr' | 'rtl';

interface ThemeContextType {
  theme: Theme;
  layoutMode: LayoutMode;
  direction: Direction;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setLayoutMode: (mode: LayoutMode) => void;
  setDirection: (dir: Direction) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light';
    try {
      const storedTheme = (localStorage.getItem('theme') || localStorage.getItem('gi_theme')) as Theme | null;
      if (storedTheme === 'dark' || storedTheme === 'light') return storedTheme;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    } catch {
      // Ignore in restricted environments
    }
    return 'light';
  });

  const [layoutMode, setLayoutModeState] = useState<LayoutMode>(() => {
    if (typeof window === 'undefined') return 'default';
    try {
      return (localStorage.getItem('gi_layout') as LayoutMode) || 'default';
    } catch {
      // Ignore
    }
    return 'default';
  });

  const [direction, setDirectionState] = useState<Direction>(() => {
    if (typeof window === 'undefined') return 'ltr';
    try {
      return (localStorage.getItem('gi_dir') as Direction) || 'ltr';
    } catch {
      // Ignore
    }
    return 'ltr';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.setAttribute('dir', direction);
  }, [theme, direction]);

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
