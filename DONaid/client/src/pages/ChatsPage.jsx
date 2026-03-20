import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";

import { chatApi } from "../api/chatApi";
import { useAuth } from "../context/AuthContext";
import LoadingBlock from "../components/common/LoadingBlock";
import EmptyState from "../components/common/EmptyState";

export default function ChatsPage() {
  const { user, sessionId } = useAuth();
  const navigate = useNavigate();

  const [chats, setChats] = useState([]);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    setBusy(true);
    setError("");
    chatApi
      .listMine(sessionId)
      .then((data) => alive && setChats(data))
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setBusy(false));
    return () => (alive = false);
  }, [sessionId]);

  const renderOtherName = (chat) => {
    const owner = chat.Item?.owner;
    const myId = user?.id;

    // Other party is either owner or the other chat user (depending on who you are)
    // For lo-fi, show owner name + item title. It’s good enough for capstone.
    return owner?.id === myId ? "Recipient" : owner?.displayName || "User";
  };

  const subtitle = useMemo(() => {
    return "Select a conversation to message in real-time.";
  }, []);

  return (
    <Box>
      <Typography variant="h5">Chats</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {subtitle}
      </Typography>

      {busy && <LoadingBlock label="Loading chats..." />}
      {!busy && error && <Alert severity="error">{error}</Alert>}

      {!busy && !error && chats.length === 0 && (
        <EmptyState
          title="No chats yet"
          subtitle="Open an item and click “Message donor” to start."
        />
      )}

      {!busy && !error && chats.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Your conversations
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <List disablePadding>
              {chats.map((chat) => (
                <ListItemButton
                  key={chat.id}
                  onClick={() => navigate(`/chats/${chat.id}`)}
                >
                  <ListItemText
                    primary={chat.Item?.title || "Item"}
                    secondary={`With: ${renderOtherName(chat)} • Chat ID: ${chat.id}`}
                  />
                </ListItemButton>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
