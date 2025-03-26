import { Router } from 'express';
import { getpartieById } from '../services/game.service';
import { promises } from 'dns';
import { verifierToken } from '../utils/verifierToken';
import { getPartiePourUtilisateur } from '../services/game.service';
import { validerCarte,recupererDernierIndice, donnerIndice, selectionnerCarte, changerRole, lancerPartie, trouverMembreEquipe} from '../services/game.service';

import { RequestAvecUtilisateur } from '../utils/verifierToken';

const router = Router();

// Route d'envoi des informations de la partie
router.get('/:id', verifierToken , async (req, res) => {
  const partieId = req.params.id;
  const utilisateurId = (req as RequestAvecUtilisateur).user!.id;


  try {
    const partie = await getPartiePourUtilisateur(partieId, utilisateurId);

    if (!partie) {
      res.status(404).json({ message: 'Partie non trouvée' });
      return ;
    }
    res.json(partie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

// Vérifie si l'utilisateur est bien membre de la partie
router.get('/:id/membre', verifierToken , async (req, res) => {
  const partieId = req.params.id;
  const utilisateurId = (req as RequestAvecUtilisateur).user!.id;  


  try {
    const partie = await getPartiePourUtilisateur(partieId, utilisateurId);
    const payload = {
      partieId: partieId, 
      utilisateurId: utilisateurId, 
  }; 
    const estmembre = await trouverMembreEquipe(payload);

    if (!partie || !estmembre) {
      res.status(404).json({ message: 'Partie non trouvée' });
      return ;
    }
    res.json(true);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});


// Route pour récupérer un indice
router.get('/:id/indice', verifierToken , async (req, res) => {
  const partieId = req.params.id;

  console.log(`Back: fetch indice de la partie  ${partieId}`);
  try {
    const indice = await recupererDernierIndice(partieId);

    // if (!indice) {
    //   console.log(`Back: fetch indice de la partie  ${partieId} not found`);
    //   res.status(404).json({ message: 'indice non trouvée' });
    //   return ;
    // }
    res.json(indice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});


export default router;
