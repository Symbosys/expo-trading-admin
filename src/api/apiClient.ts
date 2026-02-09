import axios from "axios";

export const api = axios.create({
  // baseURL: "https://trading-omega-sepia.vercel.app/api",
  baseURL: "http://localhost:4000/api",
  timeout: 8000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    // token will be refreshed on every request (see interceptor below)
  },
});

// ------------------------------------------------------------------
// Interceptor – always attach the latest token from localStorage
// ------------------------------------------------------------------
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});