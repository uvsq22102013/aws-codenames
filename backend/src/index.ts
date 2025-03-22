
import express from "express";
import http from "http"; // Ajout pour le serveur HTTP
import { Server } from "socket.io"; // Ajout pour Socket.io
import cors from "cors";

import wordsRoutes from "./routes/words";
import authRoutes from "./routes/auth";
import joinRoutes from "./routes/join";
import gameRoutes from "./routes/game.routes"; // Ta nouvelle route partie
import gameSocket from "./sockets/game.socket"; // Gestion socket partie
import teamsRoutes from "./routes/teams";
import forgotRoutes from "./routes/forgot";
import resetRoutes from "./routes/reset";

const app = express();
const server = http.createServer(app); // Permet de brancher socket.io
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(express.json());

app.use("/words", wordsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/join", joinRoutes);
app.use("/api/parties", gameRoutes); // Ajout de la route partie
app.use("/api/teams", teamsRoutes);
app.use("/api/forgot", forgotRoutes);
app.use("/api/reset", resetRoutes);

// Gestion des événements Socket.io (Temps réel)
io.on("connection", (socket) => {
  console.log(`Nouvelle connexion : ${socket.id}`);
  gameSocket(io, socket);
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Serveur en écoute sur http://localhost:${PORT}`);
  
});
