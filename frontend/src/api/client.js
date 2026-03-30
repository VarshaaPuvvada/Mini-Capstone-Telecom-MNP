const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") || "http://127.0.0.1:8000";

function buildHeaders(token, hasBody, extraHeaders = {}) {
  const headers = { ...extraHeaders };

  if (hasBody && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      payload?.detail ||
      payload?.message ||
      (typeof payload === "string" && payload) ||
      "Request failed";

    const error = new Error(message);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

export async function apiRequest(path, options = {}) {
  const {
    method = "GET",
    body,
    token,
    headers,
    signal,
  } = options;

  const hasBody = body !== undefined && body !== null;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: buildHeaders(token, hasBody, headers),
    body: hasBody ? JSON.stringify(body) : undefined,
    signal,
  });

  return parseResponse(response);
}

export { API_BASE_URL };
