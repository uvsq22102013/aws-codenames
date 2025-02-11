import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function HomePage() {


  const [roomCode, setRoomCode] = useState("");
    const navigate = useNavigate();

  //fonction pour créer une nouvelle partie

  const handleCreateRoom = async () => {

    try {


      //ici on envoi une requete POST au backend pour créer une partie 
      const response = await axios.post("http://localhost:3000/api/game/create", {

        createurId: 1, //ID du créateur de la partie est 2 (à modifier plus tard)

      });

      //message qui confirme que la partie a bien été créée
       alert(`Nouvelle partie créée avec succès ! ID: ${response.data.id}`);
       
      //on renvoi le joueur vers le lien de la partie
      navigate(`/game/${response.data.id}`);

      
    } catch (error) {

//si l'erreur vient d'axios on génère un message d'erreur 
      if (axios.isAxiosError(error)) {


        alert(error.response?.data?.error || " Erreur lors de la création de la partie (Axios)");
      } else {

//dans le cas contraire 
        alert("Erreur lors de la création de la partie");

      }
    }


  };

  // Fonction pour rejoindre une partie existante
  const handleJoinRoom = async () => {

// verifie si l'utilisateur entre quelque chose
    if (roomCode.trim() === "") {


      alert("Veuillez entrer un numéro de partie");
      return;

    }

    try {
      // Envoi d'une requête POST au backend avec axios

      const response = await axios.post("http://localhost:3000/api/game/join-game", {
        roomCode,


      });

      //message dde confirmation qu'on a bien rejoint la partie
      alert(`Vous avez rejoint la partie ${response.data.game.id}`);


      //redirige vers la partie
      window.location.href = `/game/${response.data.game.id}`;



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

      <h1 className="text-3xl font-bold mb-6">CodeNames</h1>

      <button 
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={handleCreateRoom}
      >
        Creer une nouvelle partie 
      </button>


      <div className="flex flex-col items-center bg-gray-800 p-4 rounded-lg shadow-md">

        <input 
          type="text" 
          placeholder="Numéro de la partie" 
          className="px-3 py-2 border border-gray-600 rounded mb-2 text-black"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
        />


        <button 
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          onClick={handleJoinRoom}
        >
          Intégrer une partie existante
        </button>
      </div>
    </div>
  );
}