import prisma from "../prismaClient";
import { Equipe, TypeCarte, Role, TypeAction, StatutPartie } from '@prisma/client'; 
export async function getpartieById(partieId:number) {
    return prisma.partie.findUnique({
        where: {id:partieId},
        include: {
            cartes: {include: {mot : true}},
            membres : {include: {utilisateur:true}},
            actions : true,
        },
    });
}

export async function getPartiePourUtilisateur(partieId: number, utilisateurId: number) {
    const partie = await prisma.partie.findUnique({
      where: { id: partieId },
      include: {
        cartes: { include: { mot: true } },
        membres: { include: { utilisateur: true } },
        actions: { include: { carte: { include: { mot: true } }, utilisateur: true }},
      },
    });
  
    if (!partie) return null;
  
    const monMembre = partie.membres.find((m) => m.utilisateurId === utilisateurId);
    const monRole = monMembre?.role;
    const monEquipe = monMembre?.equipe;
  
    const cartesFiltrees = partie.cartes.map((carte) => {
      if (carte.revelee || monRole === Role.MAITRE_ESPION) {
        return carte;
      }
      // Cache uniquement le type, mais garde le mot
      return {
        ...carte,
        type: 'INCONNU', // Cache le type
        mot: carte.mot,  // Laisse le mot visible
      };
    });
  
    const membresFiltres = partie.membres.map((membre) => {
      if (membre.equipe === monEquipe) {
        return membre;
      }
      return { ...membre, role: Role.INCONNU };
    });
  
    return {
      ...partie,
      cartes: cartesFiltrees,
      membres: membresFiltres,

    };
  }
  

export async function donnerIndice(payload: {mot:string, nombreMots:number, partieId : number, utilisateurId:number,equipe : Equipe}) {

    await prisma.actionJeu.create({
        data: {
            partieId: Number(payload.partieId),
            utilisateurId: payload.utilisateurId,
            equipe: payload.equipe,
            typeAction: TypeAction.INDICE,
            motDonne: payload.mot,
            nombreMots: payload.nombreMots,
        },
    });
    await prisma.partie.update({
        where : {id: Number(payload.partieId)},
        data:{
            roleEncours : Role.AGENT
            
        },

    });
}

export async function selectionnerCarte(payload:{carteId:number ,partieId : number,utilisateurId:number, equipe: Equipe}) {
    await prisma.actionJeu.create({
        data: {
            partieId: Number(payload.partieId),
            utilisateurId: payload.utilisateurId,
            equipe: payload.equipe,
            typeAction: TypeAction.SELECTION,
            carteId: payload.carteId,
        },
    });
    const constselection = await prisma.selection.create({
        data: {
            utilisateurId: payload.utilisateurId,
        },
    });

    await prisma.carte.update({
        where: {id:payload.carteId},
        data: {
            selectionId: constselection.id,
        }
    });
}
export async function validerCarte(payload:{carteId:number ,partieId : number,utilisateurId:number, equipe: Equipe}) {
    await prisma.actionJeu.create({
        data: {
            partieId: payload.partieId,
            utilisateurId: payload.utilisateurId,
            equipe: payload.equipe,
            typeAction: TypeAction.VALIDERSELECTION,
            carteId: payload.carteId,
        },
    });
    const carte = await prisma.carte.update({
        where:{
            id:payload.carteId
        },
        data: {
            revelee: true,
            trouveeParEquipe: payload.equipe,
        },
    });

    if (carte.type === TypeCarte.ASSASSIN){
        await prisma.partie.update({
            where: {id:payload.partieId},
            data: {
                statut: StatutPartie.TERMINEE,
            },
        });
    }
}

export async function rejoindrePartie(payload:{partieId : number,utilisateurId:number}) {
    await prisma.membreEquipe.create({
        data: {
            utilisateurId: payload.utilisateurId,
            partieId: payload.partieId,
            equipe: Equipe.BLEU,
            role: Role.AGENT,
        },
    });
}

export async function finDeviner(payload:{partieId : number,utilisateurId:number, equipe: Equipe}) {
    await prisma.actionJeu.create({
        data: {
            partieId: payload.partieId,
            utilisateurId: payload.utilisateurId,
            equipe: payload.equipe,
            typeAction: TypeAction.PASSER,
        }
    })
    await prisma.partie.update({
        where: {id:payload.partieId
        },
        data: {
            equipeEnCours : payload.equipe === Equipe.BLEU ? Equipe.ROUGE : Equipe.BLEU ,
            roleEncours : Role.MAITRE_ESPION,
        },
    });
}



export async function changerRole(payload:{partieId : number,utilisateurId:number, equipe: Equipe, role : Role}) {
    await prisma.membreEquipe.update({
        where : {utilisateurId_partieId: { utilisateurId: payload.utilisateurId, partieId: payload.partieId }},
        data: {
            role : payload.role,
            equipe : payload.equipe,
            
        },
    });
    
}
