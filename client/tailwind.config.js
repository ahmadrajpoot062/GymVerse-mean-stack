/** @type {import('tailwindcss').Config} */
const colors = require('./colors.js');

module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: colors.tailwindColors,
      fontFamily: {
        sans: ['Montserrat', 'ui-sans-serif', 'system-ui'],
        heading: ['Bebas Neue', 'ui-sans-serif', 'system-ui']
      }
    },
  },
  plugins: [],
}
