import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import { useItems } from "../context/ItemsContext";

export default function AddItemPage({ onDone }) {
  const { addItem } = useItems();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [itemCondition, setItemCondition] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  function onPickFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      setErr("Image is too large. Please choose a file under 3MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setImageDataUrl(String(reader.result));
    reader.readAsDataURL(file);
  }

  async function submit(e) {
    e.preventDefault();
    setErr("");

    if (!title.trim() || !description.trim()) {
      setErr("Title and description are required.");
      return;
    }

    try {
      setBusy(true);
      await addItem({
        title,
        description,
        category,
        itemCondition,
        imageDataUrl,
      });
      onDone();
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Box sx={{ py: 3 }}>
      <Container maxWidth="md">
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 900, mb: 0.5 }}>
            Add a donation item
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Add clear details and a photo so people can quickly understand what
            you’re donating.
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Box component="form" onSubmit={submit}>
            <Stack spacing={2}>
              <TextField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Wooden chair"
                required
              />

              <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add size, condition, pickup notes..."
                multiline
                rows={4}
                required
              />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  fullWidth
                  label="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Furniture, Electronics"
                />
                <TextField
                  fullWidth
                  label="Condition"
                  value={itemCondition}
                  onChange={(e) => setItemCondition(e.target.value)}
                  placeholder="e.g. Like new, Good, Used"
                />
              </Stack>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems="center"
              >
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<AddPhotoAlternateRoundedIcon />}
                >
                  Upload photo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={onPickFile}
                  />
                </Button>

                {imageDataUrl && (
                  <Box
                    component="img"
                    src={imageDataUrl}
                    alt="preview"
                    sx={{
                      height: 120,
                      width: 200,
                      objectFit: "cover",
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  />
                )}
              </Stack>

              {err && (
                <Paper
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    bgcolor: "#FEF2F2",
                    borderColor: "#FECACA",
                    color: "#991B1B",
                  }}
                >
                  {err}
                </Paper>
              )}

              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  startIcon={<CloseRoundedIcon />}
                  onClick={onDone}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveRoundedIcon />}
                  disabled={busy}
                >
                  {busy ? "Saving..." : "Save item"}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
