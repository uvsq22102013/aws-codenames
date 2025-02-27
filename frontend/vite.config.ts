import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: Number(process.env.PORT) || 5173,
    proxy: {
      "/api": process.env.BACKEND_URL || "http://localhost:3000",
      "/socket.io": {
        target: process.env.BACKEND_URL || "http://localhost:3000",
        ws: true,
      },
    },
    allowedHosts: ["aws-codenames-frontend.onrender.com"],
    cors: {
      origin: process.env.FRONTEND_URL || "https://aws-codenames-frontend.onrender.com",
    },
  },
});
