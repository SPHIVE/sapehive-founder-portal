import { useState, useCallback } from "react";
import { PORTAL_PASSWORD } from "~/data/portal-data";

const AUTH_KEY = "sapehive_auth";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(AUTH_KEY) === "true";
  });

  const login = useCallback((password: string): boolean => {
    if (password === PORTAL_PASSWORD) {
      localStorage.setItem(AUTH_KEY, "true");
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, login, logout };
}
