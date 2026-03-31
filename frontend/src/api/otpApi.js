const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

async function handleResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || data.message || "Request failed");
  }

  return data;
}

export function sendOtp(mobileNumber, token) {
  return fetch(`${API_BASE_URL}/otp/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ mobile_number: mobileNumber }),
  }).then(handleResponse);
}

export function verifyOtp({ mobileNumber, otp }, token) {
  return fetch(`${API_BASE_URL}/otp/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      mobile_number: mobileNumber,
      otp,
    }),
  }).then(handleResponse);
}
