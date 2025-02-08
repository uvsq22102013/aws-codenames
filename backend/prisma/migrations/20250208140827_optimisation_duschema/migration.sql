/*
  Warnings:

  - You are about to drop the `Equipe` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Indice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tour` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `equipeId` on the `MembreEquipe` table. All the data in the column will be lost.
  - Added the required column `equipe` to the `MembreEquipe` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Equipe";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Indice";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Tour";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ActionJeu" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "partieId" INTEGER NOT NULL,
    "utilisateurId" INTEGER NOT NULL,
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

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MembreEquipe" (
    "utilisateurId" INTEGER NOT NULL,
    "partieId" INTEGER NOT NULL,
    "equipe" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'AGENT',

    PRIMARY KEY ("utilisateurId", "partieId"),
    CONSTRAINT "MembreEquipe_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MembreEquipe_partieId_fkey" FOREIGN KEY ("partieId") REFERENCES "Partie" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_MembreEquipe" ("partieId", "role", "utilisateurId") SELECT "partieId", "role", "utilisateurId" FROM "MembreEquipe";
DROP TABLE "MembreEquipe";
ALTER TABLE "new_MembreEquipe" RENAME TO "MembreEquipe";
CREATE TABLE "new_Partie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "statut" TEXT NOT NULL DEFAULT 'EN_ATTENTE',
    "createurId" INTEGER NOT NULL,
    "dateCreation" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Partie_createurId_fkey" FOREIGN KEY ("createurId") REFERENCES "Utilisateur" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Partie" ("createurId", "dateCreation", "id", "statut") SELECT "createurId", "dateCreation", "id", "statut" FROM "Partie";
DROP TABLE "Partie";
ALTER TABLE "new_Partie" RENAME TO "Partie";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
