import { useEffect, useMemo, useState } from "react";
import { getCustomerDashboard } from "../api/authApi";
import { getMyPortRequests } from "../api/portingApi";
import { useAuth } from "../context/AuthContext";

const cardStyle = {
  background: "#ffffff",
  border: "1px solid #d7dce5",
  borderRadius: "18px",
  padding: "20px",
  boxShadow: "0 12px 28px rgba(15, 23, 42, 0.06)",
};

export default function Dashboard({ onNavigate }) {
  const { token, user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadData() {
      setIsLoading(true);

      try {
        const [dashboardResponse, requestResponse] = await Promise.all([
          getCustomerDashboard(token),
          getMyPortRequests(token),
        ]);

        if (!isActive) {
          return;
        }

        setDashboard(dashboardResponse);
        setRequests(requestResponse);
        setError("");
      } catch (loadError) {
        if (isActive) {
          setError(loadError.message || "Failed to load dashboard.");
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

  const summary = useMemo(() => {
    const total = requests.length;
    const approved = requests.filter((item) => item.status === "approved").length;
    const inProgress = requests.filter(
      (item) => item.status !== "approved" && item.status !== "rejected",
    ).length;

    return { total, approved, inProgress };
  }, [requests]);

  if (isLoading) {
    return <p>Loading customer dashboard...</p>;
  }

  return (
    <section style={{ display: "grid", gap: "20px" }}>
      <div style={cardStyle}>
        <p style={{ margin: 0, color: "#0f766e", fontWeight: 800 }}>
          Customer dashboard
        </p>
        <h1 style={{ margin: "8px 0", color: "#0f172a" }}>
          Hello, {user?.name || dashboard?.user?.name || "Customer"}
        </h1>
        <p style={{ margin: 0, color: "#475569" }}>
          {dashboard?.message || "Track your number portability request here."}
        </p>
      </div>

      {error ? <p style={{ color: "#b91c1c", margin: 0 }}>{error}</p> : null}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
        }}
      >
        <div style={cardStyle}>
          <strong style={{ display: "block", color: "#0f172a" }}>Total requests</strong>
          <span style={{ fontSize: "30px", color: "#0f766e" }}>{summary.total}</span>
        </div>
        <div style={cardStyle}>
          <strong style={{ display: "block", color: "#0f172a" }}>Approved</strong>
          <span style={{ fontSize: "30px", color: "#15803d" }}>{summary.approved}</span>
        </div>
        <div style={cardStyle}>
          <strong style={{ display: "block", color: "#0f172a" }}>In progress</strong>
          <span style={{ fontSize: "30px", color: "#b45309" }}>
            {summary.inProgress}
          </span>
        </div>
      </div>

      <div style={cardStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2 style={{ margin: "0 0 6px", color: "#0f172a" }}>Quick actions</h2>
            <p style={{ margin: 0, color: "#475569" }}>
              Start a new porting request or review your request history.
            </p>
          </div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => onNavigate?.("request-port")}
              style={{
                border: "none",
                borderRadius: "12px",
                padding: "12px 16px",
                background: "#0f766e",
                color: "#ffffff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Request port
            </button>
            <button
              type="button"
              onClick={() => onNavigate?.("my-requests")}
              style={{
                border: "1px solid #cbd5e1",
                borderRadius: "12px",
                padding: "12px 16px",
                background: "#ffffff",
                color: "#0f172a",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              View my requests
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
