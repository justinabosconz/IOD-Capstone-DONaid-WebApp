import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Stack,
  Typography,
  Alert,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { itemApi } from "../api/itemApi";
import { chatApi } from "../api/chatApi";
import { useAuth } from "../context/AuthContext";
import LoadingBlock from "../components/common/LoadingBlock";
import ConfirmDialog from "../components/common/ConfirmDialog";

const fallback =
  "https://images.unsplash.com/photo-1520975958225-9f61b40d87b4?auto=format&fit=crop&w=1200&q=60";

export default function ItemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, sessionId } = useAuth();

  const [item, setItem] = useState(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

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

  const messageDonor = async () => {
    if (!user) return navigate("/login", { state: { from: `/items/${id}` } });
    if (!item?.owner?.id) return;

    const chat = await chatApi.createOrGet(
      { itemId: item.id, otherUserId: item.owner.id },
      sessionId,
    );
    navigate(`/chats/${chat.id}`);
  };

  const deleteItem = async () => {
    setConfirmOpen(false);
    await itemApi.remove(item.id, sessionId);
    navigate("/", { replace: true });
  };

  if (busy) return <LoadingBlock label="Loading item..." />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!item) return <Alert severity="warning">Item not found</Alert>;

  return (
    <Box>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems="stretch"
      >
        <Card sx={{ flex: 1 }}>
          <CardMedia
            component="img"
            height="320"
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
              <Typography variant="h5">{item.title}</Typography>
              <Chip
                label={item.status}
                color={item.status === "AVAILABLE" ? "primary" : "default"}
              />
            </Stack>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {item.category || "Uncategorised"} • {item.condition || "N/A"}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2">Description</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {item.description || "No description provided."}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2">Donor</Typography>
            <Typography variant="body2" color="text.secondary">
              {item.owner?.displayName || "Unknown"}
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{ mt: 2 }}
            >
              <Button
                variant="contained"
                startIcon={<ChatIcon />}
                onClick={messageDonor}
              >
                Message donor
              </Button>

              {isOwner && (
                <>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    component={RouterLink}
                    to={`/items/${item.id}/edit`}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => setConfirmOpen(true)}
                  >
                    Delete
                  </Button>
                </>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete listing?"
        message="This will permanently remove the item listing."
        confirmText="Delete"
        onConfirm={deleteItem}
        onClose={() => setConfirmOpen(false)}
      />
    </Box>
  );
}
