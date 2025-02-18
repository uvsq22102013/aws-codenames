import express, { Request, Response } from "express";
import prisma from "../prismaClient";
import { Partie , TypeAction,TypeCarte,StatutPartie, Equipe, Role } from "@prisma/client";
import { creerPartieAvecCartes } from "../utils/creationPartie";
import { RejoindrePartie_Payload } from "../types/game.types";
import e from "express";
import { rejoindrePartie } from "../services/game.service";

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
          }
        });

        res.status(201).json(partie); // 201 = Création réussie
    } catch (error: any) {
        console.error("Erreur lors de la création de la partie :", error);
        res.status(500).json({ error: error.message || "Erreur serveur" });
    }
});


router.post("/join-game", async (req: Request, res: Response): Promise<void> => {

    //on récupère le code de la partie envoyé par le front
    const { roomCode } = req.body;

    //on vérifie que le code de la partie est bien valide
    if (!roomCode) {
      res.status(400).json({ error: "Veuillez entrer un code de partie valide." });
      return;
    }
  
    try {


      // On regarde si l'ID de la partie qui est fournie existe dans la base de donnée
      const game = await prisma.partie.findUnique({
        where: { id: parseInt(roomCode) }, //ici on convertis le roomcode en int

      });
  
      if (!game) {

        // si on trouve pas de partie avec cette ID, on renvoit un message d'erreure 
        res.status(404).json({ error: "La partie n'existe pas." });
        return;
      }
  

      // on regarde si la partie est en cours
        if (game.statut !== StatutPartie.EN_ATTENTE) {
          res.status(400).json({ error: "La partie est déjà en cours." });
          return;
        } else {
          // dans le cas contraire si la partie existe on renvoit l'ID de la partie créée
          res.json({ message: `Vous avez rejoint la partie ${game.id}.`, game });
        }
      } catch (error) {


    //erreur si il ya un pb avec le serveur
      console.error("Erreur lors de la tentative de rejoindre la partie", error);
      res.status(500).json({ error: "Erreur serveur" }); 
    }  
    
  });




export default router;
