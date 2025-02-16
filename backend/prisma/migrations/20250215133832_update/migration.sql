/*
  Warnings:

  - Added the required column `selectionId` to the `Carte` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Selection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "utilisateurId" INTEGER NOT NULL
);

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
    "selectionId" INTEGER NOT NULL,
    CONSTRAINT "Carte_selectionId_fkey" FOREIGN KEY ("selectionId") REFERENCES "Selection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Carte_partieId_fkey" FOREIGN KEY ("partieId") REFERENCES "Partie" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Carte_motId_fkey" FOREIGN KEY ("motId") REFERENCES "Mot" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Carte" ("id", "motId", "partieId", "revelee", "trouveeParEquipe", "type") SELECT "id", "motId", "partieId", "revelee", "trouveeParEquipe", "type" FROM "Carte";
DROP TABLE "Carte";
ALTER TABLE "new_Carte" RENAME TO "Carte";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
