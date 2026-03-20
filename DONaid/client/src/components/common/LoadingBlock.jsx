import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function LoadingBlock({ label = "Loading..." }) {
  return (
    <Box sx={{ py: 6, display: "grid", placeItems: "center", gap: 1 }}>
      <CircularProgress />
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
}
