export type ChatChannel = 'GLOBAL' | 'EquipeROUGE' | 'EquipeBLEU'| 'ESPIONROUGE' | 'ESPIONBLEU' | 'ESPIONALL' ;

// Type pour un message
export interface Message {
  content: string; 
  utilisateurId: number; 
  pseudo: string; 
  timestamp: Date; 
  channel: ChatChannel;
}

export interface SocketMessage {
  content: string;
  utilisateurId: number;
  pseudo: string;
  timestamp: Date;
  channel: ChatChannel;
  partieId: string;
}