/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      colors: {
        leaf: {
          50: '#f8f8f8',
          100: '#f1f1f3',
          600: '#4b5268',
          700: '#3a4053',
          900: '#282c3f',
          950: '#1f2333'
        },
        saffron: {
          50: '#fff7f0',
          100: '#ffeadb',
          500: '#fca65e',
          600: '#fc8019',
          700: '#e46f12'
        }
      },
      boxShadow: {
        soft: '0 18px 55px rgba(40, 44, 63, 0.10)'
      }
    }
  },
  plugins: []
};
