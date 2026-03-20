import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Grid,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  Chip,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { itemApi } from "../api/itemApi";
import LoadingBlock from "../components/common/LoadingBlock";
import EmptyState from "../components/common/EmptyState";
import ItemCard from "../components/items/ItemCard";

export default function ItemListPage() {
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("ALL");

  useEffect(() => {
    let alive = true;
    setBusy(true);
    setError("");
    itemApi
      .list()
      .then((data) => {
        if (!alive) return;
        setItems(data);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e.message);
      })
      .finally(() => alive && setBusy(false));
    return () => (alive = false);
  }, []);

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category).filter(Boolean));
    return ["ALL", ...Array.from(set).sort()];
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((i) => {
      const matchesQuery =
        !query.trim() ||
        i.title?.toLowerCase().includes(query.toLowerCase()) ||
        i.description?.toLowerCase().includes(query.toLowerCase());

      const matchesCat = category === "ALL" || (i.category || "") === category;
      return matchesQuery && matchesCat;
    });
  }, [items, query, category]);

  return (
    <Box>
      <Typography variant="h5">Items up for donation</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Browse available items. Login to create listings and message donors.
      </Typography>

      <Stack spacing={2} sx={{ mb: 2 }}>
        <TextField
          placeholder="Search items..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {categories.map((c) => (
            <Chip
              key={c}
              label={c === "ALL" ? "All categories" : c}
              onClick={() => setCategory(c)}
              color={category === c ? "primary" : "default"}
              variant={category === c ? "filled" : "outlined"}
              size="small"
            />
          ))}
        </Stack>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      {busy && <LoadingBlock label="Loading items..." />}
      {!busy && error && (
        <EmptyState title="Could not load items" subtitle={error} />
      )}
      {!busy && !error && filtered.length === 0 && (
        <EmptyState
          title="No items found"
          subtitle="Try changing your search or filters."
        />
      )}

      <Grid container spacing={2}>
        {filtered.map((item) => (
          <Grid item key={item.id} xs={12} sm={6} md={4}>
            <ItemCard item={item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
