import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getUtilisateur } from '../../utils/utilisateurs';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

interface Joueur {
  utilisateur: {
    pseudo: string;
  };
  equipe: "BLEU" | "ROUGE";
  role: string;
}

export default function Teams() {
  const [clickedButton, setClickedButton] = useState(""); // Variable qui nous servira pour l'affichage.
  const [joueurs, setJoueurs] = useState<Joueur[]>([]); // Tableau qui contiendra les joueurs de la même partie.
  const { partieId } = useParams();
  const gameId = Number(partieId);
  const utilisateur = getUtilisateur();
  const navigate = useNavigate();

  // On récupère l'id du créateur de la partie dans le localStorage.
  const storedCreatorId = localStorage.getItem("createurId");
  const createurId = storedCreatorId ? parseInt(storedCreatorId, 10) : null;

  // Requete pour récupérer les membres de la même partie dans la base de données
  const chargerMembres = async () => {
    try {  
      const res = await axios.get(`http://localhost:3000/api/teams/${gameId}`, {
      });
  
      setJoueurs(res.data);
    } catch (err) {
      console.error('Erreur chargement des membres :', err);
    }
  };

  useEffect(() => {
    if (gameId) {
      // On rejoint la room socket io pour recevoir les maj
      socket.emit('rejoindrePartie', { partieId: gameId });
      chargerMembres();
    }

    socket.on('majEquipe', () => {
      chargerMembres();
    });

    // On écoute si le créateur de la partie a lancé le jeu.
    socket.on('partieLancee', (data) => {
      console.log(`Partie ${data.partieId} lancée`);
      navigate(`/game/${data.partieId}`);
    });

    return () => {
      socket.off('majEquipe');
    };
  }, [gameId]);

  // Fonction appelée lors du choix d'une équipe suite à un clic sur un des boutons.
  const handleChoice = async (team: "ROUGE" | "BLEU", type: "MAITRE_ESPION" | "AGENT", buttonName: string) => {
    setClickedButton(buttonName);

    // Emission du choix avec socket io pour mettre à jour la BDD et informer les autres joueurs.
    if(gameId) {
      socket.emit('choixEquipe', {
        team,
        type,
        utilisateurId : utilisateur.id,
        partieId: gameId,
      });
    }

    chargerMembres();
  } 

  const handleBlueEspionClick = () => {
    // On vérifie si il existe déjà un joueur espion dans l'équipe bleue avant de valider le choix d'équipe.
    const blueEspionExists = joueurs.some(joueur => joueur.equipe === "BLEU" && joueur.role === "MAITRE_ESPION");
    if (!blueEspionExists) {
      handleChoice("BLEU", "MAITRE_ESPION", "blueEspion");
    } else {
      alert("Il ne peut y avoir qu'un seul maître espion dans l'équipe bleue.");
    }
  };

  const handleBlueAgentClick = () => {
    handleChoice("BLEU", "AGENT", "blueAgent");
  };

  const handleRedEspionClick = () => {
    // On vérifie si il existe déjà un joueur espion dans l'équipe rouge avant de valider le choix d'équipe.
    const redEspionExists = joueurs.some(joueur => joueur.equipe === "ROUGE" && joueur.role === "MAITRE_ESPION");
    if (!redEspionExists) {
      handleChoice("ROUGE", "MAITRE_ESPION", "redEspion");
    } else {
      alert("Il ne peut y avoir qu'un seul maître espion dans l'équipe rouge.");
    }
  };

  const handleRedAgentClick = () => {
    handleChoice("ROUGE", "AGENT", "redAgent");
  };

  // Renvoi sur la page de jeu lors du lancement de la partie par le créateur de la partie.
  const handleStartGame = () => {
    socket.emit('lancerPartie', { partieId: gameId, createurId });
    navigate(`/game/${gameId}`);
  };

  // Séparation des joueurs bleu et rouge contenus dans "joueurs".
  const blueTeam = joueurs.filter((joueur: Joueur) => joueur.equipe === "BLEU");
  const redTeam = joueurs.filter((joueur: Joueur) => joueur.equipe === "ROUGE");
  
  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-blue-500 flex flex-col items-center justify-center space-y-5 relative">
        <h1 className="text-black text-5xl font-bold absolute top-40">Equipe bleue</h1>
        <button 
          className={`bg-yellow-500 text-black font-bold py-4 px-8 rounded w-60 ${clickedButton === "blueEspion" ? "bg-yellow-700 cursor-not-allowed" : ""}`}
          onClick={clickedButton === "blueEspion" ? undefined : handleBlueEspionClick}
        >
          Espion
        </button>
        <button 
          className={`bg-yellow-500 text-black font-bold py-4 px-8 rounded w-60 ${clickedButton === "blueAgent" ? "bg-yellow-700 cursor-not-allowed" : ""}`}
          onClick={clickedButton === "blueAgent" ? undefined : handleBlueAgentClick}
        >
          Agent
        </button>
        <div className="absolute bottom-10 left-10 bg-white/20 backdrop-blur-md p-3 rounded-xl shadow-lg border border-white/30 w-60">
          <h2 className="text-black text-xl font-semibold mb-2 border-b border-white/30 pb-1">
            Joueurs de l'équipe bleue
          </h2>
          <ul className="space-y-1">
            {blueTeam.map((player: Joueur, index: number) => (
              <li key={index} className="flex justify-between items-center text-black text-lg bg-blue-500/30 p-1 rounded-lg">
              <span className="font-medium">{player.utilisateur.pseudo}</span>
              <span className="text-xs text-black uppercase">{player.role}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="w-1/2 bg-red-500 flex flex-col items-center justify-center space-y-5 relative">
        <h1 className="text-black text-5xl font-bold absolute top-40">Equipe rouge</h1>
        <button 
          className={`bg-yellow-500 text-black font-bold py-4 px-8 rounded w-60 ${clickedButton === "redEspion" ? "bg-yellow-700 cursor-not-allowed" : ""}`}
          onClick={clickedButton === "redEspion" ? undefined : handleRedEspionClick}
        >
          Espion
        </button>
        <button 
          className={`bg-yellow-500 text-black font-bold py-4 px-8 rounded w-60 ${clickedButton === "redAgent" ? "bg-yellow-700 cursor-not-allowed" : ""}`}
          onClick={clickedButton === "redAgent" ? undefined : handleRedAgentClick}
        >
          Agent
        </button>
        <div className="absolute bottom-10 left-10 bg-white/20 backdrop-blur-md p-3 rounded-xl shadow-lg border border-white/30 w-60">
          <h2 className="text-black text-xl font-semibold mb-2 border-b border-white/30 pb-1">
            Joueurs de l'équipe rouge
          </h2>
          <ul className="space-y-1">
            {redTeam.map((player: Joueur, index: number) => (
              <li key={index} className="flex justify-between items-center text-black text-lg bg-red-500/30 p-1 rounded-lg">
              <span className="font-medium">{player.utilisateur.pseudo}</span>
              <span className="text-xs text-black uppercase">{player.role}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {utilisateur.id === createurId && (
        <button 
          className="absolute bottom-10 right-10 bg-yellow-500 text-white font-bold py-4 px-8 rounded"
          onClick={handleStartGame}
        >
          Lancer la partie
        </button>
      )}
    </div>
  );
}