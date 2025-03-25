import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: Number(process.env.PORT) || 5173,
    proxy: {
      "/api": {
        target: process.env.VITE_BACKEND_URL || "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/socket.io": {
        target: process.env.VITE_BACKEND_URL || "http://localhost:3000",
        ws: true,
      },
    },
    allowedHosts: ["aws-codenames2.onrender.com"],
    cors: {
      origin: process.env.VITE_FRONTEND_URL || "https://aws-codenames2.onrender.com",
    },
  },
});