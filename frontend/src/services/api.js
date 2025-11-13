import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: async (email, password) => {
    const response = await api.post("/api/auth/register", { email, password });
    return response.data;
  },
  login: async (email, password) => {
    const response = await api.post("/api/auth/login", { email, password });
    return response.data;
  },
};

export const notesService = {
  getAll: async () => {
    const response = await api.get("/api/notes");
    return response.data;
  },
  create: async (title, content = "") => {
    const response = await api.post("/api/notes", { title, content });
    return response.data;
  },
  update: async (id, title, content = "") => {
    const response = await api.put(`/api/notes/${id}`, { title, content });
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/api/notes/${id}`);
    return response.data;
  },
};

export default api;
