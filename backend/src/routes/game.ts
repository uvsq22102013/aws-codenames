import express, { Request, Response } from "express";
import prisma from "../prismaClient";

const router = express.Router();

// Route pour créer une partie
router.post("/create", async (req: Request, res: Response): Promise<void>  => {

    const { createurId } = req.body;




    // vérifier si Id du créateur est fournit
    if (!createurId || typeof createurId !== "number") {

        res.status(400).json({ error: "L'ID du créateur est invalide" });
        return ;

    }

    try {
        // pour vérifier si le créateur existe dans la base de données
        const utilisateur = await prisma.utilisateur.findUnique({

            where: { id: createurId },

        });

        if (!utilisateur) {

            //sinon on renvoit un message d'erreur
             res.status(404).json({ error: "Utilisateur non trouvé" });

             return;
        }

        // création de la partie avec Prissma
        const partie = await prisma.partie.create({

            data: {

                createurId,
                statut: "EN_ATTENTE", // valeur par défaut
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
  


      // dans le cas contraire si la partie existe on renvoit l'ID de la partie créée
      res.json({ message: `Vous avez rejoint la partie ${game.id}.`, game });


    } catch (error) { 


    //erreur si il ya un pb avec le serveur
      console.error("Erreur lors de la tentative de rejoindre la partie", error);
      res.status(500).json({ error: "Erreur serveur" }); 
//réponse 500 pour signaler une erreur par rapport au serveur
    }  
  });


export default router;
