module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        expansion: "expansion 5s ease-in-out forwards",
        waviy: "waviy 1s infinite",
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
        waviy: {
          "0%, 40%, 100%": {
            transform: "translateY(0)",
          },
          "20%": {
            transform: "translateY(-20px)",
          },
        },
      },
    },
    fontFamily: {
      righteous: ["Righteous"],
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
