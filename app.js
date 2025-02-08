const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let compteur = 0;

app.use(express.static("public"));

io.on("connection", (socket) => {
    console.log("Un joueur s'est connecté !");

    socket.emit("majCompteur", compteur);

    socket.on("incrementer", () => {
        compteur++; 
        io.emit("majCompteur", compteur);
    });

    socket.on("disconnect", () => {
        console.log("Un joueur s'est déconnecté.");
    });
});

server.listen(3000, () => {
    console.log("Serveur démarré sur http://localhost:3000");
});
