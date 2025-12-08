/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Disable automatic system detection
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors (always dark)
        background: "#111111",
        surface: "#1e1e1e",
        border: "#333333",
        brand: {
          DEFAULT: "#FF6B00",
          hover: "#e66000",
        },
        text: {
          main: "#E0E0E0",
          muted: "#9CA3AF",
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
