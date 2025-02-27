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
    cors: {
      origin: process.env.VITE_FRONTEND_URL || "https://aws-codenames-frontend.onrender.com",
      credentials: true,   
    },
    hmr: {
      clientPort: 443, 
    },
  },
});
