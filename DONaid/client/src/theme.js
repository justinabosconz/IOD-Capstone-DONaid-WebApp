// client/src/theme.js
// Central MUI theme (colors, typography, component styling).
import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#4F46E5" }, // indigo
    secondary: { main: "#7C3AED" }, // purple
    background: {
      default: "#F6F7FB",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#111827",
      secondary: "#6B7280",
    },
  },
  typography: {
    fontFamily: [
      "Inter",
      "system-ui",
      "-apple-system",
      "Segoe UI",
      "Roboto",
      "Arial",
      "sans-serif",
    ].join(","),
    h5: { fontWeight: 800 },
    h6: { fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 700 },
  },
  shape: { borderRadius: 14 },
  components: {
    MuiPaper: {
      styleOverrides: { root: { borderRadius: 16 } },
    },
    MuiCard: {
      styleOverrides: { root: { borderRadius: 18 } },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 12, paddingLeft: 14, paddingRight: 14 },
      },
    },
    MuiTextField: {
      defaultProps: { size: "small" },
    },
  },
});
