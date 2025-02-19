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
    const roleEncours = partie.roleEncours;
    const equipeEncours = partie.equipeEnCours;
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
    //   if (membre.equipe === monEquipe) {
        return membre;
    //   }
    //   return { ...membre, role: Role.INCONNU };
    });
  
    return {
      ...partie,
      cartes: cartesFiltrees,
      membres: membresFiltres,
      roleEncours,
      equipeEncours,
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
    const existDeja = await prisma.membreEquipe.findUnique({
        where : {utilisateurId_partieId: { utilisateurId: payload.utilisateurId, partieId: payload.partieId }},
    });    
    if(!existDeja) {
        await prisma.membreEquipe.create({
            data: {
                utilisateurId: payload.utilisateurId,
                partieId: payload.partieId,
                equipe: Equipe.BLEU,
                role: Role.AGENT,
            },
        });
    }
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

export async function getMembres(partieId: number) {
    return await prisma.membreEquipe.findMany({
      where: {
        partieId: partieId,
      },
      include: {
        utilisateur: true,
      },
    });
  }


export async function changerRole(payload:{team : Equipe, type : Role, utilisateurId : number, partieId : number}) {
    await prisma.membreEquipe.upsert({
        // Recherche du joueur à insérer ou a mettre à jour dans la table membreEquipe
        where: {
            utilisateurId_partieId: {
                utilisateurId : payload.utilisateurId,
                partieId : payload.partieId,
            },
        },
        // S'il existe, on met à jour ses valeurs.
        update: {
            equipe: payload.team,
            role: payload.type,
        },
        // S'il n'existe pas, on insère un nouveau tuple.
        create: {
            utilisateurId : payload.utilisateurId,
            partieId : payload.partieId,
            equipe: payload.team,
            role: payload.type,
        },
    });
}
