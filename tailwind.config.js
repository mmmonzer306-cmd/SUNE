/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-space)', 'var(--font-arabic)', 'sans-serif'],
        mono: ['var(--font-fira)', 'monospace'],
        display: ['var(--font-orbitron)', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
