/** @type {import('tailwindcss').Config} */

// Builds a Tailwind colour scale from the CSS variables in src/styles/tokens.css
const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const scale = (name) =>
  Object.fromEntries(steps.map((s) => [s, `rgb(var(--${name}-${s}) / <alpha-value>)`]));
const token = (name) => `rgb(var(--color-${name}) / <alpha-value>)`;

const rose = scale('rose');
const mauve = scale('mauve');
const taupe = scale('taupe');
const champagne = scale('champagne');
const neutral = scale('neutral');

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand scales
        rose,
        mauve,
        taupe,
        champagne,
        // Legacy scales used throughout existing pages are remapped onto the
        // brand palette so every screen shares one colour system.
        purple: rose,
        pink: mauve,
        fuchsia: mauve,
        violet: taupe,
        indigo: taupe,
        blue: taupe,
        sky: taupe,
        gray: neutral,
        slate: neutral,
        zinc: neutral,
        stone: neutral,
        // Semantic tokens
        ivory: token('bg'),
        blush: token('bg-alt'),
        surface: token('surface'),
        ink: token('heading'),
        body: token('body'),
        muted: token('muted'),
        line: token('border'),
        footer: token('footer'),
        // Legacy theme names kept so older markup still resolves to the new palette
        periwinkle: {
          light: rose[200], slate: mauve[400], mid: rose[500],
          dark: neutral[900], deep: neutral[950], surface: token('surface'),
        },
        bloxic: {
          bg: token('bg'), surface: token('surface'), surfaceHover: rose[50], deep: token('bg-alt'),
          text: token('heading'), textMuted: token('muted'), highlight: rose[500], highlightHover: rose[600],
          border: token('border'), borderLight: rose[200], primary: rose[500], primaryDark: rose[700],
          primaryLight: rose[100], accent: mauve[500], dark: neutral[900], charcoal: neutral[800],
          footer: token('footer'), subtle: token('muted'), canvas: token('bg'), light: token('surface'),
        },
      },
      fontFamily: {
        display: ['Marcellus', 'Times New Roman', 'serif'],
        editorial: ['Brawler', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        // Softer, more refined corners than Tailwind's defaults
        xl: '0.5rem',
        '2xl': '0.75rem',
        '3xl': '1rem',
        arch: '999px 999px 0 0',
      },
      boxShadow: {
        md: '0 1px 2px rgb(60 40 30 / 0.04), 0 6px 16px -8px rgb(60 40 30 / 0.12)',
        lg: '0 1px 2px rgb(60 40 30 / 0.04), 0 10px 28px -12px rgb(60 40 30 / 0.16)',
        xl: '0 1px 2px rgb(60 40 30 / 0.04), 0 16px 36px -16px rgb(60 40 30 / 0.18)',
        '2xl': '0 2px 4px rgb(60 40 30 / 0.04), 0 28px 56px -24px rgb(60 40 30 / 0.24)',
        bloxic: '0 1px 2px rgb(60 40 30 / 0.04), 0 10px 28px -12px rgb(60 40 30 / 0.16)',
        'bloxic-hover': '0 2px 4px rgb(60 40 30 / 0.04), 0 24px 48px -20px rgb(60 40 30 / 0.22)',
        'bloxic-card': '0 1px 2px rgb(60 40 30 / 0.04), 0 8px 24px -12px rgb(60 40 30 / 0.12)',
        'periwinkle-glow': '0 0 0 4px rgb(var(--rose-100))',
      },
      letterSpacing: {
        label: '0.22em',
      },
      transitionTimingFunction: {
        lux: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
