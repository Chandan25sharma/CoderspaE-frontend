'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'hacker';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    // Load theme from localStorage
    const saved = localStorage.getItem('coderspae-theme') as Theme;
    if (saved && ['dark', 'light', 'hacker'].includes(saved)) {
      setTheme(saved);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    root.classList.remove('dark', 'light', 'hacker');
    root.classList.add(theme);
    
    // Apply theme-specific styles
    switch (theme) {
      case 'dark':
        root.style.setProperty('--background', '#121212');
        root.style.setProperty('--foreground', '#ffffff');
        root.style.setProperty('--primary', '#FF4444');
        root.style.setProperty('--secondary', '#44FF88');
        break;
      case 'light':
        root.style.setProperty('--background', '#ffffff');
        root.style.setProperty('--foreground', '#000000');
        root.style.setProperty('--primary', '#FF4444');
        root.style.setProperty('--secondary', '#44FF88');
        break;
      case 'hacker':
        root.style.setProperty('--background', '#0A0A0A');
        root.style.setProperty('--foreground', '#00FF41');
        root.style.setProperty('--primary', '#00FF41');
        root.style.setProperty('--secondary', '#FFD700');
        break;
    }

    // Save to localStorage
    localStorage.setItem('coderspae-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const themes: Theme[] = ['dark', 'light', 'hacker'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
