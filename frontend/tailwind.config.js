/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#F7F6F2',
        'bg-secondary': '#EFEEE9',
        'surface': '#FFFFFF',
        'accent': '#1D6954',
        'accent-light': '#E8F3EF',
        'crowd-low': '#1D6954',
        'crowd-low-bg': '#E8F3EF',
        'crowd-moderate': '#B8860B',
        'crowd-moderate-bg': '#FBF5E0',
        'crowd-high': '#C85E2A',
        'crowd-high-bg': '#FDF0E8',
        'crowd-critical': '#B91C1C',
        'crowd-critical-bg': '#FEE2E2',
        'text-primary': '#1A1916',
        'text-muted': '#8C8A82',
        'border': '#E4E2DA',
        'chat-seena': '#E8F3EF',
        'chat-user': '#1D6954',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'chat': '18px',
        'card': '16px',
        'chip': '100px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 10px 25px rgba(0,0,0,0.08), 0 4px 10px rgba(0,0,0,0.04)',
        'chat': '0 8px 30px rgba(0,0,0,0.12)',
        'float': '0 4px 20px rgba(0,0,0,0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'bounce-dots': 'bounceDots 1.4s infinite ease-in-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
      },
      keyframes: {
        bounceDots: {
          '0%, 80%, 100%': { transform: 'scale(0)' },
          '40%': { transform: 'scale(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
