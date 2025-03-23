import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function suppressionPartieEnAttente() {
  const twentyMinutesAgo = new Date(Date.now() - 20 * 60 * 1000);

  const partiesTerminees = await prisma.partie.findMany({
    where: {
      statut: 'EN_ATTENTE',
      createdAt: {
        lte: twentyMinutesAgo,
      },
    },
  });

  for (const partie of partiesTerminees) {
    await prisma.partie.delete({
      where: { id: partie.id },
    });
  }
}