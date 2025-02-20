-- CreateTable
CREATE TABLE "Indice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mot" TEXT NOT NULL,
    "nbmots" INTEGER NOT NULL,
    "membreEquipeUtilisateurId" INTEGER NOT NULL,
    "membreEquipePartieId" INTEGER NOT NULL,
    CONSTRAINT "Indice_membreEquipeUtilisateurId_membreEquipePartieId_fkey" FOREIGN KEY ("membreEquipeUtilisateurId", "membreEquipePartieId") REFERENCES "MembreEquipe" ("utilisateurId", "partieId") ON DELETE RESTRICT ON UPDATE CASCADE
);

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
    "indiceId" INTEGER,
    CONSTRAINT "Partie_indiceId_fkey" FOREIGN KEY ("indiceId") REFERENCES "Indice" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Partie_createurId_fkey" FOREIGN KEY ("createurId") REFERENCES "Utilisateur" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Partie" ("createurId", "dateCreation", "equipeEnCours", "id", "langue", "roleEncours", "statut") SELECT "createurId", "dateCreation", "equipeEnCours", "id", "langue", "roleEncours", "statut" FROM "Partie";
DROP TABLE "Partie";
ALTER TABLE "new_Partie" RENAME TO "Partie";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
