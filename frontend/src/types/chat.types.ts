
export type ChatChannel = 'global' | 'equipe' | 'espion';

// Type pour un message
export interface Message {
  content: string; 
  utilisateurId: number;
  pseudo: string; 
  timestamp: Date; 
  channel: ChatChannel; 
}

// Type pour les données d'un message envoyé via Socket.IO
export interface SocketMessage {
  content: string;
  utilisateurId: number;
  pseudo: string;
  timestamp: Date;
  channel: ChatChannel;
  partieId: string; // ID de la partie
}