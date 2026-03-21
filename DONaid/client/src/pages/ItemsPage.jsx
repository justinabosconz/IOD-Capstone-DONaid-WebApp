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

  // Search bar #1: category
  const [category, setCategory] = useState("All");

  // Search bar #2: item query (title/description)
  const [query, setQuery] = useState("");

  // Optional toggle: all items vs my items (helps you manage edit/delete)
  const [scope, setScope] = useState("all"); // "all" | "mine"

  const categories = useMemo(() => {
    const set = new Set();
    items.forEach((i) => {
      const c = (i.category || "").trim();
      if (c) set.add(c);
    });
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return items.filter((i) => {
      // Scope filter
      const matchScope = scope === "all" ? true : i.owner?.id === user?.id;

      // Category filter
      const matchCategory =
        category === "All"
          ? true
          : String(i.category || "").toLowerCase() ===
            String(category).toLowerCase();

      // Text query filter
      const hay =
        `${i.title} ${i.description} ${i.category || ""}`.toLowerCase();
      const matchQuery = q ? hay.includes(q) : true;

      return matchScope && matchCategory && matchQuery;
    });
  }, [items, category, query, scope, user]);

  // ✅ UI sizing for easier clicking
  const bigControlSx = {
    "& .MuiInputBase-root": {
      minHeight: 50, // bigger input height
      fontSize: 16, // larger text
    },
    "& .MuiInputBase-input": {
      padding: "14px 14px", // bigger click area inside input
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
      minHeight: 44,
      minWidth: 130,
      padding: "10px 16px",
      fontSize: 14.5,
      fontWeight: 800,
      textTransform: "none",
    },
  };

  return (
    <Box sx={{ py: 3 }}>
      <Container maxWidth="lg">
        <Stack
          direction="row"
          alignItems="end"
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900 }}>
              Items for Donation
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Filter by category or search by item name/description.
            </Typography>
          </Box>

          <ToggleButtonGroup
            value={scope}
            exclusive
            onChange={(e, v) => v && setScope(v)}
            size="medium"
            sx={{ bgcolor: "background.paper", ...bigToggleSx }}
          >
            <ToggleButton value="all">
              <Inventory2RoundedIcon
                fontSize="small"
                style={{ marginRight: 6 }}
              />
              All
            </ToggleButton>
            <ToggleButton value="mine">
              <PersonRoundedIcon fontSize="small" style={{ marginRight: 6 }} />
              My items
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        {/* Filters */}
        <Paper variant="outlined" sx={{ p: { xs: 2, md: 2.5 }, mb: 3 }}>
          <Grid container spacing={2}>
            {/* Search bar 1: Category */}
            <Grid item xs={12} md={4}>
              <Autocomplete
                options={categories}
                value={category}
                onChange={(e, v) => setCategory(v || "All")}
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
            </Grid>

            {/* Search bar 2: Item search */}
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Search items"
                placeholder="Search by title or description (e.g., chair, books...)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                sx={bigControlSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          {/* Filter chips */}
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

        {/* Items grid */}
        <Grid container spacing={2}>
          {loadingItems ? (
            <Grid item xs={12}>
              <Typography color="text.secondary">Loading items…</Typography>
            </Grid>
          ) : (
            filtered.map((item) => (
              <Grid key={item.id} item xs={12} sm={6} md={4}>
                <ItemCard item={item} onView={onView} />
              </Grid>
            ))
          )}

          {!loadingItems && filtered.length === 0 && (
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 3, textAlign: "center" }}>
                <Typography sx={{ fontWeight: 800 }}>No results</Typography>
                <Typography variant="body2" color="text.secondary">
                  Try clearing filters or switching to “All”.
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
}
