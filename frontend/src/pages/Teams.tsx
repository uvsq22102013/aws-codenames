import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getUtilisateur } from '../../utils/utilisateurs';
import styles from "../styles/Teams.module.css";
import { useLanguage } from "../Context/LanguageContext";
import quitterPartie, { chargerAutorisation } from "./Game";
import socket from '../../utils/socket';

interface Joueur {
  utilisateur: {
    pseudo: string;
  };
  equipe: "BLEU" | "ROUGE";
  role: string;
}
export const getPartieId = () => {
  return JSON.parse(sessionStorage.getItem("partie") || "{}").id;
};
export const getPartieStatut = () => {
  return JSON.parse(sessionStorage.getItem("partie") || "{}").statut;
};

export default function Teams() {
  const navigate = useNavigate(); 

  useEffect(() => {
    const checkAuthorization = async () => {
      if (!(await chargerAutorisation())) {
        sessionStorage.removeItem("partie");
        navigate("/join");
      }
    };
    checkAuthorization();
  }, [navigate]);
  const [clickedButton, setClickedButton] = useState(""); // Variable qui nous servira pour l'affichage.
  const [joueurs, setJoueurs] = useState<Joueur[]>([]); // Tableau qui contiendra les joueurs de la même partie.
  const utilisateur = getUtilisateur();
  const [startErrorMessage, setStartErrorMessage] = useState<string | null>(null);
  const [partie, setPartie] = useState<any>(null);
  let quiter = false;


  const storedPartie = sessionStorage.getItem("partie");
  let gameId: string | undefined, createurId: number | undefined;

  if (storedPartie) {
    const partie = JSON.parse(storedPartie);
    gameId = partie.id;
    createurId = partie.createurId;
  }



//chargement de la langue
const { language } = useLanguage(); 

const texts: { [key in "fr" | "en" | "ar"]: { [key: string]: string } } = {
  fr: {
    choisirEquipe: "Choisissez votre équipe",
    copier: "Copier le code",
    lancerPartie: "Lancer la partie",
    maitreEspion: "Maître Espion",
    joueursEquipeBleue: "Joueurs de l'équipe bleue",
    joueursEquipeRouge: "Joueurs de l'équipe rouge",
    agent: "Agent",
    maximumAgents: "Il ne peut y avoir que 4 agents par équipe.",
    equipebleue: "Equipe bleue",
    equiperouge: "Equipe rouge",
    codepartie: "Code Partie:",
    quitter : "Quitter la partie",
    errorStartGame: "Chaque équipe doit avoir au moins un espion et un agent.",
  },
  en: {
    choisirEquipe: "Choose your team",
    copier: "Copy the code",
    lancerPartie: "Start game",
    maitreEspion: "Master Spy",
    joueursEquipeBleue: "Blue team players",
    joueursEquipeRouge: "Red team players",
    agent: "Agent",
    maximumAgents: "There can only be 4 agents per team.",
    equipebleue: "Blue team",
    equiperouge: "Red team",
    codepartie: "Game Code:",
    quitter : "Leave the game",
    errorStartGame: "Each team must have at least one spy and one agent.",
  },
  ar: {
    choisirEquipe: "اختر فريقك",
    copier: "انسخ الكود",
    lancerPartie: "بدء اللعبة",
    maitreEspion: "ماستر اسبيون",
    joueursEquipeBleue: "لاعبي الفريق الأزرق",
    joueursEquipeRouge: "لاعبي الفريق الأحمر",
    agent: "وكيل",
    maximumAgents: "لا يمكن أن يكون هناك سوى 4 وكلاء لكل فريق.",
    equipebleue: "الفريق الأزرق",
    equiperouge: "الفريق الأحمر",
    codepartie: "رمز اللعبة:",
    quitter : "مغادرة اللعبة",
    errorStartGame: "يجب أن يكون لكل فريق جاسوس واحد ووكيل واحد على الأقل.",
  },
};



  // Requete pour récupérer les membres de la même partie dans la base de données
  const chargerMembres = async () => {
    try {
      const res = await axios.get(`/api/teams/${gameId}`, {
        withCredentials: true,
      });
      
      setJoueurs(res.data);
    } catch (err) {
      console.error('Erreur chargement des membres :', err);
    }
  };

  const chargerPartie = async () => {
    try {

      if (getPartieId() && !quiter){
        const res = await axios.get(`/api/parties/${getPartieId()}`, {
          withCredentials: true,
        });
    
        if (res.status !== 200) throw new Error(`Erreur HTTP : ${res.status}`);
        const data = res.data;
        setPartie(data);
        sessionStorage.setItem('partie', JSON.stringify(data));
      }

    } catch (err) {
      console.error('erreur chargement partie :', err);
    }
  };
  useEffect(() => {

    if (gameId) {
      // On rejoint la room socket io pour recevoir les maj
      socket.emit('rejoindrePartie', { partieId: gameId });
      chargerMembres();
      chargerPartie();
    }
    if (getPartieStatut() === "EN_COURS") {
      navigate(`/game/${gameId}`);
    }
    if (getPartieStatut() === "TERMINEE") {
      navigate(`/join`);
    }
    socket.on('majEquipe', () => {
      chargerPartie();
      chargerMembres();
    });

    // On écoute si le créateur de la partie a lancé le jeu.
    socket.on('partieLancee', (data:any) => {
      chargerPartie();
      console.log(`Partie ${data.partieId} lancée`);
      navigate(`/game/${gameId}`);
    });
    const intervalId = setInterval(() => {
      chargerMembres();

      chargerPartie();
    }, 9000);
    


    return () => {
      socket.off('majEquipe');
      socket.off('partieLancee');
      clearInterval(intervalId); 

    };
  }, [ gameId , partie]);

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
    handleChoice("BLEU", "MAITRE_ESPION", "blueEspion");
  };

  const handleBlueAgentClick = () => {
    const blueAgentCount = joueurs.filter(joueur => joueur.equipe === "BLEU" && joueur.role === "AGENT").length;
    if (blueAgentCount < 4) {
      handleChoice("BLEU", "AGENT", "blueAgent");
    } else {
      alert(texts[language].maximumAgents);
    }
  };

  const handleRedEspionClick = () => {
      handleChoice("ROUGE", "MAITRE_ESPION", "redEspion");
  };

  const handleRedAgentClick = () => {
    const redAgentCount = joueurs.filter(joueur => joueur.equipe === "ROUGE" && joueur.role === "AGENT").length;
    if (redAgentCount < 4) {
      handleChoice("ROUGE", "AGENT", "redAgent");
    } else {
      alert(texts[language].maximumAgents);
    }
  };

  // Renvoi sur la page de jeu lors du lancement de la partie par le créateur de la partie.
  const handleStartGame = () => {
    const blueEspions = blueTeam.filter(joueur => joueur.role === "MAITRE_ESPION").length;
    const blueAgents = blueTeam.filter(joueur => joueur.role === "AGENT").length;
    const redEspions = redTeam.filter(joueur => joueur.role === "MAITRE_ESPION").length;
    const redAgents = redTeam.filter(joueur => joueur.role === "AGENT").length;

    if (blueEspions < 1 || blueAgents < 1 || redEspions < 1 || redAgents < 1) {
      setStartErrorMessage(texts[language].errorStartGame)
      return;
    }

    socket.emit('lancerPartie', { partieId: gameId, createurId });
    navigate(`/game/${gameId}`);
  };

  const quitterPartie = () => {
    quiter = true;
    socket.emit('quitterPartie', {partieId : gameId, utilisateurId: utilisateur.id});
    navigate('/join');
    sessionStorage.removeItem("partie");

  };


  // Séparation des joueurs bleu et rouge contenus dans "joueurs".
  const blueTeam = joueurs.filter((joueur: Joueur) => joueur.equipe === "BLEU");
  const redTeam = joueurs.filter((joueur: Joueur) => joueur.equipe === "ROUGE");

  console.log("Current language:", language);
  console.log("Current texts:", texts[language]);
  
  return (
    <section className={styles.section}>
      <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
      <div className={styles.code}>
        <button
          className="bg-gray-600 text-white font-bold py-1 px-2 rounded hover:bg-gray-700"
          onClick={() => navigator.clipboard.writeText(gameId || '')}
        >
          {texts[language].copier}: {gameId}
        </button>
      </div>
      <div className={styles.quitter}>
        <button 
          className="bg-gray-600 text-white font-bold py-1 px-2 rounded hover:bg-gray-700"
          onClick={quitterPartie}
        >
          {texts[language].quitter} 
        </button>
      </div>
      <div className={styles.bleu}>
        <h1 className="text-blue-500 text-4xl sm:text-5xl md:text-6xl text-center font-bold mb-10">{texts[language].equipebleue}</h1>
        <div className={styles.boutons}>
          <button className={`w-full py-[5%] text-black text-lg font-bold bg-blue-500 rounded-lg hover:bg-blue-800 transition ${clickedButton === "blueEspion" ? "bg-blue-800 cursor-not-allowed" : ""}`}
          onClick={clickedButton === "blueEspion" ? undefined : handleBlueEspionClick}
          >
            {texts[language].maitreEspion}
            </button>
          <button className={`w-full py-[5%] text-black text-lg font-bold bg-blue-500 rounded-lg hover:bg-blue-800 transition ${clickedButton === "blueAgent" ? "bg-blue-800 cursor-not-allowed" : ""}`}
          onClick={clickedButton === "blueAgent" ? undefined : handleBlueAgentClick}
          >
          {texts[language].agent}
          </button>
        </div>
        <div className="absolute bottom-0 bg-blue-500/60 backdrop-blur-md p-3 rounded-xl w-[75%]">
          <h2 className="text-black text-l sm:text-xl md:text-xl font-semibold mb-2 border-b border-white/30 pb-1">
          {texts[language].joueursEquipeBleue}
          </h2>
          <ul className="space-y-1">
            {blueTeam
              .filter((player: Joueur) => player.role === "MAITRE_ESPION" || player.role === "AGENT")
              .map((player: Joueur, index: number) => (
              <li key={index} className="flex flex-wrap justify-between items-center text-black text-sm sm:text-lg md:text-lg p-1 rounded-lg">
              <p className="font-semibold text-black uppercase ">{player.utilisateur.pseudo}:</p>
              <p className="font-semibold text-black uppercase ">{player.role === "MAITRE_ESPION" ? "Espion" : player.role}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={styles.rouge}>
        <h1 className=" text-red-500 text-4xl sm:text-5xl md:text-6xl text-center font-bold mb-10"> {texts[language].equiperouge}</h1>
        <div className={styles.boutons}>
          <button className={`w-full py-[5%] text-black text-lg font-bold bg-red-500 rounded-lg hover:bg-red-800 transition ${clickedButton === "redEspion" ? "bg-red-800 cursor-not-allowed" : ""}`}
          onClick={clickedButton === "redEspion" ? undefined : handleRedEspionClick}
          >
            {texts[language].maitreEspion}
            </button>
          <button className={`w-full py-[5%] text-black text-lg font-bold bg-red-500 rounded-lg hover:bg-red-800 transition ${clickedButton === "redAgent" ? "bg-red-800 cursor-not-allowed" : ""}`}
          onClick={clickedButton === "redAgent" ? undefined : handleRedAgentClick}
          >
            {texts[language].agent}
            </button>
        </div>
        <div className="absolute bottom-0 bg-red-500/60 backdrop-blur-md p-3 rounded-xl w-[75%]">
          <h2 className="text-black text-l sm:text-xl md:text-xl font-semibold mb-2 border-b border-white/30 pb-1">
          {texts[language].joueursEquipeRouge}
          </h2>
          <ul className="space-y-1">
            {redTeam.filter((player: Joueur) => player.role === "MAITRE_ESPION" || player.role === "AGENT")
              .map((player: Joueur, index: number) => (
            <li key={index} className="flex flex-wrap justify-between items-center text-black text-sm sm:text-lg md:text-lg p-1 rounded-lg">
              <p className="font-semibold text-black uppercase">{player.utilisateur.pseudo}:</p>
              <p className="font-semibold text-black uppercase ">{player.role === "MAITRE_ESPION" ? "Espion" : player.role}</p>
            </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={styles.lancer}>
      {utilisateur.id === createurId && (
        <>
          <button 
            className="bg-gray-600 text-white font-bold w-full py-[5%] rounded hover:bg-gray-700"
            onClick={handleStartGame}
          >
            {texts[language].lancerPartie}
          </button>
          {startErrorMessage && (
            <p className={styles.errorMessage}>{startErrorMessage}</p>
          )}
        </>
      )}
    </div>
    </section>
  );
}