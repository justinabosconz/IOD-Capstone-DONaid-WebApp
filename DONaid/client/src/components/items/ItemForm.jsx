import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";

const categories = [
  "Clothing",
  "Furniture",
  "Electronics",
  "Books",
  "Kitchen",
  "Kids",
  "Other",
];
const conditions = ["New", "Like New", "Good", "Fair", "Used"];
const statuses = ["AVAILABLE", "PENDING", "CLAIMED"];

export default function ItemForm({
  initialValues,
  mode = "create",
  onSubmit,
  submitting = false,
  showStatus = false,
}) {
  const defaults = useMemo(
    () => ({
      title: "",
      description: "",
      category: "",
      condition: "",
      imageUrl: "",
      status: "AVAILABLE",
      ...initialValues,
    }),
    [initialValues],
  );

  const [values, setValues] = useState(defaults);
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => setValues((p) => ({ ...p, [k]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!values.title.trim()) next.title = "Title is required";
    if (values.imageUrl && !/^https?:\/\/.+/i.test(values.imageUrl.trim())) {
      next.imageUrl = "Image URL must start with http:// or https://";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      title: values.title.trim(),
      description: values.description.trim(),
      category: values.category,
      condition: values.condition,
      imageUrl: values.imageUrl.trim(),
      ...(showStatus ? { status: values.status } : {}),
    };
    await onSubmit(payload);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 1 }}>
          {mode === "create"
            ? "Create Donation Listing"
            : "Edit Donation Listing"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Lo‑fi form — keep it simple: title + description + image URL.
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box component="form" onSubmit={submit}>
          <Stack spacing={2}>
            <TextField
              label="Title"
              value={values.title}
              onChange={set("title")}
              error={!!errors.title}
              helperText={errors.title}
              fullWidth
              required
            />

            <TextField
              label="Description"
              value={values.description}
              onChange={set("description")}
              multiline
              minRows={3}
              fullWidth
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                select
                label="Category"
                value={values.category}
                onChange={set("category")}
                fullWidth
              >
                <MenuItem value="">(None)</MenuItem>
                {categories.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Condition"
                value={values.condition}
                onChange={set("condition")}
                fullWidth
              >
                <MenuItem value="">(None)</MenuItem>
                {conditions.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            <TextField
              label="Image URL"
              value={values.imageUrl}
              onChange={set("imageUrl")}
              error={!!errors.imageUrl}
              helperText={
                errors.imageUrl || "Paste a link to an image (no uploads)."
              }
              fullWidth
            />

            {showStatus && (
              <TextField
                select
                label="Status"
                value={values.status}
                onChange={set("status")}
                fullWidth
              >
                {statuses.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </TextField>
            )}

            <Stack direction="row" justifyContent="flex-end" spacing={1}>
              <Button type="submit" variant="contained" disabled={submitting}>
                {submitting ? "Saving..." : "Save"}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
