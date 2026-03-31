const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

async function handleResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || data.message || "Request failed");
  }

  return data;
}

export function getUserDocuments(userId, token) {
  return fetch(`${API_BASE_URL}/operator/documents/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(handleResponse);
}

export function verifyUserDocuments(portId, token) {
  return fetch(`${API_BASE_URL}/operator/verify-documents/${portId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(handleResponse);
}

export function createOperator({ name, circle }, token) {
  return fetch(`${API_BASE_URL}/admin/operators`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, circle }),
  }).then(handleResponse);
}

export function getOperators(token) {
  return fetch(`${API_BASE_URL}/admin/operators`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(handleResponse);
}
