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
    
    await prisma.partie.delete({
      where: { id: partie.id },
    });
  }
}