/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#fff8f7",
        foreground: "#1f1a1b",
        primary: {
          DEFAULT: "#81515a",
          foreground: "#ffffff",
          container: "#ffc0cb",
          fixed: "#ffd9df",
        },
        secondary: {
          DEFAULT: "#3a6470",
          foreground: "#ffffff",
          container: "#beeaf8",
        },
        tertiary: {
          DEFAULT: "#675f2d",
          container: "#ddd194",
          fixed: "#f0e3a4",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "secondary-fixed": "#beeaf8",
        "on-tertiary": "#ffffff",
        "surface-dim": "#e2d8d8",
        "on-tertiary-container": "#625928",
        "inverse-surface": "#352f30",
        "secondary-fixed-dim": "#a3cddb",
        "on-surface-variant": "#514345",
        "on-secondary-fixed": "#001f27",
        "error-container": "#ffdad6",
        "primary-fixed": "#ffd9df",
        "surface-variant": "#eae0e0",
        "on-error-container": "#93000a",
        "on-error": "#ffffff",
        "surface-bright": "#fff8f7",
        "surface-container": "#f6ebec",
        "on-secondary-fixed-variant": "#214c58",
        "surface-container-lowest": "#ffffff",
        "on-secondary-container": "#416a77",
        "on-tertiary-fixed-variant": "#4f4717",
        "tertiary-fixed-dim": "#d3c78b",
        "inverse-on-surface": "#f9eeef",
        "on-primary-container": "#7b4b55",
        "surface-container-low": "#fcf1f1",
        "on-primary": "#ffffff",
        "on-primary-fixed-variant": "#663a43",
        "on-background": "#1f1a1b",
        "on-secondary": "#ffffff",
        "tertiary-container": "#ddd194",
        "surface-container-high": "#f0e6e6",
        "inverse-primary": "#f4b6c1",
        "primary-fixed-dim": "#f4b6c1",
        "surface-container-highest": "#eae0e0",
        "outline-variant": "#d5c2c4",
        "on-tertiary-fixed": "#201c00",
        "on-surface": "#1f1a1b",
        "on-primary-fixed": "#330f19",
        "primary-container": "#ffc0cb",
        "error": "#ba1a1a",
        "secondary-container": "#beeaf8",
        "surface-tint": "#81515a",
        "outline": "#837375",
        "surface": "#fff8f7",
        "tertiary-fixed": "#f0e3a4"
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg) scale(1)" },
          "50%": { transform: "rotate(3deg) scale(1.05)" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        },
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        wiggle: "wiggle 3s ease-in-out infinite",
        float: "float 4s ease-in-out infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      borderRadius: {
        DEFAULT: "1rem",
        lg: "2rem",
        xl: "3rem",
        full: "9999px"
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
