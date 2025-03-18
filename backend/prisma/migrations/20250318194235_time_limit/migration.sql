-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Reset" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Reset" ("code", "email", "id") SELECT "code", "email", "id" FROM "Reset";
DROP TABLE "Reset";
ALTER TABLE "new_Reset" RENAME TO "Reset";
CREATE UNIQUE INDEX "Reset_email_key" ON "Reset"("email");
CREATE UNIQUE INDEX "Reset_code_key" ON "Reset"("code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
