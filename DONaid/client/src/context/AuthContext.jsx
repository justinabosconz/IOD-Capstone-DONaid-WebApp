import React, { createContext, useContext, useMemo, useState } from "react";
import { http } from "../api/http";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [sessionId, setSessionId] = useState(localStorage.getItem("sessionId"));
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null"),
  );

  const login = async (email, password) => {
    const data = await http("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    setSessionId(data.sessionId);
    setUser(data.user);
    localStorage.setItem("sessionId", data.sessionId);
    localStorage.setItem("user", JSON.stringify(data.user));
  };

  const register = async (displayName, email, password) => {
    const data = await http("/auth/register", {
      method: "POST",
      body: { displayName, email, password },
    });
    setSessionId(data.sessionId);
    setUser(data.user);
    localStorage.setItem("sessionId", data.sessionId);
    localStorage.setItem("user", JSON.stringify(data.user));
  };

  const logout = async () => {
    if (sessionId)
      await http("/auth/logout", { method: "POST", sessionId }).catch(() => {});
    setSessionId(null);
    setUser(null);
    localStorage.removeItem("sessionId");
    localStorage.removeItem("user");
  };

  const value = useMemo(
    () => ({ sessionId, user, login, register, logout }),
    [sessionId, user],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
