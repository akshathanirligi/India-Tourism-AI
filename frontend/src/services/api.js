import axios from "axios";

const configuredBaseUrl = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");
const apiBaseUrl = configuredBaseUrl.endsWith("/api") || configuredBaseUrl === "/api" ? configuredBaseUrl : `${configuredBaseUrl}/api`;

const api = axios.create({
  baseURL: apiBaseUrl,
});

export default api;
