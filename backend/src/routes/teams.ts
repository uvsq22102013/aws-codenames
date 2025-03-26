import express, { Request, Response } from "express";
import prisma from "../prismaClient";
import { getMembres } from '../services/game.service';
import verifierToken from "../utils/verifierToken";

const router = express.Router();

// Route qui renvoie les membres d'équipe d'une partie (pour la page de choix d'équipe)
router.get('/:id', verifierToken, async (req: Request, res: Response): Promise<void> => {
    const partieId = req.params.id;
    try { 
        const membres = await getMembres(partieId);
        res.status(200).json(membres);
    } catch (error: any) {
        console.error("Erreur lors de la création du membre d'équipe :", error);
    }
});

export default router;