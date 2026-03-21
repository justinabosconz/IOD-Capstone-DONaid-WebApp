// client/src/components/NavBar.jsx
import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, Chip } from "@mui/material";
import VolunteerActivismRoundedIcon from "@mui/icons-material/VolunteerActivismRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useAuth } from "../context/AuthContext";

export default function NavBar({ onAdd }) {
  const { user, logout } = useAuth();

  return (
    <AppBar
      elevation={0}
      position="sticky"
      color="transparent"
      sx={{
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar sx={{ gap: 1 }}>
        <VolunteerActivismRoundedIcon color="primary" />
        <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: 0.2 }}>
          DONaid
        </Typography>

        <Box sx={{ flex: 1 }} />

        {user && (
          <>
            <Chip
              label={`Hi, ${user.displayName}`}
              variant="outlined"
              sx={{ bgcolor: "background.paper" }}
            />
            <Button
              onClick={onAdd}
              variant="contained"
              startIcon={<AddRoundedIcon />}
              sx={{ ml: 1 }}
            >
              Add Item
            </Button>
            <Button
              onClick={logout}
              variant="outlined"
              startIcon={<LogoutRoundedIcon />}
              sx={{ ml: 1 }}
            >
              Logout
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
