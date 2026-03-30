import { apiRequest } from "./client";

export function registerUser({ name, mobileNumber, role, password }) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: {
      name,
      mobile_number: mobileNumber,
      role,
      password,
    },
  });
}

export function loginUser({ mobileNumber, password }) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: {
      mobile_number: mobileNumber,
      password,
    },
  });
}

export function getCurrentUser(token) {
  return apiRequest("/auth/me", { token });
}

export function getCustomerDashboard(token) {
  return apiRequest("/auth/customer-dashboard", { token });
}

export function getAgentDashboard(token) {
  return apiRequest("/auth/agent-dashboard", { token });
}

export function getAdminDashboard(token) {
  return apiRequest("/auth/admin-dashboard", { token });
}
