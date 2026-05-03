export const AUTH_EXPIRED_EVENT = "auth-expired";

const AUTH_KEYS = ["token", "email", "expiresAt"];

// These helpers keep localStorage access consistent across auth and API code.
export const clearStoredAuth = () => {
  AUTH_KEYS.forEach((key) => localStorage.removeItem(key));
};

export const getStoredAuth = () => {
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");
  const expiresAt = Number(localStorage.getItem("expiresAt"));

  // Expired or incomplete auth data should not be trusted.
  if (!token || !expiresAt || Date.now() >= expiresAt) {
    clearStoredAuth();
    return { token: "", email: "", expiresAt: 0 };
  }

  return { token, email: email || "", expiresAt };
};

export const saveStoredAuth = ({ token, email, expiresAt }) => {
  localStorage.setItem("token", token);
  localStorage.setItem("email", email);
  localStorage.setItem("expiresAt", String(expiresAt));
};

export const notifyAuthExpired = () => {
  window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
};
