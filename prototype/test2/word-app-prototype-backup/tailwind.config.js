/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2E86AB',
        'primary-light': '#4DA1C0',
        'primary-dark': '#1A5F7A',
        secondary: {
          purple: '#9B51E0',
          green: '#27AE60',
        },
        accent: '#F5A623',
        background: '#F9F7F5',
        'text-main': '#1A1A1A',
        'text-sub': '#4A4A4A',
        'text-muted': '#9CA3AF',
      },
      fontFamily: {
        sans: ['"Source Han Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(46, 134, 171, 0.08)',
        'soft-hover': '0 10px 30px -5px rgba(46, 134, 171, 0.15)',
        'inner-light': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.3)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        }
      },
      spacing: {
        'safe-top': '59px',
        'safe-bottom': '34px',
      },
      screens: {
        'iphone': '390px',
      }
    },
  },
  plugins: [],
}
