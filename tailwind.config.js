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
          bg: "#0a0f1a",
          surface: "#151a25",
          border: "#4a6fa5",
          text: "#d4d4e4",
          muted: "#6a7fa5",
          accent: "#5b9bd1",
          success: "#28ca42",
          warning: "#ffbd2e",
          error: "#ff5f57",
          purple: "#6b8bd1",
          cyan: "#5fb3d3",
          pink: "#7ba8d1",
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
      },
      keyframes: {
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
          "0%": { boxShadow: "0 0 5px rgba(107, 155, 209, 0.2)" },
          "100%": { boxShadow: "0 0 20px rgba(107, 155, 209, 0.4)" },
        },
      },
    },
  },
  plugins: [],
};

