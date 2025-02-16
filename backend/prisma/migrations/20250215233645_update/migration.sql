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
    "selectionId" INTEGER,
    CONSTRAINT "Carte_partieId_fkey" FOREIGN KEY ("partieId") REFERENCES "Partie" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Carte_motId_fkey" FOREIGN KEY ("motId") REFERENCES "Mot" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Carte_selectionId_fkey" FOREIGN KEY ("selectionId") REFERENCES "Selection" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Carte" ("id", "motId", "partieId", "revelee", "selectionId", "trouveeParEquipe", "type") SELECT "id", "motId", "partieId", "revelee", "selectionId", "trouveeParEquipe", "type" FROM "Carte";
DROP TABLE "Carte";
ALTER TABLE "new_Carte" RENAME TO "Carte";
CREATE TABLE "new_Partie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "statut" TEXT NOT NULL DEFAULT 'EN_ATTENTE',
    "createurId" INTEGER NOT NULL,
    "dateCreation" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "equipeEnCours" TEXT,
    "roleEncours" TEXT,
    "langue" TEXT NOT NULL DEFAULT 'fr',
    CONSTRAINT "Partie_createurId_fkey" FOREIGN KEY ("createurId") REFERENCES "Utilisateur" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Partie" ("createurId", "dateCreation", "equipeEnCours", "id", "roleEncours", "statut") SELECT "createurId", "dateCreation", "equipeEnCours", "id", "roleEncours", "statut" FROM "Partie";
DROP TABLE "Partie";
ALTER TABLE "new_Partie" RENAME TO "Partie";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
