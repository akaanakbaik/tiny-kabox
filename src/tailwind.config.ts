import type { Config } from "tailwindcss"

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Inter", "Roboto", "Arial", "Noto Sans", "sans-serif"]
      },
      boxShadow: {
        soft: "0 1px 0 rgba(255,255,255,0.04), 0 10px 30px rgba(0,0,0,0.35)"
      },
      colors: {
        surface: "#0b0f17",
        surfaceElev: "#101827",
        surfaceElev2: "#141f33",
        foreground: "#e9eef8",
        muted: "#a9b4c7",
        border: "rgba(255,255,255,0.10)",
        ring: "#7aa2ff",
        danger: "#ff4d4f",
        ok: "#2bd576",
        warn: "#f5c451"
      },
      borderRadius: {
        xl: "14px",
        "2xl": "18px"
      }
    }
  },
  plugins: []
} satisfies Config