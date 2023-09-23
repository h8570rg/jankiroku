import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./assets/**/*.{jpeg,jpg,png,gif,svg,webp}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
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
        sans: ["var(--font-noto-sans-jp)"],
        righteous: ["var(--font-righteous)"],
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
    },
  },
  /**
   * @see https://nextui.org/docs/frameworks/nextjs#tailwind-css-setup
   */
  darkMode: "class",
  plugins: [
    nextui({
      layout: {
        radius: {
          small: "2px",
          medium: "4px",
          large: "8px",
        },
      },
      addCommonColors: true,
      themes: {
        dark: {
          colors: {
            background: "#030711",
            primary: {
              DEFAULT: "#7C3BED",
              foreground: "#e7e1e5",
            },
          },
        },
      },
    }),
  ],
};

export default config;
