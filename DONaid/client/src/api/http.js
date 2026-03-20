const base = import.meta.env.VITE_API_BASE;

export async function http(path, { method = "GET", body, sessionId } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (sessionId) headers["X-Session-Id"] = sessionId;

  const res = await fetch(`${base}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}
