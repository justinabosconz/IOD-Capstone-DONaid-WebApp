import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const fallback =
  "https://images.unsplash.com/photo-1581579185169-56b0e29b6b3c?auto=format&fit=crop&w=1200&q=60";

export default function ItemCard({ item }) {
  const navigate = useNavigate();

  return (
    <Card sx={{ height: "100%" }}>
      <CardActionArea
        onClick={() => navigate(`/items/${item.id}`)}
        sx={{ height: "100%", alignItems: "stretch" }}
      >
        <CardMedia
          component="img"
          height="160"
          image={item.imageUrl || fallback}
          alt={item.title}
          sx={{ objectFit: "cover" }}
        />
        <CardContent>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            gap={1}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {item.title}
            </Typography>
            <Chip size="small" label={item.status} />
          </Stack>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {item.category || "Uncategorised"} • {item.condition || "N/A"}
          </Typography>

          {item.owner?.displayName && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 1 }}
            >
              Donor: {item.owner.displayName}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
