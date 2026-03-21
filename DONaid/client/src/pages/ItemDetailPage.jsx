import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Chip,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";

import { api } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useItems } from "../context/ItemsContext";
import ChatBox from "../components/ChatBox";

export default function ItemDetailPage({ itemId, onBack }) {
  const { user } = useAuth();
  const { updateItem, deleteItem } = useItems();

  const [item, setItem] = useState(null);
  const [err, setErr] = useState("");

  // Edit dialog state
  const [openEdit, setOpenEdit] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    itemCondition: "",
    status: "AVAILABLE",
  });

  // ✅ Anchor at top of the page (we will scroll to this with an offset)
  const topRef = useRef(null);

  // ✅ Load item data
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setErr("");
        const data = await api.getItem(itemId);
        if (cancelled) return;

        setItem(data);
        setForm({
          title: data.title || "",
          description: data.description || "",
          category: data.category || "",
          itemCondition: data.itemCondition || "",
          status: data.status || "AVAILABLE",
        });
      } catch (e) {
        if (!cancelled) setErr(e.message);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [itemId]);

  // ✅ Bulletproof scroll: always bring the top (Back button) into view
  //    while accounting for sticky AppBar height.
  useEffect(() => {
    // Run after render
    const t = setTimeout(() => {
      const topEl = topRef.current;
      if (!topEl) return;

      // Find MUI AppBar <header> (sticky)
      const header = document.querySelector("header.MuiAppBar-root");
      const headerBottom = header ? header.getBoundingClientRect().bottom : 0;

      // Add extra padding so Back button is comfortably visible
      const extraPadding = 20;
      const offset = headerBottom + extraPadding;

      const y = topEl.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({
        top: Math.max(0, y),
        left: 0,
        behavior: "smooth", // ✅ correct spelling
      });
    }, 60);

    return () => clearTimeout(t);
  }, [itemId]);

  // ✅ Owner check (only owners can edit/delete)
  const isOwner = useMemo(() => {
    return item?.owner?.id && user?.id && item.owner.id === user.id;
  }, [item, user]);

  async function onSave() {
    if (!item) return;
    setSaving(true);
    try {
      setErr("");
      const updated = await updateItem(item.id, form);
      setItem((prev) => ({ ...prev, ...updated }));
      setOpenEdit(false);
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!item) return;
    if (!window.confirm("Delete this item? This cannot be undone.")) return;

    try {
      setErr("");
      await deleteItem(item.id);
      onBack();
    } catch (e) {
      setErr(e.message);
    }
  }

  // Error state
  if (err && !item) {
    return (
      <Box sx={{ py: 3 }}>
        <Container maxWidth="md">
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography sx={{ fontWeight: 900 }}>
              Could not load item
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {err}
            </Typography>
            <Button
              sx={{ mt: 2 }}
              variant="outlined"
              onClick={onBack}
              startIcon={<ArrowBackRoundedIcon />}
            >
              Back
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  // Loading state
  if (!item) {
    return (
      <Box sx={{ py: 3 }}>
        <Container maxWidth="md">
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography color="text.secondary">Loading…</Typography>
          </Paper>
        </Container>
      </Box>
    );
  }

  const imgSrc = item.imagePath
    ? `http://localhost:4000/uploads/${item.imagePath}`
    : null;

  return (
    <Box sx={{ py: 3 }}>
      {/* ✅ Top anchor so we always scroll to where buttons are visible */}
      <div ref={topRef} />

      <Container maxWidth="md" sx={{ pt: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <Button
            variant="outlined"
            onClick={onBack}
            startIcon={<ArrowBackRoundedIcon />}
          >
            Back
          </Button>

          <Box sx={{ flex: 1 }} />

          {isOwner && (
            <>
              <Button
                variant="outlined"
                startIcon={<EditRoundedIcon />}
                onClick={() => setOpenEdit(true)}
              >
                Edit
              </Button>
              <Button
                color="error"
                variant="contained"
                startIcon={<DeleteRoundedIcon />}
                onClick={onDelete}
              >
                Delete
              </Button>
            </>
          )}
        </Stack>

        <Paper variant="outlined" sx={{ p: 3 }}>
          {imgSrc && (
            <Box
              component="img"
              src={imgSrc}
              alt={item.title}
              sx={{
                width: "100%",
                maxHeight: 360,
                objectFit: "cover",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                mb: 2,
              }}
            />
          )}

          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            {item.title}
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            sx={{ mt: 1, flexWrap: "wrap", rowGap: 1 }}
          >
            <Chip label={item.category || "Uncategorised"} />
            <Chip
              variant="outlined"
              label={item.itemCondition || "Condition: N/A"}
            />
            <Chip
              label={item.status || "AVAILABLE"}
              color="primary"
              variant="outlined"
            />
          </Stack>

          <Typography variant="body1" sx={{ mt: 2 }}>
            {item.description}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body2" color="text.secondary">
            Owner: <strong>{item.owner?.displayName}</strong> (
            {item.owner?.email})
          </Typography>

          {err && (
            <Paper
              variant="outlined"
              sx={{
                mt: 2,
                p: 1.5,
                bgcolor: "#FEF2F2",
                borderColor: "#FECACA",
                color: "#991B1B",
              }}
            >
              {err}
            </Paper>
          )}
        </Paper>

        <Box sx={{ mt: 2 }}>
          <ChatBox itemId={item.id} />
        </Box>
      </Container>

      {/* Edit dialog */}
      <Dialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit item</DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
            />

            <TextField
              label="Description"
              value={form.description}
              multiline
              rows={4}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                label="Category"
                value={form.category}
                onChange={(e) =>
                  setForm((p) => ({ ...p, category: e.target.value }))
                }
              />
              <TextField
                fullWidth
                label="Condition"
                value={form.itemCondition}
                onChange={(e) =>
                  setForm((p) => ({ ...p, itemCondition: e.target.value }))
                }
              />
            </Stack>

            <TextField
              select
              label="Status"
              value={form.status}
              onChange={(e) =>
                setForm((p) => ({ ...p, status: e.target.value }))
              }
            >
              <MenuItem value="AVAILABLE">AVAILABLE</MenuItem>
              <MenuItem value="TAKEN">TAKEN</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={() => setOpenEdit(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveRoundedIcon />}
            onClick={onSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
