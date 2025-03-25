import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function suppressionPartieTerminee() {
  const partiesTerminees = await prisma.partie.findMany({
    where: {
      statut: {
        in: ['TERMINEE', 'EN_COURS','EN_ATTENTE'],
      },
      membres: {
        none: {},
      },
    },
  });

  for (const partie of partiesTerminees) {
    await prisma.carte.deleteMany({
      where: { partieId: partie.id },
    });
    await prisma.actionJeu.deleteMany({
      where: { partieId: partie.id },
    });
    await prisma.message.deleteMany({
      where: { partieId: partie.id },
    });

    await prisma.membreEquipe.deleteMany({
      where: { partieId: partie.id },
    });


    await prisma.partie.delete({
      where: { id: partie.id },
    });
  }
}