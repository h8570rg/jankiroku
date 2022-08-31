import { PaletteMode } from "@mui/material";
import { grey, indigo, red } from "@mui/material/colors";
import { createTheme, ThemeOptions } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    "primary-inverted": Palette["primary"];
  }
  interface PaletteOptions {
    "primary-inverted"?: PaletteOptions["primary"];
  }
}

// Update the Button's color prop options
declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    "primary-inverted": true;
  }
}

const getDesignTokens = (mode: PaletteMode): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          background: {
            default: grey[100],
          },
          primary: {
            main: indigo[900],
          },
          "primary-inverted": {
            main: "#fff",
            light: "#fff",
            dark: "#ccc",
            contrastText: indigo[900],
          },

          // palette values for light mode
        }
      : {
          // palette values for dark mode
        }),
  },
  typography: {
    fontFamily: ['"Noto Sans JP"', "Helvetica", "Arial", "sans-serif"].join(
      ","
    ),
  },
});

export const theme = createTheme(getDesignTokens("light"));
