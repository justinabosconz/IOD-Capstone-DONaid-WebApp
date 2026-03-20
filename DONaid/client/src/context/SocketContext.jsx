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
export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }) {
  const { sessionId } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setSocket(null);
      return;
    }
    const s = io(import.meta.env.VITE_SOCKET_URL, { auth: { sessionId } });
    setSocket(s);
    return () => s.disconnect();
  }, [sessionId]);

  const value = useMemo(() => ({ socket }), [socket]);
  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}
