import jwt from 'jsonwebtoken';
import e, { Request, Response, NextFunction } from 'express';

interface RequestAvecUtilisateur extends Request {
  user?: { id: number; pseudo: string };
}

export function verifierToken(req: RequestAvecUtilisateur, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
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

export default verifierToken;
export { RequestAvecUtilisateur };