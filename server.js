require('dotenv').config();
console.log("Connexion aux variables d'environnement...");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_NAME:", process.env.DB_NAME);
require('dotenv').config();
const express = require('express');
const connection = require('./db'); // Importer la connexion MySQL

const app = express();
app.use(express.json()); // Permet d’envoyer des données JSON

// 📌 Route pour récupérer tous les utilisateurs
app.get('/utilisateurs', (req, res) => {
    connection.query('SELECT * FROM utilisateurs', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// 📌 Route pour ajouter un utilisateur
app.post('/utilisateurs', (req, res) => {
    const { nom, email } = req.body;
    if (!nom || !email) {
        return res.status(400).json({ error: 'Nom et email sont obligatoires' });
    }

    connection.query('INSERT INTO utilisateurs (nom, email) VALUES (?, ?)', [nom, email], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Utilisateur ajouté avec succès', id: results.insertId });
    });
});

// 📌 Route pour supprimer un utilisateur
app.delete('/utilisateurs/:id', (req, res) => {
    const { id } = req.params;

    connection.query('DELETE FROM utilisateurs WHERE id = ?', [id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Utilisateur supprimé avec succès' });
    });
});

// Lancer le serveur sur le port 3000
app.listen(3000, () => {
    console.log('🚀 Serveur en écoute sur http://localhost:3000');
});
