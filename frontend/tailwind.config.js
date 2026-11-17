/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#D4AF37',
          light: '#F3E5AB',
          dark: '#AA7C11',
        },
        maroon: {
          DEFAULT: '#2B040B',
          light: '#4A0A17',
        },
        cream: '#FAF8F5',
        blush: '#FDF6F0'
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      }
    },
  },
  plugins: [],
}