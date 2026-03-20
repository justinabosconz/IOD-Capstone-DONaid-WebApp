import { http } from "./http";

export const authApi = {
  register: (displayName, email, password) =>
    http("/auth/register", {
      method: "POST",
      body: { displayName, email, password },
    }),

  login: (email, password) =>
    http("/auth/login", { method: "POST", body: { email, password } }),

  logout: (sessionId) => http("/auth/logout", { method: "POST", sessionId }),
};
