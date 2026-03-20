import React from "react";
import { Button, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <Stack spacing={2} sx={{ py: 8, textAlign: "center" }} alignItems="center">
      <Typography variant="h4">404</Typography>
      <Typography variant="body2" color="text.secondary">
        Page not found.
      </Typography>
      <Button variant="contained" component={RouterLink} to="/">
        Go home
      </Button>
    </Stack>
  );
}
