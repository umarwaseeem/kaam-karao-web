/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00B4A6',
        secondary: '#FFAB40',
        bg: '#090E18',
        surface: '#161B22',
        elevated: '#1F2937',
        muted: '#8B949E',
        error: '#F97583',
        success: '#3FB950',
      },
      fontFamily: {
        rubik: ['Rubik', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

