-- CreateEnum
CREATE TYPE "StatutPartie" AS ENUM ('EN_ATTENTE', 'EN_COURS', 'TERMINEE');

-- CreateEnum
CREATE TYPE "TypeCarte" AS ENUM ('ROUGE', 'BLEU', 'NEUTRE', 'ASSASSIN');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MAITRE_ESPION', 'AGENT', 'INCONNU');

-- CreateEnum
CREATE TYPE "TypeAction" AS ENUM ('INDICE', 'SELECTION', 'PASSER', 'VALIDERSELECTION');

-- CreateEnum
CREATE TYPE "Equipe" AS ENUM ('ROUGE', 'BLEU');

-- CreateEnum
CREATE TYPE "ChatChannel" AS ENUM ('GLOBAL', 'EquipeROUGE', 'EquipeBLEU', 'ESPIONROUGE', 'ESPIONBLEU', 'ESPIONALL');

-- CreateTable
CREATE TABLE "Utilisateur" (
    "id" SERIAL NOT NULL,
    "pseudo" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mdp_hash" TEXT NOT NULL,
    "dateInscription" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Partie" (
    "id" TEXT NOT NULL,
    "statut" "StatutPartie" NOT NULL DEFAULT 'EN_ATTENTE',
    "createurId" INTEGER NOT NULL,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "equipeEnCours" "Equipe" NOT NULL DEFAULT 'ROUGE',
    "roleEncours" "Role" NOT NULL DEFAULT 'MAITRE_ESPION',
    "langue" TEXT NOT NULL DEFAULT 'fr',
    "nbMotsRouge" INTEGER NOT NULL DEFAULT 9,
    "nbMotsBleu" INTEGER NOT NULL DEFAULT 8,
    "equipeGagnante" "Equipe",
    "indiceId" INTEGER,

    CONSTRAINT "Partie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Indice" (
    "id" SERIAL NOT NULL,
    "mot" TEXT NOT NULL,
    "nbmots" INTEGER NOT NULL,
    "membreEquipeUtilisateurId" INTEGER NOT NULL,
    "membreEquipePartieId" TEXT NOT NULL,

    CONSTRAINT "Indice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MembreEquipe" (
    "utilisateurId" INTEGER NOT NULL,
    "partieId" TEXT NOT NULL,
    "equipe" "Equipe" NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'AGENT',

    CONSTRAINT "MembreEquipe_pkey" PRIMARY KEY ("utilisateurId","partieId")
);

-- CreateTable
CREATE TABLE "Mot" (
    "id" SERIAL NOT NULL,
    "mot" TEXT NOT NULL,
    "langue" TEXT NOT NULL DEFAULT 'fr',

    CONSTRAINT "Mot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Selection" (
    "id" SERIAL NOT NULL,
    "utilisateurId" INTEGER NOT NULL,
    "carteId" INTEGER NOT NULL,
    "partieId" TEXT NOT NULL,

    CONSTRAINT "Selection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Carte" (
    "id" SERIAL NOT NULL,
    "partieId" TEXT NOT NULL,
    "motId" INTEGER NOT NULL,
    "type" "TypeCarte" NOT NULL,
    "revelee" BOOLEAN NOT NULL DEFAULT false,
    "trouveeParEquipe" "Equipe",

    CONSTRAINT "Carte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActionJeu" (
    "id" SERIAL NOT NULL,
    "partieId" TEXT NOT NULL,
    "utilisateurId" INTEGER NOT NULL,
    "equipe" "Equipe" NOT NULL,
    "typeAction" "TypeAction" NOT NULL,
    "motDonne" TEXT,
    "nombreMots" INTEGER,
    "carteId" INTEGER,
    "resultat" TEXT,
    "dateAction" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActionJeu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "partieId" TEXT NOT NULL,
    "utilisateurId" INTEGER NOT NULL,
    "contenu" TEXT NOT NULL,
    "channel" "ChatChannel" NOT NULL,
    "pseudo" TEXT NOT NULL,
    "dateMessage" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reset" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_pseudo_key" ON "Utilisateur"("pseudo");

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "Utilisateur"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Mot_mot_langue_key" ON "Mot"("mot", "langue");

-- CreateIndex
CREATE UNIQUE INDEX "Selection_utilisateurId_carteId_key" ON "Selection"("utilisateurId", "carteId");

-- CreateIndex
CREATE UNIQUE INDEX "Reset_email_key" ON "Reset"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Reset_code_key" ON "Reset"("code");

-- AddForeignKey
ALTER TABLE "Partie" ADD CONSTRAINT "Partie_indiceId_fkey" FOREIGN KEY ("indiceId") REFERENCES "Indice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partie" ADD CONSTRAINT "Partie_createurId_fkey" FOREIGN KEY ("createurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Indice" ADD CONSTRAINT "Indice_membreEquipeUtilisateurId_membreEquipePartieId_fkey" FOREIGN KEY ("membreEquipeUtilisateurId", "membreEquipePartieId") REFERENCES "MembreEquipe"("utilisateurId", "partieId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembreEquipe" ADD CONSTRAINT "MembreEquipe_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembreEquipe" ADD CONSTRAINT "MembreEquipe_partieId_fkey" FOREIGN KEY ("partieId") REFERENCES "Partie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Selection" ADD CONSTRAINT "Selection_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Selection" ADD CONSTRAINT "Selection_carteId_fkey" FOREIGN KEY ("carteId") REFERENCES "Carte"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Carte" ADD CONSTRAINT "Carte_partieId_fkey" FOREIGN KEY ("partieId") REFERENCES "Partie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Carte" ADD CONSTRAINT "Carte_motId_fkey" FOREIGN KEY ("motId") REFERENCES "Mot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionJeu" ADD CONSTRAINT "ActionJeu_partieId_fkey" FOREIGN KEY ("partieId") REFERENCES "Partie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionJeu" ADD CONSTRAINT "ActionJeu_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionJeu" ADD CONSTRAINT "ActionJeu_carteId_fkey" FOREIGN KEY ("carteId") REFERENCES "Carte"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_partieId_fkey" FOREIGN KEY ("partieId") REFERENCES "Partie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;
