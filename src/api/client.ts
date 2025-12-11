import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    
    config.headers = (config.headers || {}) as any;
    (config.headers as any).Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
