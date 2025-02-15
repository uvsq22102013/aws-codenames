import { Router } from 'express';
import { getpartieById } from '../services/game.service';

const router = Router();

router.get('/:id', async (req, res) => {
  const partieId = parseInt(req.params.id);
  const partie = await getpartieById(partieId);
  res.json(partie);
});

export default router;
