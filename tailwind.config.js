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
            // base colors
            // neutralのいっこずらし
            default: {
              50: "#1d1b1e",
              100: "#322f33",
              200: "#49464a",
              300: "#615d61",
              400: "#7a767a",
              500: "#948f94",
              600: "#afaaae",
              700: "#cac5c9",
              800: "#e7e1e5",
              foreground: "#ffffff",
              DEFAULT: "#322f33",
            },
            background: "#1d1b1e",
            foreground: "#e7e1e5",
            content1: {
              DEFAULT: "#1d1b1e",
              foreground: "#cac5c9",
            },
            content2: {
              DEFAULT: "#211f22",
              foreground: "#cac5c9",
            },
            content3: {
              DEFAULT: "#2c292d",
              foreground: "#cac5c9",
            },
            content4: {
              DEFAULT: "#373438",
              foreground: "#cac5c9",
            },
            // theme colors
            primary: {
              DEFAULT: "#dab9ff",
              foreground: "#431475",
            },
          },
        },
      },
    }),
  ],
};

export default config;
