/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from "react-router-dom";
import { getUtilisateur} from '../../utils/utilisateurs';
import { getToken } from '../../utils/token';
import styles from "../styles/Game.module.css";
import Cellule from '../components/Cellule';
import {motion, AnimatePresence} from 'framer-motion';

const socket = io(process.env.BACKEND_URL || 'http://localhost:3000');

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
  const navigate = useNavigate();

  const storedPartie = localStorage.getItem("partie");
  let partieId: string | undefined, partieIdNumber: string | undefined;

  if (storedPartie) {
    const partie = JSON.parse(storedPartie);
    partieId = partie.id;
    partieIdNumber = partie.id;
  }

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
       

   const chargerPartie = async () => {
    try {
      const token = getToken();

      const res = await fetch(`/api/parties/${partieIdNumber}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`Erreur HTTP : ${res.status}`);
      const data = await res.json();
      setPartie(data);
      setCartes(data.cartes);
      localStorage.setItem('partie', JSON.stringify(data));
    } catch (err) {
      console.error('erreur chargement partie :', err);
    }
  };
  const chargerIndice = async () => {
    try {
      const token = getToken();

      const res = await fetch(`/api/parties/${partieIdNumber}/indice`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`Erreur HTTP : ${res.status}`);
      const data = await res.json();
      if (!data) return;
      setIndice(data);
      localStorage.setItem('indice', JSON.stringify(data));
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
      console.log('majPartie reçue, rechargement...');
      chargerPartie();
      chargerIndice();
    };
  
    socket.on('majPartie', majHandler);

    socket.on('joueurVire', (data: { joueurId: number }) => {
      if (data.joueurId === utilisateur.id) {
        navigate('/join');
      }
    });

    socket.on('gagnant', (data: { equipeGagnante: string }) => {
      console.log(`L'équipe gagnante est : ${data.equipeGagnante}`);
      setEquipeGagnante(data.equipeGagnante);
      setTimeout(() => setEquipeGagnante(null), 8000);
    });

    socket.on('partieJoin', () => {
      navigate(`/teams/${partieId}`);
    });
    
    return () => {
      socket.off('majPartie', majHandler);
      socket.off('joueurVire');
    };
  }, [partieId, utilisateur]);
  

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
    socket.emit('quitterPartie', {partieId : partieIdNumber, utilisateurId: utilisateur.id});
    navigate('/join');
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

  if (!partie)  { chargerPartie(); 
    chargerIndice();
    return <p>Chargement...</p>;
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
            <button onClick={bouttonJoueurs} className="text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-xs sm:text-sm md:text-sm px-1 py-1 sm:px-2.5 sm:py-2.5 md:px-2.5 md:py-2.5 text-center mb-1 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900">Joueurs : 👤 {partie.membres.length}</button>
            {montrerJoueurs && (
              <div className="absolute left-0 mt-1 w-{100%} bg-[#222] shadow-xl border border-yellow-400 text-white rounded shadow-lg z-10 flex flex-col p-1 ">
                <p className='text-[10px]'>Joueurs dans la partie:</p>
                {/* Liste des joueurs */}
                <div className="flex flex-wrap gap-x-1 gap-y-1">
                  {partie.membres.map((m: any) => (
                    <div className="flex sm:flex-row justify-between items-center mb-1 gap-2 relative">
                      <button onClick={() => setJoueurSelectionne(joueurSelectionne === m.utilisateur.pseudo ? null : m.utilisateur.pseudo)} key={m.utilisateur.id} className="text-[10px] text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-1 py-1 text-center mb-1 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800 w-auto disabled " disabled={!isHost() || getJoueurIdByPseudo(m.utilisateur.pseudo)==partie?.createurId}>{m.utilisateur.pseudo}</button>
                      {/* Bulle d'options */}
                      {joueurSelectionne === m.utilisateur.pseudo && (
                        <div className="absolute left-[50%]  -translate-x-1/2 mt-1 top-full w-[330%] bg-[#222] text-black rounded shadow-xl z-10 flex flex-col p-1 text-[10px] border border-blue-500 items-center">
                          <p className="text-center text-white">{m.utilisateur.pseudo}</p>
                          <button onClick={expulser} className="w-full text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-[10px] px-1 py-1 text-center mb-1 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">Expulser</button>
                          <button onClick={mettreHote} className="w-full text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-[10px] px-1 py-1 text-center mb-2 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900">Mettre Hôte</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Ligne de séparation */}
                <div className="border-t border-gray-800 w-[90%] mx-auto mb-1"></div>
                <p className='text-[10px] text-center'>Copiez le code de la partie et partagez le avec vos amis!</p>
                {/* Bouton de copie */}
                <button onClick={() => navigator.clipboard.writeText(partie.id)} className="text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-[10px] px-1 py-1 text-center mb-1 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900" >Copier le code</button>
              </div>
            )}
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            {isHost() && (
            <div className="relative inline-block">
              <button onClick={afficherConfirmer}  className="text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-xs sm:text-sm md:text-sm px-1 py-1 sm:px-2.5 sm:py-2.5 md:px-2.5 md:py-2.5 text-center mb-1 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900">🔄 Réinitialiser</button>
              {confirmerReinit && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-1 w-[100%] bg-[#222] border border-yellow-400 rounded shadow-lg z-10 flex flex-col gap-2 p-2 items-center">
                  <p className="text-[10px] text-red-500 text-center">Êtes-vous sûr de vouloir réinitialiser la partie ?</p>
                  <button onClick={renitPartie} className="text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-[10px] px-1 py-1 text-center mb-1 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900">Confirmer Réinitialisation</button>
                </div>
              )}
            </div>
            )}    
            <button className="text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-xs sm:text-sm md:text-sm px-1 py-1 sm:px-2.5 sm:py-2.5 md:px-2.5 md:py-2.5 text-center mb-2 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900">📜 Règles</button>    
            <div className="relative">
              <button onClick={bouttonUtilisateur} className="text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-xs sm:text-sm md:text-sm px-1 py-1 sm:px-2.5 sm:py-2.5 md:px-2.5 md:py-2.5 text-center mb-2 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900">{utilisateur.pseudo}</button>
              {montrerOptions && (
                <div className="absolute right-0 mt-2 sm:w-[150%] md:w-[150%] bg-[#222] border border-yellow-400 rounded shadow-xl z-10 flex flex-col gap-2 p-2">
                  <button  onClick={devenirSpec} className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-[10px] px-1 py-1 text-center mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800">Devenir Spectateur</button>
                  {getEquipeUtilisateur() === "ROUGE" &&(<button  onClick={handleClickChangeTeam} className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-[10px] px-1 py-1 text-center mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">↔️ Changer d'équipe</button>)}
                  {getEquipeUtilisateur() === "BLEU" &&(<button  onClick={handleClickChangeTeam} className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-[10px] px-1 py-1 text-center mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">↔️ Changer d'équipe</button>)}
                  <button  onClick={quitterPartie} className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-[10px] px-1 py-1 text-center mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">Quitter la Partie</button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={styles.message}>
        {/*Messages changeant selon le tour */}
          {equipeEnCours!= equipeUtilisateur && roleEncours ==="MAITRE_ESPION" &&(<h1 className="text-[100%] text-white font-bold text-center mb-4 w-full">Les Espions adverses sont en train de jouer, veuillez attendre votre tour...</h1>)}
          {equipeEnCours!= equipeUtilisateur && roleEncours ==="AGENT" &&(<h1 className="text-[100%] text-white font-bold text-center mb-4 w-full">Les Agents adverses sont en train de jouer, veuillez attendre votre tour...</h1>)}
          {equipeEnCours === equipeUtilisateur && roleEncours ==="MAITRE_ESPION" && roleEncours != roleUtilisateur &&(<h1 className="text-[100%] text-white font-bold text-center mb-4 w-full">Vos espions sont en train de jouer, veuillez attendre votre indice...</h1>)}
          {equipeEnCours === equipeUtilisateur && roleEncours ==="AGENT" && roleEncours != roleUtilisateur &&(<h1 className="text-[100%] text-white font-bold text-center mb-4 w-full">Vos Agents font de leur mieux pour trouver vos mots !</h1>)}
          {equipeEnCours === equipeUtilisateur && roleEncours ==="AGENT" && roleEncours === roleUtilisateur &&(<h1 className="text-[100%] text-white font-bold text-center mb-4 w-full">Utilisez les indices donnés par vos Espions pour trouver vos mots !</h1>)}
          {equipeEnCours === equipeUtilisateur && roleEncours ==="MAITRE_ESPION" && roleEncours === roleUtilisateur &&(<h1 className="text-[100%] text-white font-bold text-center mb-4 w-full">Trouvez le meilleur indice pour que vos Agents puissent trouver vos mots !</h1>)}
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
          <div className="bg-red-500 rounded w-full">
            <p className='text-center font-bold text-xl mt-2'>{nbCarteRouge}</p>
            <div className="border-t border-red-800 mb-1 w-[90%] mx-auto"></div>
            {montrerBouttonAgentRouge && (
              <div className="flex justify-center mb-1">
                <button onClick={handleRedAgentClick} className='text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-[10px] px-1 py-1 text-center mb-1 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900'>Devenir agent</button>
              </div>
            )}
              <h3 className="font-bold text-center mb-1">Agents</h3>
            {partie.membres.filter((m: any) => m.equipe === 'ROUGE' && m.role === 'AGENT').map((m: any) => (
              <p className="text-[12px] text-center" key={m.utilisateur.id}>{m.utilisateur.pseudo}</p>
            ))}
            {montrerBouttonEspionRouge && (
              <div className="flex justify-center mb-1">
                <button onClick={handleRedEspionClick} className='text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-[10px] px-1 py-1 text-center mb-1 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900'>Devenir espion</button>
              </div>
            )}
              <h3 className="font-bold text-center mb-1">Espions</h3>
            {partie.membres.filter((m: any) => m.equipe === 'ROUGE' && m.role === 'MAITRE_ESPION').map((m: any) => (
              <p className=" text-[12px] text-center mb-2" key={m.utilisateur.id}>{m.utilisateur.pseudo}</p>
            ))}
          </div>
        </div>
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
          </AnimatePresence>
          <div className="grid grid-cols-5 gap-2 p-6 rounded-lg w-full h-full z-10">
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
        </div>
        <div className={styles.bleu}>
          {/*Cote bleu et historique*/}
          <div className="w-1/5 flex flex-col w-full">
            <div className="bg-blue-700 text-black rounded w-full">
              <p className='text-center font-bold text-xl mt-2'>{nbCarteBleu}</p>
              <div className="border-t border-blue-900 mb-1 w-[90%] mx-auto"></div>
              {montrerBouttonAgentBleu && (
                <div className="flex justify-center mb-1">
                  <button onClick={handleBlueAgentClick} className='text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-[10px] px-1 py-1 text-center mb-1 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900'>Devenir agent</button>
                </div>
              )}
                <h3 className="font-bold text-center">Agents</h3>   
              {partie.membres.filter((m: any) => m.equipe === 'BLEU' && m.role === 'AGENT' ).map((m: any) => (    
                <p className="text-[12px] text-center" key={m.utilisateur.id}>{m.utilisateur.pseudo}</p>   
              ))}
              {montrerBouttonEspionBleu && (
                <div className="flex justify-center mb-1">
                  <button onClick={handleBlueEspionClick} className='text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-[10px] px-1 py-1 text-center mb-1 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900'>Devenir espion</button>
                </div>
              )}     
                <h3 className="font-bold text-center mt-2">Espions</h3>    
              {partie.membres.filter((m: any) => m.equipe === 'BLEU' && m.role === 'MAITRE_ESPION' ).map((m: any) => (    
                <p className="text-[12px] text-center" key={m.utilisateur.id}>{m.utilisateur.pseudo}</p>   
              ))}  
            </div>
          </div>
        </div>
        <div>
          <div className={styles.historique}>
            <div className="bg-gray-800 p-2 rounded mt-4 h-[30vh] sm:h-[24vh] md:h-[30vh] lg:h-[60vh] flex flex-col w-full">     
              <p className="text-xs text-center">Historique</p>
              {/* Ligne de séparation */}
              <div className="border-t border-gray-300 mt-2 mb-2"></div>
              <div className="custom-scrollbar overflow-y-auto overflow-x-hidden bg-gray-700 rounded-lg p-1 border border-gray-600">
                {partie.actions.map((action: any) => (    
                  <p key={action.id} className="text-xs py-1">
                    {action.utilisateur?.pseudo} {action.motDonne && `a donné l'indice : ${action.motDonne}`}
                    {action.carte && `a sélectionné : ${action.carte.mot.mot}`}
                  </p>            
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Zone indices - Seulement pour maître espion */}
        {roleUtilisateur === 'MAITRE_ESPION' && equipeUtilisateur === equipeEnCours && roleEncours === 'MAITRE_ESPION' &&(
          <div className={styles.indice}>
            <div className="p-4 rounded text-center w-full">
              <h2 className="text-l text-white sm:text-xl">Donner un indice</h2>
              <input
                type="text"
                value={motIndice}
                onChange={(e) => setMotIndice(e.target.value)}
                placeholder="Mot indice"
                className="p-2 rounded bg-gray-700 text-white mr-2"
              />
              <input
                type="number"
                value={nombreMots}
                onChange={(e) => setNombreMots(Number(e.target.value))}
                className="p-2 rounded bg-gray-700 text-white w-16"
              />
              <button onClick={donnerIndice} className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-2.5 py-2 ml-2 text-center dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800">
                Valider
              </button>
            </div>
          </div>
        )}
        {roleEncours === 'AGENT' && indice ? (
          <div className={styles.indice}>
            <div className=" w-full rounded text-white text-center">
              <h2 className="text-xl">Indice donné : {indice.mot} pour {indice.nbmots} mots </h2>
              {roleUtilisateur === 'AGENT' && equipeUtilisateur === equipeEnCours && roleEncours === 'AGENT' ? (
              <button onClick={passerTour} className="bg-green-500 px-4 py-2 ml-2 rounded mt-2">
                Valider
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