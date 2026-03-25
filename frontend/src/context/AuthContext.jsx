import { createContext, useContext, useMemo, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);
const storageKey = "india-tourism-ai-auth";
function getSession() { try { return JSON.parse(localStorage.getItem(storageKey)) || null; } catch { return null; } }

export function AuthProvider({ children }) {
  const [session, setSession] = useState(getSession);
  const setAuth = (data, remember = true) => { const next = { token: data.token, user: data.user }; setSession(next); try { if (remember) localStorage.setItem(storageKey, JSON.stringify(next)); else localStorage.removeItem(storageKey); } catch { /* session stays active for this tab */ } };
  const logout = () => { setSession(null); try { localStorage.removeItem(storageKey); } catch { /* no storage available */ } };
  const value = useMemo(() => ({ user: session?.user || null, token: session?.token || null, isAuthenticated: Boolean(session?.token), setAuth, logout }), [session]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// This hook intentionally shares the context with other components.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error("useAuth must be used inside AuthProvider"); return context; }

api.interceptors.request.use((config) => { const session = getSession(); if (session?.token) config.headers.Authorization = `Bearer ${session.token}`; return config; });
