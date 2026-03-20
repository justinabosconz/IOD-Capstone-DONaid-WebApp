import React from "react";
import { Box, Typography } from "@mui/material";

export default function EmptyState({ title, subtitle }) {
  return (
    <Box
      sx={{
        py: 6,
        textAlign: "center",
        border: "1px dashed #ddd",
        borderRadius: 2,
      }}
    >
      <Typography variant="h6">{title}</Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}
