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
          50: '#f5f1ec',
          100: '#efe3d5',
          600: '#9f6f4b',
          700: '#7a2e1f',
          900: '#4b1d14',
          950: '#2b110c'
        },
        saffron: {
          50: '#fff7ef',
          100: '#f6ddc3',
          500: '#d9b08c',
          600: '#fc8019',
          700: '#d76708'
        }
      },
      boxShadow: {
        soft: '0 22px 60px rgba(73, 31, 20, 0.16)',
        luxe: '0 30px 80px rgba(44, 16, 10, 0.22)'
      }
    }
  },
  plugins: []
};
