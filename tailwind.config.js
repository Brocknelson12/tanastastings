/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4A5568',
          dark: '#2D3748'
        },
        success: {
          DEFAULT: '#48BB78',
          dark: '#38A169'
        },
        accent: {
          DEFAULT: '#E2E8F0',
          dark: '#CBD5E0'
        },
        softblue: {
          light: '#EDF2F7',
          DEFAULT: '#A0AEC0',
          dark: '#718096'
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
};