import express, { Request, Response } from "express";
import prisma from "../prismaClient";
import nodemailer from "nodemailer";


const router = express.Router();

// Route qui s'occupe de l'envoi d'email de reset du mot de passe
router.post("", async (req: Request, res: Response): Promise<void> => {
    const {email} = req.body;

    try {
        const existingMail = await prisma.utilisateur.findUnique({
            where: { email }
        });

        if (!existingMail) {
            res.status(400).json({ error: "Aucun compte associé à cet email." });
            return;
        }
        
        // Generation du code qui sera dans l'URL pour garantir la sécurité.
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let code = '';
        for (let i = 0; i < 12; i++) {
            const index = Math.floor(Math.random() * caracteres.length);
            code += caracteres[index];
        }

        const user = await prisma.reset.upsert({
            where: { email },
            update: { code },
            create: { email, code },
        });

        // Email qui est utilisé pour envoyer le lien de reset
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'awscodenames@gmail.com',
                pass: 'icurgcsunbdtupqd'
            }
        });

        const mailOptions = {
            from: 'noreply@aws-codenames',
            to: email,
            subject: 'Réinitialisation de mot de passe aws-codenames',
            text: `Cliquez sur le lien suivant pour réinitialiser votre mot de passe : https://aws-codenames2.onrender.com/reset/${code}`,
            replyTo: 'noreply@aws-codenames'
        };

        // Envoi de l'email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Erreur d'envoi d'email :", error);
                res.status(500).json({ error: "Erreur d'envoi d'email" });
            } else {
                res.json({ message: "Email envoyé avec succès", user });
            }
        });

    } catch (error) {
        console.error("Erreur Prisma :", error);
        res.status(500).json({ error: "Erreur envoi reset backend" });
    }
});

export default router;