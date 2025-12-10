/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Bug-themed colors 🐛
        'bug-primary': '#2d5a27',    // Forest green
        'bug-secondary': '#8b4513',   // Saddle brown
        'bug-accent': '#ffd700',      // Gold
        'bug-light': '#f0f7ed',       // Light mint
        'bug-dark': '#1a3518',        // Dark forest
      },
    },
  },
  plugins: [],
}
