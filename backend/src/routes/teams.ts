import express, { Request, Response } from "express";
import prisma from "../prismaClient";

const router = express.Router();

router.post("/", async (req: Request, res: Response): Promise<void> => {
    let { team, type, utilisateurId, partieId } = req.body;

    try {
        utilisateurId = parseInt(utilisateurId, 10);
        partieId = parseInt(partieId, 10);

        // Vérifier si l'utilisateur et la partie existent
        const utilisateur = await prisma.utilisateur.findUnique({
            where: { id: utilisateurId },
        });

        const partie = await prisma.partie.findUnique({  
            where: { id: partieId },  
        });

        if (!utilisateur) {
            console.log("Utilsateur non trouvé dans la bd")
            return; 
        }
        if (!partie) {
            console.log("Partie non trouvée dans la bd")
            return;
        }

        const membreEquipe = await prisma.membreEquipe.upsert({
            where: {
                utilisateurId_partieId: {
                    utilisateurId,
                    partieId,
                },
            },
            update: {
                equipe: team,
                role: type,
            },
            create: {
                utilisateurId,
                partieId,
                equipe: team,
                role: type,
            },
        });
        res.status(200).json({ success: true, membreEquipe });

    } catch (error: any) {
        console.error("Erreur lors de la création du membre d'équipe :", error);
        res.status(500).json({ error: error.message || "Erreur serveur" });
    }
});

export default router;