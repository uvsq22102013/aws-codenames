/*
  Warnings:

  - Added the required column `equipe` to the `ActionJeu` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Carte" ADD COLUMN "trouveeParEquipe" TEXT;

-- AlterTable
ALTER TABLE "Partie" ADD COLUMN "equipeEnCours" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ActionJeu" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "partieId" INTEGER NOT NULL,
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
INSERT INTO "new_ActionJeu" ("carteId", "dateAction", "id", "motDonne", "nombreMots", "partieId", "resultat", "typeAction", "utilisateurId") SELECT "carteId", "dateAction", "id", "motDonne", "nombreMots", "partieId", "resultat", "typeAction", "utilisateurId" FROM "ActionJeu";
DROP TABLE "ActionJeu";
ALTER TABLE "new_ActionJeu" RENAME TO "ActionJeu";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
