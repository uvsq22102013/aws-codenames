
import express from "express";
import http from "http"; // Ajout pour le serveur HTTP
import { Server } from "socket.io"; // Ajout pour Socket.io
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";


import wordsRoutes from "./routes/words";
import authRoutes from "./routes/auth";
import joinRoutes from "./routes/join";
import gameRoutes from "./routes/game.routes"; // Ta nouvelle route partie
import gameSocket from "./sockets/game.socket"; // Gestion socket partie
import teamsRoutes from "./routes/teams";
import forgotRoutes from "./routes/forgot";
import resetRoutes from "./routes/reset";
import checkAuth from "./routes/check-auth";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL || "https://aws-codenames2.onrender.com", "http://localhost:5173"],
    credentials: true,
  },
});

app.use(cors({
  origin: [process.env.FRONTEND_URL || "https://aws-codenames2.onrender.com", "http://localhost:5173"],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/words", wordsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/join", joinRoutes);
app.use("/api/parties", gameRoutes); 
app.use("/api/teams", teamsRoutes);
app.use("/api/forgot", forgotRoutes);
app.use("/api/reset", resetRoutes);
app.use("/api/check-auth", checkAuth);

io.on("connection", (socket) => {
  console.log(`Nouvelle connexion : ${socket.id}`);
  gameSocket(io, socket);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Serveur en écoute sur ${PORT}`);
  
});