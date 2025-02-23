import prisma from "../prismaClient";
import { Partie , TypeAction,TypeCarte,StatutPartie, Equipe, Role } from "@prisma/client";
async function genererCartesPourPartie(partieId: number, langue: string) {
    const mots = await prisma.mot.findMany({
      where: { langue  },
    });
    console.log('les mots : ${ mots }');
  
    if (mots.length < 25) {
        console.log(`back Pas assez de mots en langue ${langue} (trouvé: ${mots.length})`);
      throw new Error(`Pas assez de mots en langue ${langue} (trouvé: ${mots.length})`);
    }
  
    const motsMelanges = mots.slice().sort(() => Math.random() - 0.5).slice(0, 25);
  
    const typesCartes: TypeCarte[] = [
      ...Array(9).fill(TypeCarte.ROUGE),
      ...Array(8).fill(TypeCarte.BLEU),
      ...Array(7).fill(TypeCarte.NEUTRE),
      TypeCarte.ASSASSIN,
    ];
    const typesMelanges = typesCartes.sort(() => Math.random() - 0.5);
  
    const cartesPromises = motsMelanges.map((mot, index) =>
      prisma.carte.create({
        data: {
          partieId,
          motId: mot.id,
          type: typesMelanges[index],
          selectionId: null,
        },
      })
    );
  
    await Promise.all(cartesPromises);
    return cartesPromises;
  }
  export async function creerPartieAvecCartes(createurId: number, langue: string) {
    const partie = await prisma.partie.create({
      data: {
        createurId,
        statut: StatutPartie.EN_ATTENTE,
        langue,
        membres: {
          create: {
            utilisateurId: createurId,
            equipe: Equipe.ROUGE,
            role: Role.MAITRE_ESPION,
          },
        },
        roleEncours : Role.MAITRE_ESPION,
        equipeEnCours : Equipe.ROUGE,
      },
      include: { createur: true, membres: true },
    });
  
    await genererCartesPourPartie(partie.id, langue);
  
    return partie;
  }
  export async function renitPartie(partieId: number) {
    try {
      const partie = await prisma.partie.update({
        where: { id: partieId },
        data: {
          statut: StatutPartie.EN_COURS,
          roleEncours: Role.MAITRE_ESPION,
          equipeEnCours: Equipe.ROUGE,
          indice: undefined,
        },
      });
  
      await prisma.carte.deleteMany({ where: { partieId } });
      const cartes = await genererCartesPourPartie(partie.id, partie.langue);
      await Promise.all(cartes);
      return partie;
    } catch (error) {
      console.error(`Erreur lors de la réinitialisation de la partie avec ID ${partieId}:`, error);
      throw new Error(`Erreur lors de la réinitialisation de la partie.`);
    }
  }