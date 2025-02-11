import express, { Request, Response } from "express";
import prisma from "../prismaClient";

const router = express.Router();

// Route pour créer une partie
router.post("/create", async (req: Request, res: Response): Promise<void>  => {
    const { createurId } = req.body;

    // Vérifier si createurId est bien fourni et valide
    if (!createurId || typeof createurId !== "number") {
        res.status(400).json({ error: "L'ID du créateur est invalide" });
        return ;
    }

    try {
        // Vérifier si le créateur existe dans la base de données
        const utilisateur = await prisma.utilisateur.findUnique({
            where: { id: createurId },
        });

        if (!utilisateur) {
             res.status(404).json({ error: "Utilisateur non trouvé" });
             return;
        }

        // Création de la partie avec Prisma
        const partie = await prisma.partie.create({
            data: {
                createurId,
                statut: "EN_ATTENTE", // Valeur par défaut
                dateCreation: new Date(),
                membres: {
                    create: {
                        utilisateurId: createurId,
                        equipe: "ROUGE", // Mettre une équipe par défaut
                        role: "MAITRE_ESPION", // Rôle par défaut
                    },
                },
            },
            include: {
                createur: true, // Inclure les infos du créateur dans la réponse
                membres: true,  // Inclure les membres de l'équipe
            },
        });

        res.status(201).json(partie); // 201 = Création réussie
    } catch (error: any) {
        console.error("Erreur lors de la création de la partie :", error);
        res.status(500).json({ error: error.message || "Erreur serveur" });
    }
});


// route pour joindre une partie qui existe déjà




export default router;
