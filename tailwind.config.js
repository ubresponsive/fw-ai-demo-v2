/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand — based on #485DCA
        primary: {
          50: '#eef0fb',
          100: '#dde1f7',
          200: '#b9c1ef',
          300: '#96a1e6',
          400: '#7281de',
          500: '#485DCA',
          600: '#3a4bb5',
          700: '#2f3d94',
          800: '#242f73',
          900: '#1a2152',
          950: '#0f1331',
        },
        // Secondary — light cyan based on #C7EAF4
        secondary: {
          50: '#f0f9fc',
          100: '#e0f2f9',
          200: '#C7EAF4',
          300: '#9ad8eb',
          400: '#65c0de',
          500: '#3aa8d0',
          600: '#2b8ab0',
          700: '#256f8f',
          800: '#235c76',
          900: '#214d63',
          950: '#153342',
        },
        // Tertiary — teal for success/info states
        tertiary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        // Dark mode semantic colors (Dracula-inspired with slate)
        dark: {
          bg: '#0f172a',      // slate-900 - main dark background
          surface: '#1e293b', // slate-800 - elevated surfaces (cards, panels)
          elevated: '#334155', // slate-700 - highly elevated (modals, popovers)
          border: '#475569',  // slate-600 - borders in dark mode
        },
        'dark-text': {
          primary: '#f1f5f9',   // slate-100 - high contrast text
          secondary: '#cbd5e1', // slate-300 - medium contrast text
          tertiary: '#94a3b8',  // slate-400 - lower contrast text
          muted: '#64748b',     // slate-500 - very muted text
        },
        // Neutral palette — semantic slate-based neutrals (single source of truth)
        neutral: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        // Schedule category colours — operational area indicators
        schedule: {
          purchasing: '#3b82f6',  // blue-500
          sales:      '#f59e0b',  // amber-500
          accounts:   '#10b981',  // emerald-500
          inventory:  '#ef4444',  // red-500
          production: '#8b5cf6',  // violet-500
        },
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.07)',
      },
      keyframes: {
        sparkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1) rotate(0deg)' },
          '50%': { opacity: '0.7', transform: 'scale(1.15) rotate(8deg)' },
        },
        'bell-ring': {
          '0%': { transform: 'rotate(0deg)' },
          '10%': { transform: 'rotate(14deg)' },
          '20%': { transform: 'rotate(-14deg)' },
          '30%': { transform: 'rotate(10deg)' },
          '40%': { transform: 'rotate(-8deg)' },
          '50%': { transform: 'rotate(4deg)' },
          '60%': { transform: 'rotate(-2deg)' },
          '70%, 100%': { transform: 'rotate(0deg)' },
        },
        'ai-bounce': {
          '0%, 60%, 100%': { transform: 'translateY(0)' },
          '30%': { transform: 'translateY(-6px)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'highlight-green': {
          '0%': { backgroundColor: 'rgb(240 253 244)' },
          '100%': { backgroundColor: 'transparent' },
        },
        'highlight-green-dark': {
          '0%': { backgroundColor: 'rgba(16, 185, 129, 0.15)' },
          '100%': { backgroundColor: 'transparent' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      animation: {
        sparkle: 'sparkle 1.5s ease-in-out infinite',
        'sparkle-3': 'sparkle 1.5s ease-in-out 3',
        'bell-ring': 'bell-ring 1s ease-in-out infinite',
        'ai-bounce': 'ai-bounce 1.2s ease-in-out infinite',
        'fade-in': 'fade-in 0.3s ease-out',
        'highlight-green': 'highlight-green 2s ease-out forwards',
        'highlight-green-dark': 'highlight-green-dark 2s ease-out forwards',
        'scale-in': 'scale-in 0.3s ease-out',
        blink: 'blink 0.8s step-end infinite',
      },
    },
  },
  plugins: [],
}
