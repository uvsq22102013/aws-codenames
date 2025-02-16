-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Partie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "statut" TEXT NOT NULL DEFAULT 'EN_ATTENTE',
    "createurId" INTEGER NOT NULL,
    "dateCreation" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "equipeEnCours" TEXT NOT NULL DEFAULT 'ROUGE',
    "roleEncours" TEXT NOT NULL DEFAULT 'MAITRE_ESPION',
    "langue" TEXT NOT NULL DEFAULT 'fr',
    CONSTRAINT "Partie_createurId_fkey" FOREIGN KEY ("createurId") REFERENCES "Utilisateur" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Partie" ("createurId", "dateCreation", "equipeEnCours", "id", "langue", "roleEncours", "statut") SELECT "createurId", "dateCreation", coalesce("equipeEnCours", 'ROUGE') AS "equipeEnCours", "id", "langue", coalesce("roleEncours", 'MAITRE_ESPION') AS "roleEncours", "statut" FROM "Partie";
DROP TABLE "Partie";
ALTER TABLE "new_Partie" RENAME TO "Partie";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
