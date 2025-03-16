import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getUtilisateur } from '../../utils/utilisateurs';
import { io } from 'socket.io-client';
import styles from "../styles/Login.module.css";


const socket = io(process.env.BACKEND_URL || 'http://localhost:3000');

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
  const utilisateur = getUtilisateur();

  const navigate = useNavigate();

  const storedPartie = localStorage.getItem("partie");
  let gameId: string | undefined, createurId: number | undefined;

  if (storedPartie) {
    const partie = JSON.parse(storedPartie);
    gameId = partie.id;
    createurId = partie.createurId;
  }


  // Requete pour récupérer les membres de la même partie dans la base de données
  const chargerMembres = async () => {
    try {  
      const res = await axios.get(`/api/teams/${gameId}`, {
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
      navigate(`/game/${gameId}`);
    });

    return () => {
      socket.off('majEquipe');
    };
  }, []);

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
    const blueEspionCount = joueurs.filter(joueur => joueur.equipe === "BLEU" && joueur.role === "MAITRE_ESPION").length;
    if (blueEspionCount < 2) {
      handleChoice("BLEU", "MAITRE_ESPION", "blueEspion");
    } else {
      alert("Il peut y avoir au maximum deux maître espions dans l'équipe bleue.");
    }
  };

  const handleBlueAgentClick = () => {
    handleChoice("BLEU", "AGENT", "blueAgent");
  };

  const handleRedEspionClick = () => {
    // On vérifie si il existe déjà un joueur espion dans l'équipe rouge avant de valider le choix d'équipe.
    const redEspionCount = joueurs.filter(joueur => joueur.equipe === "ROUGE" && joueur.role === "MAITRE_ESPION").length;
    if (redEspionCount < 2) {
      handleChoice("ROUGE", "MAITRE_ESPION", "redEspion");
    } else {
      alert("Il peut y avoir au maximum deux maître espions dans l'équipe rouge.");
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
    <section className={styles.section}>
      <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
      <div className="absolute left-0 w-1/2 h-full flex flex-col items-center justify-center gap-10">
      <div className="absolute top-8 left-4 z-[10] flex items-center space-x-2">
        <p className="text-white text-xl bg-gray-600 font-bold">Code Partie: {gameId}</p>
        <button
          className="bg-gray-600 text-white font-bold py-1 px-2 rounded hover:bg-gray-700"
          onClick={() => navigator.clipboard.writeText(gameId || '')}
        >
          Copier
        </button>
      </div>
        <h1 className="z-[10] text-blue-500 text-6xl font-bold absolute top-40">Equipe bleue</h1>
        <button className={`w-60 z-[10] px-10 py-5 text-black text-lg font-bold bg-blue-500 rounded-lg hover:bg-blue-800 transition ${clickedButton === "blueEspion" ? "bg-blue-800 cursor-not-allowed" : ""}`}
        onClick={clickedButton === "blueEspion" ? undefined : handleBlueEspionClick}
        >
            Maître espion
        </button>
        <button className={`w-60 z-[10] px-10 py-5 text-black text-lg font-bold bg-blue-500 rounded-lg hover:bg-blue-800 transition ${clickedButton === "blueAgent" ? "bg-blue-800 cursor-not-allowed" : ""}`}
        onClick={clickedButton === "blueAgent" ? undefined : handleBlueAgentClick}
        >
          Agent
        </button>
        <div className="absolute z-[10] bottom-10 bg-blue-500/60 backdrop-blur-md p-3 rounded-xl w-80">
          <h2 className="text-black text-xl font-semibold mb-2 border-b border-white/30 pb-1">
            Joueurs de l'équipe bleue
          </h2>
          <ul className="space-y-1">
            {blueTeam.map((player: Joueur, index: number) => (
              <li key={index} className="flex justify-between items-center text-black text-lg p-1 rounded-lg">
              <p className="font-semibold text-black uppercase">{player.utilisateur.pseudo}</p>
              <p className="font-semibold text-black uppercase">{player.role}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="absolute right-0 w-1/2 h-full flex flex-col items-center justify-center gap-10">
        <h1 className="z-[10] text-red-500 text-6xl font-bold absolute top-40">Equipe rouge</h1>
        <button className={`w-60 z-[10] px-10 py-5 text-black text-lg font-bold bg-red-500 rounded-lg hover:bg-red-800 transition ${clickedButton === "redEspion" ? "bg-red-800 cursor-not-allowed" : ""}`}
        onClick={clickedButton === "redEspion" ? undefined : handleRedEspionClick}
        >
            Maître espion
        </button>
        <button className={`w-60 z-[10] px-10 py-5 text-black text-lg font-bold bg-red-500 rounded-lg hover:bg-red-800 transition ${clickedButton === "redAgent" ? "bg-red-800 cursor-not-allowed" : ""}`}
        onClick={clickedButton === "redAgent" ? undefined : handleRedAgentClick}
        >
            Agent
        </button>
        <div className="absolute z-[10] bottom-10 bg-red-500/60 backdrop-blur-md p-3 rounded-xl w-80">
          <h2 className="text-black text-xl font-semibold mb-2 border-b border-white/30 pb-1">
            Joueurs de l'équipe rouge
          </h2>
          <ul className="space-y-1">
            {redTeam.map((player: Joueur, index: number) => (
            <li key={index} className="flex justify-between items-center text-black text-lg p-1 rounded-lg">
              <p className="font-semibold text-black uppercase">{player.utilisateur.pseudo}</p>
              <p className="font-semibold text-black uppercase">{player.role}</p>
            </li>
            ))}
          </ul>
        </div>
      </div>
      {utilisateur.id === createurId && (
        <button 
          className="absolute z-[10] top-10 bg-gray-600 text-white font-bold py-4 px-8 rounded hover:bg-gray-700 h-20 w-60"
          onClick={handleStartGame}
        >
          Lancer la partie
        </button>
      )}
    </section>
  );
}