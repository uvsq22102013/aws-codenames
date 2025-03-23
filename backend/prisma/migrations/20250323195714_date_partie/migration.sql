-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Partie" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "statut" TEXT NOT NULL DEFAULT 'EN_ATTENTE',
    "createurId" INTEGER NOT NULL,
    "dateCreation" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "equipeEnCours" TEXT NOT NULL DEFAULT 'ROUGE',
    "roleEncours" TEXT NOT NULL DEFAULT 'MAITRE_ESPION',
    "langue" TEXT NOT NULL DEFAULT 'fr',
    "nbMotsRouge" INTEGER NOT NULL DEFAULT 9,
    "nbMotsBleu" INTEGER NOT NULL DEFAULT 8,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "equipeGagnante" TEXT,
    "indiceId" INTEGER,
    CONSTRAINT "Partie_indiceId_fkey" FOREIGN KEY ("indiceId") REFERENCES "Indice" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Partie_createurId_fkey" FOREIGN KEY ("createurId") REFERENCES "Utilisateur" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Partie" ("createurId", "dateCreation", "equipeEnCours", "equipeGagnante", "id", "indiceId", "langue", "nbMotsBleu", "nbMotsRouge", "roleEncours", "statut") SELECT "createurId", "dateCreation", "equipeEnCours", "equipeGagnante", "id", "indiceId", "langue", "nbMotsBleu", "nbMotsRouge", "roleEncours", "statut" FROM "Partie";
DROP TABLE "Partie";
ALTER TABLE "new_Partie" RENAME TO "Partie";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
