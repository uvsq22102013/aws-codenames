import express from "express";
import cors from "cors";
import wordsRoutes from "./routes/words";
import authRoutes from "./routes/auth";
import gameRoutes from "./routes/game";
import joinRoute from "./routes/join-game"

const app = express();
app.use(cors());
app.use(express.json());

app.use("/words", wordsRoutes);
app.use("/api/auth", authRoutes);
app.use("/game", gameRoutes);
app.use("/join-game", joinRoute);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});
