/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getUtilisateur } from "../../utils/utilisateurs";
import { getToken } from "../../utils/token";
import "../index.css"
import styles from "../styles/Login.module.css";
import { useLanguage } from "../Context/LanguageContext";
import socket from '../../utils/socket';



const RECAPTCHA_SITE_KEY = "6LdyAwArAAAAAG1XpNn7GuvvpwNnhBkv4kWCVSzg";



export default function HomePage() {


  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();

  //langue du jeu
  const { language, setLanguage } = useLanguage();
  const [errorMessage, setErrorMessage] = useState(""); 
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [montrerOptions, setMontrerOption] = useState(false);



//dictionnaire des langues (anglais ou francais)
const texts: { [key in "fr" | "en" | "ar"]: { title: string; createGame: string; joinGame: string; enterRoomCode: string; createdSuccess: string; joinedSuccess: string; errorCreate: string; errorJoin: string; wrongGameCode: string; deco: string} } = {
  fr: {
    title: "CodeNames",
    createGame: "Créer une nouvelle partie",
    joinGame: "Intégrer une partie existante",
    enterRoomCode: "Code Partie",
    createdSuccess: "Nouvelle partie créée avec succès ! ID: ",
    joinedSuccess: "Vous avez rejoint la partie ",
    errorCreate: "Erreur lors de la création de la partie",
    errorJoin: "Erreur lors de la connexion à la partie",
    wrongGameCode: "Mauvais Code Partie",
    deco: "Se déconnecter",
  },
  en: {
    title: "CodeNames",
    createGame: "Create a new game",
    joinGame: "Join an existing game",
    enterRoomCode: "Game Code",
    createdSuccess: "New game created successfully! ID: ",
    joinedSuccess: "You have joined the game ",
    errorCreate: "Error creating the game",
    errorJoin: "Error joining the game",
    wrongGameCode: "Wrong Game Code",
    deco: "Log out",
  },
  ar: {
    title: "CodeNames",
    createGame: "إنشاء لعبة جديدة",
    joinGame: "الانضمام إلى لعبة موجودة",
    enterRoomCode: "رقم غرفة اللعبة",
    createdSuccess: "تم إنشاء لعبة جديدة بنجاح! الرقم: ",
    joinedSuccess: "لقد انضممت إلى اللعبة ",
    errorCreate: "خطأ في إنشاء اللعبة",
    errorJoin: "خطأ في الانضمام إلى اللعبة",
    wrongGameCode: "رمز الجزء السيئ",
    deco: "قطع الاتصال",
  },

};





  //fonction pour créer une nouvelle partie

  const handleCreateRoom = async () => {
    if (!window.grecaptcha) {
      setErrorMessage("Erreur de chargement reCAPTCHA");
      return;
    }

    // Récupérer le token reCAPTCHA
    const recaptchaToken = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: "create_game" });

    try {

      axios.defaults.withCredentials = true;
  
      const response = await axios.post("/api/join/create", { recaptchaToken, language });
    
      if (response.status !== 200) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
      //message qui confirme que la partie a bien été créée
      const data = JSON.stringify(response.data);
      sessionStorage.setItem("partie", data);

      //on renvoi le joueur vers le lien de la partie
      navigate(`/teams/${response.data.id}`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.error === "Deja dans une partie") {
        const partieId = error.response.data.partieId;
        const utilisateur = getUtilisateur();
        socket.emit('quitterPartie', { partieId, utilisateurId: utilisateur.id });
        handleCreateRoom();
      } else {
        setErrorMessage(texts[language].errorCreate);
      }
    }



  };

// Fonction pour rejoindre une partie existante
const handleJoinRoom = async () => {

// verifie si l'utilisateur entre quelque chose
    const utilisateur = getUtilisateur();

    if (roomCode.trim() === "") {


      alert("Veuillez entrer un numéro de partie");
      return;

    }


    //RecApctha token
    if (!window.grecaptcha) {
      setErrorMessage("Erreur de chargement reCAPTCHA");
      return;
    }

    // Récupérer le token reCAPTCHA
    const recaptchaToken = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: "join_game" });

    if (!recaptchaToken) {
      setErrorMessage("Échec de la vérification reCAPTCHA");
      return;
    }

    try {

      axios.defaults.withCredentials = true;

      const response = await axios.post("/api/join/join-game", {
        roomCode,
        recaptchaToken,
        utilisateurId: utilisateur.id,
      });

      const data = response.data;
      sessionStorage.setItem("partie", JSON.stringify(data.game));
  
      navigate(`/teams/${response.data.game.id}`);

    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.error === "Deja dans une partie") {
        const partieId = error.response.data.partieId;
        const utilisateur = getUtilisateur();
        socket.emit('quitterPartie', { partieId, utilisateurId: utilisateur.id });
        handleJoinRoom();
      } else {
        setErrorMessage(texts[language].wrongGameCode);
        }
      }
  };

  const handleChangeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = e.target.value as "fr" | "en" | "ar";
    setLanguage(selectedLanguage);  // Met à jour la langue via le contexte
  };

//fonction pour se deconnecter
  const deconnexion = () => {
    socket.emit('deconnexion', { utilisateurId: getUtilisateur().id });
    //redirection vers la page de connexion
    navigate('/');
    sessionStorage.removeItem('utilisateur'); 
    sessionStorage.removeItem('token'); 

};


const bouttonUtilisateur = () => {
  setMontrerOption(!montrerOptions);
}
sessionStorage.removeItem('partie');

  

  //les lignes qui suive concernent l'interface utilisateiur sur la page d'accueil

  return (
    <section className={styles.section}>
      {/* Carrés avec fond animé */}
        <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
        
        <div className="z-[10] absolute top-4 right-4 flex items-center gap-3">
          {/* Bouton pseudo */}
          <div className="relative">
            <button
              className="w-auto min-w-20 h-10 px-1 rounded-lg bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition border-2 shadow-lg text-yellow-400 hover:text-white border-yellow-400 hover:bg-yellow-500"
              onClick={bouttonUtilisateur}
            >
              {getUtilisateur()?.pseudo}
            </button>
            
            {montrerOptions && (
              <div className="absolute top-full right-0 w-full bg-[#222] border border-yellow-400 rounded shadow-lg z-10 flex flex-col gap-2 p-2 items-center mt-1">
                <button
                  onClick={deconnexion}
                  className=" flex flex-wrap text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-[10px] px-1 py-1 text-center mb-1 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900"
                >
                  {texts[language].deco}
                </button>
              </div>
            )}
          </div>

          {/* Bouton langue */}
          <button
            className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition"
            onClick={() => {
              if(language === "fr") {
                setLanguage("en")
              } else if(language === "en") {
                setLanguage("ar")
              } else {
                setLanguage("fr")
              }
            }}
            style={{
              backgroundImage: `url(${"public/images/" + language + ".png"})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              clipPath: "circle(50% at center)",
            }}
          ></button>
        </div>



  
  
            {/* Logo */}
            <img
              src="src/assets/Logo_CodeNames_blanc.png"
              alt="Logo"
              className="z-[10] absolute top-0 left-0 w-40 h-auto"
            />
        
        
  <div className={styles.signin}>
  <div className={styles.content}>


            {/*<button
              className="text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-xs sm:text-sm md:text-sm px-1 py-1 sm:px-2.5 sm:py-2.5 md:px-2.5 md:py-2.5 text-center mb-2 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900"
              onClick={deconnexion}
            >
              Se déconnecter
            </button>*/}

  
            {/* Titre */}
            <h1 className="z-[20] text-3xl font-bold text-blue-500 mb-6">
                {texts[language].title}
              </h1>
  
  
              {/* Sélecteur de langue */}
              <div className="flex items-center mb-4">
              <select
                value={language}
                onChange={handleChangeLanguage}
                className="bg-gray-700 text-white px-3 py-2 rounded-md shadow-md w-40 flex items-center"
              >
                <option value="fr" className="flex items-center">
                  {/* Drapeau France */}
                  <span className="fi fi-fr mr-2"></span>Français
                </option>
                <option value="en" className="flex items-center">
                  {/* Drapeau UK */}
                  <span className="fi fi-gb mr-2"></span>English
                </option>
                <option value="ar" className="flex items-center">
                  {/* Drapeau Arabie Saoudite */}
                  <span className="fi fi-sa mr-2"></span>العربية
                </option>
              </select>
            </div>

              <div className={styles.form}>
    
            {/* Affichage du message d'erreur */}
            {errorMessage && (
              <p className="z-[20] text-red-500 font-bold mb-2 text-center mx-auto">{errorMessage}</p>
            )}
            {/* Code de la salle */}
              <input
                type="text"
                placeholder={texts[language].enterRoomCode}
                className="z-[20] px-2 py-2 border border-gray-600 rounded-lg mb-2 text-black w-full"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
              />
  
            <button
                className={`z-[20] font-bold py-2 px-4 rounded-lg shadow-lg transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                  roomCode.trim() === ""
                    ? "bg-blue-800 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-400"
                }`}
                onClick={handleJoinRoom}
                disabled={roomCode.trim() === ""}
              >
                {texts[language].joinGame}
              </button>
  
              
  
            {/* Bouton pour créer une salle */}
            <button
              className="z-[10] bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
              onClick={handleCreateRoom}
  >
              {texts[language].createGame}
            </button>
  
            
            </div>
            </div>
            </div>
          
            
            
    </section>
  );
  }