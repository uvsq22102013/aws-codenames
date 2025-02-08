import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient";

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "super_secret_key";

// Inscription
router.post("/register", async (req, res) => {
    const { pseudo, email, mdp } = req.body;
    const hashedPassword = await bcrypt.hash(mdp, 10);

    try {
        const user = await prisma.utilisateur.create({
            data: { pseudo, email, mdp_hash: hashedPassword },
        });
        res.json({ message: "Utilisateur inscrit", user });
    } catch (error) {
        res.status(500).json({ error: "Erreur d'inscription" });
    }
});

export default router; 
