import axios from "axios";

const API_URL = "https://laravel-cloud-sam-main-bdunom.laravel.cloud/api"; // ✅ Ensure correct URL

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error); 
  }
);
