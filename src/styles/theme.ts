import { PaletteMode } from "@mui/material";
import { createTheme, ThemeOptions } from "@mui/material/styles";

const getDesignTokens = (mode: PaletteMode): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          // palette values for light mode
        }
      : {
          // palette values for dark mode
        }),
  },
});

export const theme = createTheme(getDesignTokens("light"));
