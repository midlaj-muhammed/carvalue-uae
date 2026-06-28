import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Dark theme (prediction page)
        midnight: {
          DEFAULT: "#0A1628",
          50: "#1A2A44",
          100: "#14223A",
          200: "#0E1C32",
          300: "#0A1628",
          400: "#061020",
          500: "#030A18",
        },
        gold: {
          DEFAULT: "#C9A84C",
          light: "#E2C97A",
          dark: "#A88B3A",
          muted: "#C9A84C20",
        },
        surface: {
          DEFAULT: "#FFFFFF08",
          light: "#FFFFFF12",
          medium: "#FFFFFF1A",
          strong: "#FFFFFF25",
        },
        // Light theme (landing page) — Titan editorial
        obsidian: "#111111",
        paper: "#ffffff",
        linen: "#e9eaeb",
        sand: "#d8d3cc",
        graphite: "#615e5b",
        ash: "#888888",
        onyx: "#000000",
        mist: "#f5f5f5",
        "border-light": "#e5e5e5",
      },
      fontFamily: {
        display: ['"DM Sans"', "sans-serif"],
        body: ['"Outfit"', "sans-serif"],
        geist: ['"Geist"', '"Inter"', "system-ui", "sans-serif"],
        mono: ['"Geist Mono"', '"SF Mono"', "Menlo", "monospace"],
      },
      borderRadius: {
        pill: "160px",
        nav: "140px",
        editorial: "32px",
      },
      animation: {
        "fade-in": "fadeIn 500ms cubic-bezier(0.23,1,0.32,1) forwards",
        "fade-in-up": "fadeInUp 400ms cubic-bezier(0.23,1,0.32,1) forwards",
        "slide-in-right": "slideInRight 350ms cubic-bezier(0.23,1,0.32,1) forwards",
        "scale-in": "scaleIn 300ms cubic-bezier(0.23,1,0.32,1) forwards",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
        shimmer: "shimmer 2.5s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(-12px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(201, 168, 76, 0.3)" },
          "50%": { boxShadow: "0 0 0 8px rgba(201, 168, 76, 0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(201,168,76,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.03) 1px, transparent 1px)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      backgroundSize: {
        grid: "48px 48px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
