/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: "#0a0a0a",
          surface: "#141414",
          border: "#2d2d2d",
          text: "#e5e5e5",
          muted: "#737373",
          accent: "#a3a3a3",
          success: "#22c55e",
          warning: "#eab308",
          error: "#ef4444",
          purple: "#a78bfa",
          cyan: "#22d3ee",
          pink: "#f472b6",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "Monaco", "Consolas", "monospace"],
      },
      animation: {
        blink: "blink 1s step-end infinite",
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        glow: "glow 2s ease-in-out infinite alternate",
        "light-ray-pulse": "lightRayPulse 14s ease-in-out infinite",
      },
      keyframes: {
        lightRayPulse: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.65" },
        },
        blink: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0 },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        slideUp: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(255, 255, 255, 0.2)" },
          "100%": { boxShadow: "0 0 20px rgba(255, 255, 255, 0.4)" },
        },
      },
      borderRadius: {
        DEFAULT: "0.5rem",
      },
    },
  },
  plugins: [],
};

