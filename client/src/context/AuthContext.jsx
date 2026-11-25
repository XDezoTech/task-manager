import { createContext, useContext, useState } from "react";
import {
  getStoredSession,
  loginUser,
  registerUser,
  loginAsDemo,
  logoutUser,
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getStoredSession());

  async function login(credentials) {
    const newSession = await loginUser(credentials);
    setSession(newSession);
    return newSession;
  }

  async function register(details) {
    const newSession = await registerUser(details);
    setSession(newSession);
    return newSession;
  }

  async function demoLogin() {
    const newSession = await loginAsDemo();
    setSession(newSession);
    return newSession;
  }

  function logout() {
    logoutUser();
    setSession(null);
  }

  const value = {
    user: session?.user || null,
    token: session?.token || null,
    isAuthenticated: Boolean(session?.token),
    login,
    register,
    demoLogin,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return ctx;
}
