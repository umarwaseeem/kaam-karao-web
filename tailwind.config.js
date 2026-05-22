/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#00B4A6',
        'primary-dark': '#007a74',
        secondary: '#FFAB40',
        // Dark theme
        'dark-bg': '#090E18',
        'dark-surface': '#161B22',
        'dark-elevated': '#1F2937',
        'dark-on-surface': '#8B949E',
        'dark-border': 'rgba(255,255,255,0.08)',
        // Light theme
        'light-bg': '#F5F7FA',
        'light-surface': '#FFFFFF',
        'light-elevated': '#EDF0F4',
        'light-on-bg': '#0D1117',
        'light-on-surface': '#57606A',
        'light-border': '#D0D7DE',
        // Semantic (CSS-var backed, switches with theme class)
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        elevated: 'var(--color-elevated)',
        muted: 'var(--color-muted)',
        'on-bg': 'var(--color-on-bg)',
        border: 'var(--color-border)',
        error: 'var(--color-error)',
        success: '#3FB950',
      },
      fontFamily: {
        rubik: ['Rubik', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
        'pulse-dot': 'pulseDot 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        pulseDot: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.4 } },
      },
    },
  },
  plugins: [],
}

