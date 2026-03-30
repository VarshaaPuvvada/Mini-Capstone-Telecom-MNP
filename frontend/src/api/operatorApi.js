import { apiRequest } from "./client";

export function getUserDocuments(userId, token) {
  return apiRequest(`/operator/documents/${userId}`, { token });
}

export function verifyUserDocuments(portId, token) {
  return apiRequest(`/operator/verify-documents/${portId}`, {
    method: "PUT",
    token,
  });
}

export function createOperator({ name, circle }, token) {
  return apiRequest("/admin/operators", {
    method: "POST",
    token,
    body: { name, circle },
  });
}

export function getOperators(token) {
  return apiRequest("/admin/operators", { token });
}
