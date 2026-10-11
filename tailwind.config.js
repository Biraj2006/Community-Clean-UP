/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#2C5F2D',
          dark: '#1f4520',
          light: '#387839',
        },
        moss: {
          DEFAULT: '#97BC62',
          light: '#b0d182',
          dark: '#7ea44c',
        },
        darkText: '#263326',
        lightGreen: {
          DEFAULT: '#EEF5E8',
          card: '#EEF5E8',
          hover: '#e2edd8',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(44, 95, 45, 0.08), 0 2px 6px -1px rgba(44, 95, 45, 0.04)',
        'soft-lg': '0 10px 25px -3px rgba(44, 95, 45, 0.12), 0 4px 10px -2px rgba(44, 95, 45, 0.06)',
      },
    },
  },
  plugins: [],
}
