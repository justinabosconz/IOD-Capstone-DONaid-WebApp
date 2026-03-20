import React, { useState } from "react";
import { Alert, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { itemApi } from "../api/itemApi";
import { useAuth } from "../context/AuthContext";
import ItemForm from "../components/items/ItemForm";

export default function CreateItemPage() {
  const { sessionId } = useAuth();
  const navigate = useNavigate();

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (payload) => {
    setBusy(true);
    setError("");
    try {
      const created = await itemApi.create(payload, sessionId);
      navigate(`/items/${created.id}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Create listing</Typography>
      <Typography variant="body2" color="text.secondary">
        Add an item you want to donate. Images use URL links (no uploads).
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <ItemForm mode="create" onSubmit={submit} submitting={busy} />
    </Stack>
  );
}
