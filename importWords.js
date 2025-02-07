const fs = require('fs');
const db = require('./db');

const importWords = (filePath, lang) => {
    const words = fs.readFileSync(filePath, 'utf8').split('\n').map(w => w.trim()).filter(w => w !== '');

    db.serialize(() => {
        const stmt = db.prepare(`INSERT OR IGNORE INTO mot (mot, langue) VALUES (?, ?)`); // Ignorer les doublons
        words.forEach(word => {
            stmt.run(word, lang, (err) => {
                if (err) console.error(`❌ Erreur insertion : ${word} -> ${err.message}`);
            });
        });
        stmt.finalize();
        console.log(`✅ ${words.length} mots (${lang}) ajoutés ou ignorés (s'ils existent déjà) !`);
    });
};

importWords('./data/mots_fr.txt', 'fr');
importWords('./data/mots_en.txt', 'en');

db.close();