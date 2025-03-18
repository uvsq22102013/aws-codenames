import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import prisma from "../prismaClient";
import axios from "axios"; 

require('dotenv').config();  // Charger les variables du fichier .env

const router = express.Router();


// Clé secrète de Google reCAPTCHA (remplacez par votre clé secrète)
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;




router.post("/register", async (req: Request, res: Response): Promise<void> => {
    const { pseudo, email, mdp, mdp2, recaptchaResponse } = req.body; // Ajoutez recaptchaResponse ici

    try {
        // Vérifier la réponse reCAPTCHA avec Google
        const recaptchaVerificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaResponse}`;

        // Envoi de la requête à Google pour vérifier le CAPTCHA
        const recaptchaVerification = await axios.post(recaptchaVerificationUrl);

        if (!recaptchaVerification.data.success) {
            // Si la vérification reCAPTCHA échoue, renvoyer une erreur
            res.status(400).json({ error: "Échec de la vérification reCAPTCHA. Veuillez réessayer." });
            return;
        }



        // Chercher un utilisateur avec le mail, vérifier le pseudo, etc.
        
        const existingMail = await prisma.utilisateur.findUnique({
            where: { email }
        });
        if (existingMail) {
            res.status(400).json({ error: "Cet email est déjà utilisé." });
            return;
        }

        const existingUser = await prisma.utilisateur.findUnique({
            where: { pseudo }
        });
        if (existingUser) {
            res.status(400).json({ error: "Ce nom d'utilisateur est déjà utilisé." });
            return;
        }

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








router.post("/login", async (req: Request, res: Response): Promise<void> => {
    const { pseudo, email, mdp, recaptchaResponse } = req.body; 

    try {
        // Vérifier la réponse reCAPTCHA avec Google
        const recaptchaVerificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaResponse}`;

        const recaptchaVerification = await axios.post(recaptchaVerificationUrl);

        if (!recaptchaVerification.data.success) {
            // Si la vérification reCAPTCHA échoue, renvoyer une erreur
            res.status(400).json({ error: "Échec de la vérification reCAPTCHA. Veuillez réessayer." });
            return;
        }


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

        let user: any;
        if (existingPseudo) {
            user = existingPseudo;
        } else {
            user = existingMail;
        }

        const isPasswordValid = await bcrypt.compare(mdp, user.mdp_hash);
        if (!isPasswordValid) {
            res.status(400).json({ error: "Login ou mot de passe incorrect." });
            return;
        }

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
        console.error("Erreur Prisma :", error);
        res.status(500).json({ error: "Erreur de connexion backend" });
    }
});


  

export default router;
