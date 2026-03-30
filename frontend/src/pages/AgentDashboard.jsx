import { useEffect, useState } from "react";
import { getAgentDashboard } from "../api/authApi";
import { sendOtp } from "../api/otpApi";
import {
  getUserDocuments,
  verifyUserDocuments,
} from "../api/operatorApi";
import {
  getAllPortRequests,
  verifyPortRequest,
} from "../api/portingApi";
import { useAuth } from "../context/AuthContext";

const panelStyle = {
  background: "#ffffff",
  border: "1px solid #d7dce5",
  borderRadius: "18px",
  padding: "20px",
  boxShadow: "0 12px 28px rgba(15, 23, 42, 0.06)",
};

export default function AgentDashboard() {
  const { token, user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [requests, setRequests] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  async function loadRequests() {
    const response = await getAllPortRequests(token);
    setRequests(response);
  }

  useEffect(() => {
    let isActive = true;

    async function loadData() {
      setIsLoading(true);
      try {
        const [dashboardResponse, requestResponse] = await Promise.all([
          getAgentDashboard(token),
          getAllPortRequests(token),
        ]);

        if (!isActive) {
          return;
        }

        setDashboard(dashboardResponse);
        setRequests(requestResponse);
        setError("");
      } catch (loadError) {
        if (isActive) {
          setError(loadError.message || "Failed to load agent dashboard.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    if (token) {
      loadData();
    }

    return () => {
      isActive = false;
    };
  }, [token]);

  async function handleFetchDocuments(userId) {
    setIsProcessing(true);
    setError("");
    setStatusMessage("");

    try {
      const response = await getUserDocuments(userId, token);
      setSelectedUserId(userId);
      setDocuments(response);
      setStatusMessage("Customer documents loaded.");
    } catch (loadError) {
      setError(loadError.message || "Failed to load user documents.");
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleAction(action) {
    setIsProcessing(true);
    setError("");
    setStatusMessage("");

    try {
      await action();
      await loadRequests();
      setStatusMessage("Action completed successfully.");
    } catch (actionError) {
      setError(actionError.message || "Action failed.");
    } finally {
      setIsProcessing(false);
    }
  }

  if (isLoading) {
    return <p>Loading agent dashboard...</p>;
  }

  return (
    <section style={{ display: "grid", gap: "16px" }}>
      <div style={panelStyle}>
        <p style={{ margin: 0, color: "#0f766e", fontWeight: 800 }}>
          Agent workspace
        </p>
        <h1 style={{ margin: "8px 0", color: "#0f172a" }}>
          Hello, {user?.name || dashboard?.user?.name || "Agent"}
        </h1>
        <p style={{ margin: 0, color: "#475569" }}>
          {dashboard?.message || "Review customer requests and document status."}
        </p>
      </div>

      {error ? <p style={{ margin: 0, color: "#b91c1c" }}>{error}</p> : null}
      {statusMessage ? (
        <p style={{ margin: 0, color: "#15803d" }}>{statusMessage}</p>
      ) : null}

      <div style={panelStyle}>
        <h2 style={{ marginTop: 0, color: "#0f172a" }}>Port requests</h2>
        <div style={{ display: "grid", gap: "14px" }}>
          {requests.map((request) => (
            <div
              key={request.id}
              style={{
                border: "1px solid #d7dce5",
                borderRadius: "14px",
                padding: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <strong style={{ color: "#0f172a" }}>{request.mobile_number}</strong>
                <span style={{ color: "#475569", textTransform: "capitalize" }}>
                  {request.status.replaceAll("_", " ")}
                </span>
              </div>
              <p style={{ margin: "10px 0 0", color: "#64748b" }}>
                User ID: {request.user_id}
              </p>
              <p style={{ margin: "6px 0 0", color: "#64748b" }}>
                {request.current_operator} to {request.target_operator}
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  marginTop: "14px",
                }}
              >
                <button
                  type="button"
                  onClick={() => handleFetchDocuments(request.user_id)}
                  style={{
                    border: "1px solid #0f766e",
                    borderRadius: "10px",
                    padding: "10px 12px",
                    background: "#ffffff",
                    color: "#0f766e",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  View documents
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleAction(() => sendOtp(request.mobile_number, token))
                  }
                  disabled={isProcessing}
                  style={{
                    border: "none",
                    borderRadius: "10px",
                    padding: "10px 12px",
                    background: "#1d4ed8",
                    color: "#ffffff",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Resend OTP
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleAction(() => verifyUserDocuments(request.id, token))
                  }
                  disabled={isProcessing}
                  style={{
                    border: "none",
                    borderRadius: "10px",
                    padding: "10px 12px",
                    background: "#f59e0b",
                    color: "#ffffff",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Verify documents
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleAction(() => verifyPortRequest(request.id, token))
                  }
                  disabled={isProcessing}
                  style={{
                    border: "none",
                    borderRadius: "10px",
                    padding: "10px 12px",
                    background: "#15803d",
                    color: "#ffffff",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Verify request
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={panelStyle}>
        <h2 style={{ marginTop: 0, color: "#0f172a" }}>Selected customer documents</h2>
        {selectedUserId ? (
          <p style={{ marginTop: 0, color: "#475569" }}>
            Showing documents for user: {selectedUserId}
          </p>
        ) : (
          <p style={{ marginTop: 0, color: "#475569" }}>
            Pick a request above to view that customer's uploaded documents.
          </p>
        )}

        {documents.length ? (
          <div style={{ display: "grid", gap: "12px" }}>
            {documents.map((document) => (
              <div
                key={document.id}
                style={{
                  border: "1px solid #d7dce5",
                  borderRadius: "12px",
                  padding: "14px",
                }}
              >
                <strong style={{ color: "#0f172a" }}>{document.type}</strong>
                <p style={{ margin: "8px 0 0", color: "#475569" }}>
                  {document.file_url}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ margin: 0, color: "#64748b" }}>
            No documents loaded yet.
          </p>
        )}
      </div>
    </section>
  );
}
