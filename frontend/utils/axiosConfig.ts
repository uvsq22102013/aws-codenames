import axios from "axios";

const api = axios.create({
  baseURL: process.env.VITE_BACKEND_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;