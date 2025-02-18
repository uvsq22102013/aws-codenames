// pour les sockets on a besoin de définir  des types pour les données qui seront échangées entre le client et le serveur

import prisma from "../prismaClient";
import { Equipe, TypeCarte, Role, TypeAction, StatutPartie } from '@prisma/client';

// Type indice ce que l'espion donne comme indice avec le nombre de mots
export type Indice_Payload = {
  mot:string, 
  nombreMots:number, 
  partieId : number, 
  utilisateurId:number,
  equipe : Equipe
  };
  
// Type pour la sélection d'une carte

  export type SelectionCarte_Payload = {
    carteId:number ,
    partieId : number,
    utilisateurId:number, 
    equipe: Equipe
  };

  export type RejoindrePartie_Payload = {
    partieId: number,
    utilisateurId: number
  };


  export type FinDeviner_Payload = {
    partieId : number,
    utilisateurId:number, 
    equipe: Equipe
  };


