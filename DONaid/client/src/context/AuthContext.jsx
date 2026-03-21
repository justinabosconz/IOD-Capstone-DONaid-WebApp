// client/src/context/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api } from "../api/api";

// Create context
const AuthContext = createContext(null);

/**
 * AuthProvider
 * - Stores token in localStorage
 * - Loads user profile (/me) on refresh
 * - Exposes login/register/logout
 */
export function AuthProvider({ children }) {
  // ✅ Load token from localStorage once
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ On token change (or first load), fetch current user
  useEffect(() => {
    let cancelled = false;

    async function loadMe() {
      try {
        if (!token) {
          // No token = not logged in
          if (!cancelled) {
            setUser(null);
            setLoading(false);
          }
          return;
        }

        const me = await api.me(token);
        if (!cancelled) {
          setUser(me);
          setLoading(false);
        }
      } catch (err) {
        // Token invalid/expired -> clear it
        localStorage.removeItem("token");
        if (!cancelled) {
          setToken(null);
          setUser(null);
          setLoading(false);
        }
      }
    }

    setLoading(true);
    loadMe();

    return () => {
      cancelled = true;
    };
  }, [token]);

  // ✅ Login: overwrite token and user every time
  async function login(email, password) {
    const data = await api.login({ email, password });

    // Important: replace token (switch users safely)
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user);
  }

  // ✅ Register then login
  async function register(displayName, email, password) {
    await api.register({ displayName, email, password });
    await login(email, password);
  }

  // ✅ Logout: remove token + clear session
  async function logout() {
    try {
      if (token) await api.logout(token);
    } catch {
      // ignore logout errors
    }
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }

  // Values exposed to the app
  const value = useMemo(
    () => ({ token, user, loading, login, register, logout }),
    [token, user, loading],
  );

  // ✅ This return MUST be inside the AuthProvider function
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use AuthContext
export function useAuth() {
  return useContext(AuthContext);
}
