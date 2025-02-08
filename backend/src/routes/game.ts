import express from "express";
import prisma from "../prismaClient";

const router = express.Router();

// Route pour créer une partie
router.post("/create", async (req, res) => {
    const { createurId } = req.body;

    try {
        const partie = await prisma.partie.create({
            data: { createurId },
        });
        res.json(partie);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la création de la partie" });
    }
});

export default router; 