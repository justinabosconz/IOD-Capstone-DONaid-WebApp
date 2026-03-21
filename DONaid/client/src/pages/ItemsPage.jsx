// client/src/pages/ItemsPage.jsx
import React, { useMemo, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Autocomplete,
  InputAdornment,
  Chip,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

import { useItems } from "../context/ItemsContext";
import { useAuth } from "../context/AuthContext";
import ItemCard from "../components/ItemCard";

export default function ItemsPage({ onView }) {
  const { items, loadingItems } = useItems();
  const { user } = useAuth();

  // Filters
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState("all"); // "all" | "mine"

  // ✅ Sizing styles: bigger tap targets for easier clicking
  const bigControlSx = {
    "& .MuiInputBase-root": {
      minHeight: 52,
      fontSize: 16,
    },
    "& .MuiInputBase-input": {
      padding: "14px 14px",
    },
  };

  const bigAutoCompleteSx = {
    ...bigControlSx,
    "& .MuiOutlinedInput-root": {
      paddingTop: "2px",
      paddingBottom: "2px",
    },
  };

  const bigToggleSx = {
    "& .MuiToggleButton-root": {
      minHeight: 46,
      minWidth: 140,
      padding: "10px 16px",
      fontSize: 14.5,
      fontWeight: 800,
      textTransform: "none",
    },
  };

  // Build category options from current items
  const categories = useMemo(() => {
    const set = new Set();
    items.forEach((i) => {
      const c = (i.category || "").trim();
      if (c) set.add(c);
    });
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [items]);

  // Filter items with scope + category + query
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return items.filter((i) => {
      const matchScope = scope === "all" ? true : i.owner?.id === user?.id;

      const matchCategory =
        category === "All"
          ? true
          : String(i.category || "").toLowerCase() ===
            String(category).toLowerCase();

      const hay =
        `${i.title} ${i.description} ${i.category || ""}`.toLowerCase();
      const matchQuery = q ? hay.includes(q) : true;

      return matchScope && matchCategory && matchQuery;
    });
  }, [items, category, query, scope, user]);

  return (
    <Box sx={{ py: 3 }}>
      <Container maxWidth="xl">
        <Typography variant="h5" sx={{ fontWeight: 900, mb: 0.5 }}>
          Items for Donation
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Filter on the left. Click an item to view details and chat.
        </Typography>

        <Grid container spacing={2}>
          {/* ✅ LEFT SIDEBAR FILTERS */}
          <Grid item xs={12} md={4} lg={3}>
            <Paper
              variant="outlined"
              sx={{ p: 2.25, position: "sticky", top: 88 }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 1 }}>
                Filters
              </Typography>

              {/* Scope toggle */}
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 700 }}
              >
                Show
              </Typography>
              <ToggleButtonGroup
                value={scope}
                exclusive
                onChange={(e, v) => v && setScope(v)}
                size="medium"
                sx={{ mt: 0.75, width: "100%", ...bigToggleSx }}
              >
                <ToggleButton value="all" sx={{ flex: 1 }}>
                  <Inventory2RoundedIcon
                    fontSize="small"
                    style={{ marginRight: 6 }}
                  />
                  All
                </ToggleButton>
                <ToggleButton value="mine" sx={{ flex: 1 }}>
                  <PersonRoundedIcon
                    fontSize="small"
                    style={{ marginRight: 6 }}
                  />
                  My items
                </ToggleButton>
              </ToggleButtonGroup>

              <Divider sx={{ my: 2 }} />

              {/* Category */}
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 700 }}
              >
                Category
              </Typography>
              <Autocomplete
                options={categories}
                value={category}
                onChange={(e, v) => setCategory(v || "All")}
                sx={{ mt: 0.75 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label="Category"
                    placeholder="All categories"
                    sx={bigAutoCompleteSx}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <CategoryRoundedIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              <Divider sx={{ my: 2 }} />

              {/* Search */}
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 700 }}
              >
                Search
              </Typography>
              <TextField
                fullWidth
                label="Search items"
                placeholder="e.g., chair, books, microwave…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                sx={{ mt: 0.75, ...bigControlSx }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Active filter chips */}
              <Stack
                direction="row"
                spacing={1}
                sx={{ mt: 2, flexWrap: "wrap", rowGap: 1 }}
              >
                <Chip
                  label={`Scope: ${scope === "all" ? "All" : "My items"}`}
                  variant="outlined"
                />
                <Chip
                  label={`Category: ${category}`}
                  onDelete={() => setCategory("All")}
                  variant="outlined"
                />
                <Chip
                  label={query ? `Search: "${query}"` : "Search: (none)"}
                  onDelete={() => setQuery("")}
                  variant="outlined"
                />
                <Chip label={`${filtered.length} result(s)`} color="primary" />
              </Stack>
            </Paper>
          </Grid>

          {/* ✅ RIGHT CONTENT: ITEMS GRID */}
          <Grid item xs={12} md={8} lg={9}>
            <Grid container spacing={2}>
              {loadingItems ? (
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 3 }}>
                    <Typography color="text.secondary">
                      Loading items…
                    </Typography>
                  </Paper>
                </Grid>
              ) : (
                filtered.map((item) => (
                  <Grid key={item.id} item xs={12} sm={6} lg={4}>
                    <ItemCard item={item} onView={onView} />
                  </Grid>
                ))
              )}

              {!loadingItems && filtered.length === 0 && (
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 3, textAlign: "center" }}>
                    <Typography sx={{ fontWeight: 900 }}>No results</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Try clearing filters or switching scope to “All”.
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
