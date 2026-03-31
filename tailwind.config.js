/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        game: {
          bg: '#4EC0CA',
          ground: '#DED895',
          pipe: '#73BF2E',
          bird: '#F4CE3A'
        }
      },
      fontFamily: {
        game: ['"Press Start 2P"', 'cursive', 'sans-serif'], // Assuming we add a pixel font later
      }
    },
  },
  plugins: [],
}
