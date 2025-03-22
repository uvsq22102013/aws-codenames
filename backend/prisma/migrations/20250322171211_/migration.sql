-- CreateTable
CREATE TABLE "Utilisateur" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pseudo" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mdp_hash" TEXT NOT NULL,
    "dateInscription" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Partie" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "statut" TEXT NOT NULL DEFAULT 'EN_ATTENTE',
    "createurId" INTEGER NOT NULL,
    "dateCreation" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "equipeEnCours" TEXT NOT NULL DEFAULT 'ROUGE',
    "roleEncours" TEXT NOT NULL DEFAULT 'MAITRE_ESPION',
    "langue" TEXT NOT NULL DEFAULT 'fr',
    "nbMotsRouge" INTEGER NOT NULL DEFAULT 9,
    "nbMotsBleu" INTEGER NOT NULL DEFAULT 8,
    "equipeGagnante" TEXT,
    "indiceId" INTEGER,
    CONSTRAINT "Partie_indiceId_fkey" FOREIGN KEY ("indiceId") REFERENCES "Indice" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Partie_createurId_fkey" FOREIGN KEY ("createurId") REFERENCES "Utilisateur" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Indice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mot" TEXT NOT NULL,
    "nbmots" INTEGER NOT NULL,
    "membreEquipeUtilisateurId" INTEGER NOT NULL,
    "membreEquipePartieId" TEXT NOT NULL,
    CONSTRAINT "Indice_membreEquipeUtilisateurId_membreEquipePartieId_fkey" FOREIGN KEY ("membreEquipeUtilisateurId", "membreEquipePartieId") REFERENCES "MembreEquipe" ("utilisateurId", "partieId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MembreEquipe" (
    "utilisateurId" INTEGER NOT NULL,
    "partieId" TEXT NOT NULL,
    "equipe" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'AGENT',

    PRIMARY KEY ("utilisateurId", "partieId"),
    CONSTRAINT "MembreEquipe_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MembreEquipe_partieId_fkey" FOREIGN KEY ("partieId") REFERENCES "Partie" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Mot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mot" TEXT NOT NULL,
    "langue" TEXT NOT NULL DEFAULT 'fr'
);

-- CreateTable
CREATE TABLE "Selection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "utilisateurId" INTEGER NOT NULL,
    "carteId" INTEGER NOT NULL,
    "partieId" TEXT NOT NULL,
    CONSTRAINT "Selection_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Selection_carteId_fkey" FOREIGN KEY ("carteId") REFERENCES "Carte" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Carte" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "partieId" TEXT NOT NULL,
    "motId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "revelee" BOOLEAN NOT NULL DEFAULT false,
    "trouveeParEquipe" TEXT,
    CONSTRAINT "Carte_partieId_fkey" FOREIGN KEY ("partieId") REFERENCES "Partie" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Carte_motId_fkey" FOREIGN KEY ("motId") REFERENCES "Mot" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ActionJeu" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "partieId" TEXT NOT NULL,
    "utilisateurId" INTEGER NOT NULL,
    "equipe" TEXT NOT NULL,
    "typeAction" TEXT NOT NULL,
    "motDonne" TEXT,
    "nombreMots" INTEGER,
    "carteId" INTEGER,
    "resultat" TEXT,
    "dateAction" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ActionJeu_partieId_fkey" FOREIGN KEY ("partieId") REFERENCES "Partie" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ActionJeu_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ActionJeu_carteId_fkey" FOREIGN KEY ("carteId") REFERENCES "Carte" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Message" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "partieId" TEXT NOT NULL,
    "utilisateurId" INTEGER NOT NULL,
    "contenu" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "pseudo" TEXT NOT NULL,
    "dateMessage" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Message_partieId_fkey" FOREIGN KEY ("partieId") REFERENCES "Partie" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Message_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Reset" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
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
