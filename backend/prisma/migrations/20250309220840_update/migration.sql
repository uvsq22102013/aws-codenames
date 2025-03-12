/*
  Warnings:

  - A unique constraint covering the columns `[codePartie]` on the table `Partie` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Partie_codePartie_key" ON "Partie"("codePartie");
