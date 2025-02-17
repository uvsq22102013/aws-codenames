import { useState, useEffect } from "react";
import axios from "axios";
import { getUtilisateur } from '../../utils/utilisateurs';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

export default function Teams() {
  const [teamChoice, setTeamChoice] = useState<"ROUGE" | "BLEU">("ROUGE");
  const [playerType, setPlayerType] = useState<"MAITRE_ESPION" | "AGENT">("AGENT");
  const [clickedButton, setClickedButton] = useState("");
  const [error, setError] = useState("");
  const [blueTeam, setBlueTeam] = useState<{ pseudo: string, type: string }[]>([]);
  const [redTeam, setRedTeam] = useState<{ pseudo: string, type: string }[]>([]);

  const utilisateur = getUtilisateur();

  // Récupérer l'ID de la partie depuis le localStorage
  const storedGameId = localStorage.getItem("partieId");
  const gameId = storedGameId ? parseInt(storedGameId, 10) : null;

  useEffect(() => {
    if (gameId) {
      socket.emit('rejoindrePartie', { partieId: gameId });
    }

    socket.on('majEquipe', (data) => {
      const { team, type, pseudo } = data;
      console.log(`Utilisateur ${pseudo} a rejoint l'équipe ${team} en tant que ${type}`);

      updateTeams(pseudo, team, type);

    });

    return () => {
      socket.off('majEquipe');
    };
  }, [gameId]);

  const updateTeams = (pseudo: string, newTeam: "ROUGE" | "BLEU", type: string) => {
    setBlueTeam((prevBlueTeam) => prevBlueTeam.filter(player => player.pseudo !== pseudo));
    setRedTeam((prevRedTeam) => prevRedTeam.filter(player => player.pseudo !== pseudo));

    if (newTeam === "BLEU") {
      setBlueTeam((prevBlueTeam) => [...prevBlueTeam, { pseudo, type }]);
    } else if (newTeam === "ROUGE") {
      setRedTeam((prevRedTeam) => [...prevRedTeam, { pseudo, type }]);
    }
  };

  const handleChoice = async (team: "ROUGE" | "BLEU", type: "MAITRE_ESPION" | "AGENT", buttonName: string) => {
    try {
      await axios.post("http://localhost:3000/api/teams", {
        team,
        type,
        utilisateurId: utilisateur.id,
        partieId: gameId,
      });
  
      setTeamChoice(team);
      setPlayerType(type);
      setClickedButton(buttonName);

      socket.emit('choixEquipe', {
        team,
        type,
        pseudo: utilisateur.pseudo,
        partieId: gameId,
      });

    } catch (error: any) {
      if (error.response?.data?.error === "Déjà un MAITRE_ESPION") {
        alert("Il ne peut y avoir qu'un seul maître espion par équipe.");
      } else {
        setError(error.response?.data?.error || "Erreur de choix d'équipe.");
      }
    }
  };

  const handleBlueEspionClick = () => {
    handleChoice("BLEU", "MAITRE_ESPION", "blueEspion");

  };

  const handleBlueAgentClick = () => {
    handleChoice("BLEU", "AGENT", "blueAgent");
  };

  const handleRedEspionClick = () => {
    handleChoice("ROUGE", "MAITRE_ESPION", "redEspion");

  };

  const handleRedAgentClick = () => {
    handleChoice("ROUGE", "AGENT", "redAgent");
  };

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
            {blueTeam.map((player, index) => (
              <li key={index} className="flex justify-between items-center text-black text-lg bg-blue-500/30 p-1 rounded-lg">
                <span className="font-medium">{player.pseudo}</span>
                <span className="text-xs text-black uppercase">{player.type}</span>
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
            {redTeam.map((player, index) => (
              <li key={index} className="flex justify-between items-center text-black text-lg bg-red-500/30 p-1 rounded-lg">
                <span className="font-medium">{player.pseudo}</span>
                <span className="text-xs text-black uppercase">{player.type}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
