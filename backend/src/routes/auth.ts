import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../prismaClient";

const router = express.Router();

// Inscription
router.post("/register", async (req: Request, res: Response): Promise<void> => {
    const { pseudo, email, mdp } = req.body;

    if (!pseudo || !email || !mdp) {
        res.status(400).json({ error: "Tous les champs sont requis." });
        return;
    }

    try {
        const hashedPassword = await bcrypt.hash(mdp, 10);
        const user = await prisma.utilisateur.create({
            data: { pseudo, email, mdp_hash: hashedPassword },
        });
        res.json({ message: "Utilisateur inscrit avec succès", user });
    } catch (error) {
        console.error("Erreur Prisma :", error);
        res.status(500).json({ error: "Erreur d'inscription backend" });
    }
});



export default router;
