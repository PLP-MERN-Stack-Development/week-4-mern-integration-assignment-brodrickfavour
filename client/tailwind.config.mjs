// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}", // This line is crucial for scanning your React components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}