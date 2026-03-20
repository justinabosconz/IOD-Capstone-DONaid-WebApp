import React from "react";
import { Outlet, Link as RouterLink, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
  Stack,
  Chip,
} from "@mui/material";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import AddIcon from "@mui/icons-material/Add";
import ChatIcon from "@mui/icons-material/Chat";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";

import { useAuth } from "../../context/AuthContext";

export default function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar
        position="sticky"
        color="default"
        elevation={0}
        sx={{ borderBottom: "1px solid #eee" }}
      >
        <Toolbar>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ flexGrow: 1 }}
          >
            <VolunteerActivismIcon color="primary" />
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{ textDecoration: "none", color: "text.primary" }}
            >
              DONaid
            </Typography>
            <Chip size="small" label="Lo‑Fi" variant="outlined" />
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Button component={RouterLink} to="/" color="inherit">
              Browse
            </Button>

            {user && (
              <>
                <Button
                  component={RouterLink}
                  to="/create"
                  startIcon={<AddIcon />}
                >
                  Create
                </Button>
                <Button
                  component={RouterLink}
                  to="/chats"
                  startIcon={<ChatIcon />}
                >
                  Chats
                </Button>
              </>
            )}

            {!user ? (
              <Button
                component={RouterLink}
                to="/login"
                variant="contained"
                startIcon={<LoginIcon />}
              >
                Login
              </Button>
            ) : (
              <Button
                onClick={handleLogout}
                variant="outlined"
                startIcon={<LogoutIcon />}
              >
                Logout
              </Button>
            )}
          </Stack>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 3 }}>
        <Outlet />
      </Container>

      <Box sx={{ borderTop: "1px solid #eee", py: 2, mt: 6 }}>
        <Container>
          <Typography variant="caption" color="text.secondary">
            DONaid • Capstone Project • React + MUI + SQL Server + Socket.IO
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
