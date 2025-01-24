import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./assets/**/*.{jpeg,jpg,png,gif,svg,webp}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontSize: {},
    extend: {
      animation: {
        expansion: "expansion 5s ease-in-out forwards",
        wavy: "wavy 1s infinite",
      },
      keyframes: {
        expansion: {
          "0%": {
            transformOrigin: "center",
            transform: "scale(1)",
          },
          "100%": {
            transform: "scale(1.2)",
          },
        },
        wavy: {
          "0%, 40%, 100%": {
            transform: "translateY(0)",
          },
          "20%": {
            transform: "translateY(-20px)",
          },
        },
      },
      fontFamily: {
        righteous: ["var(--font-righteous)"],
        rocknroll: ["var(--font-rocknroll-one)"],
      },
      height: {
        screen: ["100vh", "100dvh"],
      },
      minHeight: {
        screen: ["100vh", "100dvh"],
      },
      maxHeight: {
        screen: ["100vh", "100dvh"],
      },
      wordBreak: {
        test: "break-all",
      },
    },
  },
  /**
   * @see https://heroui.org/docs/frameworks/nextjs#tailwind-css-setup
   */
  darkMode: "class",
  plugins: [
    heroui({
      layout: {
        radius: {
          small: "4px",
          medium: "8px",
          large: "8px",
        },
      },
      addCommonColors: true,
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "#7C3BED",
            },
          },
        },
        dark: {
          colors: {
            background: "#030711",
            primary: {
              DEFAULT: "#7C3BED",
              foreground: "#e7e1e5",
            },
            foreground: {
              light: "#a1a1aa",
            },
          },
        },
      },
    }),
  ],
};

export default config;
