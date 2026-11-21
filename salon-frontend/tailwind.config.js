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
        bloxic: {
          bg: '#0B3048',
          surface: '#0e3854',
          surfaceHover: '#134567',
          deep: '#072132',
          text: '#F2F0E9',
          textMuted: 'rgba(242, 240, 233, 0.68)',
          highlight: '#B9F12F',
          highlightHover: '#a6db24',
          border: 'rgba(242, 240, 233, 0.12)',
          borderLight: 'rgba(242, 240, 233, 0.22)',
          primary: '#B9F12F',
          primaryDark: '#a6db24',
          primaryLight: '#d4fa61',
          accent: '#B9F12F',
          dark: '#072132',
          charcoal: '#0a2a3f',
          footer: '#072132',
          subtle: 'rgba(242, 240, 233, 0.65)',
          canvas: '#0B3048',
          light: '#0e3854',
        }
      },
      fontFamily: {
        sans: ['"Poppins"', 'system-ui', '-apple-system', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'bloxic': '0 4px 20px rgba(0,0,0,0.25)',
        'bloxic-hover': '0 16px 36px rgba(0,0,0,0.4)',
        'bloxic-card': '0 2px 10px rgba(0,0,0,0.2)',
      }
    },
  },
  plugins: [],
}
