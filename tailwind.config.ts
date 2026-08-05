import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
    },
    extend: {
      colors: {
        // Primary — Navy (trust, authority, discipline)
        navy: {
          50: "#F1F5FA",
          100: "#DCE7F2",
          200: "#AFC7DE",
          300: "#7EA0C2",
          400: "#4E7BA3",
          500: "#2C567F",
          600: "#1D4A73",
          700: "#123659",
          800: "#0A2540", // brand primary
          900: "#071B33",
          950: "#050F1E",
        },
        // Secondary — Gold (aspiration, achievement)
        gold: {
          50: "#FDF9EE",
          100: "#FBF3DD",
          200: "#F3E5B4",
          300: "#EAD48C",
          400: "#E0C465",
          500: "#D4AF37",
          600: "#C9A227", // brand secondary
          700: "#A9821A",
          800: "#8F6B12",
          900: "#7A5B0E",
        },
        // Accent — warm paper whites (the brief's "White", given texture)
        paper: {
          DEFAULT: "#FBF8F1",
          50: "#FFFFFF",
          100: "#FBF8F1",
          200: "#F5F1E6",
        },
        neutral: {
          50: "#F7F8FA",
          100: "#F0F2F5",
          200: "#E4E7EB",
          300: "#B8BEC7",
          500: "#6B7280",
          700: "#3D4451",
          900: "#1F2430",
        },
        success: "#1E8E5A",
        "success-text": "#166F49", // WCAG-AA safe on light backgrounds (4.5:1+)
        warning: "#C97A1A",
        error: "#D3452D",
        info: "#2C6BB5",
        whatsapp: "#25D366",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        bengali: ["var(--font-hind-siliguri)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "8px",
        DEFAULT: "12px",
        lg: "16px",
        xl: "24px",
        full: "9999px",
      },
      boxShadow: {
        card: "0 2px 8px -2px rgba(10, 37, 64, 0.08), 0 1px 2px -1px rgba(10, 37, 64, 0.06)",
        elevated:
          "0 12px 32px -8px rgba(10, 37, 64, 0.18), 0 4px 12px -4px rgba(10, 37, 64, 0.10)",
        gold: "0 8px 24px -6px rgba(201, 162, 39, 0.45)",
      },
      maxWidth: {
        "8xl": "90rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "loop-pulse": {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "1" },
        },
        "gentle-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
        "loop-pulse": "loop-pulse 2.4s ease-in-out infinite",
        "gentle-float": "gentle-float 5s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
