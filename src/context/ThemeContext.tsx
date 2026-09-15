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
  setLayoutMode: (mode: LayoutMode) => void;
  setDirection: (dir: Direction) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [layoutMode, setLayoutModeState] = useState<LayoutMode>('default');
  const [direction, setDirectionState] = useState<Direction>('ltr');

  useEffect(() => {
    const savedTheme = (localStorage.getItem('gi_theme') as Theme) || 'light';
    const savedLayout = (localStorage.getItem('gi_layout') as LayoutMode) || 'default';
    const savedDir = (localStorage.getItem('gi_dir') as Direction) || 'ltr';

    setTheme(savedTheme);
    setLayoutModeState(savedLayout);
    setDirectionState(savedDir);

    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    document.documentElement.setAttribute('dir', savedDir);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('gi_theme', nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  };

  const setLayoutMode = (mode: LayoutMode) => {
    setLayoutModeState(mode);
    localStorage.setItem('gi_layout', mode);
  };

  const setDirection = (dir: Direction) => {
    setDirectionState(dir);
    localStorage.setItem('gi_dir', dir);
    document.documentElement.setAttribute('dir', dir);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        layoutMode,
        direction,
        toggleTheme,
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
