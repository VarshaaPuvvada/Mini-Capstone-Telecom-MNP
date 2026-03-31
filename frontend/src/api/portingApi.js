const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

async function handleResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || data.message || "Request failed");
  }

  return data;
}

export function createPortRequest(
  { mobileNumber, currentOperator, targetOperator },
  token,
) {
  return fetch(`${API_BASE_URL}/port/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      mobile_number: mobileNumber,
      current_operator: currentOperator,
      target_operator: targetOperator,
    }),
  }).then(handleResponse);
}

export function getMyPortRequests(token) {
  return fetch(`${API_BASE_URL}/port/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(handleResponse);
}

export function getAllPortRequests(token) {
  return fetch(`${API_BASE_URL}/port/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(handleResponse);
}

export function verifyPortRequest(portId, token) {
  return fetch(`${API_BASE_URL}/port/${portId}/verify`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(handleResponse);
}

export function approvePortRequest(portId, token) {
  return fetch(`${API_BASE_URL}/port/${portId}/approve`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(handleResponse);
}

export function rejectPortRequest(portId, token) {
  return fetch(`${API_BASE_URL}/port/${portId}/reject`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(handleResponse);
}

export function uploadPortDocument({ type, fileUrl }, token) {
  return fetch(`${API_BASE_URL}/port/documents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      type,
      file_url: fileUrl,
    }),
  }).then(handleResponse);
}
