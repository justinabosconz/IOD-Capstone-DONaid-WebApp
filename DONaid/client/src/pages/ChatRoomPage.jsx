import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { chatApi } from "../api/chatApi";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import LoadingBlock from "../components/common/LoadingBlock";

export default function ChatRoomPage() {
  const { id } = useParams(); // chatId
  const navigate = useNavigate();
  const { sessionId, user } = useAuth();
  const { socket } = useSocket();

  const [messages, setMessages] = useState([]);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const [text, setText] = useState("");

  const bottomRef = useRef(null);

  useEffect(() => {
    let alive = true;
    setBusy(true);
    setError("");
    chatApi
      .getMessages(id, sessionId)
      .then((data) => alive && setMessages(data))
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setBusy(false));
    return () => (alive = false);
  }, [id, sessionId]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("joinChat", { chatId: id });

    const onNew = (msg) => {
      if (String(msg.chatId) === String(id)) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("newMessage", onNew);
    return () => socket.off("newMessage", onNew);
  }, [socket, id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const send = () => {
    if (!socket) return;
    const content = text.trim();
    if (!content) return;

    socket.emit("sendMessage", { chatId: id, content });
    setText("");
  };

  const grouped = useMemo(() => messages, [messages]);

  if (busy) return <LoadingBlock label="Loading chat..." />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/chats")}
          variant="outlined"
        >
          Back
        </Button>
        <Typography variant="h5">Chat</Typography>
        <Typography variant="body2" color="text.secondary">
          Chat ID: {id}
        </Typography>
      </Stack>

      <Card>
        <CardContent>
          <Typography variant="subtitle2">Messages</Typography>
          <Divider sx={{ my: 1 }} />

          <Box
            sx={{
              height: { xs: 420, md: 480 },
              overflow: "auto",
              bgcolor: "#fafafa",
              border: "1px solid #eee",
              borderRadius: 2,
              p: 1.5,
            }}
          >
            {grouped.map((m) => {
              const mine =
                m.senderUserId === user?.id || m.sender?.id === user?.id;
              const name = mine ? "You" : m.sender?.displayName || "Them";
              const time = m.createdAt
                ? new Date(m.createdAt).toLocaleString()
                : "";

              return (
                <Box
                  key={m.id}
                  sx={{
                    display: "flex",
                    justifyContent: mine ? "flex-end" : "flex-start",
                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: "78%",
                      px: 1.5,
                      py: 1,
                      borderRadius: 2,
                      bgcolor: mine ? "primary.main" : "white",
                      color: mine ? "primary.contrastText" : "text.primary",
                      border: mine ? "none" : "1px solid #eee",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ opacity: mine ? 0.9 : 0.7 }}
                    >
                      {name} {time ? `• ${time}` : ""}
                    </Typography>
                    <Typography variant="body2">{m.content}</Typography>
                  </Box>
                </Box>
              );
            })}
            <div ref={bottomRef} />
          </Box>

          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
            />
            <Button variant="contained" onClick={send}>
              Send
            </Button>
          </Stack>

          {!socket && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Socket is not connected. Try refreshing or logging in again.
            </Alert>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}
