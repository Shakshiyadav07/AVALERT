/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#0b0f17",
          card: "#151c28",
          accent: "#ef4444",
        }
      }
    },
  },
  plugins: [],
}