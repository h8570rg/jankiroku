module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  important: "#__next",
  theme: {
    extend: {
      animation: {
        expansion: "expansion 5s ease-in-out forwards",
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
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
