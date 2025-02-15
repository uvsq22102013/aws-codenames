import { Server, Socket } from 'socket.io';
import { donnerIndice, selectionnerCarte } from '../services/game.service';
import { Indice_Payload, SelectionCarte_Payload, RejoindrePartie_Payload } from '../types/game.types';

export default function gameSocket(io: Server, socket: Socket) {
  console.log(`User connecté : ${socket.id}`);

  socket.on('rejoindrePartie', (data: RejoindrePartie_Payload) => {
    socket.join(`partie-${data.partieId}`);
    console.log(`Joueur a rejoint la partie ${data.partieId}`);
  });

  socket.on('donnerIndice', async (data: Indice_Payload) => {
    await donnerIndice(data);
    io.to(`partie-${data.partieId}`).emit('majPartie', { partieId: data.partieId });
  });

  socket.on('selectionnerCarte', async (data: SelectionCarte_Payload) => {
    await selectionnerCarte(data);
    io.to(`partie-${data.partieId}`).emit('majPartie', { partieId: data.partieId });
  });

  socket.on('disconnect', () => {
    console.log(`User déconnecté : ${socket.id}`);
  });
}
