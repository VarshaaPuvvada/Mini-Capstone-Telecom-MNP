import { useMemo, useState } from "react";
import {
  createPortRequest,
  uploadPortDocument,
} from "../api/portingApi";
import { verifyOtp } from "../api/otpApi";
import { useAuth } from "../context/AuthContext";

const blockStyle = {
  background: "#ffffff",
  border: "1px solid #d7dce5",
  borderRadius: "18px",
  padding: "20px",
  boxShadow: "0 12px 28px rgba(15, 23, 42, 0.06)",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid #cbd5e1",
  borderRadius: "12px",
  padding: "12px 14px",
  fontSize: "14px",
  marginTop: "8px",
};

export default function RequestPort({ onCreated }) {
  const { token, user } = useAuth();
  const [requestForm, setRequestForm] = useState({
    mobileNumber: user?.mobile_number || "",
    currentOperator: "",
    targetOperator: "",
  });
  const [documentForm, setDocumentForm] = useState({
    type: "aadhaar",
    fileUrl: "",
  });
  const [otpCode, setOtpCode] = useState("");
  const [createdRequest, setCreatedRequest] = useState(null);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentMobileNumber = useMemo(
    () => requestForm.mobileNumber || user?.mobile_number || "",
    [requestForm.mobileNumber, user?.mobile_number],
  );

  function updateRequestForm(event) {
    const { name, value } = event.target;
    setError("");
    setStatusMessage("");
    setRequestForm((current) => ({ ...current, [name]: value }));
  }

  function updateDocumentForm(event) {
    const { name, value } = event.target;
    setError("");
    setStatusMessage("");
    setDocumentForm((current) => ({ ...current, [name]: value }));
  }

  async function handleCreateRequest(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    setStatusMessage("");

    try {
      const response = await createPortRequest(requestForm, token);
      setCreatedRequest(response.port_request);
      setStatusMessage(response.message);

      if (onCreated) {
        onCreated(response.port_request);
      }
    } catch (submitError) {
      setError(submitError.message || "Failed to create port request.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUploadDocument(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    setStatusMessage("");

    try {
      const uploaded = await uploadPortDocument(documentForm, token);
      setUploadedDocuments((current) => [uploaded, ...current]);
      setDocumentForm((current) => ({ ...current, fileUrl: "" }));
      setStatusMessage("Document uploaded successfully.");
    } catch (uploadError) {
      setError(uploadError.message || "Failed to upload document.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleVerifyOtp(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    setStatusMessage("");

    try {
      const response = await verifyOtp(
        { mobileNumber: currentMobileNumber, otp: otpCode },
        token,
      );
      setStatusMessage(response.message || "OTP verified successfully.");
      setOtpCode("");
    } catch (verifyError) {
      setError(verifyError.message || "Failed to verify OTP.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section style={{ display: "grid", gap: "20px" }}>
      <div style={blockStyle}>
        <h1 style={{ margin: "0 0 10px", color: "#0f172a" }}>New Port Request</h1>
        <p style={{ margin: 0, color: "#475569" }}>
          Submit a porting request first. The backend will send an OTP for the
          same mobile number after the request is created.
        </p>
      </div>

      {error ? <p style={{ color: "#b91c1c", margin: 0 }}>{error}</p> : null}
      {statusMessage ? (
        <p style={{ color: "#15803d", margin: 0 }}>{statusMessage}</p>
      ) : null}

      <form onSubmit={handleCreateRequest} style={blockStyle}>
        <h2 style={{ marginTop: 0, color: "#0f172a" }}>1. Create request</h2>
        <label>
          Mobile number
          <input
            name="mobileNumber"
            value={requestForm.mobileNumber}
            onChange={updateRequestForm}
            style={inputStyle}
            required
          />
        </label>
        <label>
          Current operator
          <input
            name="currentOperator"
            value={requestForm.currentOperator}
            onChange={updateRequestForm}
            style={inputStyle}
            required
          />
        </label>
        <label>
          Target operator
          <input
            name="targetOperator"
            value={requestForm.targetOperator}
            onChange={updateRequestForm}
            style={inputStyle}
            required
          />
        </label>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            marginTop: "16px",
            border: "none",
            borderRadius: "12px",
            padding: "12px 16px",
            background: "#0f766e",
            color: "#ffffff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {isSubmitting ? "Submitting..." : "Create port request"}
        </button>
      </form>

      <form onSubmit={handleUploadDocument} style={blockStyle}>
        <h2 style={{ marginTop: 0, color: "#0f172a" }}>2. Upload document</h2>
        <label>
          Document type
          <select
            name="type"
            value={documentForm.type}
            onChange={updateDocumentForm}
            style={inputStyle}
          >
            <option value="aadhaar">Aadhaar</option>
            <option value="id_proof">ID Proof</option>
          </select>
        </label>
        <label>
          Document URL
          <input
            name="fileUrl"
            value={documentForm.fileUrl}
            onChange={updateDocumentForm}
            placeholder="Paste uploaded file URL"
            style={inputStyle}
            required
          />
        </label>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            marginTop: "16px",
            border: "1px solid #0f766e",
            borderRadius: "12px",
            padding: "12px 16px",
            background: "#ffffff",
            color: "#0f766e",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Upload document
        </button>

        {uploadedDocuments.length ? (
          <div style={{ marginTop: "16px", display: "grid", gap: "10px" }}>
            {uploadedDocuments.map((document) => (
              <div
                key={document.id}
                style={{
                  border: "1px solid #d7dce5",
                  borderRadius: "12px",
                  padding: "12px",
                }}
              >
                <strong style={{ color: "#0f172a" }}>{document.type}</strong>
                <p style={{ margin: "8px 0 0", color: "#475569" }}>
                  {document.file_url}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </form>

      <form onSubmit={handleVerifyOtp} style={blockStyle}>
        <h2 style={{ marginTop: 0, color: "#0f172a" }}>3. Verify OTP</h2>
        <p style={{ marginTop: 0, color: "#475569" }}>
          The backend updates the latest port request status to `otp_verified`
          when the OTP is correct.
        </p>
        <label>
          OTP code
          <input
            value={otpCode}
            onChange={(event) => setOtpCode(event.target.value)}
            placeholder="Enter OTP"
            style={inputStyle}
            required
          />
        </label>
        <button
          type="submit"
          disabled={isSubmitting || !currentMobileNumber}
          style={{
            marginTop: "16px",
            border: "none",
            borderRadius: "12px",
            padding: "12px 16px",
            background: "#1d4ed8",
            color: "#ffffff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Verify OTP
        </button>
      </form>

      {createdRequest ? (
        <div style={blockStyle}>
          <h2 style={{ marginTop: 0, color: "#0f172a" }}>Latest request</h2>
          <p style={{ margin: "0 0 8px", color: "#475569" }}>
            Request ID: {createdRequest.id}
          </p>
          <p style={{ margin: "0 0 8px", color: "#475569" }}>
            Status: {createdRequest.status}
          </p>
          <p style={{ margin: 0, color: "#475569" }}>
            {createdRequest.current_operator} to {createdRequest.target_operator}
          </p>
        </div>
      ) : null}
    </section>
  );
}
