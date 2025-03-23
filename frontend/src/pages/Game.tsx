/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { getUtilisateur} from '../../utils/utilisateurs';
import { getToken } from '../../utils/token';
import styles from "../styles/Game.module.css";
import Cellule from '../components/Cellule';
import {motion, AnimatePresence} from 'framer-motion';
import { useLanguage } from "../Context/LanguageContext";
import Chat from '../components/Chat'; // Importe le composant Chat
import socket from '../../utils/socket';
import axios from 'axios';



const Game = () => {
  const [partie, setPartie] = useState<any>(null);
  const [cartes, setCartes] = useState<any>(null);

  const [motIndice, setMotIndice] = useState('');
  const [nombreMots, setNombreMots] = useState(1);
  const [indice, setIndice] = useState<any>(null);
  const [joueurSelectionne, setJoueurSelectionne] = useState<string | null>(null);
  const [montrerOptions, setMontrerOption] = useState(false);
  const [montrerJoueurs, setMontrerJoueurs] = useState(false);
  const [montrerBouttonAgentRouge, setmontrerBouttonAgentRouge] = useState(false);
  const [montrerBouttonAgentBleu, setmontrerBouttonAgentBleu] = useState(false);
  const [montrerBouttonEspionRouge, setmontrerBouttonEspionRouge] = useState(false);
  const [montrerBouttonEspionBleu, setmontrerBouttonEspionBleu] = useState(false);
  const [confirmerReinit, setConfirmerReinit] = useState(false);
  const [equipeGagnante, setEquipeGagnante] = useState<string | null>(null);
  const [montrerBulleFinDePartie, setMontrerBulleFinDePartie] = useState(false);
  const [indiceAffiche, setIndiceAffiche] = useState<string | null>(null);
  const [nbAffiche, setNbAffiche] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [montrerChat, setMontrerChat] = useState(false);
  const [errIndice, setErrIndice] = useState<string | null>(null);
  const navigate = useNavigate();

  const storedPartie = sessionStorage.getItem("partie");
  let partieId: string | undefined, partieIdNumber: string | undefined;

  if (storedPartie) {
    const partie = JSON.parse(storedPartie);
    partieId = partie.id;
    partieIdNumber = partie.id;
  }
const {language} = useLanguage(); //important pour récupérer la langue sélectionée sur la page join
const [montrerRegles, setMontrerRegles] = useState(false);

const texts: { [key in "fr" | "en" | "ar"]: { [key: string]: string } } = {
  fr: {
    joueurs: "Joueurs : 👤",
    joueurspartie: "Joueurs dans la partie :",
    copiez_code: "Copiez le code de la partie et partagez-le avec vos amis !",
    copier_code: "Copier le code",
    reinitialiser: "Réinitialiser",
    confirmation_reinit: "Êtes-vous sûr de vouloir réinitialiser la partie ?",
    confirmer_reinit: "Confirmer Réinitialisation",
    regles: "📜 Règles",
    devenir_spectateur: "Devenir Spectateur",
    changer_equipe: "↔️ Changer d'équipe",
    quitter_partie: "Quitter la Partie",
    victoire: "Victoire !",
    expulser: "Expulser",
    mettrehote: "Mettre hôte",
    espionad : "Les Espions adverses sont en train de jouer, veuillez attendre votre tour...",
    agentad : "Les Agents adverses sont en train de jouer, veuillez attendre votre tour...",
    espion : "Vos espions sont en train de jouer, veuillez attendre votre indice...",
    agent : "Vos Agents font de leur mieux pour trouver vos mots !",
    indice1 : "Utilisez les indices donnés par vos Espions pour trouver vos mots !",
    indice2 : "Trouvez le meilleur indice pour que vos Agents puissent trouver vos mots !",
    devagent : "Devenir agent",
    devespion : "Devenir espion",
    agent1: "Agents",
    espion1: "Espions",
    historique: "Historique",
    indice : "Donner un indice",
    valider : "Valider",
    indicedonne : "Indice donné",
    pour: "pour",
    mots: "mots",
    chargement: "Chargement...",
    motindice: "Mot indice",
  },
  en: {
    joueurs: "Players : 👤",
    joueurspartie: "Players in the game:",
    copiez_code: "Copy the game code and share it with your friends!",
    copier_code: "Copy the code",
    reinitialiser: "Reset",
    confirmation_reinit: "Are you sure you want to reset the game?",
    confirmer_reinit: "Confirm Reset",
    regles: "📜 Rules",
    devenir_spectateur: "Become a Spectator",
    changer_equipe: "↔️ Change team",
    quitter_partie: "Leave the Game",
    victoire: "Victory!",
    expulser: "Expel",
    mettrehote: "Set host",
    espionad : "The opposing Spies are playing, please wait your turn...",
    agentad : "The opposing Agents are playing, please wait your turn...",
    espion : "Your Spies are playing, please wait for your clue...",
    agent : "Your Agents are doing their best to find your words!",
    indice1 : "Use the clues given by your Spies to find your words!",
    indice2 : "Find the best clue so your Agents can find your words!",
    devagent : "Become agent",
    devespion : "Become spy",
    agent1: "Agents",
    espion1: "Spies",
    historique: "History",
    indice : "Give a clue",
    valider : "Validate",
    indicedonne : "Given clue",
    pour: "for",
    mots: "words",
    chargement: "Loading...",
    motindice: "Clue word",
  },
  ar: {
    joueurs: "اللاعبون : 👤",
    joueurspartie: "اللاعبون في اللعبة:",
    copiez_code: "انسخ رمز اللعبة وشاركه مع أصدقائك!",
    copier_code: "نسخ الرمز",
    reinitialiser: "إعادة تعيين",
    confirmation_reinit: "هل أنت متأكد أنك تريد إعادة تعيين اللعبة؟",
    confirmer_reinit: "تأكيد إعادة التعيين",
    regles: "📜 القواعد",
    devenir_spectateur: "أن تصبح مشاهدًا",
    changer_equipe: "↔️ تغيير الفريق",
    quitter_partie: "مغادرة اللعبة",
    victoire: "الانتقال!",
    expulser: "طرد",
    mettrehote: "تعيين المضيف",
    espionad : "الجواسيس المعارضون يلعبون ، يرجى الانتظار لدورك...",
    agentad : "العملاء المعارضون يلعبون ، يرجى الانتظار لدورك...",
    espion : "جواسيسك يلعبون ، يرجى الانتظار للحصول على تلميحك...",
    agent : "عملاءك يبذلون قصارى جهدهم للعثور على كلماتك!",
    indice1 : "استخدم الدلائل التي تعطيها جواسيسك للعثور على كلماتك!",
    indice2 : "ابحث عن أفضل دليل حتى يتمكن عملاءك من العثور على كلماتك!",
    devagent : "تصبح وكيل",
    devespion : "تصبح جاسوس",
    agent1: "عملاء",
    espion1: "جواسيس",
    historique: "التاريخ",
    indice : "أعط تلميحا",
    valider : "تحقق",
    indicedonne : "تلميح معطى",
    pour: "ل",
    mots: "كلمات",
    chargement: "جار التحميل...",
    motindice: "كلمة الدليل",
  }
};




  // Fonction appelée lors du choix d'une équipe suite à un clic sur un des boutons.
  const handleChoice = async (team: "ROUGE" | "BLEU", type: "MAITRE_ESPION" | "AGENT") => {
    setmontrerBouttonAgentBleu(false);
    setmontrerBouttonAgentRouge(false);
    setmontrerBouttonEspionBleu(false);
    setmontrerBouttonEspionRouge(false);

    // Emission du choix avec socket io pour mettre à jour la BDD et informer les autres joueurs.
    if(partieIdNumber) {
      socket.emit('changerEquipe', {
        team,
        type,
        utilisateurId : utilisateur.id,
        partieId: partieIdNumber,
      });
    }
  } 

  const handleBlueEspionClick = () => {
    handleChoice("BLEU", "MAITRE_ESPION");
  };

  const handleBlueAgentClick = () => {
    handleChoice("BLEU", "AGENT");
  };

  const handleRedEspionClick = () => {
    handleChoice("ROUGE", "MAITRE_ESPION");
  };

  const handleRedAgentClick = () => {
    handleChoice("ROUGE", "AGENT");
  };

  const handleClickChangeTeam = () => {
    setMontrerOption(false);
    if (equipeUtilisateur === 'ROUGE') {
      if (roleUtilisateur === 'AGENT') {
        setmontrerBouttonAgentBleu(true);
        setmontrerBouttonEspionBleu(true);
      }
      else if (roleUtilisateur === 'MAITRE_ESPION') {
        handleBlueEspionClick();
      }
      
    }
    else if (equipeUtilisateur === 'BLEU') {
      if (roleUtilisateur === 'AGENT') {
        setmontrerBouttonAgentRouge(true);
        setmontrerBouttonEspionRouge(true);
      }
      else if (roleUtilisateur === 'MAITRE_ESPION') {
        handleRedEspionClick();
      }
      
    }
  }
  const bouttonJoueurs = () => {
    setMontrerJoueurs(!montrerJoueurs);
    setMontrerOption(false);
    setConfirmerReinit(false)
    if (montrerJoueurs === false) {
      setJoueurSelectionne(null)
    }
  };
  const afficherConfirmer = () => {
    setConfirmerReinit(!confirmerReinit);
    setMontrerJoueurs(false);
    setMontrerOption(false);
  };
  const bouttonUtilisateur = () => {
    setMontrerOption(!montrerOptions);
    setMontrerJoueurs(false);
    setConfirmerReinit(false);
  };
  const utilisateur = getUtilisateur();
  const gameStatus = partie?.statut;
       

  const chargerPartie = async () => {
    try {
      partieIdNumber = getPartieId();
      const token = getToken();
  
      const res = await axios.get(`/api/parties/${partieIdNumber}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (res.status !== 200) throw new Error(`Erreur HTTP : ${res.status}`);
      const data = res.data;
      setPartie(data);
      setCartes(data.cartes);
      sessionStorage.setItem('partie', JSON.stringify(data));
    } catch (err) {
      console.error('erreur chargement partie :', err);
    }
  };
  
  const chargerIndice = async () => {
    try {
      partieIdNumber = getPartieId();
      if (partieIdNumber) {
        const token = getToken();
  
        const res = await axios.get(`/api/parties/${partieIdNumber}/indice`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (res.status !== 200) throw new Error(`Erreur HTTP : ${res.status}`);
        const data = res.data;
        if (!data) return;
        setIndice(data);
        sessionStorage.setItem('indice', JSON.stringify(data));
      }
    } catch (err) {
      console.error('erreur chargement indice :', err);
    }
  };

  useEffect(() => {
    if (!utilisateur) {
      console.error('Utilisateur non connecté');
      navigate('/login');
      return;
    }
  
    socket.emit('rejoindrePartie', { partieId });
  
    const majHandler = () => {
      if(partieIdNumber){
        console.log('majPartie reçue, rechargement...');
        chargerPartie();
        chargerIndice();
      }
    };

    const handleResize = (): void => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener("resize", handleResize);
    if(!isMobile){
      setMontrerChat(false);
    }
  
    socket.on('majPartie', majHandler);

    socket.on('joueurVire', (data: { joueurId: number }) => {
      if (data.joueurId === utilisateur.id) {
        navigate('/join');
        sessionStorage.removeItem('partie');
        sessionStorage.removeItem('indice');
      }
    });

    socket.on('gagnant', (data: { equipeGagnante: string }) => {
      console.log(`L'équipe gagnante est : ${data.equipeGagnante}`);
      setEquipeGagnante(data.equipeGagnante);
      setTimeout(() => setEquipeGagnante(null), 8000);
    });

    socket.on('indiceDonne', (data: { indice: string, nbmots: number }) => {
      setIndiceAffiche(data.indice);
      setNbAffiche(data.nbmots);
    });

    socket.on('indiceNonDonne', (data: { joueurId: number }) => {
      if (data.joueurId === utilisateur.id) {
        setErrIndice('Vous ne pouvez pas donner cet indice');
      }
    });

    if (equipeGagnante) {
      setTimeout(() => {
        setMontrerBulleFinDePartie(true);
      }, 8000); // 8 secondes pour correspondre à la durée de l'animation
    }
    if (gameStatus === "TERMINEE" && !equipeGagnante) {
      setMontrerBulleFinDePartie(true);
    }

    if (indiceAffiche && nbAffiche) {
      const timer = setTimeout(() => {
        setIndiceAffiche(null); // Réinitialiser après 2 secondes
        setNbAffiche(null);
      }, 2000);
      return () => clearTimeout(timer); // Nettoyer le timer
    }

    if (errIndice) {
      const timer = setTimeout(() => {
        setErrIndice(null); // Réinitialiser après 2 secondes
      }, 2000);
      return () => clearTimeout(timer); // Nettoyer le timer
    }

    socket.on('partieJoin', () => {
      navigate(`/teams/${partieId}`);
    });
    
    return () => {
      socket.off('majPartie', majHandler);
      socket.off('joueurVire');
      socket.off('indiceDonne');
      socket.off('gagnant');
      socket.off('partieJoin');
      window.removeEventListener("resize", handleResize);
    };
  }, [partieId, utilisateur, equipeGagnante, gameStatus, indiceAffiche, nbAffiche]);
  

  const donnerIndice = () => {
    const equipe = getEquipeUtilisateur();
    socket.emit('donnerIndice', {
      partieId,
      utilisateurId: utilisateur.id,
      motDonne: motIndice,
      nombreMots,
      equipe,
    });
    setMotIndice('');
    setNombreMots(1);
  };

  const passerTour = () => {
    socket.emit('finDeviner', { partieId : partieId , utilisateurId: utilisateur.id , equipe : getEquipeUtilisateur() });
  };

  const selectionnerCarte = (carteId: number) => {
    const equipe = getEquipeUtilisateur();
    socket.emit('selectionnerCarte', { partieId, carteId, equipe, utilisateurId: utilisateur.id });
  };

  const deselectionnerCarte = (carteId: number) => {
    socket.emit('deselectionnerCarte', {partieId, carteId, utilisateurId: utilisateur.id})
  }

  const validerCarte = (carteId: number) => {
    const equipe = getEquipeUtilisateur();
    socket.emit('validerCarte', { partieId : partieIdNumber, carteId, equipe, utilisateurId: utilisateur.id });
  };
  const renitPartie = () => {
    socket.emit('renitPartie', {partieId : partieIdNumber, utilisateurId: utilisateur.id});
  };

  const devenirSpec = () => {
    socket.emit('devenirSpectateur', {partieId : partieIdNumber, utilisateurId: utilisateur.id});
    setMontrerOption(false);
  };

  const quitterPartie = () => {
    socket.emit('quitterPartie', { partieId: partieIdNumber, utilisateurId: utilisateur.id });
    navigate('/join');
    sessionStorage.removeItem('partie');
    sessionStorage.removeItem('indice');
    setPartie(null);
    setCartes(null);
    setMotIndice('');
    setNombreMots(1);
    setIndice(null);
    setJoueurSelectionne(null);
    setMontrerOption(false);
    setMontrerJoueurs(false);
    setmontrerBouttonAgentRouge(false);
    setmontrerBouttonAgentBleu(false);
    setmontrerBouttonEspionRouge(false);
    setmontrerBouttonEspionBleu(false);
    setConfirmerReinit(false);
    setEquipeGagnante(null);
    setMontrerBulleFinDePartie(false);
    setIndiceAffiche(null);
    setNbAffiche(null);
    setMontrerChat(false);
    setMontrerRegles(false);
  };

  const getJoueurIdByPseudo = (pseudo: string) => {
    const joueur = partie?.membres.find((m: any) => m.utilisateur.pseudo === pseudo);
    return joueur.utilisateur.id ? joueur.utilisateur.id : null;
  };

  const expulser = () => {
    socket.emit('virerJoueur', {partieId : partieIdNumber, utilisateurId: utilisateur.id, joueurId: getJoueurIdByPseudo(joueurSelectionne as string)});
    setJoueurSelectionne(null);
    setMontrerJoueurs(false);
  };
  const mettreHote = () => {
    socket.emit('changerHost', {partieId : partieIdNumber, utilisateurId: utilisateur.id, newHostId: getJoueurIdByPseudo(joueurSelectionne as string)});
    setJoueurSelectionne(null);
    setMontrerJoueurs(false);
  };

  const getEquipeUtilisateur = () => {
    return partie?.membres.find((m: any) => m.utilisateurId === utilisateur.id)?.equipe;
  };

  const getRoleUtilisateur = () => {
    return partie?.membres.find((m: any) => m.utilisateurId === utilisateur.id)?.role;
  };
  const getRoleEnCours = () => {
    return partie?.roleEncours;
  };
  const getEquipeEnCours = () => {
    return partie?.equipeEncours;
  };
  const getIndiceEnCours = () => {
    return partie?.indice;
  };
  const isHost = () => {
    return partie?.createurId === utilisateur.id;
  };
  const getnbCarteRouge = () => {
    return partie?.nbMotsRouge;
  };
  const getnbCarteBleu = () => {
    return partie?.nbMotsBleu;
  };
  const getPartieId = () => {
    return JSON.parse(sessionStorage.getItem("partie") || "{}").id;
  };


  if (!partie)  { chargerPartie(); 
    chargerIndice();
    return <p>{texts[language].chargement}</p>;
  }

  const equipeUtilisateur = getEquipeUtilisateur();
  const roleUtilisateur = getRoleUtilisateur();
  //const host = getHost();
  const roleEncours = getRoleEnCours();
  const equipeEnCours = getEquipeEnCours();
  const indiceEnCours = getIndiceEnCours();
  const nbCarteRouge = getnbCarteRouge();
  const nbCarteBleu = getnbCarteBleu();

  return (
    <section className={styles.section}>
       <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>

      
      {/* Barre de navigation */}
      <div className={styles.container}>
        <div className={styles.nav}>
          <div className='relative'>
            <button onClick={bouttonJoueurs} className="text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-xs sm:text-sm md:text-sm px-1 py-1 sm:px-2.5 sm:py-2.5 md:px-2.5 md:py-2.5 text-center mb-1 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900">{texts[language].joueurs} {partie.membres.length}</button>
            {montrerJoueurs && (
              <div className="absolute left-0 mt-1 w-{100%} bg-[#222] shadow-xl border border-yellow-400 text-white rounded shadow-lg z-10 flex flex-col p-1 ">
                <p className='text-[10px]'>{texts[language].joueurspartie}</p>
                {/* Liste des joueurs */}
                <div className="flex flex-wrap gap-x-1 gap-y-1">
                  {partie.membres.map((m: any) => (
                    <div className="flex sm:flex-row justify-between items-center mb-1 gap-2 relative">
                      <button onClick={() => setJoueurSelectionne(joueurSelectionne === m.utilisateur.pseudo ? null : m.utilisateur.pseudo)} key={m.utilisateur.id} className="text-[10px] text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-1 py-1 text-center mb-1 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800 w-auto disabled " disabled={!isHost() || getJoueurIdByPseudo(m.utilisateur.pseudo)==partie?.createurId}>{m.utilisateur.pseudo}</button>
                      {/* Bulle d'options */}
                      {joueurSelectionne === m.utilisateur.pseudo && (
                        <div className="absolute left-[50%]  -translate-x-1/2 mt-1 top-full w-[330%] bg-[#222] text-black rounded shadow-xl flex flex-col p-1 text-[10px] border border-blue-500 items-center z-10">
                          <p className="text-center text-white">{m.utilisateur.pseudo}</p>
                          <button onClick={expulser} className="w-full text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-[10px] px-1 py-1 text-center mb-1 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">{texts[language].expulser}</button>
                          <button onClick={mettreHote} className="w-full text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-[10px] px-1 py-1 text-center mb-2 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900">{texts[language].mettrehote}</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Ligne de séparation */}
                <div className="border-t border-gray-800 w-[90%] mx-auto mb-1"></div>
                <p className='text-[10px] text-center'>{texts[language].copiez_code}</p>
                {/* Bouton de copie */}
                <button onClick={() => navigator.clipboard.writeText(partie.id)} className="text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-[10px] px-1 py-1 text-center mb-1 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900" >{texts[language].copier_code}</button>
              </div>
            )}
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            {isHost() && (
            <div className="relative inline-block">
              <button onClick={afficherConfirmer}  className="text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-xs sm:text-sm md:text-sm px-1 py-1 sm:px-2.5 sm:py-2.5 md:px-2.5 md:py-2.5 text-center mb-1 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900">{texts[language].reinitialiser}</button>
              {confirmerReinit && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-1 w-[100%] bg-[#222] border border-yellow-400 rounded shadow-lg z-10 flex flex-col gap-2 p-2 items-center">
                  <p className="text-[10px] text-red-500 text-center">{texts[language].confirmation_reinit}</p>
                  <button onClick={renitPartie} className="text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-[10px] px-1 py-1 text-center mb-1 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900">{texts[language].confirmer_reinit}</button>
                </div>
              )}
            </div>
            )}    

             {/*bouton pour montrer les règles*/}
             <button 
            className="text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-xs sm:text-sm md:text-sm px-1 py-1 sm:px-2.5 sm:py-2.5 md:px-2.5 md:py-2.5 text-center mb-2 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900"
            onClick={() => setMontrerRegles(true)}
            >
              {texts[language].regles}
            </button>  


            {/*fenêtre modale des règles */} 
            {montrerRegles && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-99999">
          <div className="bg-white p-5 rounded-lg shadow-lg w-96 relative max-h-[80vh] overflow-y-auto">
            {/* Bouton pour fermer */}
            <button
              className="absolute top-2 right-2 text-gray-700 hover:text-red-500"
              onClick={() => setMontrerRegles(false)} // Lors du clic, on ferme la fenêtre
            >
              ✖
            </button>

            <h2 className="text-xl font-bold mb-3">Règles du jeu</h2>
            <p className="text-sm text-gray-700">
            Codenames est un jeu de deux équipes. La grille comporte 25 mots. Certains sont secrètement assignés à l'équipe rouge, d'autres à l'équipe bleue. Un joueur de chaque équipe est le maître-espion, et seuls les maîtres-espions voient les mots qui appartiennent à chaque équipe. À tour de rôle, les maîtres-espions donnent des indices à leurs coéquipiers (agents) pour les aider à deviner les mots de leur équipe. L'équipe qui devine tous les mots en premier remporte la partie.
            </p>
            <h2 className="text-xl font-bold mb-3 mt-3">Division en équipes</h2>
            <p className="text-sm text-gray-700">
            Divisez tous les joueurs en deux équipes, rouge et bleue. Un joueur de chaque équipe doit cliquer sur «Rejoindre en tant que Maître-espion». Il verra alors les couleurs des cartes. Tous les autres joueurs doivent cliquer sur «Rejoindre en tant qu'Agent». Ils ne verront pas les couleurs des cartes.
            </p>
            <img
              src="../images/team.png"  
              className="w-full h-auto mb-3 rounded-lg"  
            />
            <h2 className="text-xl font-bold mb-3 mt-3">Donner des indices</h2>
            <p className="text-sm text-gray-700">
            Les Maîtres-Espions donnent des indices. À votre tour, appuyez sur les mots de votre couleur pour lesquels vous souhaitez donner un indice. Saisissez ensuite un indice d'un mot correspondant à tous les mots sélectionnés. Vos Agents ne verront que l'indice et le nombre de cartes marquées.
            </p>
            <img
              src="../images/indice.jpg"  
              className="w-full h-auto mb-3 rounded-lg"  
            />
            <p className="text-sm text-gray-700">
            Attention à la carte noire: c'est un assassin! Évitez les indices qui pourraient mener à l'assassin ou aux paroles de l'équipe adverse.
            </p>
            <h2 className="text-xl font-bold mb-3 mt-3">Choix des cartes</h2>
            <p className="text-sm text-gray-700">
            Les agents devinent les mots grâce à l'indice du Maître-espion. Vous pouvez discuter de l'indice avec vos coéquipiers grâce au chat. 
            Selectionner une ou plusieurs cartes puis appuyez sur le bouton pour valider votre choix. Le jeu révélera alors la couleur du mot choisi.
            </p>
            <img
              src="../images/cartes.png"  
              className="w-full h-auto mb-3 rounded-lg"  
            />
            <p className="text-sm text-gray-700 mt-2">
            Si vous devinez un mot de la couleur de votre équipe, vous pouvez recommencer. Il vous faudra deviner autant de mots que votre maître espion vous l'a indiqué.
            </p>
            <h2 className="text-xl font-bold mb-3 mt-3">Fin de tour</h2>
            <p className="text-sm text-gray-700 mt-2">
            Votre tour peut se terminer de trois manières:
            </p>
            <p className="text-sm text-gray-700 mt-2">
            -Devinez un mot de la couleur de l'adversaire ou de la couleur neutre.
            </p>
            <p className="text-sm text-gray-700 mt-2">
            -Terminez manuellement la devinette en cliquant sur le bouton.
            </p>
            <p className="text-sm text-gray-700 mt-2">
            -Atteignez le nombre maximal de devinettes (indice + 1).
            </p>
            <h2 className="text-xl font-bold mb-3 mt-3">Victoire et défaite</h2>
            <p className="text-sm text-gray-700 mt-2">
            Les équipes jouent à tour de rôle. Une équipe gagne lorsque tous ses mots sont devinés. Elle perd si elle devine l'Assassin!
            </p>
          </div>
        </div>
      )}



            
      


           


            <div className="relative">
              <button onClick={bouttonUtilisateur} className="text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-xs sm:text-sm md:text-sm px-1 py-1 sm:px-2.5 sm:py-2.5 md:px-2.5 md:py-2.5 text-center mb-2 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900">{utilisateur.pseudo}</button>
              {montrerOptions && (
                <div className="absolute right-0 mt-2 sm:w-[150%] md:w-[150%] bg-[#222] border border-yellow-400 rounded shadow-xl flex flex-col gap-2 p-2">
                  <button  onClick={devenirSpec} className="text-white hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-[10px] px-1 py-1 text-center mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800">{texts[language].devenir_spectateur}</button>
                  {getEquipeUtilisateur() === "ROUGE" &&(<button  onClick={handleClickChangeTeam} className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-[10px] px-1 py-1 text-center mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">{texts[language].changer_equipe}</button>)}
                  {getEquipeUtilisateur() === "BLEU" &&(<button  onClick={handleClickChangeTeam} className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-[10px] px-1 py-1 text-center mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">{texts[language].changer_equipe}</button>)}
                  <button  onClick={quitterPartie} className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-[10px] px-1 py-1 text-center mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">{texts[language].quitter_partie}</button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={styles.message}>
          <AnimatePresence mode="wait">
            {equipeEnCours !== equipeUtilisateur && roleEncours === "MAITRE_ESPION" && (
              <motion.h1 key="espion-adverse" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} className="text-[100%] text-white font-bold text-center mb-4 w-full">
                {texts[language].espionad}
              </motion.h1>
            )}
            {equipeEnCours !== equipeUtilisateur && roleEncours === "AGENT" && (
              <motion.h1 key="agent-adverse" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} className="text-[100%] text-white font-bold text-center mb-4 w-full">
                {texts[language].agentad}
              </motion.h1>
            )}
            {equipeEnCours === equipeUtilisateur && roleEncours === "MAITRE_ESPION" && roleEncours !== roleUtilisateur && (
              <motion.h1 key="espion-equipe" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} className="text-[100%] text-white font-bold text-center mb-4 w-full">
                {texts[language].espion}
              </motion.h1>
            )}
            {equipeEnCours === equipeUtilisateur && roleEncours === "AGENT" && roleEncours !== roleUtilisateur && (
              <motion.h1 key="agent-equipe" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} className="text-[100%] text-white font-bold text-center mb-4 w-full">
                {texts[language].agent}
              </motion.h1>
            )}
            {equipeEnCours === equipeUtilisateur && roleEncours === "AGENT" && roleEncours === roleUtilisateur && (
              <motion.h1 key="agent-utilisateur" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} className="text-[100%] text-white font-bold text-center mb-4 w-full">
                {texts[language].indice1}
              </motion.h1>
            )}
            {equipeEnCours === equipeUtilisateur && roleEncours === "MAITRE_ESPION" && roleEncours === roleUtilisateur && (
              <motion.h1 key="espion-utilisateur" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} className="text-[100%] text-white font-bold text-center mb-4 w-full">
                {texts[language].indice2}
              </motion.h1>
            )}
          </AnimatePresence>
        </div>
        {/* Grille des mots */}
        {/* <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-4">
          {partie.cartes.map((carte: any) => {
            const couleur =
              carte.revelee || roleUtilisateur === 'MAITRE_ESPION'
                ? {
                    ROUGE: 'bg-red-500',
                    BLEU: 'bg-blue-500',
                    NEUTRE: 'bg-gray-400',
                    ASSASSIN: 'bg-black text-white',
                  }[carte.type as 'ROUGE' | 'BLEU' | 'NEUTRE' | 'ASSASSIN']
                : 'bg-gray-700';

            return (
              <button
                key={carte.id}
                onClick={() => validerCarte(carte.id)}
                disabled={carte.revelee || roleUtilisateur !== 'AGENT'}
                className={`p-4 rounded ${couleur} ${
                  carte.revelee ? 'opacity-50' : 'hover:opacity-80'
                }`}
              >
                {carte.mot.mot}
              </button>
            );
          })}
        </div> */}
          
        <div className={styles.rouge}>
          <div className="bg-red-500 rounded w-full h-full">
            <AnimatePresence mode="wait">
              <motion.p key={`rouge-${nbCarteRouge}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ type: "spring", stiffness: 120, damping: 10, delay: 0.2 }} className="text-center font-bold text-xl mt-2">
                {nbCarteRouge}
              </motion.p>
            </AnimatePresence>
            <div className="border-t border-red-800 mb-1 w-[90%] mx-auto"></div>
            {montrerBouttonAgentRouge && (
              <div className="flex justify-center mb-1">
                <button onClick={handleRedAgentClick} className='text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-[10px] px-1 py-1 text-center mb-1 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900'>{texts[language].devagent}</button>
              </div>
            )}
              <h3 className="font-bold text-center mb-1">{texts[language].agent1}</h3>
            {!montrerBouttonAgentRouge && partie.membres.filter((m: any) => m.equipe === 'ROUGE' && m.role === 'AGENT').map((m: any) => (
              <p className="text-[12px] text-center" key={m.utilisateur.id}>{m.utilisateur.pseudo}</p>
            ))}
            {montrerBouttonEspionRouge && (
              <div className="flex justify-center mb-1">
                <button onClick={handleRedEspionClick} className='text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-[10px] px-1 py-1 text-center mb-1 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900'>{texts[language].devespion}</button>
              </div>
            )}
              <h3 className="font-bold text-center mt-2">{texts[language].espion1}</h3>
              {!montrerBouttonEspionRouge && partie.membres.filter((m: any) => m.equipe === 'ROUGE' && m.role === 'MAITRE_ESPION').map((m: any) => (
              <p className=" text-[12px] text-center mb-2" key={m.utilisateur.id}>{m.utilisateur.pseudo}</p>
            ))}
          </div>
          </div>
          {!isMobile &&(
          <div className={styles.chat}>
            <Chat />
          </div> 
          )}       
      <div className={styles.cartes}>
          <AnimatePresence>
            {equipeGagnante && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}  
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.8 }}
                className="fixed inset-0 flex items-center justify-center z-50 rounded-lg before:content-[''] before:absolute before:inset-0 before:bg-cover before:bg-center before:bg-[url('/images/win.png')] before:opacity-90"
              >
                <div className="relative text-center z-10">
                  <h2 className="text-6xl font-bold mb-4 text-yellow-700">
                    {equipeGagnante === equipeUtilisateur ? 'Vous avez gagné !' : 'Vous avez perdu !'}
                  </h2>
                </div>
              </motion.div>
            )}
          {montrerBulleFinDePartie && isHost() &&(
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-[#222] p-6 rounded-lg border border-yellow-400">
                <h2 className="text-2xl font-bold mb-4 text-white">Que souhaitez-vous faire ?</h2>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      renitPartie();
                    }}
                    className="text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900"
                  >
                    Relancer une partie
                  </button>
                  <button
                    onClick={() => {
                      quitterPartie();
                    }}
                    className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                  >
                    Terminer la partie
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-5 gap-2 p-6 rounded-lg w-full h-full">
            {cartes.map((carte: any) => {

              const estSelectionnee = carte.joueursSelection && carte.joueursSelection.length > 0;
              const estSelectionneeParJoueur = carte.joueursSelection && carte.joueursSelection.includes(utilisateur.pseudo);
              
              return <Cellule
              key={carte.id}
              carte={carte}
              roleUtilisateur={roleUtilisateur}
              roleEncours={roleEncours}
              equipeUtilisateur={equipeUtilisateur}
              equipeEnCours={equipeEnCours}
              onSelectionner={selectionnerCarte}
              onDeselectionner={deselectionnerCarte}
              onValiderCarte={validerCarte}
              estSelectionnee={estSelectionnee}
              pseudosSelections={carte.joueursSelection}
              estSelectionneeParJoueur={estSelectionneeParJoueur}
              trouvee={carte.trouvee}
              />
          
            })}

          </div>
          </AnimatePresence>
        </div>
        <div className={styles.bleu}>
          {/*Cote bleu et historique*/}
            <div className="bg-blue-700 text-black rounded w-full h-full">
              <AnimatePresence mode="wait">
                <motion.p key={`bleu-${nbCarteBleu}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ type: "spring", stiffness: 120, damping: 10, delay: 0.2 }} className="text-center font-bold text-xl mt-2">
                  {nbCarteBleu}
                </motion.p>
              </AnimatePresence>
              <div className="border-t border-blue-900 mb-1 w-[90%] mx-auto"></div>
              {montrerBouttonAgentBleu && (
                <div className="flex justify-center mb-1">
                  <button onClick={handleBlueAgentClick} className='text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-[10px] px-1 py-1 text-center mb-1 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900'>{texts[language].devagent}</button>
                </div>
              )}
                <h3 className="font-bold text-center">{texts[language].agent1}</h3>   
                {!montrerBouttonAgentBleu && partie.membres.filter((m: any) => m.equipe === 'BLEU' && m.role === 'AGENT' ).map((m: any) => (    
                <p className="text-[12px] text-center" key={m.utilisateur.id}>{m.utilisateur.pseudo}</p>   
              ))}
              {montrerBouttonEspionBleu && (
                <div className="flex justify-center mb-1">
                  <button onClick={handleBlueEspionClick} className='text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-[10px] px-1 py-1 text-center mb-1 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900'>{texts[language].devespion}</button>
                </div>
              )}     
                <h3 className="font-bold text-center mt-2">{texts[language].espion1}</h3>    
                {!montrerBouttonEspionBleu && partie.membres.filter((m: any) => m.equipe === 'BLEU' && m.role === 'MAITRE_ESPION' ).map((m: any) => (    
                <p className="text-[12px] text-center" key={m.utilisateur.id}>{m.utilisateur.pseudo}</p>   
              ))}  
            </div>
        </div>
        {!equipeGagnante && indiceAffiche && nbAffiche &&(
          <div className={styles.affiche}>
            <motion.h1
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              style={{
                textShadow: `
                  -1px -1px 0 #000,  
                  1px -1px 0 #000,
                  -1px  1px 0 #000,
                  1px  1px 0 #000
                `,
              }}
              className="fixed inset-0 flex items-center justify-center text-8xl text-white font-bold text-center z-50"
            >
              {indiceAffiche} pour {nbAffiche}
            </motion.h1>
          </div>
        )}
        <div className={styles.historique}>
          <div className='h-full w-full flex flex-col items-center'>
            {/* Bouton tchat visible seulement si écran ≤ 1024px */}
            {isMobile && (
              <button onClick={() => setMontrerChat(!montrerChat)} className=" bg-gray-700 text-white p-0.5 rounded shadow-md mb-1 w-full">
                {montrerChat ?"📖" : "💬"}
              </button>
            )} 
            {!montrerChat && (
              <div className="bg-gray-800 p-2 rounded h-full flex flex-col w-full">     
                <p className="text-xs text-center">{texts[language].historique}</p>
                <div className="border-t border-gray-300 mt-2 mb-2"></div>
                  <div className="custom-scrollbar overflow-y-auto overflow-x-hidden bg-gray-700 rounded-lg p-1 border border-gray-600 flex-1">
                    <AnimatePresence>
                      {partie.actions.filter((action:any) => {
                          if (action.typeAction === 'SELECTION' ) return false;
                          return true;
                        }).map((action: any) => {
                        const couleurPseudo = action.equipe === 'ROUGE' ? 'text-red-500' : 'text-blue-500';
                        const couleurMot = action.carte?.type === 'ROUGE' ? 'text-red-500' : 
                                action.carte?.type === 'BLEU' ? 'text-blue-500' : 
                                action.carte?.type === 'ASSASSIN' ? 'text-black' : 'text-gray-400';

                        return (
                          <motion.div
                            key={action.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={`text-xs py-1 px-2 hover:bg-gray-600 rounded-sm ${
                              equipeEnCours === action.utilisateur?.equipe ? 'bg-gray-600' : ''
                            }`}
                            style={{ whiteSpace: 'nowrap' }}
                          >
                            <div className="flex gap-2 items-baseline">
                              {action.utilisateur?.pseudo && (
                                <div className={`${couleurPseudo} font-semibold truncate`}>
                                  {action.utilisateur.pseudo}
                                </div>
                              )}
                        
                              {action.motDonne && (
                                <>
                                  <div className="text-gray-400">a donné l'indice :</div>
                                  <div className="text-yellow-400 truncate">{action.motDonne}</div>
                                </>
                              )}

                              {action.carte && action.typeAction === 'VALIDERSELECTION' && (
                                <>
                                  <div className="text-gray-400">a validé :</div>
                                  <div className={`${couleurMot} truncate`}>
                                    {action.carte.mot.mot}
                                  </div>
                                </>
                              )}
                              {action.typeAction === 'PASSER' && (
                                <>
                                  <div className="text-gray-400">a finie de deviner </div>
                                </>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>
            )}
            {montrerChat &&(
              <Chat />
            )}
          </div>
        </div>
        {/* Zone indices - Seulement pour maître espion */}
        {gameStatus === "EN_COURS" && roleUtilisateur === 'MAITRE_ESPION' && equipeUtilisateur === equipeEnCours && roleEncours === 'MAITRE_ESPION' &&(
          <div className={styles.indice}>
            <div className="p-4 rounded text-center w-full">
              {errIndice &&(<p className="text-red-500 text-sm text-center">{errIndice}</p>)}
              <h2 className="text-l text-white sm:text-xl">{texts[language].indice}</h2>
              <input
                type="text"
                value={motIndice}
                onChange={(e) => setMotIndice(e.target.value)}
                placeholder={texts[language].motindice}
                className="p-2 rounded bg-gray-700 text-white mr-2"
              />
              <input
                type="number"
                value={nombreMots}
                onChange={(e) => setNombreMots(Number(e.target.value))}
                className="p-2 rounded bg-gray-700 text-white w-16"
              />
              <button onClick={donnerIndice} className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-2.5 py-2 ml-2 mt-2 text-center dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800">
              {texts[language].valider}
              </button>
            </div>
          </div>
        )}
        {gameStatus === "EN_COURS" && roleEncours === 'AGENT' && indice ? (
          <div className={styles.indice}>
            <div className=" w-full rounded text-white text-center">
              <h2 className="text-xl"> {indice.mot} {texts[language].pour} {indice.nbmots} {texts[language].mots}</h2>
              {roleUtilisateur === 'AGENT' && equipeUtilisateur === equipeEnCours && roleEncours === 'AGENT' ? (
              <button onClick={passerTour} className="bg-green-500 px-4 py-2 ml-2 rounded mt-2">
                {texts[language].valider}
              </button>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default Game;