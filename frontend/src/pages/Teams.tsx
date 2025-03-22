import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getUtilisateur } from '../../utils/utilisateurs';
import styles from "../styles/Teams.module.css";
import { useLanguage } from "../Context/LanguageContext";
import quitterPartie from "./Game";
import socket from '../../utils/socket';

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
    copier: "Copier",
    lancerPartie: "Lancer la partie",
    maitreEspion: "Maître Espion",
    joueursEquipeBleue: "Joueurs de l'équipe bleue",
    joueursEquipeRouge: "Joueurs de l'équipe rouge",
    agent: "Agent",
    maximumEspion: "Il ne peut y avoir que 2 maîtres espions par équipe.",
    equipebleue: "Equipe bleue",
    equiperouge: "Equipe rouge",
    codepartie: "Code Partie:",
    quitter : "Quitter la partie",
  },
  en: {
    choisirEquipe: "Choose your team",
    copier: "Copy",
    lancerPartie: "Start game",
    maitreEspion: "Master Spy",
    joueursEquipeBleue: "Blue team players",
    joueursEquipeRouge: "Red team players",
    agent: "Agent",
    maximumEspion: "There can only be 2 master spies per team.",
    equipebleue: "Blue team",
    equiperouge: "Red team",
    codepartie: "Game Code:",
    quitter : "Leave the game",
  },
  ar: {
    choisirEquipe: "اختر فريقك",
    copier: "نسخ",
    lancerPartie: "بدء اللعبة",
    maitreEspion: "ماستر اسبيون",
    joueursEquipeBleue: "لاعبي الفريق الأزرق",
    joueursEquipeRouge: "لاعبي الفريق الأحمر",
    agent: "وكيل",
    maximumEspion: "لا يمكن أن يكون هناك سوى جاسوسين رئيسيين 2 في كل فريق.",
    equipebleue: "الفريق الأزرق",
    equiperouge: "الفريق الأحمر",
    codepartie: "رمز اللعبة:",
    quitter : "مغادرة اللعبة",
  },
};



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
    socket.on('partieLancee', (data:any) => {
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
      alert(texts[language].maximumEspion);
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
      alert(texts[language].maximumEspion);
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

  const quitterPartie = () => {
    socket.emit('quitterPartie', {partieId : gameId, utilisateurId: utilisateur.id});
    navigate('/join');
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
          className="bg-gray-600 text-white font-bold px-[2%] py-[5%] w-full rounded hover:bg-gray-700"
          onClick={() => navigator.clipboard.writeText(gameId || '')}
        >
          {texts[language].copier}
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
            {blueTeam.map((player: Joueur, index: number) => (
              <li key={index} className="flex justify-between items-center text-black text-sm sm:text-lg md:text-lg p-1 rounded-lg">
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
            {redTeam.map((player: Joueur, index: number) => (
            <li key={index} className="flex justify-between items-center text-black text-sm sm:text-lg md:text-lg p-1 rounded-lg">
              <p className="font-semibold text-black uppercase">{player.utilisateur.pseudo}:</p>
              <p className="font-semibold text-black uppercase">{player.role === "MAITRE_ESPION" ? "Espion" : player.role}</p>
            </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={styles.lancer}>
      {utilisateur.id === createurId && (
        <button 
          className=" bg-gray-600 text-white font-bold w-full py-[5%] rounded hover:bg-gray-700"
          onClick={handleStartGame}
        >
          {texts[language].lancerPartie}
          </button>
      )}
      </div>

      <button 
        className="absolute top-10 right-4 z-[10] bg-gray-600 text-white font-bold py-4 px-8 rounded hover:bg-gray-700 h-20 w-60"
        onClick={quitterPartie}
      >
        {texts[language].quitter} 
      </button>
    </section>
  );
}