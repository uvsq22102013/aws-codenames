import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import prisma from "../prismaClient";
import { verifyEmailDomain } from "../utils/emailVerifier"; // Import the function

import verifyCaptcha from "../utils/captchaverif";  // Assure-toi que le fichier captchaVerification exporte correctement la fonction

const router = express.Router();



// Partie qui se charge de l'inscription
router.post("/register", async (req: Request, res: Response): Promise<void> => {
    //Recupere les donnees de la requete 
    const { pseudo, email, mdp, mdp2, captchaToken } = req.body;
    //Essaye plusieurs verifications pour l'inscription et essaye de créer un utilisateur
    try {
        //Cherche si un utilisateur avec le mail existe déjà en bdd
        const captchaResult = await verifyCaptcha(captchaToken);
        if (!captchaResult?.success || captchaResult.score < 0.6) {
            res.status(400).json({ error: "Vérification reCAPTCHA échouée" });
            return;
        }
        const isEmailDomainValid = await verifyEmailDomain(email);
        if (!isEmailDomainValid) {
            res.status(400).json({ error: "Email invalide." });
            return;
        }

        const existingMail = await prisma.utilisateur.findUnique({
            where: { email }
        });
        if (existingMail) {
            res.status(400).json({ error: "Cet email est déjà utilisé." });
            return;
        }

        // Vérifier si un utilisateur avec le pseudo existe déjà en BDD
        const existingUser = await prisma.utilisateur.findUnique({
            where: { pseudo }
        });
        if (existingUser) {
            res.status(400).json({ error: "Ce nom d'utilisateur est déjà utilisé." });
            return;
        }

        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(mdp, 10);

        // Créer un utilisateur
        const user = await prisma.utilisateur.create({
            data: { pseudo, email, mdp_hash: hashedPassword },
        });

        res.json({ message: "Utilisateur inscrit avec succès", user });
    } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        res.status(500).json({ error: "Erreur d'inscription backend" });
    }
});

// Partie qui se charge de la connexion
router.post("/login", async (req: Request, res: Response): Promise<void> => {
    const { pseudo, email, mdp, captchaToken } = req.body;

    try {
        // Vérifier le token reCAPTCHA
        const captchaResult = await verifyCaptcha(captchaToken);
        if (!captchaResult?.success || captchaResult.score < 0.6) {
            res.status(400).json({ error: "Vérification reCAPTCHA échouée" });
            return;
        }

        // Chercher l'utilisateur avec le pseudo ou l'email
        const existingPseudo = await prisma.utilisateur.findUnique({
            where: { pseudo },
        });
        const existingMail = await prisma.utilisateur.findUnique({
            where: { email },
        });

        if (!existingMail && !existingPseudo) {
            res.status(400).json({ error: "Login ou mot de passe incorrect." });
            return;
        }

        // Définir l'utilisateur trouvé (pseudo ou email)
        let user: any;
        if (existingPseudo) {
            user = existingPseudo;
        } else {
            user = existingMail;
        }

        // Vérifier si le mot de passe est valide
        const isPasswordValid = await bcrypt.compare(mdp, user.mdp_hash);
        if (!isPasswordValid) {
            res.status(400).json({ error: "Login ou mot de passe incorrect." });
            return;
        }

        // Générer le token JWT
        const token = jwt.sign(
            { id: user.id, pseudo: user.pseudo },
            'testkey',
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                pseudo: user.pseudo,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        res.status(500).json({ error: "Erreur de connexion backend" });
    }
});

export default router;
