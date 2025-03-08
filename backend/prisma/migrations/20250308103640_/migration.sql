/*
  Warnings:

  - You are about to drop the column `selectionId` on the `Carte` table. All the data in the column will be lost.
  - Added the required column `carteId` to the `Selection` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Carte" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "partieId" INTEGER NOT NULL,
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
CREATE TABLE "new_Selection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "utilisateurId" INTEGER NOT NULL,
    "carteId" INTEGER NOT NULL,
    CONSTRAINT "Selection_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Selection_carteId_fkey" FOREIGN KEY ("carteId") REFERENCES "Carte" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Selection" ("id", "utilisateurId") SELECT "id", "utilisateurId" FROM "Selection";
DROP TABLE "Selection";
ALTER TABLE "new_Selection" RENAME TO "Selection";
CREATE UNIQUE INDEX "Selection_utilisateurId_carteId_key" ON "Selection"("utilisateurId", "carteId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
