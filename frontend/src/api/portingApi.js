import { apiRequest } from "./client";

export function createPortRequest(
  { mobileNumber, currentOperator, targetOperator },
  token,
) {
  return apiRequest("/port/", {
    method: "POST",
    token,
    body: {
      mobile_number: mobileNumber,
      current_operator: currentOperator,
      target_operator: targetOperator,
    },
  });
}

export function getMyPortRequests(token) {
  return apiRequest("/port/my", { token });
}

export function getAllPortRequests(token) {
  return apiRequest("/port/", { token });
}

export function verifyPortRequest(portId, token) {
  return apiRequest(`/port/${portId}/verify`, {
    method: "PUT",
    token,
  });
}

export function approvePortRequest(portId, token) {
  return apiRequest(`/port/${portId}/approve`, {
    method: "PUT",
    token,
  });
}

export function rejectPortRequest(portId, token) {
  return apiRequest(`/port/${portId}/reject`, {
    method: "PUT",
    token,
  });
}

export function uploadPortDocument({ type, fileUrl }, token) {
  return apiRequest("/port/documents", {
    method: "POST",
    token,
    body: {
      type,
      file_url: fileUrl,
    },
  });
}
