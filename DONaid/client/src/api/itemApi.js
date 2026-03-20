import { http } from "./http";

export const itemApi = {
  list: () => http("/items"),
  get: (id) => http(`/items/${id}`),
  create: (payload, sessionId) =>
    http("/items", { method: "POST", body: payload, sessionId }),
  update: (id, payload, sessionId) =>
    http(`/items/${id}`, { method: "PUT", body: payload, sessionId }),
  remove: (id, sessionId) =>
    http(`/items/${id}`, { method: "DELETE", sessionId }),
};
