-- DropForeignKey
ALTER TABLE "Indice" DROP CONSTRAINT "Indice_membreEquipeUtilisateurId_membreEquipePartieId_fkey";

-- AddForeignKey
ALTER TABLE "Indice" ADD CONSTRAINT "Indice_membreEquipeUtilisateurId_membreEquipePartieId_fkey" FOREIGN KEY ("membreEquipeUtilisateurId", "membreEquipePartieId") REFERENCES "MembreEquipe"("utilisateurId", "partieId") ON DELETE CASCADE ON UPDATE CASCADE;
