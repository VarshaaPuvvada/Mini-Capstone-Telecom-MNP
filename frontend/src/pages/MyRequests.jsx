import { useEffect, useState } from "react";
import { getMyPortRequests } from "../api/portingApi";
import { useAuth } from "../context/AuthContext";

const panelStyle = {
  background: "#ffffff",
  border: "1px solid #d7dce5",
  borderRadius: "18px",
  padding: "20px",
  boxShadow: "0 12px 28px rgba(15, 23, 42, 0.06)",
};

function getStatusColor(status) {
  switch (status) {
    case "approved":
      return "#15803d";
    case "rejected":
      return "#b91c1c";
    case "verified":
    case "otp_verified":
      return "#1d4ed8";
    default:
      return "#b45309";
  }
}

export default function MyRequests() {
  const { token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadRequests() {
      setIsLoading(true);
      try {
        const response = await getMyPortRequests(token);
        if (isActive) {
          setRequests(response);
          setError("");
        }
      } catch (loadError) {
        if (isActive) {
          setError(loadError.message || "Failed to load requests.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    if (token) {
      loadRequests();
    }

    return () => {
      isActive = false;
    };
  }, [token]);

  if (isLoading) {
    return <p>Loading your requests...</p>;
  }

  return (
    <section style={{ display: "grid", gap: "16px" }}>
      <div style={panelStyle}>
        <h1 style={{ margin: "0 0 8px", color: "#0f172a" }}>My Requests</h1>
        <p style={{ margin: 0, color: "#475569" }}>
          Review the status of every porting request linked to your account.
        </p>
      </div>

      {error ? <p style={{ margin: 0, color: "#b91c1c" }}>{error}</p> : null}

      {requests.length ? (
        requests.map((request) => (
          <article key={request.id} style={panelStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <strong style={{ color: "#0f172a" }}>{request.mobile_number}</strong>
              <span
                style={{
                  color: getStatusColor(request.status),
                  fontWeight: 800,
                  textTransform: "capitalize",
                }}
              >
                {request.status.replaceAll("_", " ")}
              </span>
            </div>
            <p style={{ margin: "10px 0 0", color: "#475569" }}>
              {request.current_operator} to {request.target_operator}
            </p>
            <p style={{ margin: "8px 0 0", color: "#64748b" }}>
              Created: {new Date(request.created_at).toLocaleString()}
            </p>
          </article>
        ))
      ) : (
        <div style={panelStyle}>
          <p style={{ margin: 0, color: "#475569" }}>
            No requests found yet. Create your first porting request to get
            started.
          </p>
        </div>
      )}
    </section>
  );
}
