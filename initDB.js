const db = require('./db');

db.serialize(() => {
    console.log("🛠 Création des tables...");

    // Table des utilisateurs
    db.run(`CREATE TABLE IF NOT EXISTS utilisateur (
        id_utilisateur INTEGER PRIMARY KEY AUTOINCREMENT,
        pseudo TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        mdp_hash TEXT NOT NULL,
        date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    // Table des parties
    db.run(`CREATE TABLE IF NOT EXISTS partie (
        id_partie INTEGER PRIMARY KEY AUTOINCREMENT,
        statut TEXT CHECK(statut IN ('en attente', 'en cours', 'terminée')) DEFAULT 'en attente',
        id_createur INTEGER,
        date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_createur) REFERENCES utilisateur(id_utilisateur)
    )`);

    // Table des équipes
    db.run(`CREATE TABLE IF NOT EXISTS equipe (
        id_equipe INTEGER PRIMARY KEY AUTOINCREMENT,
        couleur TEXT CHECK(couleur IN ('Rouge', 'Bleu')) NOT NULL,
        id_partie INTEGER,
        FOREIGN KEY (id_partie) REFERENCES partie(id_partie) ON DELETE CASCADE
    )`);

    // Table des membres d'une équipe
    db.run(`CREATE TABLE IF NOT EXISTS membre_equipe (
        id_utilisateur INTEGER,
        id_partie INTEGER,
        role TEXT CHECK(role IN ('maître-espion', 'agent')) NOT NULL,
        PRIMARY KEY (id_utilisateur, id_partie),
        FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE,
        FOREIGN KEY (id_partie) REFERENCES partie(id_partie) ON DELETE CASCADE
    )`);

    // Table des mots
    db.run(`CREATE TABLE IF NOT EXISTS mot (
        id_mot INTEGER PRIMARY KEY AUTOINCREMENT,
        mot TEXT UNIQUE NOT NULL,
        langue TEXT CHECK(langue IN ('fr', 'en')) NOT NULL
    )`);

    // Table des cartes (mots affichés sur la grille)
    db.run(`CREATE TABLE IF NOT EXISTS carte (
        id_carte INTEGER PRIMARY KEY AUTOINCREMENT,
        id_partie INTEGER,
        id_mot INTEGER,
        type TEXT CHECK(type IN ('Rouge', 'Bleu', 'Neutre', 'Assassin')) NOT NULL,
        révélée BOOLEAN DEFAULT 0,
        FOREIGN KEY (id_partie) REFERENCES partie(id_partie) ON DELETE CASCADE,
        FOREIGN KEY (id_mot) REFERENCES mot(id_mot) ON DELETE CASCADE
    )`);

    // Table des indices
    db.run(`CREATE TABLE IF NOT EXISTS indice (
        id_indice INTEGER PRIMARY KEY AUTOINCREMENT,
        id_partie INTEGER,
        id_utilisateur INTEGER,
        mot_donné TEXT NOT NULL,
        nombre_mots INTEGER NOT NULL,
        date_indice TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_partie) REFERENCES partie(id_partie) ON DELETE CASCADE,
        FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE
    )`);

    // Table des tours
    db.run(`CREATE TABLE IF NOT EXISTS tour (
        id_tour INTEGER PRIMARY KEY AUTOINCREMENT,
        id_partie INTEGER,
        id_utilisateur INTEGER,
        id_carte INTEGER,
        résultat TEXT CHECK(résultat IN ('correct', 'incorrect', 'assassin')) NOT NULL,
        date_tour TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_partie) REFERENCES partie(id_partie) ON DELETE CASCADE,
        FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE,
        FOREIGN KEY (id_carte) REFERENCES carte(id_carte) ON DELETE CASCADE
    )`);

    // Table des messages du chat
    db.run(`CREATE TABLE IF NOT EXISTS message (
        id_message INTEGER PRIMARY KEY AUTOINCREMENT,
        id_partie INTEGER,
        id_utilisateur INTEGER,
        contenu TEXT NOT NULL,
        date_message TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_partie) REFERENCES partie(id_partie) ON DELETE CASCADE,
        FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE
    )`);

    console.log("✅ Toutes les tables ont été créées !");
});

db.close();