import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Base colors
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Gamified color palette
        'neon-red': '#FF4444',
        'neon-green': '#44FF88',
        'neon-blue': '#4488FF',
        'neon-yellow': '#FFD700',
        'neon-purple': '#9D4EDD',
        'cyber-dark': '#121212',
        'cyber-gray': '#1E1E1E',
        'cyber-light': '#2A2A2A',
        // Theme variants
        'hacker-bg': '#0A0A0A',
        'hacker-accent': '#00FF41',
      },
      fontFamily: {
        'mono': ['Roboto Mono', 'monospace'],
        'sans': ['Inter', 'sans-serif'],
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'md': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounce-subtle 1s ease-in-out infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'confetti': 'confetti 0.6s ease-out',
        'typing': 'typing 1s steps(10) infinite',
        'level-up': 'level-up 0.8s ease-out',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': {
            opacity: '1',
            boxShadow: '0 0 20px rgba(255, 68, 68, 0.5)',
          },
          '50%': {
            opacity: '.8',
            boxShadow: '0 0 30px rgba(255, 68, 68, 0.8)',
          },
        },
        'bounce-subtle': {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-5px)',
          },
        },
        'slide-up': {
          from: {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'confetti': {
          '0%': {
            transform: 'scale(0) rotate(0deg)',
            opacity: '1',
          },
          '100%': {
            transform: 'scale(1) rotate(180deg)',
            opacity: '0',
          },
        },
        'typing': {
          'from': {
            width: '0',
          },
          'to': {
            width: '100%',
          },
        },
        'level-up': {
          '0%': {
            transform: 'scale(1) rotate(0deg)',
            opacity: '1',
          },
          '50%': {
            transform: 'scale(1.2) rotate(180deg)',
            opacity: '0.8',
          },
          '100%': {
            transform: 'scale(1) rotate(360deg)',
            opacity: '1',
          },
        },
      },
      boxShadow: {
        'neon': '0 0 20px rgba(255, 68, 68, 0.5)',
        'neon-green': '0 0 20px rgba(68, 255, 136, 0.5)',
        'neon-blue': '0 0 20px rgba(68, 136, 255, 0.5)',
        'cyber': '0 4px 20px rgba(0, 0, 0, 0.5)',
        'glow': '0 0 30px rgba(255, 255, 255, 0.1)',
      },
      backgroundImage: {
        'cyber-grid': 'linear-gradient(rgba(68, 255, 136, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(68, 255, 136, 0.1) 1px, transparent 1px)',
        'neon-gradient': 'linear-gradient(135deg, #FF4444, #44FF88, #4488FF)',
      },
      backgroundSize: {
        'grid': '20px 20px',
      },
    },
  },
  plugins: [],
};

export default config;
