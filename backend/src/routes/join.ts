import express, { Request, Response } from "express";
import prisma from "../prismaClient";
import { creerPartieAvecCartes } from "../utils/creationPartie";
import verifierToken, { RequestAvecUtilisateur } from "../utils/verifierToken";
import { StatutPartie } from "@prisma/client";
import verifyCaptcha from "../utils/captchaverif";

const router = express.Router();

// Route pour créer une partie
router.post("/create", verifierToken, async (req, res) => {
    const utilisateurReq = req as RequestAvecUtilisateur;

    if (!utilisateurReq.user) {
        res.status(401).json({ error: "Utilisateur non authentifié" });
        return;
    }

    const createurId = utilisateurReq.user.id;
    const { recaptchaToken, language } = req.body;

    const joueurDansPartie = await prisma.membreEquipe.findFirst({
        where: { utilisateurId: utilisateurReq.user.id },
        include: { partie: true }, 
    });
    
    if (joueurDansPartie) {
        res.status(400).json({ error: "Deja dans une partie", partieId: joueurDansPartie.partie.id });
        return;
    }


    if (!createurId || typeof createurId !== "number") {
        res.status(400).json({ error: "L'ID du créateur est invalide" });
        return;
    }

    // Vérification du CAPTCHA
    const captchaResult = await verifyCaptcha(recaptchaToken);
    if (!captchaResult || !captchaResult.success || captchaResult.score < 0.6) {
        res.status(403).json({ error: "Échec de la vérification reCAPTCHA" });
        return;
    }

    try {
        const utilisateur = await prisma.utilisateur.findUnique({
            where: { id: createurId },
        });

        if (!utilisateur) {
            res.status(404).json({ error: "Utilisateur non trouvé" });
            return;
        }

        const partie = await creerPartieAvecCartes(createurId, language);
        res.json(partie);
    } catch (error: any) {
        console.error("Erreur lors de la création de la partie :", error);
        res.status(500).json({ error: error.message || "Erreur serveur" });
    }
});

// Route pour rejoindre une partie
router.post("/join-game", async (req: Request, res: Response): Promise<void> => {
    const { roomCode, recaptchaToken, utilisateurId } = req.body;

    const joueurDansPartie = await prisma.membreEquipe.findFirst({
        where: { utilisateurId: utilisateurId },
        include: { partie: true }, 
    });
    
    if (joueurDansPartie) {
        res.status(400).json({ error: "Deja dans une partie", partieId: joueurDansPartie.partie.id });
        return;
    }

    const captchaResult = await verifyCaptcha(recaptchaToken);
    if (!captchaResult || !captchaResult.success || captchaResult.score < 0.6) {
        res.status(403).json({ error: "Échec de la vérification reCAPTCHA" });
        return;
    }



    try {
        const game = await prisma.partie.findUnique({
            where: { id: roomCode },
        });

        if (!game) {
            res.status(400).json({ error: "Mauvais Code Partie" });
            return;
        }

        if (game.statut !== StatutPartie.EN_ATTENTE) {
            res.status(400).json({ error: "La partie est déjà en cours." });
            return;
        }

        res.json({ game });
    } catch (error) {
        console.error("Erreur lors de la tentative de rejoindre la partie :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

export default router;
