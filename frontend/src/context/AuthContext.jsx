/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "../api/authApi";

const AuthContext = createContext(null);

const STORAGE_KEY = "telecom-mnp-auth";

function readStoredSession() {
  if (typeof window === "undefined") {
    return { token: "", user: null };
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    if (!rawValue) {
      return { token: "", user: null };
    }

    const parsedValue = JSON.parse(rawValue);
    return {
      token: parsedValue?.token || "",
      user: parsedValue?.user || null,
    };
  } catch {
    return { token: "", user: null };
  }
}

function persistSession(token, user) {
  if (typeof window === "undefined") {
    return;
  }

  if (!token) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ token, user: user || null }),
  );
}

export function AuthProvider({ children }) {
  const initialSession = readStoredSession();
  const [session, setSession] = useState(initialSession);
  const [isLoading, setIsLoading] = useState(Boolean(initialSession.token));
  const [error, setError] = useState("");

  const token = session.token;
  const user = session.user;
  const isAuthenticated = Boolean(token && user);

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    let isActive = true;

    async function loadCurrentUser() {
      setIsLoading(true);

      try {
        const currentUser = await getCurrentUser(token);
        if (!isActive) {
          return;
        }

        const nextSession = { token, user: currentUser };
        setSession(nextSession);
        persistSession(token, currentUser);
        setError("");
      } catch (loadError) {
        if (!isActive) {
          return;
        }

        setSession({ token: "", user: null });
        persistSession("", null);
        setError(loadError.message || "Your session has expired.");
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadCurrentUser();

    return () => {
      isActive = false;
    };
  }, [token]);

  async function signIn(credentials) {
    setIsLoading(true);
    setError("");

    try {
      const response = await loginUser(credentials);
      const nextSession = {
        token: response.access_token,
        user: response.user,
      };

      setSession(nextSession);
      persistSession(nextSession.token, nextSession.user);
      return response;
    } catch (signInError) {
      setError(signInError.message || "Login failed.");
      throw signInError;
    } finally {
      setIsLoading(false);
    }
  }

  async function signUp(payload) {
    setIsLoading(true);
    setError("");

    try {
      return await registerUser(payload);
    } catch (signUpError) {
      setError(signUpError.message || "Registration failed.");
      throw signUpError;
    } finally {
      setIsLoading(false);
    }
  }

  function signOut() {
    setSession({ token: "", user: null });
    persistSession("", null);
    setError("");
  }

  function clearError() {
    setError("");
  }

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated,
      isLoading,
      error,
      setError,
      clearError,
      signIn,
      signUp,
      signOut,
    }),
    [token, user, isAuthenticated, isLoading, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
