import { useEffect, useState } from "react";

import { loginUser, registerUser } from "../api/authApi";
import {
  AUTH_EXPIRED_EVENT,
  clearStoredAuth,
  getStoredAuth,
  saveStoredAuth,
} from "./authSession";
import { AuthContext } from "./authStore";

const emptyAuth = { token: "", email: "", expiresAt: 0 };

export const AuthProvider = ({ children }) => {
  // Read any valid saved session once when the app starts.
  const [auth, setAuth] = useState(getStoredAuth);

  const isAuthenticated = Boolean(auth.token);

  useEffect(() => {
    const handleAuthExpired = () => {
      setAuth(emptyAuth);
    };

    // ApiClient dispatches this event when an authenticated request returns 401.
    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);

    return () => {
      window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
    };
  }, []);

  const register = async (credentials) => registerUser(credentials);

  const login = async (credentials) => {
    const data = await loginUser(credentials);
    // The API returns expiresIn in seconds; localStorage stores an absolute time.
    const expiresAt = Date.now() + data.expiresIn * 1000;
    const nextAuth = {
      token: data.token,
      email: credentials.email,
      expiresAt,
    };

    saveStoredAuth(nextAuth);
    setAuth(nextAuth);

    return data;
  };

  const logout = () => {
    clearStoredAuth();
    setAuth(emptyAuth);
  };

  const value = {
    email: auth.email,
    isAuthenticated,
    login,
    logout,
    register,
    token: auth.token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
