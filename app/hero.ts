import { heroui } from "@heroui/react";

export default heroui({
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
      },
    },
  },
});
