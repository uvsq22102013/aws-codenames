import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Supprimez les enregistrements dans l'ordre correct pour respecter les contraintes de clés étrangères
  await prisma.selection.deleteMany({});
  await prisma.actionJeu.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.indice.deleteMany({});
  await prisma.membreEquipe.deleteMany({});
  await prisma.carte.deleteMany({});
  await prisma.partie.deleteMany({});
  await prisma.utilisateur.deleteMany({});
  await prisma.mot.deleteMany({});
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });