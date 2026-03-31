import "./App.css";
import {
  NavLink,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import RequestPort from "./pages/RequestPort";
import MyRequests from "./pages/MyRequests";
import AgentDashboard from "./pages/AgentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { useAuth } from "./context/AuthContext";

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

function AppFrame({ children }) {
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
        {children}
      </div>
    </main>
  );
}

function Header() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const customerNav = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/request-port", label: "Request Port" },
    { to: "/my-requests", label: "My Requests" },
  ];

  const navItems = user?.role === "customer" ? customerNav : [];

  function handleLogout() {
    signOut();
    navigate("/login", { replace: true });
  }

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

      <div
        style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}
      >
        {navItems.map((item) => {
          const active = location.pathname === item.to;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              style={{
                border: active ? "none" : "1px solid #cbd5e1",
                borderRadius: "999px",
                padding: "10px 14px",
                background: active ? "#0f766e" : "#ffffff",
                color: active ? "#ffffff" : "#0f172a",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              {item.label}
            </NavLink>
          );
        })}

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
          onClick={handleLogout}
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

function ProtectedLayout({ allowedRoles }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    if (user?.role === "agent") {
      return <Navigate to="/agent" replace />;
    }

    if (user?.role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AppFrame>
      <Header />
      <Outlet />
    </AppFrame>
  );
}

function LoginRoute() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    if (user?.role === "agent") {
      return <Navigate to="/agent" replace />;
    }

    if (user?.role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AppFrame>
      <Login />
    </AppFrame>
  );
}

function RequestPortRoute() {
  const navigate = useNavigate();

  return <RequestPort onCreated={() => navigate("/my-requests")} />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginRoute />} />

      <Route element={<ProtectedLayout allowedRoles={["customer"]} />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/request-port" element={<RequestPortRoute />} />
        <Route path="/my-requests" element={<MyRequests />} />
      </Route>

      <Route element={<ProtectedLayout allowedRoles={["agent"]} />}>
        <Route path="/agent" element={<AgentDashboard />} />
      </Route>

      <Route element={<ProtectedLayout allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
