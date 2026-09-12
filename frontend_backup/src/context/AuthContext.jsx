import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as authApi from "../services/auth.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [farmer, setFarmer] = useState(null);
  const [officer, setOfficer] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("kp_token");
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then((res) => {
        setUser(res.user);
        setFarmer(res.farmer || null);
        setOfficer(res.officer || null);
      })
      .catch(() => localStorage.removeItem("kp_token"))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (phone, password) => {
    const res = await authApi.login(phone, password);
    localStorage.setItem("kp_token", res.token);
    setUser(res.user);
    const meRes = await authApi.me().catch(() => null);
    if (meRes) {
      setFarmer(meRes.farmer || null);
      setOfficer(meRes.officer || null);
    }
    return res.user;
  }, []);

  const register = useCallback((payload) => authApi.register(payload), []);

  const logout = useCallback(() => {
    localStorage.removeItem("kp_token");
    setUser(null);
    setFarmer(null);
    setOfficer(null);
    navigate("/login");
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, farmer, officer, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}