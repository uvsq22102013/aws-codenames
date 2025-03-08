// pour les sockets on a besoin de définir  des types pour les données qui seront échangées entre le client et le serveur

import prisma from "../prismaClient";
import { Equipe, TypeCarte, Role, TypeAction, StatutPartie } from '@prisma/client';

// Type indice ce que l'espion donne comme indice avec le nombre de mots
export type Indice_Payload = {
  partieId : number, 
  utilisateurId:number,
  motDonne:string, 
  nombreMots:number, 
  equipe : Equipe
  };
  
// Type pour la sélection d'une carte
  export type SelectionCarte_Payload = {
    carteId:number ,
    partieId : number,
    utilisateurId:number, 
    equipe: Equipe
  };

  export type DeselectionCarte_Payload = {
    partieId:number,
    carteId:number,
    utilisateurId:number
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

  export type changerHost_Payload = {
    partieId: number,
    utilisateurId: number
    newHostId: number
  };

  export type virerJoueur_Payload = {
    partieId: number,
    utilisateurId: number
    joueurId: number
  };

  export type renitPartie_Payload = {
    partieId: number,
    utilisateurId: number
  };
 export type devenirSpectateur_Payload = {
    partieId: number,
    utilisateurId: number
  };