/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}', './src/index.html'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#737373', // cinza médio
          light: '#d1d5db',  // cinza claro
          dark: '#171717',   // cinza escuro
        },
        secondary: {
          DEFAULT: '#a3a3a3', // cinza secundário
          light: '#e5e7eb',  // cinza bem claro
          dark: '#404040',   // cinza escuro
        },
        neutral: {
          light: '#f5f5f5',  // quase branco
          DEFAULT: '#737373', // cinza médio
          dark: '#171717',   // quase preto
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        gradient: "gradient 8s ease infinite",
      },
    },
  },

  plugins: [],
  darkMode: 'class'
};
