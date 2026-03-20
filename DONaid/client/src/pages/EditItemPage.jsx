import React, { useEffect, useMemo, useState } from "react";
import { Alert, Stack, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import { itemApi } from "../api/itemApi";
import { useAuth } from "../context/AuthContext";
import ItemForm from "../components/items/ItemForm";
import LoadingBlock from "../components/common/LoadingBlock";

export default function EditItemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, sessionId } = useAuth();

  const [item, setItem] = useState(null);
  const [busy, setBusy] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    setBusy(true);
    setError("");
    itemApi
      .get(id)
      .then((data) => alive && setItem(data))
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setBusy(false));
    return () => (alive = false);
  }, [id]);

  const isOwner = useMemo(() => {
    return user && item && item.ownerUserId === user.id;
  }, [user, item]);

  const submit = async (payload) => {
    setSaving(true);
    setError("");
    try {
      const updated = await itemApi.update(id, payload, sessionId);
      navigate(`/items/${updated.id}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (busy) return <LoadingBlock label="Loading listing..." />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!item) return <Alert severity="warning">Item not found</Alert>;
  if (!isOwner)
    return (
      <Alert severity="warning">Only the owner can edit this listing.</Alert>
    );

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Edit listing</Typography>
      <Typography variant="body2" color="text.secondary">
        Update details and status.
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <ItemForm
        mode="edit"
        initialValues={item}
        onSubmit={submit}
        submitting={saving}
        showStatus
      />
    </Stack>
  );
}
