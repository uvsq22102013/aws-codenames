import { Router } from 'express';
import { getpartieById } from '../services/game.service';
import { promises } from 'dns';
import { verifierToken } from '../utils/verifierToken';
import { getPartiePourUtilisateur } from '../services/game.service';
import { validerCarte,recupererDernierIndice, donnerIndice, selectionnerCarte, changerRole, lancerPartie, trouverMembreEquipe} from '../services/game.service';

import { RequestAvecUtilisateur } from '../utils/verifierToken';

const router = Router();


router.get('/:id', verifierToken , async (req, res) => {
  const partieId = parseInt(req.params.id);
  const utilisateurId = (req as RequestAvecUtilisateur).user!.id;


  console.log(`Back: fetch partie ${partieId}`);
  try {
    const partie = await getPartiePourUtilisateur(partieId, utilisateurId);

    if (!partie) {
      console.log(`Back: fetch partie ${partieId} not found`);
      res.status(404).json({ message: 'Partie non trouvée' });
      return ;
    }
    console.log(`Back: fetch partie ${partieId} done`);
    res.json(partie);
  } catch (error) {
    console.log(`Back: fetch partie ${partieId} error`);
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

router.get('/:id/indice', verifierToken , async (req, res) => {
  const partieId = parseInt(req.params.id);

  console.log(`Back: fetch indice de la partie  ${partieId}`);
  try {
    const indice = await recupererDernierIndice(partieId);

    // if (!indice) {
    //   console.log(`Back: fetch indice de la partie  ${partieId} not found`);
    //   res.status(404).json({ message: 'indice non trouvée' });
    //   return ;
    // }
    console.log(`Back: fetch indice de la partie ${partieId} done`);
    res.json(indice);
  } catch (error) {
    console.log(`Back: fetch indice de la partie  ${partieId} error`);
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});


export default router;
