import { PaletteMode } from "@mui/material";
import { red } from "@mui/material/colors";
import { createTheme, ThemeOptions } from "@mui/material/styles";

const getDesignTokens = (mode: PaletteMode): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          background: {
            default: "#fff",
          },
          primary: {
            main: red[900],
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
