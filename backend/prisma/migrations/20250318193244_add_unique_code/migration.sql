/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Reset` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Reset_code_key" ON "Reset"("code");
