const API_BASE = "http://localhost:4000/api";

export async function apiFetch(path, { token, method = "GET", body } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export const api = {
  register: (payload) =>
    apiFetch("/auth/register", { method: "POST", body: payload }),

  login: (payload) =>
    apiFetch("/auth/login", { method: "POST", body: payload }),
  me: (token) => apiFetch("/auth/me", { token }),

  logout: (token) => apiFetch("/auth/logout", { token, method: "POST" }),

  listItems: () => apiFetch("/items"),

  getItem: (id) => apiFetch(`/items/${id}`),

  createItem: (token, payload) =>
    apiFetch("/items", { token, method: "POST", body: payload }),

  listMessages: (token, itemId) =>
    apiFetch(`/chat/${itemId}/messages`, { token }),

  updateItem: (token, id, payload) =>
    apiFetch(`/items/${id}`, { token, method: "PUT", body: payload }),

  deleteItem: (token, id) =>
    apiFetch(`/items/${id}`, { token, method: "DELETE" }),
};
