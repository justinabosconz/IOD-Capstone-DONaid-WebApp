import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Stack,
  Box,
} from "@mui/material";

export default function ItemCard({ item, onView }) {
  const imgSrc = item.imagePath
    ? `http://localhost:4000/uploads/${item.imagePath}`
    : null;

  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardActionArea onClick={() => onView(item.id)} sx={{ height: "100%" }}>
        {imgSrc ? (
          <CardMedia
            component="img"
            height="180"
            image={imgSrc}
            alt={item.title}
          />
        ) : (
          <Box
            sx={{
              height: 180,
              display: "grid",
              placeItems: "center",
              bgcolor: "grey.100",
              color: "text.secondary",
              borderBottom: "1px solid",
              borderColor: "divider",
              fontWeight: 700,
            }}
          >
            No Image
          </Box>
        )}

        <CardContent>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 800 }}
            gutterBottom
            noWrap
          >
            {item.title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 1 }}
            noWrap
          >
            {item.description}
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            sx={{ flexWrap: "wrap", rowGap: 1 }}
          >
            <Chip size="small" label={item.category || "Uncategorised"} />
            <Chip
              size="small"
              variant="outlined"
              label={item.itemCondition || "Condition: N/A"}
            />
            <Chip
              size="small"
              color={item.status === "AVAILABLE" ? "success" : "default"}
              variant={item.status === "AVAILABLE" ? "filled" : "outlined"}
              label={item.status || "AVAILABLE"}
            />
          </Stack>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 1.2 }}
          >
            Owner: {item.owner?.displayName || "Unknown"}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
