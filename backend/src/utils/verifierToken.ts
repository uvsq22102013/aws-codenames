import jwt from 'jsonwebtoken';
import e, { Request, Response, NextFunction } from 'express';
import { utilisateurExist } from '../services/game.service';

interface RequestAvecUtilisateur extends Request {
  user?: { id: number; pseudo: string };
}

export function verifierToken(req: RequestAvecUtilisateur, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log('back 1er if dans verif : Token manquant');
    res.status(401).json({ message: 'Token manquant' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, 'testkey') as { id: number; pseudo: string };
    req.user = decoded;
    next(); // On passe à la suite
  } catch (error) {
    res.status(403).json({ message: 'Token invalide' });
  }
}
export function verifierTokenSocket(tokenrecue: string) {

  const token = tokenrecue.split(' ')[1];

  try {
    const decoded = jwt.verify(token, 'testkey') as { id: number; pseudo: string };
    return utilisateurExist(decoded.id, decoded.pseudo);
  } catch (error) {
    return false;
  }
}

export default verifierToken;
export { RequestAvecUtilisateur };