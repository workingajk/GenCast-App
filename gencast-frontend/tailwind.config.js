/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // From Screen 1
        "primary": "#00f0ff", // Soft Cyan
        "primary-hover": "#00d7e6",
        "bg-deep": "#0a0c0e",
        "bg-surface": "#12171d",
        "bg-sidebar": "#0f1216",
        "bg-input": "#181d24",
        "accent-purple": "#a855f7",

        // From Screen 2 (with adjusted primary name)
        "primary-s2": "#00bdc7",
        "background-dark": "#0a0c10",
        "sidebar-dark": "#0d1117",
        "card-dark": "#161b22",

        // From Screen 3 (with adjusted primary name)
        "primary-s3": "#39FF14", // Neon Green
        "accent": "#00F0FF", // Neon Blue
        "surface-dark": "#15191E",
        "surface-darker": "#0D1114",
        "border-dark": "#2D343D",
        "neon-glow": "rgba(57, 255, 20, 0.4)",
      },
      fontFamily: {
        "display": ["Outfit", "sans-serif"],
        "heading": ["Outfit", "sans-serif"],
        "mono": ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        "glow": "0 0 20px rgba(0, 240, 255, 0.3)",
        "soft": "0 4px 20px rgba(0, 0, 0, 0.05)",
        "xl-saas": "0 20px 40px rgba(0, 0, 0, 0.1)",
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.1)",
      },
      borderRadius: {
        "3xl": "1.5rem",
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },
  plugins: [],
}
