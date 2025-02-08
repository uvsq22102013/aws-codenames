/*
  Warnings:

  - A unique constraint covering the columns `[mot,langue]` on the table `Mot` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Mot_mot_key";

-- CreateIndex
CREATE UNIQUE INDEX "Mot_mot_langue_key" ON "Mot"("mot", "langue");
