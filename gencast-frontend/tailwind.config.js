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
        "primary": "#00f0ff",
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
        "display": ["Manrope", "sans-serif"],
        "heading": ["Space Grotesk", "sans-serif"],
        "mono": ["Space Grotesk", "monospace"],
      },
      boxShadow: {
        "glow": "0 0 20px rgba(0, 240, 255, 0.12)",
        "inner-subtle": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.4)",
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1rem",
        "full": "9999px"
      },
    },
  },
  plugins: [],
}
