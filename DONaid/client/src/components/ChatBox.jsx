import React, { useEffect, useRef, useState } from "react";
import {
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/api";

export default function ChatBox({ itemId }) {
  const { socket } = useSocket();
  const { token, user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [body, setBody] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    async function load() {
      const history = await api.listMessages(token, itemId);
      setMessages(history);
    }
    load();
  }, [token, itemId]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("joinItemRoom", { itemId });

    const handler = (msg) => {
      if (String(msg.itemId) === String(itemId)) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("newMessage", handler);
    return () => socket.off("newMessage", handler);
  }, [socket, itemId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function send() {
    if (!body.trim()) return;
    socket.emit("sendMessage", { itemId, body: body.trim() });
    setBody("");
  }

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography sx={{ fontWeight: 900, mb: 1 }}>Chat</Typography>

      <Box
        sx={{
          height: 260,
          overflowY: "auto",
          pr: 1,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          mb: 1.5,
        }}
      >
        {messages.map((m) => {
          const fromMe = m.fromUserId
            ? m.fromUserId === user?.id
            : m.fromUser?.id === user?.id;
          const name = m.fromUser?.displayName || "User";

          return (
            <Box
              key={m.id || `${m.createdAt}-${m.body}`}
              sx={{
                alignSelf: fromMe ? "flex-end" : "flex-start",
                maxWidth: "80%",
                bgcolor: fromMe ? "primary.main" : "grey.100",
                color: fromMe ? "white" : "text.primary",
                borderRadius: 2,
                px: 1.5,
                py: 1,
                border: "1px solid",
                borderColor: fromMe ? "primary.main" : "divider",
              }}
            >
              <Typography
                variant="caption"
                sx={{ opacity: fromMe ? 0.9 : 0.8 }}
              >
                {name}
              </Typography>
              <Typography variant="body2">{m.body}</Typography>
            </Box>
          );
        })}
        <div ref={bottomRef} />
      </Box>

      <Stack direction="row" spacing={1}>
        <TextField
          fullWidth
          placeholder="Type a message…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              send();
            }
          }}
        />
        <Button
          variant="contained"
          onClick={send}
          endIcon={<SendRoundedIcon />}
        >
          Send
        </Button>
      </Stack>
    </Paper>
  );
}
