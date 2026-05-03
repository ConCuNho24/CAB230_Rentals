import { apiRequest } from "./client";

export const registerUser = ({ email, password }) =>
  apiRequest("/user/register", {
    method: "POST",
    body: { email, password },
    token: null,
  });

export const loginUser = ({ email, password }) =>
  apiRequest("/user/login", {
    method: "POST",
    body: { email, password },
    token: null,
  });
