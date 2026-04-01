/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Source Sans Pro', 'sans-serif'],
        display: ['Source Sans Pro', 'sans-serif'],
        'portal': ['DM Sans', 'system-ui', 'sans-serif'],
        'portal-heading': ['DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        portal: {
          bg: '#F7F6F3',
          card: '#FFFFFF',
          sidebar: '#FFFFFF',
          border: '#E0DDD6',
          'border-subtle': '#F0EDE7',
          accent: '#6B4FBB',
          'accent-light': '#EDE9FF',
          'accent-text': '#4A3490',
          green: '#22A06B',
          'green-light': '#E8F6EF',
          amber: '#E8902A',
          'amber-light': '#FFF3E0',
          red: '#FF4D4D',
          text: '#1A1916',
          'text-secondary': '#3D3C38',
          'text-muted': '#7A7870',
          'text-hint': '#9A9890',
          'text-faint': '#B8B5AE',
        },
      },
      fontSize: {
        '7xl': ['4.5rem', { lineHeight: '1.1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
      },
      letterSpacing: {
        tighter: '-0.05em',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}