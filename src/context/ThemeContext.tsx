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
  const [theme, setThemeState] = useState<Theme>('light');
  const [layoutMode, setLayoutModeState] = useState<LayoutMode>('default');
  const [direction, setDirectionState] = useState<Direction>('ltr');

  useEffect(() => {
    try {
      const storedTheme = (localStorage.getItem('theme') || localStorage.getItem('gi_theme')) as Theme | null;
      const savedLayout = (localStorage.getItem('gi_layout') as LayoutMode) || 'default';
      const savedDir = (localStorage.getItem('gi_dir') as Direction) || 'ltr';

      if (storedTheme === 'dark' || storedTheme === 'light') {
        setThemeState(storedTheme);
        document.documentElement.classList.toggle('dark', storedTheme === 'dark');
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setThemeState('dark');
        document.documentElement.classList.add('dark');
      }

      setLayoutModeState(savedLayout);
      setDirectionState(savedDir);
      document.documentElement.setAttribute('dir', savedDir);
    } catch (_) {
      // Ignore localStorage access issues in restricted environments
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('theme', newTheme);
      localStorage.setItem('gi_theme', newTheme);
    } catch (_) {}

    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const setLayoutMode = (mode: LayoutMode) => {
    setLayoutModeState(mode);
    try {
      localStorage.setItem('gi_layout', mode);
    } catch (_) {}
  };

  const setDirection = (dir: Direction) => {
    setDirectionState(dir);
    try {
      localStorage.setItem('gi_dir', dir);
    } catch (_) {}
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
