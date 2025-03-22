import { create } from "domain";
import prisma from "../prismaClient";
import { Equipe, TypeCarte, Role, TypeAction, StatutPartie } from '@prisma/client'; 
export async function getpartieById(partieId:string) {
    return prisma.partie.findUnique({
        where: {id:partieId},
        include: {
            cartes: {include: {mot : true}},
            membres : {include: {utilisateur:true}},
            actions : true,
        },
    });
}
export async function lancerPartie(partieId:string) {
    await prisma.partie.update({
        where : {id: partieId},
        data:{
            statut : StatutPartie.EN_COURS,
        },
    });
}

export async function quitterPartie(partieId: string, utilisateurId: number) {
    console.log(`Tentative de suppression du membre : utilisateurId=${utilisateurId}, partieId=${partieId}`);
  
    // Vérifiez si le membre existe
    const membre = await prisma.membreEquipe.findUnique({
      where: { utilisateurId_partieId: { utilisateurId, partieId } },
    });
  
    if (!membre) {
      console.error(`Erreur : Aucun membre trouvé avec utilisateurId=${utilisateurId} et partieId=${partieId}`);
      return; // Arrêtez l'exécution si le membre n'existe pas
    }
  
    // Supprimez les sélections associées
    await prisma.selection.deleteMany({
      where: { utilisateurId, partieId },
    });
  
    // Supprimez les messages associés
    await prisma.message.deleteMany({
      where: { utilisateurId, partieId },
    });
  
    // Supprimez les actions associées
    await prisma.actionJeu.deleteMany({
      where: { utilisateurId, partieId },
    });
  
    // Supprimez les indices associés
    await prisma.indice.deleteMany({
      where: {
        membreEquipeUtilisateurId: utilisateurId,
        membreEquipePartieId: partieId,
      },
    });
  
    // Supprimez le membre de l'équipe
    await prisma.membreEquipe.delete({
      where: { utilisateurId_partieId: { utilisateurId, partieId } },
    });
  
    console.log(`Membre supprimé avec succès : utilisateurId=${utilisateurId}, partieId=${partieId}`);
  }
export async function gameOver(partieId:string) {
    const partie = await prisma.partie.findUnique({
        where: {id:partieId},
    });
    return partie?.statut === StatutPartie.TERMINEE;
}

export async function changerHost(partieId:string, utilisateurId:number) {
    await prisma.partie.update({
        where : {id: partieId},
        data:{
            createurId : utilisateurId,
        },
    });
}
export async function virerJoueur(partieId: string, utilisateurId: number) {
    // Supprimer les sélections associées
    await prisma.selection.deleteMany({
      where: { utilisateurId, partieId },
    });
  
    // Supprimer les messages associés
    await prisma.message.deleteMany({
      where: { utilisateurId, partieId },
    });
  
    // Supprimer les actions associées
    await prisma.actionJeu.deleteMany({
      where: { utilisateurId, partieId },
    });
  
    // Supprimer les indices associés
    await prisma.indice.deleteMany({
      where: {
        membreEquipeUtilisateurId: utilisateurId,
        membreEquipePartieId: partieId,
      },
    });
  
    // Supprimer le membre de l'équipe
    await prisma.membreEquipe.delete({
      where: { utilisateurId_partieId: { utilisateurId, partieId } },
    });
  }

  export async function devenirSpectateur(payload: { partieId: string; utilisateurId: number }) {
    const { partieId, utilisateurId } = payload;
  
    // Supprimer les sélections associées
    await prisma.selection.deleteMany({
      where: { utilisateurId, partieId },
    });
  
    // Supprimer les messages associés
    await prisma.message.deleteMany({
      where: { utilisateurId, partieId },
    });
  
    // Supprimer les actions associées
    await prisma.actionJeu.deleteMany({
      where: { utilisateurId, partieId },
    });
  
    // Supprimer les indices associés
    await prisma.indice.deleteMany({
      where: {
        membreEquipeUtilisateurId: utilisateurId,
        membreEquipePartieId: partieId,
      },
    });
  
    // Supprimer le membre de l'équipe
    await prisma.membreEquipe.delete({
      where: { utilisateurId_partieId: { utilisateurId, partieId } },
    });
  
    return partieId;
  }

export async function getHost(partieId:string) {
    const partie = await prisma.partie.findUnique({
        where: {id:partieId},
        select: {createurId: true, id: true},
    });
    return partie?.createurId;
}

export async function getPartiePourUtilisateur(partieId: string, utilisateurId: number) {
    const partie = await prisma.partie.findUnique({
    where: { id: partieId },
    include: {
    cartes: { include: { 
        mot: true,
        selections : {
            include : {
                utilisateur : true
            }
        }
     } },
    membres: { include: { utilisateur: true } },
    actions: { include: { carte: { include: { mot: true } }, utilisateur: true }},
    messages: { include: { 
        utilisateur: true,
        partie: true,
        
    } }
    },
    });
  
    if (!partie) return null;
  
    const monMembre = partie.membres.find((m) => m.utilisateurId === utilisateurId);
    const roleEncours = partie.roleEncours;
    const equipeEncours = partie.equipeEnCours;
    const monRole = monMembre?.role;
    const monEquipe = monMembre?.equipe;
  
    const cartesFiltrees = partie.cartes.map((carte) => ({
        ...carte,
        type: carte.revelee || monRole === Role.MAITRE_ESPION ? carte.type : 'INCONNU',
        mot: carte.mot,
        joueursSelection: carte.selections? carte.selections
            .filter((sel) => partie.membres.find((m) => m.utilisateurId === sel.utilisateurId)?.equipe === monEquipe)
            .map((sel) => sel.utilisateur.pseudo)
            : [],
        trouvee: carte.trouveeParEquipe !== null
      }));
      
    const messagesFiltres = partie.messages.filter((message) => {
        if (message.channel === 'GLOBAL') {
            return true;
        }
        if (message.channel === 'EquipeROUGE' && monEquipe === Equipe.ROUGE) {
            return true;
        }
        if (message.channel === 'EquipeBLEU' && monEquipe === Equipe.BLEU) {
            return true;
        }
        if (message.channel === 'ESPIONROUGE' && monEquipe === Equipe.ROUGE && monRole === Role.MAITRE_ESPION) {
            return true;
        }
        if (message.channel === 'ESPIONBLEU' && monEquipe === Equipe.BLEU && monRole === Role.MAITRE_ESPION) {
            return true;
        }
        if (message.channel === 'ESPIONALL' && monRole === Role.MAITRE_ESPION) {
            return true;
        }
        return false;
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
    messages: messagesFiltres,
    };
    }

  export async function trouverMembreEquipe(payload:{partieId : string, utilisateurId:number}) {
    return await prisma.membreEquipe.findUnique({
        where : {utilisateurId_partieId: { utilisateurId: payload.utilisateurId, partieId: payload.partieId }},
    });
}
  export async function trouverUtilisateur(utilisateurId:number) {
    return await prisma.utilisateur.findUnique({
        where : {id: utilisateurId},
    });
}

export async function donnerIndice(payload: {partieId : string, utilisateurId:number, motDonne:string, nombreMots:number,equipe : Equipe}) {

    await prisma.actionJeu.create({
        data: {
            partieId: payload.partieId,
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
                            partieId: payload.partieId,
                        }
                    }
                },
                mot: payload.motDonne,
                nbmots: payload.nombreMots,
            },
        });
        await prisma.partie.update({
            where : {id: payload.partieId},
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

export async function selectionnerCarte(payload: { carteId: number; partieId: string; utilisateurId: number; equipe: Equipe }) {
    await prisma.actionJeu.create({
        data: {
            partieId: payload.partieId,
            utilisateurId: payload.utilisateurId,
            equipe: payload.equipe,
            typeAction: TypeAction.SELECTION,
            carteId: payload.carteId,
        },
    });

    await prisma.selection.create({
        data: {
            utilisateurId: payload.utilisateurId,
            carteId: payload.carteId,
            partieId: payload.partieId,
        },
    });
}


export async function deselectionnerCarte(payload: {partieId:string, carteId: number; utilisateurId: number }) {
    await prisma.selection.deleteMany({
        where: {
            carteId: payload.carteId,
            utilisateurId: payload.utilisateurId,
        },
    });
}


export async function validerCarte(payload:{carteId:number ,partieId : string,utilisateurId:number, equipe: Equipe}) {
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
        await prisma.selection.deleteMany({
            where:{
                carteId:payload.carteId
            },
        });
        if (carte.type === TypeCarte.ASSASSIN){
            await prisma.partie.update({
                where: {id:payload.partieId},
                data: {
                    statut: StatutPartie.TERMINEE,
                    equipeGagnante: payload.equipe === Equipe.BLEU ? Equipe.ROUGE : Equipe.BLEU,
                },
            });

            await prisma.carte.updateMany({
                where: {partieId: payload.partieId},
                data: {revelee: true},
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
            await prisma.selection.deleteMany({
                where: {partieId: payload.partieId}
            });
            
        }
        if( carte.type === TypeCarte.BLEU ){
            await prisma.partie.update({
                where: {id: payload.partieId},
                data: {
                    nbMotsBleu: {
                        decrement: 1
                    }
                },
            });
        }
        if( carte.type === TypeCarte.ROUGE ){
            await prisma.partie.update({
                where: {id: payload.partieId},
                data: {
                    nbMotsRouge: {
                        decrement: 1
                    }
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
            await prisma.carte.updateMany({
                where: {partieId: payload.partieId},
                data: {revelee: true},
            });
        } else if (equipeRougeCartes.length === 0) {
            await prisma.partie.update({
                where: { id: payload.partieId },
                data: {
                    statut: StatutPartie.TERMINEE,
                    equipeGagnante: Equipe.ROUGE,
                },
            });
            await prisma.carte.updateMany({
                where: {partieId: payload.partieId},
                data: {revelee: true},
            });
        }
    }

    
}

export async function verifierGagnant(payload: { partieId: string }) {
    const partie = await prisma.partie.findUnique({
      where: { id: payload.partieId },
      select: { 
        statut: true, 
        equipeGagnante: true,  
      }, 
    });
  
    if (partie?.statut === StatutPartie.TERMINEE) {  
      return partie.equipeGagnante; 
    }
  
    return null;
}

export async function rejoindrePartie(payload:{partieId : string,utilisateurId:number}) {
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
export async function equipeEnCours(payload:{partieId : string}) {
    const partie = await prisma.partie.findUnique({
        where: {id:payload.partieId},
        select: {
            equipeEnCours: true,
        }
    });
    return partie?.equipeEnCours;
}
export async function roleEnCours(payload:{partieId : string}) {
    const partie = await prisma.partie.findUnique({
        where: {id:payload.partieId},
        select: {
            roleEncours: true,
        }
    });
    return partie?.roleEncours;
}

export async function utilisateurExist(utilisateurId: number, pseudo: string) {
    const utilisateur = await prisma.utilisateur.findUnique({
        where: {id :utilisateurId },
    });
    return utilisateur?.pseudo === pseudo;
}

export async function getroleUtilisateur(partieId: string, utilisateurId: number) {
    const membre = await prisma.membreEquipe.findUnique({
        where: {utilisateurId_partieId: {utilisateurId, partieId}},
        select: {
            role: true,
        },
    });
    return membre?.role;
}

export async function autoriserTour(partieId : string,utilisateurId:number, equipe: Equipe) {
    const equipeEnCoursconst = await equipeEnCours({partieId:partieId});
    const roleEnCoursconst = await roleEnCours({partieId:partieId});
    const roleUtilisateurconst = await getroleUtilisateur(partieId, utilisateurId);
    return (equipeEnCoursconst === equipe && roleEnCoursconst === roleUtilisateurconst)
}

export async function finDeviner(payload:{partieId : string,utilisateurId:number, equipe: Equipe}) {
    if (await autoriserTour(payload.partieId, payload.utilisateurId, payload.equipe)) {
        const equipeEnCoursconst = await equipeEnCours({partieId:payload.partieId});

        await prisma.actionJeu.create({
            data: {
                partieId: payload.partieId,
                utilisateurId: payload.utilisateurId,
                equipe: payload.equipe,
                typeAction: TypeAction.PASSER,
            }
        });
        await prisma.partie.update({
            where: {id:payload.partieId
            },
            data: {
                equipeEnCours : equipeEnCoursconst === Equipe.BLEU ? Equipe.ROUGE : Equipe.BLEU ,
                roleEncours : Role.MAITRE_ESPION,
                indice : undefined,
            },
        });

        await prisma.selection.deleteMany({
            where: {partieId: payload.partieId}
        });

        
    } else {
        console.log('Tentative interdite : Pas le tour de l equipe');
    }
}

export async function getMembres(partieId: string) {
    return await prisma.membreEquipe.findMany({
      where: {
        partieId: partieId,
      },
      include: {
        utilisateur: true,
      },
    });
  }


export async function changerRole(payload:{team : Equipe, type : Role, utilisateurId : number, partieId : string}) {
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

export async function recupererDernierIndice(partieId: string) {
    return await prisma.indice.findFirst({
        where: {
            membreEquipePartieId: partieId,
        },
        orderBy: {
            id: 'desc',
        },
    });
}

export async function nouveauMessage(payload: {
    content: string;
    utilisateurId: number;
    pseudo: string;
    timestamp: Date;
    channel: 'GLOBAL' | 'EquipeROUGE' | 'EquipeBLEU' | 'ESPIONROUGE' | 'ESPIONBLEU' | 'ESPIONALL';
    partieId: string;
  }) {
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id: payload.utilisateurId },
    });
    if (!utilisateur) {
      console.log(`Utilisateur avec ID ${payload.utilisateurId} n'exite pas.`);
    }
  
    const partie = await prisma.partie.findUnique({
      where: { id: payload.partieId },
    });
    const membre = await prisma.membreEquipe.findUnique({
        where : {utilisateurId_partieId: { utilisateurId: payload.utilisateurId, partieId: payload.partieId }},
    });
    if (!partie) {
      console.log(`Partie avec ID ${payload.partieId} n'exite pas.`);
    }
    if(!membre) {
        console.log(`Utilisateur avec ID ${payload.utilisateurId} n'exite pas.`);
    } else if (membre.role === 'INCONNU') {
        console.log(`Utilisateur avec ID ${payload.utilisateurId} n'as pas le droit d'ecrire.`);
    }
    else if(payload.channel.includes('ESPION') && membre.role !== 'MAITRE_ESPION'){
        console.log(`Utilisateur avec ID ${payload.utilisateurId} n'as pas le droit d'ecrire dans ce chanel car pas espion.`);
    }
    else if (membre.role === 'MAITRE_ESPION' && (payload.channel ===  'EquipeBLEU' || payload.channel ===  'EquipeROUGE' || payload.channel ===  'GLOBAL')){
        console.log(`Utilisateur avec ID ${payload.utilisateurId} n'as pas le droit d'ecrire dans ce chanel car espion.`);
    }else {
        await prisma.message.create({
            data: {
              contenu: payload.content,
              utilisateurId: payload.utilisateurId,
              partieId: payload.partieId,
              dateMessage: payload.timestamp || new Date(),
              channel: payload.channel,
              pseudo: payload.pseudo || 'Anonyme',
            },
          });
    }
    
  }
