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
        periwinkle: {
          light: '#CCCCFF',
          slate: '#A3A3CC',
          mid: '#5C5C99',
          dark: '#292966',
          deep: '#1e1e4f',
          surface: '#363675',
        },
        bloxic: {
          bg: '#292966',
          surface: '#363675',
          surfaceHover: '#44448a',
          deep: '#1e1e4f',
          text: '#FFFFFF',
          textMuted: 'rgba(255, 255, 255, 0.75)',
          highlight: '#CCCCFF',
          highlightHover: '#b8b8f5',
          border: 'rgba(163, 163, 204, 0.25)',
          borderLight: 'rgba(204, 204, 255, 0.35)',
          primary: '#CCCCFF',
          primaryDark: '#5C5C99',
          primaryLight: '#e0e0ff',
          accent: '#A3A3CC',
          dark: '#1e1e4f',
          charcoal: '#242459',
          footer: '#1a1a4a',
          subtle: 'rgba(255, 255, 255, 0.70)',
          canvas: '#292966',
          light: '#363675',
        }
      },
      fontFamily: {
        sans: ['"Poppins"', 'system-ui', '-apple-system', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'bloxic': '0 4px 20px rgba(15,15,40,0.3)',
        'bloxic-hover': '0 16px 36px rgba(15,15,40,0.5)',
        'bloxic-card': '0 2px 10px rgba(15,15,40,0.25)',
        'periwinkle-glow': '0 0 25px rgba(204, 204, 255, 0.35)',
      }
    },
  },
  plugins: [],
}
