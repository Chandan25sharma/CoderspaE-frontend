'use client';

import { motion } from 'framer-motion';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

const themes = [
  { id: 'dark' as const, name: 'Dark', icon: Moon, color: 'from-slate-800 to-slate-600' },
  { id: 'light' as const, name: 'Light', icon: Sun, color: 'from-slate-100 to-slate-300' },
  { id: 'hacker' as const, name: 'Hacker', icon: Monitor, color: 'from-green-800 to-green-600' },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="relative">
      <motion.div 
        className="flex bg-cyber-gray rounded-full p-1 gap-1"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {themes.map((themeOption) => {
          const Icon = themeOption.icon;
          const isActive = theme === themeOption.id;
          
          return (
            <motion.button
              key={themeOption.id}
              onClick={() => setTheme(themeOption.id)}
              className={`
                relative flex items-center justify-center w-10 h-10 rounded-full
                transition-all duration-300 group
                ${isActive 
                  ? 'bg-gradient-to-br text-white shadow-lg' 
                  : 'text-gray-400 hover:text-white hover:bg-cyber-light'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              layout
            >
              {/* Active theme background */}
              {isActive && (
                <motion.div
                  className={`absolute inset-0 rounded-full bg-gradient-to-br ${themeOption.color}`}
                  layoutId="activeTheme"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              
              {/* Icon */}
              <Icon className="w-5 h-5 relative z-10" />
              
              {/* Glow effect for active theme */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-white/20"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
              
              {/* Tooltip */}
              <motion.div
                className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-cyber-dark text-white text-xs px-2 py-1 rounded opacity-0 pointer-events-none whitespace-nowrap"
                initial={{ opacity: 0, y: 5 }}
                whileHover={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {themeOption.name} Mode
              </motion.div>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
