import React, { useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Link,
  Stack,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from || "/";

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="center"
        sx={{ mb: 2 }}
      >
        <VolunteerActivismIcon color="primary" />
        <Typography variant="h5">DONaid</Typography>
      </Stack>

      <Card>
        <CardContent>
          <Typography variant="h6">Login</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter your email and password to continue.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={submit}>
            <Stack spacing={2}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                fullWidth
                required
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                fullWidth
                required
              />
              <Button type="submit" variant="contained" disabled={busy}>
                {busy ? "Logging in..." : "Login"}
              </Button>

              <Typography variant="body2" color="text.secondary">
                Don’t have an account?{" "}
                <Link component={RouterLink} to="/register">
                  Register
                </Link>
              </Typography>

              <Link component={RouterLink} to="/" underline="hover">
                Continue browsing without login
              </Link>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
