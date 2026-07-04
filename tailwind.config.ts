import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "var(--line)",
        input: "var(--line)",
        ring: "var(--teal)",
        background: "var(--paper)",
        foreground: "var(--text)",
        ink: "var(--ink)",
        teal: {
          DEFAULT: "var(--teal)",
          bg: "var(--teal-bg)",
        },
        amber: {
          DEFAULT: "var(--amber)",
          bg: "var(--amber-bg)",
        },
        muted: {
          DEFAULT: "var(--line)",
          foreground: "var(--text-2)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--text)",
        },
      },
      fontFamily: {
        sans: ["var(--font-plex)", "IBM Plex Sans", "system-ui", "sans-serif"],
        display: ["var(--font-space)", "Space Grotesk", "sans-serif"],
        mono: ["var(--font-plex-mono)", "IBM Plex Mono", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      maxWidth: {
        chat: "860px",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
