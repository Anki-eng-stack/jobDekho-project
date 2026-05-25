import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// auto-attach token if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
