import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../prismaClient";

const router = express.Router();

// Inscription
router.post("/register", async (req: Request, res: Response): Promise<void> => {
    const { pseudo, email, mdp, mdp2 } = req.body;

    try {
        // Vérifier si le mail existe déjà en bdd
        const existingMail = await prisma.utilisateur.findUnique({
            where: { email }
        });

        if (existingMail) {
            res.status(400).json({ error: "Cet email est déjà utilisé." });
            return;
        }
        // Vérifier si le pseudo existe déjà en bdd
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

// Connexion
router.post("/login", async (req: Request, res: Response): Promise<void> => {
    const { pseudo, email, mdp } = req.body;

    try {
        // Vérifier si l'utilisateur existe avec ce pseudo
        const existingPseudo = await prisma.utilisateur.findUnique({
            where: { pseudo },
        });
        // Vérifier si l'utilisateur existe avec cet email
        const existingMail = await prisma.utilisateur.findUnique({
            where: { email },
        });

        if (!existingMail && !existingPseudo) {
            res.status(400).json({ error: "Login ou mot de passe incorrect." });
            return;
        }
        //donne a user l'objet représentant l'utilisateur
        let user: any;

        if (existingPseudo) {
            user = existingPseudo;
        } else {
            user = existingMail;
        }
        // Vérifier si le mot de passe est correct
        const isPasswordValid = await bcrypt.compare(mdp, user.mdp_hash);

        if (!isPasswordValid) {
            res.status(400).json({ error: "Login ou mot de passe incorrect." });
            return;
        }

        res.json({ message: "Connexion réussie", user });
    } catch (error) {
        console.error("Erreur Prisma :", error);
        res.status(500).json({ error: "Erreur de connexion backend" });
    }
});




export default router;
