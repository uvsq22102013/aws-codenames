import { create } from "domain";
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
export async function lancerPartie(partieId:number) {
    await prisma.partie.update({
        where : {id: partieId},
        data:{
            statut : StatutPartie.EN_COURS,
        },
    });
}

export async function quitterPartie(partieId : number,utilisateurId : number ) {
    await prisma.membreEquipe.delete({
        where : {utilisateurId_partieId: { utilisateurId: utilisateurId, partieId: partieId }},
    });
}
export async function gameOver(partieId:number) {
    const partie = await prisma.partie.findUnique({
        where: {id:partieId},
    });
    return partie?.statut === StatutPartie.TERMINEE;
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
    ///   if (membre.equipe === monEquipe) {
    return membre;
    ///   }
    ///   return { ...membre, role: Role.INCONNU };
    });
  
    return {
    ...partie,
    cartes: cartesFiltrees,
    membres: membresFiltres,
    roleEncours : roleEncours,
    equipeEncours : equipeEncours,
    };
    }

  export async function trouverMembreEquipe(payload:{partieId : number, utilisateurId:number}) {
    return await prisma.membreEquipe.findUnique({
        where : {utilisateurId_partieId: { utilisateurId: payload.utilisateurId, partieId: Number(payload.partieId) }},
    });
}
  

export async function donnerIndice(payload: {partieId : number, utilisateurId:number, motDonne:string, nombreMots:number,equipe : Equipe}) {

    await prisma.actionJeu.create({
        data: {
            partieId: Number(payload.partieId),
            utilisateurId: payload.utilisateurId,
            equipe: payload.equipe,
            typeAction: TypeAction.INDICE,
            motDonne: payload.motDonne,
            nombreMots: payload.nombreMots,
        },
    });
const membreequipe = await trouverMembreEquipe({partieId:payload.partieId, utilisateurId:payload.utilisateurId});
    if ( membreequipe){
        const indiceconst = await prisma.indice.create({
            data: {
                createur: {
                    connect: {
                        utilisateurId_partieId: {
                            utilisateurId: payload.utilisateurId,
                            partieId: Number(payload.partieId),
                        }
                    }
                },
                mot: payload.motDonne,
                nbmots: payload.nombreMots,
            },
        });
        await prisma.partie.update({
            where : {id: Number(payload.partieId)},
            data:{
                roleEncours : Role.AGENT,
                indice: {
                    connect: {
                        id: indiceconst.id
                    }
                },
            },
    
        });
    }
    
    
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
    const equipeEnCoursconst = await prisma.partie.findUnique({
        where: { id: payload.partieId },
        select: { equipeEnCours: true },
    });
    if (await autoriserTour(payload.partieId, payload.utilisateurId, payload.equipe)) {
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
        } else if (carte.type === TypeCarte.NEUTRE || carte.type === TypeCarte.BLEU && equipeEnCoursconst?.equipeEnCours === Equipe.ROUGE || carte.type === TypeCarte.ROUGE && equipeEnCoursconst?.equipeEnCours === Equipe.BLEU) {
            await prisma.partie.update({
                where: { id: payload.partieId },
                data: {
                    equipeEnCours: equipeEnCoursconst?.equipeEnCours === Equipe.BLEU ? Equipe.ROUGE : Equipe.BLEU,
                    roleEncours: Role.MAITRE_ESPION,
                    indice: undefined,
                },
            });
        }
        const equipeBleuCartes = await prisma.carte.findMany({
            where: {
                partieId: payload.partieId,
                type: TypeCarte.BLEU,
                revelee: false,
            },
        });
    
        const equipeRougeCartes = await prisma.carte.findMany({
            where: {
                partieId: payload.partieId,
                type: TypeCarte.ROUGE,
                revelee: false,
            },
        });
    
        if (equipeBleuCartes.length === 0) {
            await prisma.partie.update({
                where: { id: payload.partieId },
                data: {
                    statut: StatutPartie.TERMINEE,
                    equipeGagnante: Equipe.BLEU,
                },
            });
        } else if (equipeRougeCartes.length === 0) {
            await prisma.partie.update({
                where: { id: payload.partieId },
                data: {
                    statut: StatutPartie.TERMINEE,
                    equipeGagnante: Equipe.ROUGE,
                },
            });
        }
    }
    
}

export async function rejoindrePartie(payload:{partieId : number,utilisateurId:number}) {
    const existDeja = await trouverMembreEquipe(payload);
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
export async function equipeEnCours(payload:{partieId : number}) {
    const partie = await prisma.partie.findUnique({
        where: {id:payload.partieId},
        select: {
            equipeEnCours: true,
        }
    });
    return partie?.equipeEnCours;
}
export async function roleEnCours(payload:{partieId : number}) {
    const partie = await prisma.partie.findUnique({
        where: {id:payload.partieId},
        select: {
            roleEncours: true,
        }
    });
    return partie?.roleEncours;
}

export async function getroleUtilisateur(partieId: number, utilisateurId: number) {
    const membre = await prisma.membreEquipe.findUnique({
        where: {utilisateurId_partieId: {utilisateurId, partieId}},
        select: {
            role: true,
        },
    });
    return membre?.role;
}

export async function autoriserTour(partieId : number,utilisateurId:number, equipe: Equipe) {
    const equipeEnCoursconst = await equipeEnCours({partieId:partieId});
    const roleEnCoursconst = await roleEnCours({partieId:partieId});
    const roleUtilisateurconst = await getroleUtilisateur(partieId, utilisateurId);
    return (equipeEnCoursconst === equipe && roleEnCoursconst === roleUtilisateurconst)
}

export async function finDeviner(payload:{partieId : number,utilisateurId:number, equipe: Equipe}) {
    if (await autoriserTour(payload.partieId, payload.utilisateurId, payload.equipe)) {
        const equipeEnCoursconst = await equipeEnCours({partieId:payload.partieId});

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
                equipeEnCours : equipeEnCoursconst === Equipe.BLEU ? Equipe.ROUGE : Equipe.BLEU ,
                roleEncours : Role.MAITRE_ESPION,
                indice : undefined,
            },
        });
    } else {
        console.log('Tentative interdite : Pas le tour de l equipe');
    }
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

export async function recupererDernierIndice(partieId: number) {
    return await prisma.indice.findFirst({
        where: {
            membreEquipePartieId: partieId,
        },
        orderBy: {
            id: 'desc',
        },
    });
}
