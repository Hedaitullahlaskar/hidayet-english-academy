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
      // A considered type scale, not Tailwind's generic default: each step
      // pairs its size with a line-height and letter-spacing tuned for that
      // size specifically — display sizes run tighter (both leading and
      // tracking) the way premium editorial/product type systems do, body
      // sizes stay loose and neutral for comfortable reading. Fluid sizes
      // (clamp) on the display steps mean hero/section headings scale
      // smoothly with viewport width instead of jumping at breakpoints.
      fontSize: {
        xs: ["0.8125rem", { lineHeight: "1.5", letterSpacing: "0" }],
        sm: ["0.875rem", { lineHeight: "1.55", letterSpacing: "0" }],
        base: ["1rem", { lineHeight: "1.65", letterSpacing: "0" }],
        lg: ["1.125rem", { lineHeight: "1.65", letterSpacing: "-0.005em" }],
        xl: ["1.25rem", { lineHeight: "1.6", letterSpacing: "-0.005em" }],
        "2xl": ["1.5rem", { lineHeight: "1.35", letterSpacing: "-0.01em" }],
        "3xl": [
          "clamp(1.875rem, 1.7rem + 0.9vw, 2.25rem)",
          { lineHeight: "1.22", letterSpacing: "-0.015em" },
        ],
        "4xl": [
          "clamp(2.25rem, 1.95rem + 1.5vw, 2.75rem)",
          { lineHeight: "1.15", letterSpacing: "-0.02em" },
        ],
        "5xl": [
          "clamp(2.75rem, 2.25rem + 2.5vw, 3.5rem)",
          { lineHeight: "1.08", letterSpacing: "-0.025em" },
        ],
        "6xl": [
          "clamp(3.25rem, 2.5rem + 3.75vw, 4.5rem)",
          { lineHeight: "1.03", letterSpacing: "-0.03em" },
        ],
        "7xl": [
          "clamp(3.75rem, 2.75rem + 5vw, 5.5rem)",
          { lineHeight: "1", letterSpacing: "-0.035em" },
        ],
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
        // Premium ambient shadow for large surfaces (feature cards, modals)
        // that want depth without the harder-edged "elevated" shadow's
        // hover-lift connotation.
        ambient: "0 24px 64px -20px rgba(10, 37, 64, 0.22), 0 8px 24px -8px rgba(10, 37, 64, 0.08)",
      },
      maxWidth: {
        "8xl": "90rem",
      },
      // The same "ease-out-expo"-family curve already used by the fade-up
      // keyframe, now reusable on any hover/transition so interactive
      // elements (buttons, cards, links) all decelerate the same
      // considered way instead of each defaulting to Tailwind's linear ease.
      transitionTimingFunction: {
        premium: "cubic-bezier(0.16, 1, 0.3, 1)",
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
