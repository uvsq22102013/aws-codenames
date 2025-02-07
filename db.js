const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Chemin vers la base SQLite
const DB_PATH = path.join(__dirname, 'codenames.db');

// Création de la connexion
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error("Erreur de connexion à SQLite :", err.message);
    } else {
        console.log("Connecté à SQLite !");
    }
});

module.exports = db;