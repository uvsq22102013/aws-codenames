import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getUtilisateur } from "../../utils/utilisateurs";
import { getToken } from "../../utils/token";
// import { io } from 'socket.io-client';

// const socket = io('http://localhost:3000');

export default function HomePage() {


  const [roomCode, setRoomCode] = useState("");
    const navigate = useNavigate();

    //langue du jeu
    const [language, setLanguage] = useState<"fr" | "en">("fr"); 


    //dictionnaire des langues (anglais ou francais)
    const texts: { [key in "fr" | "en"]: { title: string; createGame: string; joinGame: string; enterRoomCode: string; createdSuccess: string; joinedSuccess: string; errorCreate: string; errorJoin: string; } } = {
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




  //les lignes qui suive concernent l'interface utilisateiur sur la page d'accueil

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">


<button
        className="absolute top-4 right-4 w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition"
        onClick={() => setLanguage(language === "fr" ? "en" : "fr")}
      >
        {language === "fr" ? "EN" : "FR"}
      </button>

      <h1 className="text-3xl font-bold mb-6">{texts[language].title}</h1>

      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={handleCreateRoom}
      >
        {texts[language].createGame}
      </button>

      <div className="flex flex-col items-center bg-gray-800 p-4 rounded-lg shadow-md">
        <input
          type="text"
          placeholder={texts[language].enterRoomCode}
          className="px-3 py-2 border border-gray-600 rounded mb-2 text-black"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
        />

        <button
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          onClick={handleJoinRoom}
        >
          {texts[language].joinGame}
        </button>
      </div>
    </div>
  );
}