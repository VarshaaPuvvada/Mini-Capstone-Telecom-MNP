import { apiRequest } from "./client";

export function sendOtp(mobileNumber, token) {
  return apiRequest("/otp/send", {
    method: "POST",
    token,
    body: { mobile_number: mobileNumber },
  });
}

export function verifyOtp({ mobileNumber, otp }, token) {
  return apiRequest("/otp/verify", {
    method: "POST",
    token,
    body: {
      mobile_number: mobileNumber,
      otp,
    },
  });
}
