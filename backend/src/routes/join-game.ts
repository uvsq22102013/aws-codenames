import express, { Request, Response } from "express"; 
import prisma from "../prismaClient";  

const router = express.Router();

// Route pour rejoindre une partie
router.post("/join-game", async (req: Request, res: Response): Promise<void> => {
  const { roomCode } = req.body; // Code de la partie envoyé par le frontend

  if (!roomCode) {
    res.status(400).json({ error: "Veuillez entrer un code de partie valide." });
    return;
  }

  try {
    // Vérifier si la partie existe
    const game = await prisma.partie.findUnique({
      where: { id: parseInt(roomCode) }, // Recherche par l'ID de la partie
    });

    if (!game) {
      // Si la partie n'existe pas
      res.status(404).json({ error: "La partie n'existe pas." });
      return;
    }

    // Si la partie existe, renvoie les informations de la partie
    res.json({ message: `Vous avez rejoint la partie ${game.id}.`, game });
  } catch (error) {
    console.error("Erreur lors de la tentative de rejoindre la partie", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;