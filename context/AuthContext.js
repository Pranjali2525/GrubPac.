"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import authService from "@/services/auth.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Validate token on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) { setLoading(false); return; }
      try {
        const { user } = await authService.validateToken(token);
        setUser(user);
      } catch {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = useCallback(async (credentials) => {
    const { token, user } = await authService.login(credentials);
    localStorage.setItem("auth_token", token);
    localStorage.setItem("auth_user", JSON.stringify(user));
    setUser(user);
    return user;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
