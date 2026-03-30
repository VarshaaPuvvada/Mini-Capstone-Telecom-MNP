import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";

const panelStyle = {
  background: "#ffffff",
  border: "1px solid #d7dce5",
  borderRadius: "20px",
  padding: "24px",
  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
};

const fieldStyle = {
  display: "grid",
  gap: "8px",
  marginBottom: "16px",
};

const inputStyle = {
  border: "1px solid #c9d2df",
  borderRadius: "12px",
  padding: "12px 14px",
  fontSize: "14px",
};

const buttonStyle = {
  border: "none",
  borderRadius: "12px",
  padding: "12px 16px",
  fontSize: "14px",
  fontWeight: 700,
  cursor: "pointer",
};

export default function Login({ onAuthenticated }) {
  const { signIn, signUp, isLoading, error, clearError } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    mobileNumber: "",
    role: "customer",
    password: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  const title = useMemo(
    () => (mode === "login" ? "Welcome Back" : "Create Account"),
    [mode],
  );

  function updateField(event) {
    const { name, value } = event.target;
    clearError();
    setSuccessMessage("");
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSuccessMessage("");

    try {
      if (mode === "register") {
        await signUp(form);
        setSuccessMessage("Registration complete. You can sign in now.");
        setMode("login");
        return;
      }

      const response = await signIn({
        mobileNumber: form.mobileNumber,
        password: form.password,
      });

      if (onAuthenticated) {
        onAuthenticated(response.user);
      }
    } catch {
      // Error state comes from AuthContext.
    }
  }

  return (
    <section
      style={{
        maxWidth: "540px",
        margin: "0 auto",
        display: "grid",
        gap: "24px",
      }}
    >
      <div style={panelStyle}>
        <p
          style={{
            margin: 0,
            color: "#0f766e",
            fontSize: "12px",
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Telecom MNP Portal
        </p>
        <h1 style={{ margin: "12px 0 8px", fontSize: "34px", color: "#0f172a" }}>
          {title}
        </h1>
        <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>
          Use the same mobile number and password format expected by the FastAPI
          backend.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={panelStyle}>
        {mode === "register" ? (
          <label style={fieldStyle}>
            <span>Full name</span>
            <input
              name="name"
              value={form.name}
              onChange={updateField}
              placeholder="Enter full name"
              style={inputStyle}
              required
            />
          </label>
        ) : null}

        <label style={fieldStyle}>
          <span>Mobile number</span>
          <input
            name="mobileNumber"
            value={form.mobileNumber}
            onChange={updateField}
            placeholder="10 digit mobile number"
            style={inputStyle}
            required
          />
        </label>

        {mode === "register" ? (
          <label style={fieldStyle}>
            <span>Role</span>
            <select
              name="role"
              value={form.role}
              onChange={updateField}
              style={inputStyle}
            >
              <option value="customer">Customer</option>
              <option value="agent">Agent</option>
              <option value="admin">Admin</option>
            </select>
          </label>
        ) : null}

        <label style={fieldStyle}>
          <span>Password</span>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={updateField}
            placeholder="Enter password"
            style={inputStyle}
            required
          />
        </label>

        {error ? (
          <p style={{ color: "#b91c1c", margin: "0 0 16px" }}>{error}</p>
        ) : null}

        {successMessage ? (
          <p style={{ color: "#15803d", margin: "0 0 16px" }}>{successMessage}</p>
        ) : null}

        <button
          type="submit"
          disabled={isLoading}
          style={{
            ...buttonStyle,
            width: "100%",
            background: "#0f766e",
            color: "#ffffff",
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          {isLoading
            ? "Please wait..."
            : mode === "login"
              ? "Sign In"
              : "Create Account"}
        </button>

        <button
          type="button"
          onClick={() => {
            clearError();
            setSuccessMessage("");
            setMode((current) => (current === "login" ? "register" : "login"));
          }}
          style={{
            ...buttonStyle,
            width: "100%",
            marginTop: "12px",
            background: "#e2e8f0",
            color: "#0f172a",
          }}
        >
          {mode === "login"
            ? "Need an account? Register"
            : "Already registered? Sign in"}
        </button>
      </form>
    </section>
  );
}
