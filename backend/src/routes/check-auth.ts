import express, { Request, Response } from 'express';
import verifierToken, { RequestAvecUtilisateur } from '../utils/verifierToken';

const router = express.Router();

router.get('/', verifierToken, (req: RequestAvecUtilisateur, res: Response) => {
  if (req.user) {
    res.status(200).json({ authenticated: true, user: req.user });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

export default router;