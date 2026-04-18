/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Semantic tokens used by cards + result banners.
        ok: "#16a34a",
        warn: "#ca8a04",
        bad: "#dc2626",
      },
      fontFamily: {
        // System stack; no webfonts on purpose (offline + zero FOUC).
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
