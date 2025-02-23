import { Server, Socket } from 'socket.io';
// import { JSEncrypt } from 'jsencrypt';
import {renitPartie} from '../utils/creationPartie';
import { validerCarte,recupererDernierIndice, donnerIndice, selectionnerCarte, changerRole, lancerPartie, trouverMembreEquipe, finDeviner, quitterPartie} from '../services/game.service';
import { FinDeviner_Payload, Indice_Payload, SelectionCarte_Payload, RejoindrePartie_Payload } from '../types/game.types';

// const crypterData = (data: any, publicKey: string) => {
//   const encryptor = new JSEncrypt();
//   encryptor.setPublicKey(publicKey);
//   return encryptor.encrypt(JSON.stringify(data)); // convertir  l'objet en string avant chiffrement
// };

export default function gameSocket(io: Server, socket: Socket) {
  console.log(`User connecté : ${socket.id}`);
  socket.on('rejoindrePartie', (data: RejoindrePartie_Payload) => {
    console.log(`Joueur a rejoint la partie ${data.partieId}`);
    socket.join(`partie-${data.partieId}`);
  });
  
  socket.on('quitterPartie', (data: RejoindrePartie_Payload) => {
    console.log(`Joueur a quitté la partie ${data.partieId}`);
    quitterPartie(data.partieId, data.utilisateurId);
    socket.leave(`partie-${data.partieId}`);
  });

  socket.on('renitPartie', async (data: number) => {
    console.log(`Renitialisation de la partie ${data}`);
    const partie = await renitPartie(data);
    console.log(`Partie ${JSON.stringify(partie)} renitialisée`);
    io.to(`partie-${data}`).emit('majPartie', { partieId: partie.id });
  });
  
  socket.on('donnerIndice', async (data: Indice_Payload) => {
    const partID = Number(data.partieId);
    const membre = await trouverMembreEquipe({partieId:partID, utilisateurId:data.utilisateurId});
  
    if (!membre || membre.role !== 'MAITRE_ESPION') {
      console.log('Tentative interdite : No n espion');
      return;
    }

    await donnerIndice(data);
    console.log(`Back socket: Indice donné : ${data.motDonne} (${data.nombreMots})`);
    
    io.to(`partie-${data.partieId}`).emit('majPartie', { partieId: data.partieId });
    console.log(`Back socket: majPartie apres indice envoyé`);
  });

  socket.on('selectionnerCarte', async (data: SelectionCarte_Payload) => {
    console.log(`Back socket: selectionnerCarte ${data.carteId} pour partie ${data.partieId} par utilisateur ${data.utilisateurId}`);
    await selectionnerCarte(data);
    console.log(`Back socket: Carte sélectionnée : ${data.carteId}`);
    io.to(`partie-${data.partieId}`).emit('majPartie', { partieId: data.partieId });
    console.log(`Back socket: majPartie apres carte sélectionnée`);
  });

  socket.on('validerCarte', async (data: SelectionCarte_Payload) => {
    console.log(`Back socket: validerCarte ${data.carteId} pour partie ${data.partieId} par utilisateur ${data.utilisateurId}`);
    await validerCarte(data);
    console.log(`Back socket: Carte validee : ${data.carteId}`);
    io.to(`partie-${data.partieId}`).emit('majPartie', { partieId: data.partieId });
    console.log(`Back socket: majPartie apres carte valider`);
  });

  socket.on('choixEquipe', async (data) => {
    console.log("EMIT rcezucvhgzv");
    await changerRole(data);
    io.to(`partie-${data.partieId}`).emit('majEquipe');
  });

  socket.on('lancerPartie', (data) => {
    const { partieId } = data;
    lancerPartie(partieId);
    console.log(`Partie ${partieId} lancée`);
    io.to(`partie-${partieId}`).emit('partieLancee', { partieId });
  });

  socket.on('recupererDernierIndice', (data) => {
    const { partieId } = data;
    const indice = recupererDernierIndice(partieId);
    const indiceJson = JSON.stringify(indice); // Convert the indice object to JSON
    io.to(`partie-${partieId}`).emit('dernierIndice', { indice: indiceJson }); // Emit the JSON representation of the indice
    console.log(`Indice envoyer`);
  });

  socket.on('finDeviner', async (data : FinDeviner_Payload) => {
    const { partieId } = data;
    finDeviner(data);
    io.to(`partie-${data.partieId}`).emit('majPartie', { partieId: data.partieId });
  });

  
  socket.on('disconnect', () => {
    console.log(`User déconnecté : ${socket.id}`);
  });
}
