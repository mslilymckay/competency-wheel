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
          700: '#B23267', // Brand Deep Pink
          800: '#942854',
          900: '#751e42'
        },
        deepPink: '#B23267',
        lightPink: '#FFAEC9',
        deepBlue: '#0B538C',
        lightBlue: '#00CCFF',
        forestGreen: '#1E5C32',
        mintGreen: '#82D18D',
        golden: '#FFCC00',
        charcoal: '#2A2A2A',
        warmGray: '#EBE6DE',
        lighterGray: '#F5F5F7',
        blush: '#fce7f3',
        cloud: '#F5F5F7',
      }
    },
  },
  plugins: [],
}
