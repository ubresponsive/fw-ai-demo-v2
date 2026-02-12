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
      },
      animation: {
        sparkle: 'sparkle 1.5s ease-in-out infinite',
        'sparkle-3': 'sparkle 1.5s ease-in-out 3',
        'bell-ring': 'bell-ring 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
