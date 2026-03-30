import { useCallback, useEffect, useState } from "react";
import { getAdminDashboard } from "../api/authApi";
import { createOperator, getOperators } from "../api/operatorApi";
import {
  approvePortRequest,
  getAllPortRequests,
  rejectPortRequest,
} from "../api/portingApi";
import { useAuth } from "../context/AuthContext";

const panelStyle = {
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

export default function AdminDashboard() {
  const { token, user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [requests, setRequests] = useState([]);
  const [operators, setOperators] = useState([]);
  const [operatorForm, setOperatorForm] = useState({ name: "", circle: "" });
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const loadPageData = useCallback(async () => {
    const [dashboardResponse, requestResponse, operatorResponse] =
      await Promise.all([
        getAdminDashboard(token),
        getAllPortRequests(token),
        getOperators(token),
      ]);

    setDashboard(dashboardResponse);
    setRequests(requestResponse);
    setOperators(operatorResponse);
  }, [token]);

  useEffect(() => {
    let isActive = true;

    async function loadData() {
      setIsLoading(true);
      try {
        await loadPageData();
        if (isActive) {
          setError("");
        }
      } catch (loadError) {
        if (isActive) {
          setError(loadError.message || "Failed to load admin dashboard.");
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
  }, [token, loadPageData]);

  async function handleRequestAction(action) {
    setIsProcessing(true);
    setError("");
    setStatusMessage("");

    try {
      await action();
      await loadPageData();
      setStatusMessage("Request status updated successfully.");
    } catch (actionError) {
      setError(actionError.message || "Failed to update request.");
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleCreateOperator(event) {
    event.preventDefault();
    setIsProcessing(true);
    setError("");
    setStatusMessage("");

    try {
      await createOperator(operatorForm, token);
      await loadPageData();
      setOperatorForm({ name: "", circle: "" });
      setStatusMessage("Operator created successfully.");
    } catch (createError) {
      setError(createError.message || "Failed to create operator.");
    } finally {
      setIsProcessing(false);
    }
  }

  if (isLoading) {
    return <p>Loading admin dashboard...</p>;
  }

  return (
    <section style={{ display: "grid", gap: "16px" }}>
      <div style={panelStyle}>
        <p style={{ margin: 0, color: "#0f766e", fontWeight: 800 }}>
          Admin control center
        </p>
        <h1 style={{ margin: "8px 0", color: "#0f172a" }}>
          Hello, {user?.name || dashboard?.user?.name || "Admin"}
        </h1>
        <p style={{ margin: 0, color: "#475569" }}>
          {dashboard?.message || "Approve requests and manage operators."}
        </p>
      </div>

      {error ? <p style={{ margin: 0, color: "#b91c1c" }}>{error}</p> : null}
      {statusMessage ? (
        <p style={{ margin: 0, color: "#15803d" }}>{statusMessage}</p>
      ) : null}

      <div style={panelStyle}>
        <h2 style={{ marginTop: 0, color: "#0f172a" }}>Pending request actions</h2>
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
                {request.current_operator} to {request.target_operator}
              </p>
              <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
                <button
                  type="button"
                  onClick={() =>
                    handleRequestAction(() => approvePortRequest(request.id, token))
                  }
                  disabled={isProcessing}
                  style={{
                    border: "none",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    background: "#15803d",
                    color: "#ffffff",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleRequestAction(() => rejectPortRequest(request.id, token))
                  }
                  disabled={isProcessing}
                  style={{
                    border: "none",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    background: "#b91c1c",
                    color: "#ffffff",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleCreateOperator} style={panelStyle}>
        <h2 style={{ marginTop: 0, color: "#0f172a" }}>Add operator</h2>
        <label>
          Operator name
          <input
            value={operatorForm.name}
            onChange={(event) =>
              setOperatorForm((current) => ({
                ...current,
                name: event.target.value,
              }))
            }
            style={inputStyle}
            required
          />
        </label>
        <label>
          Circle
          <input
            value={operatorForm.circle}
            onChange={(event) =>
              setOperatorForm((current) => ({
                ...current,
                circle: event.target.value,
              }))
            }
            style={inputStyle}
            required
          />
        </label>
        <button
          type="submit"
          disabled={isProcessing}
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
          Create operator
        </button>
      </form>

      <div style={panelStyle}>
        <h2 style={{ marginTop: 0, color: "#0f172a" }}>Available operators</h2>
        {operators.length ? (
          <div style={{ display: "grid", gap: "12px" }}>
            {operators.map((operator) => (
              <div
                key={operator.id}
                style={{
                  border: "1px solid #d7dce5",
                  borderRadius: "12px",
                  padding: "14px",
                }}
              >
                <strong style={{ color: "#0f172a" }}>{operator.name}</strong>
                <p style={{ margin: "8px 0 0", color: "#475569" }}>
                  Circle: {operator.circle}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ margin: 0, color: "#64748b" }}>
            No operators found yet.
          </p>
        )}
      </div>
    </section>
  );
}
