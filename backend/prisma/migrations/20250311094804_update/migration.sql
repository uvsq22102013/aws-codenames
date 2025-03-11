/*
  Warnings:

  - The primary key for the `MembreEquipe` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Partie` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ActionJeu" (
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
INSERT INTO "new_ActionJeu" ("carteId", "dateAction", "equipe", "id", "motDonne", "nombreMots", "partieId", "resultat", "typeAction", "utilisateurId") SELECT "carteId", "dateAction", "equipe", "id", "motDonne", "nombreMots", "partieId", "resultat", "typeAction", "utilisateurId" FROM "ActionJeu";
DROP TABLE "ActionJeu";
ALTER TABLE "new_ActionJeu" RENAME TO "ActionJeu";
CREATE TABLE "new_Carte" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "partieId" TEXT NOT NULL,
    "motId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "revelee" BOOLEAN NOT NULL DEFAULT false,
    "trouveeParEquipe" TEXT,
    CONSTRAINT "Carte_partieId_fkey" FOREIGN KEY ("partieId") REFERENCES "Partie" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Carte_motId_fkey" FOREIGN KEY ("motId") REFERENCES "Mot" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Carte" ("id", "motId", "partieId", "revelee", "trouveeParEquipe", "type") SELECT "id", "motId", "partieId", "revelee", "trouveeParEquipe", "type" FROM "Carte";
DROP TABLE "Carte";
ALTER TABLE "new_Carte" RENAME TO "Carte";
CREATE TABLE "new_Indice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mot" TEXT NOT NULL,
    "nbmots" INTEGER NOT NULL,
    "membreEquipeUtilisateurId" INTEGER NOT NULL,
    "membreEquipePartieId" TEXT NOT NULL,
    CONSTRAINT "Indice_membreEquipeUtilisateurId_membreEquipePartieId_fkey" FOREIGN KEY ("membreEquipeUtilisateurId", "membreEquipePartieId") REFERENCES "MembreEquipe" ("utilisateurId", "partieId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Indice" ("id", "membreEquipePartieId", "membreEquipeUtilisateurId", "mot", "nbmots") SELECT "id", "membreEquipePartieId", "membreEquipeUtilisateurId", "mot", "nbmots" FROM "Indice";
DROP TABLE "Indice";
ALTER TABLE "new_Indice" RENAME TO "Indice";
CREATE TABLE "new_MembreEquipe" (
    "utilisateurId" INTEGER NOT NULL,
    "partieId" TEXT NOT NULL,
    "equipe" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'AGENT',

    PRIMARY KEY ("utilisateurId", "partieId"),
    CONSTRAINT "MembreEquipe_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MembreEquipe_partieId_fkey" FOREIGN KEY ("partieId") REFERENCES "Partie" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_MembreEquipe" ("equipe", "partieId", "role", "utilisateurId") SELECT "equipe", "partieId", "role", "utilisateurId" FROM "MembreEquipe";
DROP TABLE "MembreEquipe";
ALTER TABLE "new_MembreEquipe" RENAME TO "MembreEquipe";
CREATE TABLE "new_Message" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "partieId" TEXT NOT NULL,
    "utilisateurId" INTEGER NOT NULL,
    "contenu" TEXT NOT NULL,
    "dateMessage" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Message_partieId_fkey" FOREIGN KEY ("partieId") REFERENCES "Partie" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Message_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Message" ("contenu", "dateMessage", "id", "partieId", "utilisateurId") SELECT "contenu", "dateMessage", "id", "partieId", "utilisateurId" FROM "Message";
DROP TABLE "Message";
ALTER TABLE "new_Message" RENAME TO "Message";
CREATE TABLE "new_Partie" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "statut" TEXT NOT NULL DEFAULT 'EN_ATTENTE',
    "createurId" INTEGER NOT NULL,
    "dateCreation" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "equipeEnCours" TEXT NOT NULL DEFAULT 'ROUGE',
    "roleEncours" TEXT NOT NULL DEFAULT 'MAITRE_ESPION',
    "langue" TEXT NOT NULL DEFAULT 'fr',
    "equipeGagnante" TEXT,
    "indiceId" INTEGER,
    "codePartie" TEXT NOT NULL,
    CONSTRAINT "Partie_indiceId_fkey" FOREIGN KEY ("indiceId") REFERENCES "Indice" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Partie_createurId_fkey" FOREIGN KEY ("createurId") REFERENCES "Utilisateur" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Partie" ("codePartie", "createurId", "dateCreation", "equipeEnCours", "equipeGagnante", "id", "indiceId", "langue", "roleEncours", "statut") SELECT "codePartie", "createurId", "dateCreation", "equipeEnCours", "equipeGagnante", "id", "indiceId", "langue", "roleEncours", "statut" FROM "Partie";
DROP TABLE "Partie";
ALTER TABLE "new_Partie" RENAME TO "Partie";
CREATE UNIQUE INDEX "Partie_codePartie_key" ON "Partie"("codePartie");
CREATE TABLE "new_Selection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "utilisateurId" INTEGER NOT NULL,
    "carteId" INTEGER NOT NULL,
    "partieId" TEXT NOT NULL,
    CONSTRAINT "Selection_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Selection_carteId_fkey" FOREIGN KEY ("carteId") REFERENCES "Carte" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Selection" ("carteId", "id", "partieId", "utilisateurId") SELECT "carteId", "id", "partieId", "utilisateurId" FROM "Selection";
DROP TABLE "Selection";
ALTER TABLE "new_Selection" RENAME TO "Selection";
CREATE UNIQUE INDEX "Selection_utilisateurId_carteId_key" ON "Selection"("utilisateurId", "carteId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
