import express from "express";
import cors from "cors";
import wordsRoutes from "./routes/words";
import authRoutes from "./routes/auth";
import gameRoutes from "./routes/game";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/words", wordsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/game", gameRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});
