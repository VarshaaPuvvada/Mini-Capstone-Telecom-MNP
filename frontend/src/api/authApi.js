const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

async function handleResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || data.message || "Request failed");
  }

  return data;
}

export function registerUser({ name, mobileNumber, role, password }) {
  return fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      mobile_number: mobileNumber,
      role,
      password,
    }),
  }).then(handleResponse);
}

export function loginUser({ mobileNumber, password }) {
  return fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mobile_number: mobileNumber,
      password,
    }),
  }).then(handleResponse);
}

export function getCurrentUser(token) {
  return fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(handleResponse);
}

export function getCustomerDashboard(token) {
  return fetch(`${API_BASE_URL}/auth/customer-dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(handleResponse);
}

export function getAgentDashboard(token) {
  return fetch(`${API_BASE_URL}/auth/agent-dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(handleResponse);
}

export function getAdminDashboard(token) {
  return fetch(`${API_BASE_URL}/auth/admin-dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(handleResponse);
}
