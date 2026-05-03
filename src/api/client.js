import { clearStoredAuth, notifyAuthExpired } from "../context/authSession";

export const API_BASE_URL = "http://4.237.58.241:3000";

export const buildQuery = (params = {}) => {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === "" || value === null || value === undefined) return;

    if (Array.isArray(value)) {
      value
        .filter((item) => item !== "" && item !== null && item !== undefined)
        .forEach((item) => queryParams.append(key, item));
      return;
    }

    queryParams.append(key, value);
  });

  return queryParams.toString();
};

const getErrorMessage = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const data = await response.json();
    return data.message || "The API request failed.";
  }

  const text = await response.text();
  return text || "The API request failed.";
};

export const apiRequest = async (
  path,
  { method = "GET", body, query, token = localStorage.getItem("token") } = {},
) => {
  const queryString = buildQuery(query);
  const url = `${API_BASE_URL}${path}${queryString ? `?${queryString}` : ""}`;
  const headers = {};

  if (body) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    if (response.status === 401 && token) {
      clearStoredAuth();
      notifyAuthExpired();
    }

    const error = new Error(await getErrorMessage(response));
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) return null;

  return response.json();
};
