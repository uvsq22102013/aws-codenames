import { Server, Socket } from 'socket.io';
// import { JSEncrypt } from 'jsencrypt';
import {renitPartie} from '../utils/creationPartie';
import { validerCarte,recupererDernierIndice, donnerIndice, selectionnerCarte, changerRole, lancerPartie, trouverMembreEquipe, finDeviner, quitterPartie, changerHost, getHost, virerJoueur, devenirSpectateur, deselectionnerCarte, verifierGagnant} from '../services/game.service';
import { FinDeviner_Payload, Indice_Payload, SelectionCarte_Payload, RejoindrePartie_Payload, changerHost_Payload, virerJoueur_Payload, renitPartie_Payload, devenirSpectateur_Payload, DeselectionCarte_Payload } from '../types/game.types';
import { verifierTokenSocket } from '../utils/verifierToken';

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

  socket.on('changerHost', async (data: changerHost_Payload) => {
    console.log(`Changement de host pour la partie ${data.partieId}`);
    const ancienHost = await getHost(data.partieId);
    if (ancienHost === data.utilisateurId) {
      await changerHost(data.partieId, data.newHostId);
      console.log(`Host changé pour la partie ${data.partieId}`);
      io.to(`partie-${data.partieId}`).emit('majPartie', { partieId: data.partieId });
    } else {
      console.log(`Tentative interdite : Not host`);
    }
  });

  socket.on('virerJoueur', async (data: virerJoueur_Payload) => {
    console.log(`Changement de host pour la partie ${data.partieId}`);
    const host = await getHost(data.partieId);
    if (host === data.utilisateurId) {
      await virerJoueur(data.partieId, data.joueurId);
      console.log(`Joueur vire dans la partie ${data.partieId}`);
      io.to(`partie-${data.partieId}`).emit('majPartie', { partieId: data.partieId });
    } else {
      console.log(`Tentative interdite : Not host`);
    }
  });

  socket.on('renitPartie', async (data: renitPartie_Payload) => {
    console.log(`Renitialisation de la partie ${data.partieId}`);
    const host = await getHost(data.partieId);
    if (host === data.utilisateurId) {
      const partie = await renitPartie(data.partieId);
      console.log(`Partie ${JSON.stringify(partie)} renitialisée`);
      io.to(`partie-${partie.id}`).emit('majPartie', { partieId: partie.id });
      
    } else {
      console.log(`Tentative interdite : Not host`);
    }
  });

  socket.on('devenirSpectateur', async (data: devenirSpectateur_Payload) => {
    console.log(`joueur ${data.utilisateurId} devient spectateur dans la partie ${data.partieId}`);
    const partie = await devenirSpectateur(data);
    io.to(`partie-${partie}`).emit('majPartie', { partieId: partie });
      
  });
  
  socket.on('donnerIndice', async (data: Indice_Payload) => {
    const partID = data.partieId;
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

  socket.on('deselectionnerCarte', async (data: DeselectionCarte_Payload) => {
    console.log(`Back socket: deselectionnerCarte ${data.carteId} pour partie ${data.partieId} par utilisateur ${data.utilisateurId}`);
    await deselectionnerCarte(data);
    console.log(`Back socket: Carte deselectionner : ${data.carteId}`);
    io.to(`partie-${data.partieId}`).emit('majPartie', { partieId: data.partieId });
  });

  socket.on('validerCarte', async (data: SelectionCarte_Payload) => {
    console.log(`Back socket: validerCarte ${data.carteId} pour partie ${data.partieId} par utilisateur ${data.utilisateurId}`);
    await validerCarte(data);
    console.log(`Back socket: Carte validee : ${data.carteId}`);
    io.to(`partie-${data.partieId}`).emit('majPartie', { partieId: data.partieId });
    console.log(`Back socket: majPartie apres carte valider`);

    const gagnant = await verifierGagnant({ partieId: data.partieId });
    if (gagnant) {
      io.to(`partie-${data.partieId}`).emit('gagnant', { equipeGagnante: gagnant });
      console.log(`Back socket: gagnant detecté : ${gagnant}`);
    }
  });

  socket.on('changerEquipe', async (data) => {
    console.log("EMIT rcezucvhgzv");
    await changerRole(data);
    io.to(`partie-${data.partieId}`).emit('majPartie', { partieId: data.partieId });
  });

  socket.on('choixEquipe', async (data) => {
    await changerRole(data);
    io.to(`partie-${data.partieId}`).emit('majEquipe');
  });

  socket.on('changerEquipe', async (data) => {
    await changerRole(data);
    io.to(`partie-${data.partieId}`).emit('majPartie', {partieId : data.partieId});
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
    finDeviner(data);
    io.to(`partie-${data.partieId}`).emit('majPartie', { partieId: data.partieId });
  });

  socket.on('verifToken',async (data : string) => {
    verifierTokenSocket(data);
    console.log('Token vérifié');
    socket.emit('tokenVerifie');
  });
  
  socket.on('disconnect', () => {
    console.log(`User déconnecté : ${socket.id}`);
  });
}
