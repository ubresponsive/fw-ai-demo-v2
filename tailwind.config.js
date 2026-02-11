/** @type {import('tailwindcss').Config} */
module.exports = {
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
        // Secondary — warm amber/gold for accents
        secondary: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
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
        'bell-ring': 'bell-ring 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
