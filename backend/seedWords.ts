import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const readWordsFromFile = (filePath: string): string[] => {
    try {
        const words = fs.readFileSync(filePath, 'utf8')
            .split('\n')
            .map(word => word.trim())
            .filter(word => word.length > 0);
        return words;
    } catch (error) {
        console.error(`Erreur lecture fichier ${filePath}`, error);
        return [];
    }
};

const importWords = async (filePath: string, lang: string) => {
    const words = readWordsFromFile(filePath);
    if (words.length === 0) return;

    console.log(`Insertion de ${words.length} mots (${lang})...`);

    for (const word of words) {
        try {
            await prisma.mot.create({ data: { mot: word, langue: lang } });
        } catch {
            console.error(`Mot déjà en base : ${word}`);
        }
    }
};

const seedDatabase = async () => {
    console.log("Importation des mots...");
    await importWords(path.join(__dirname, 'data/mots_fr.txt'), 'fr');
    await importWords(path.join(__dirname, 'data/mots_en.txt'), 'en');
    console.log("Importation terminée !");
    await prisma.$disconnect();
};

seedDatabase();
