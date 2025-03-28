import express, { Request, Response } from "express";
import prisma from "../prismaClient";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/:code", async (req: Request, res: Response): Promise<void> => {
    const { code } = req.params; 
    const { mdp } = req.body; 

    try {
        const resetEntry = await prisma.reset.findUnique({
            where: { code }
        });

        if (!resetEntry) {
            res.status(400).json({ error: "Lien de réinitialisation expiré" });
            return;
        }

        const twenty = 20 * 60 * 1000; 
        const now = new Date();
        const createdAt = new Date(resetEntry.createdAt);
        if (now.getTime() - createdAt.getTime() > twenty) {
            await prisma.reset.delete({
                where: { code }
            });
            res.status(400).json({ error: "Lien de réinitialisation expiré" });
            return;
        }

        const hashedPassword = await bcrypt.hash(mdp, 10);

        await prisma.utilisateur.update({
            where: { email: resetEntry.email },
            data: { mdp_hash: hashedPassword }
        });


        await prisma.reset.delete({
            where: { code }
        });

        res.json({ message: "Mot de passe réinitialisé avec succès." });
    } catch (error) {
        console.error("Erreur Prisma :", error);
        res.status(500).json({ error: "Erreur réinitialisation backend." });
    }
});

export default router;