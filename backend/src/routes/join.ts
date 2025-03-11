import express, { Request, Response } from "express";
import prisma from "../prismaClient";
import { creerPartieAvecCartes } from "../utils/creationPartie";
import verifierToken, { RequestAvecUtilisateur } from "../utils/verifierToken";
import { StatutPartie } from "@prisma/client";


const router = express.Router();


// Route pour créer une partie
router.post("/create", verifierToken , async (req, res) => {
    const createurId = (req as RequestAvecUtilisateur).user!.id;

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
        const partie = await creerPartieAvecCartes(createurId, "fr");

        res.json(partie); // 201 = Création réussie
    } catch (error: any) {
        console.error("Erreur lors de la création de la partie :", error);
        res.status(500).json({ error: error.message || "Erreur serveur" });
    }
});


router.post("/join-game", async (req: Request, res: Response): Promise<void> => {

    //on récupère le code de la partie envoyé par le front
    const { roomCode } = req.body;
  
    try {

      // On regarde si l'ID de la partie qui est fournie existe dans la base de donnée
      const game = await prisma.partie.findUnique({
        where: { id: roomCode },

      });
  
      if (!game) {

        // si on trouve pas de partie avec cette ID, on renvoit un message d'erreur 
        res.status(400).json({ error: "Mauvaise Code Partie" });
        return;
      }
  

      // on regarde si la partie est en cours
        if (game.statut !== StatutPartie.EN_ATTENTE) {
          res.status(400).json({ error: "La partie est déjà en cours." });
          return;
        } else {
          // dans le cas contraire si la partie existe on renvoit l'ID de la partie créée
          res.json({game});
        }
      } catch (error) {

    }  
    
  });




export default router;
