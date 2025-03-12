/*
  Warnings:

  - Added the required column `partieId` to the `Selection` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Selection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "utilisateurId" INTEGER NOT NULL,
    "carteId" INTEGER NOT NULL,
    "partieId" INTEGER NOT NULL,
    CONSTRAINT "Selection_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Selection_carteId_fkey" FOREIGN KEY ("carteId") REFERENCES "Carte" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Selection" ("carteId", "id", "utilisateurId") SELECT "carteId", "id", "utilisateurId" FROM "Selection";
DROP TABLE "Selection";
ALTER TABLE "new_Selection" RENAME TO "Selection";
CREATE UNIQUE INDEX "Selection_utilisateurId_carteId_key" ON "Selection"("utilisateurId", "carteId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
