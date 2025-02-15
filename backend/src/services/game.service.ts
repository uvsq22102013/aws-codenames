import {prisma} from "../prismaClient";
import { Equipe, TypeCarte, Role, TypeAction, StatutPartie } from '@prisma/client';

export async function getpartieById(partieId:number) {
    return prisma.Partie.findUnique({
        where: {id:partieId},
        include: {
            cartes: {include: {mot : true}},
            membres : {include: {utilisateur:true}},
            actions : true,
        },
    });
}

export async function donnerIndice(payload: {mot:string, nombreMots:number, partieId : number, utilisateurId:number,equipe : Equipe}) {

    await prisma.ActionJeu.creat({
        data: {
            partieId: payload.partieId,
            utilisateurId: payload.utilisateurId,
            equipe: payload.equipe,
            typeAction: TypeAction.INDICE,
            motDonne: payload.mot,
            nombreMots: payload.nombreMots,
        },
    });
    await prisma.Partie.update({
        where : {id: payload.partieId},
        data:{
            roleEncours : Role.AGENT
        },

    });
}

export async function selectionnerCarte(payload:{carteId:number ,partieId : number,utilisateurId:number, equipe: Equipe}) {
    await prisma.ActionJeu.creat({
        data: {
            partieId: payload.partieId,
            utilisateurId: payload.utilisateurId,
            equipe: payload.equipe,
            typeAction: TypeAction.SELECTION,
            carteId: payload.carteId,
        },
    });

    await prisma.Carte.update({
        where: {id:payload.carteId},
        data: {
            Selection : {utilisateurId: payload.utilisateurId}
        }
    });
}
export async function validerCarte(payload:{carteId:number ,partieId : number,utilisateurId:number, equipe: Equipe}) {
    await prisma.ActionJeu.creat({
        data: {
            partieId: payload.partieId,
            utilisateurId: payload.utilisateurId,
            equipe: payload.equipe,
            typeAction: TypeAction.VALIDERSELECTION,
            carteId: payload.carteId,
        },
    });
    const carte = await prisma.Carte.update({
        where:{
            id:payload.carteId
        },
        data: {
            revelee: true,
            trouveeParEquipe: payload.equipe,
        },
    });

    if (carte.type === TypeCarte.ASSASSIN){
        await prisma.Partie.update({
            where: {id:payload.partieId},
            data: {
                statut: StatutPartie.TERMINEE,
            },
        });
    }
}

export async function finDeviner(payload:{partieId : number,utilisateurId:number, equipe: Equipe}) {
    await prisma.ActionJeu.creat({
        data: {
            partieId: payload.partieId,
            utilisateurId: payload.utilisateurId,
            equipe: payload.equipe,
            typeAction: TypeAction.PASSER,
        }
    })
    await prisma.Partie.update({
        where: {id:payload.partieId
        },
        data: {
            equipeEnCours : payload.equipe === Equipe.BLEU ? Equipe.ROUGE : Equipe.BLEU ,
            roleEncours : Role.MAITRE_ESPION,
        },
    });
}