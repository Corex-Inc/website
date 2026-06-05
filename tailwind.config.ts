/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        minecraft: ['Minecraft', 'sans-serif'],
        emoji: ['Noto Color Emoji', 'sans-serif'],
        unbounded: ['Unbounded', 'cursive'],
        jost: ['Jost', 'sans-serif'],
      },
      colors: {
        mc: {
          '0': '#000000', // Black
          '1': '#0000AA', // Dark Blue
          '2': '#00AA00', // Dark Green
          '3': '#00AAAA', // Dark Aqua
          '4': '#AA0000', // Dark Red
          '5': '#AA00AA', // Dark Purple
          '6': '#FFAA00', // Gold
          '7': '#AAAAAA', // Gray
          '8': '#555555', // Dark Gray
          '9': '#5555FF', // Blue
          'a': '#55FF55', // Green
          'b': '#55FFFF', // Aqua
          'c': '#FF5555', // Red
          'd': '#FF55FF', // Light Purple
          'e': '#FFFF55', // Yellow
          'f': '#FFFFFF', // White

          'shadow-0': '#000000',
          'shadow-1': '#00002A',
          'shadow-2': '#002A00',
          'shadow-3': '#002A2A',
          'shadow-4': '#2A0000',
          'shadow-5': '#2A002A',
          'shadow-6': '#3F2A00',
          'shadow-7': '#2A2A2A',
          'shadow-8': '#151515',
          'shadow-9': '#15153F',
          'shadow-a': '#153F15',
          'shadow-b': '#153F3F',
          'shadow-c': '#3F1515',
          'shadow-d': '#3F153F',
          'shadow-e': '#3F3F15',
          'shadow-f': '#3F3F3F',
        },
        surface: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          850: '#1e1e21',
          900: '#18181b',
          950: '#09090b',
        },
        accent: {
          DEFAULT: '#e4e4e7',
          dim: '#a1a1aa',
          bright: '#ffffff',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'slide-in': 'slideIn 0.5s ease-out forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
