/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        apple: {
          blue: '#0071e3',
          'blue-dark': '#2997ff',
          'blue-hover': '#0077ed',
          black: '#000000',
          'surface-dark': '#1d1d1f',
          'surface-dark-2': '#2d2d2f',
          'surface-dark-3': '#3a3a3c',
          white: '#ffffff',
          'surface-light': '#f5f5f7',
          'surface-light-2': '#e8e8ed',
          'text-dark': '#f5f5f7',
          'text-dark-2': '#a1a1a6',
          'text-light': '#1d1d1f',
          'text-light-2': '#6e6e73',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['SF Mono', 'ui-monospace', 'Menlo', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.03em',
        tighter: '-0.02em',
        tight: '-0.015em',
      },
    },
  },
  plugins: [],
}

