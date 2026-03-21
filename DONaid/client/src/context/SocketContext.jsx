import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { token } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // ✅ Always disconnect previous socket when token changes
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }

    if (!token) return;

    const s = io("http://localhost:4000", {
      auth: { token }, // ✅ new token used here
    });

    setSocket(s);
    return () => s.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const value = useMemo(() => ({ socket }), [socket]);
  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
