const socket = io();

function enregistrerJoueur(joueur) {
    localStorage.setItem("joueurChoisi", joueur);
    document.getElementById("resultat").innerText = "Joueur enregistré : " + joueur;
}

window.onload = function() {
    let joueur = localStorage.getItem("joueurChoisi");
    if (joueur) {
        document.getElementById("resultat").innerText = "Joueur enregistré : " + joueur;
    }
};

function supprimerJoueur() {
    localStorage.removeItem("joueurChoisi");
    document.getElementById("resultat").innerText = "Aucun joueur enregistré";
}

socket.on("majCompteur", (valeur) => {
    let cpt = document.getElementById("compteur")
    cpt.innerText = valeur;
    let joueur = localStorage.getItem("joueurChoisi");
});

document.getElementById("bouton").addEventListener("click", () => {
    socket.emit("incrementer");
});