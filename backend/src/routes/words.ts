import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

// Route pour récupérer les mots par langue
router.get("/:langue", async (req: Request<{ langue: string }>, res: Response): Promise<void> => {
    const { langue } = req.params;

    if (!["fr", "en"].includes(langue)) {
        res.status(400).json({ error: "Langue invalide (choisissez 'fr' ou 'en')" });
        return;
    }

    try {
        const mots = await prisma.mot.findMany({
            where: { langue },
            select: { mot: true },
        });
        res.json(mots);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des mots" });
    }
});

export default router;
