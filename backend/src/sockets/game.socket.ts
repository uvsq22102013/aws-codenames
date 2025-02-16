import { Server, Socket } from 'socket.io';
import { validerCarte, donnerIndice, selectionnerCarte } from '../services/game.service';
import { Indice_Payload, SelectionCarte_Payload, RejoindrePartie_Payload } from '../types/game.types';
import prisma from '../prismaClient';
export default function gameSocket(io: Server, socket: Socket) {
  console.log(`User connecté : ${socket.id}`);

  socket.on('rejoindrePartie', (data: RejoindrePartie_Payload) => {
    socket.join(`partie-${data.partieId}`);
    console.log(`Joueur a rejoint la partie ${data.partieId}`);
  });
  console.log(`Back socket: rejoindrePartie`);
  socket.on('donnerIndice', async (data: Indice_Payload) => {
    const membre = await prisma.membreEquipe.findUnique({
      where: { utilisateurId_partieId: { utilisateurId: data.utilisateurId, partieId: data.partieId } },
    });
  
    if (!membre || membre.role !== 'MAITRE_ESPION') {
      console.log('Tentative interdite : Non espion');
      return;
    }

    await donnerIndice(data);
    console.log(`Back socket: Indice donné : ${data.mot} (${data.nombreMots})`);
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
  socket.on('disconnect', () => {
    console.log(`User déconnecté : ${socket.id}`);
  });
}
