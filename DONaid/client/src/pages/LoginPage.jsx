import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import VolunteerActivismRoundedIcon from "@mui/icons-material/VolunteerActivismRounded";

import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login, register } = useAuth();

  const [mode, setMode] = useState("login"); // login | register
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr("");

    if (!email.trim() || !password.trim()) {
      setErr("Please enter email and password.");
      return;
    }
    if (mode === "register" && !displayName.trim()) {
      setErr("Please enter a display name.");
      return;
    }

    try {
      setBusy(true);
      if (mode === "login") await login(email.trim(), password);
      else await register(displayName.trim(), email.trim(), password);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Box
      sx={{ minHeight: "100vh", display: "grid", placeItems: "center", p: 2 }}
    >
      <Container maxWidth="sm">
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            borderRadius: 4,
            boxShadow: "0 12px 30px rgba(17,24,39,0.08)",
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <VolunteerActivismRoundedIcon color="primary" />
            <Typography variant="h5" sx={{ fontWeight: 900 }}>
              DONaid
            </Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {mode === "login"
              ? "Log in to add donations and message item owners."
              : "Create an account to start donating and chatting."}
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Box component="form" onSubmit={submit}>
            <Stack spacing={2}>
              {mode === "register" && (
                <TextField
                  label="Display name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              )}
              <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
              />

              {err && (
                <Paper
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    bgcolor: "#FEF2F2",
                    borderColor: "#FECACA",
                    color: "#991B1B",
                  }}
                >
                  {err}
                </Paper>
              )}

              <Button
                type="submit"
                variant="contained"
                startIcon={
                  mode === "login" ? (
                    <LockRoundedIcon />
                  ) : (
                    <PersonAddAltRoundedIcon />
                  )
                }
                disabled={busy}
              >
                {busy
                  ? "Please wait..."
                  : mode === "login"
                    ? "Log In"
                    : "Create Account"}
              </Button>

              <Button
                type="button"
                variant="text"
                onClick={() => {
                  setErr("");
                  setMode(mode === "login" ? "register" : "login");
                }}
              >
                {mode === "login"
                  ? "New here? Create an account"
                  : "Already have an account? Log in"}
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
