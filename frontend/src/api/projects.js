// src/api/projects.js
import axios from "axios";

// Create a reusable instance that includes token and credentials
const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

// Interceptor to add token to every request (optional, but clean)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API methods
export const getAllProjects = () => api.get("/projects");
export const getProjectById = (id) => api.get(`/projects/${id}`);
export const createProject = (data) => api.post("/projects", data);
export const updateProject = (id, data) => api.patch(`/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/projects/${id}`);
