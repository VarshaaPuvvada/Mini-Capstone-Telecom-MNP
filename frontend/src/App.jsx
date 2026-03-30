import { useState } from "react";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import RequestPort from "./pages/RequestPort";
import MyRequests from "./pages/MyRequests";
import AgentDashboard from "./pages/AgentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { useAuth } from "./context/AuthContext";

function Header({ currentView, onNavigate }) {
  const { user, signOut } = useAuth();

  const customerNav = [
    { id: "dashboard", label: "Dashboard" },
    { id: "request-port", label: "Request Port" },
    { id: "my-requests", label: "My Requests" },
  ];

  const navItems = user?.role === "customer" ? customerNav : [];

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "16px",
        padding: "24px 0 20px",
        borderBottom: "1px solid #d7dce5",
        marginBottom: "28px",
        flexWrap: "wrap",
      }}
    >
      <div>
        <p
          style={{
            margin: 0,
            fontSize: "12px",
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#0f766e",
          }}
        >
          Telecom Number Portability
        </p>
        <h1 style={{ margin: "10px 0 0", fontSize: "28px", color: "#0f172a" }}>
          {user?.role === "admin"
            ? "Admin Portal"
            : user?.role === "agent"
              ? "Agent Portal"
              : "Customer Portal"}
        </h1>
      </div>

      <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.id)}
            style={{
              border: currentView === item.id ? "none" : "1px solid #cbd5e1",
              borderRadius: "999px",
              padding: "10px 14px",
              background: currentView === item.id ? "#0f766e" : "#ffffff",
              color: currentView === item.id ? "#ffffff" : "#0f172a",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {item.label}
          </button>
        ))}

        <div
          style={{
            padding: "10px 14px",
            borderRadius: "999px",
            background: "#ecfeff",
            color: "#155e75",
            fontWeight: 700,
          }}
        >
          {user?.name}
        </div>

        <button
          type="button"
          onClick={signOut}
          style={{
            border: "none",
            borderRadius: "999px",
            padding: "10px 16px",
            background: "#b91c1c",
            color: "#ffffff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

function AuthenticatedApp() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState("dashboard");

  function renderPage() {
    if (user?.role === "agent") {
      return <AgentDashboard />;
    }

    if (user?.role === "admin") {
      return <AdminDashboard />;
    }

    switch (currentView) {
      case "request-port":
        return <RequestPort onCreated={() => setCurrentView("my-requests")} />;
      case "my-requests":
        return <MyRequests />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  }

  return (
    <>
      <Header currentView={currentView} onNavigate={setCurrentView} />
      {renderPage()}
    </>
  );
}

function LoadingScreen() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "32px",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #d7dce5",
          borderRadius: "20px",
          padding: "28px 32px",
          boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
        }}
      >
        Loading your telecom portal...
      </div>
    </main>
  );
}

function AppShell() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f0fdfa 0%, #f8fafc 30%, #ffffff 100%)",
        padding: "32px 20px 48px",
      }}
    >
      <div
        style={{
          maxWidth: "1120px",
          margin: "0 auto",
        }}
      >
        {isAuthenticated ? <AuthenticatedApp /> : <Login />}
      </div>
    </main>
  );
}

export default function App() {
  return <AppShell />;
}
