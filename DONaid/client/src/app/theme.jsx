import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#2E7D32" }, // calm green
    secondary: { main: "#1565C0" },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: "Inter, system-ui, Arial, sans-serif",
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
  },
  components: {
    MuiCard: { styleOverrides: { root: { borderRadius: 16 } } },
    MuiButton: { defaultProps: { disableElevation: true } },
  },
});

export default theme;
