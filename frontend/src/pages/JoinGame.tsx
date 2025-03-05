import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getUtilisateur } from "../../utils/utilisateurs";
import { getToken } from "../../utils/token";
import "../index.css"
import styles from "../styles/login.module.css";


// import { io } from 'socket.io-client';

// const socket = io('http://localhost:3000');

export default function HomePage() {


  const [roomCode, setRoomCode] = useState("");
    const navigate = useNavigate();

    //langue du jeu
    const [language, setLanguage] = useState<"fr" | "en" | "ar">("fr"); 



//dictionnaire des langues (anglais ou francais)
const texts: { [key in "fr" | "en" | "ar"]: { title: string; createGame: string; joinGame: string; enterRoomCode: string; createdSuccess: string; joinedSuccess: string; errorCreate: string; errorJoin: string; } } = {
  fr: {
    title: "CodeNames",
    createGame: "Créer une nouvelle partie",
    joinGame: "Intégrer une partie existante",
    enterRoomCode: "Numéro de la partie",
    createdSuccess: "Nouvelle partie créée avec succès ! ID: ",
    joinedSuccess: "Vous avez rejoint la partie ",
    errorCreate: "Erreur lors de la création de la partie",
    errorJoin: "Erreur lors de la connexion à la partie",
  },
  en: {
    title: "CodeNames",
    createGame: "Create a new game",
    joinGame: "Join an existing game",
    enterRoomCode: "Game Room Number",
    createdSuccess: "New game created successfully! ID: ",
    joinedSuccess: "You have joined the game ",
    errorCreate: "Error creating the game",
    errorJoin: "Error joining the game",
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
  },
};



  //fonction pour créer une nouvelle partie

  const handleCreateRoom = async () => {
    const token = getToken();
    try {

      //ici on envoi une requete POST au backend pour créer une partie 
      const response = await axios.post("http://localhost:3000/api/join/create",{}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    
      if (response.status !== 200) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
      //message qui confirme que la partie a bien été créée
      alert(`Nouvelle partie créée avec succès ! ID: ${response.data.id}`);
      const data = JSON.stringify(response.data);
      localStorage.setItem("createurId", response.data);

      localStorage.setItem("partie", data);
      //on renvoi le joueur vers le lien de la partie
      navigate(`/teams/${response.data.id}`);
    } catch (error) {

    //si l'erreur vient d'axios on génère un message d'erreur 
      if (axios.isAxiosError(error)) {

        alert(error.response?.data?.error || " Erreur lors de la création de la partie (Axios)");
      } else {

      //dans le cas contraire 
        alert(`front Erreur lors de la création de la partie: ${error}`);

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

    try {
      // Envoi d'une requête POST au backend avec axios

      const response = await axios.post("http://localhost:3000/api/join/join-game", {
        roomCode,
      playerId: utilisateur.id,
      });

      //message dde confirmation qu'on a bien rejoint la partie
      alert(`Vous avez rejoint la partie ${response.data.game.id}`);
      localStorage.setItem("createurId", response.data.createurId);
      localStorage.setItem("partie", response.data);
      navigate(`/teams/${response.data.game.id}`);

    } catch (error) {


//on vérifie également si l'erreur vient d'axios
      if (axios.isAxiosError(error)) {

        alert(error.response?.data?.error || "Erreur lors de la connexion à la partie (Axios)");

      } else {


        alert("Erreur lors de la connexion à la partie front");

      }

    }
  };
  const handleChangeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as "fr" | "en" | "ar");
  };






  //les lignes qui suive concernent l'interface utilisateiur sur la page d'accueil

  return (
    <section className={styles.section}>
      {/* Carrés avec fond animé */}
        <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
        
        {/* Bouton de changement de langue */}
        <button
              className="z-[10] absolute top-4 right-4 w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition"
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
  
  
            {/* Logo */}
            <img
              src="src/assets/Logo_CodeNames_blanc.svg"
              alt="Logo"
              className="z-[10] absolute top-0 left-0 w-20 h-auto"
            />
  
  
        
        
  
  
        
        
  <div className={styles.signin}>
  <div className={styles.content}>
  
  
  
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
  
  
            
      
            
        
  
            {/* Code de la salle */}
              <input
                type="text"
                placeholder={texts[language].enterRoomCode}
                className="z-[20] px-2 py-2 border border-gray-600 rounded-lg mb-2 text-black w-full"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
              />
  
              <button
                className="z-[20] bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                onClick={handleJoinRoom}
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