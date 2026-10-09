/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Open Sans"', 'system-ui', 'sans-serif'],
        heading: ['"Tenor Sans"', 'Georgia', 'serif'],
      },
      colors: {
        rose: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843'
        },
        blush: '#fdf2f8',
        charcoal: '#1f2937',
        cloud: '#f3f4f6',
        lightBlue: '#5BCEFA',
        transPink: '#F5A9B8',
      }
    },
  },
  plugins: [],
}
