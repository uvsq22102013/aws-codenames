import { useState } from "react";

export default function HomePage() {
  const [roomCode, setRoomCode] = useState("");

  // Fonction pour créer une nouvelle partie
  const handleCreateRoom = async () => {
    try {
      // Envoi d'une requête POST pour créer une nouvelle partie
      const response = await fetch("http://localhost:3000/game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ createurId: 1 }) //id de l'utilisateur (à modifier avec l'utilisateur réel)
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création de la partie");
      }

      const data = await response.json();
      alert(`Nouvelle partie créée avec succès ! ID: ${data.id}`);
      // Rediriger l'utilisateur vers la nouvelle partie (par exemple vers la page de jeu)
      window.location.href = `/game/${data.id}`;

    } catch (error) {
      alert(error);
    }
  };

  // Fonction pour rejoindre une partie existante
  const handleJoinRoom = async () => {
    if (roomCode.trim() === "") {
      alert("Veuillez entrer un numéro de partie");
      return;
    }

    try {
      // Envoi d'une requête POST pour rejoindre une partie
      const response = await fetch("http://localhost:3000/join-game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomCode }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || "Erreur inconnue");
        return;
      }

      const data = await response.json();
      alert(`Vous avez rejoint la partie ${data.game.id}`);
      // Rediriger l'utilisateur vers la page de la partie
      window.location.href = `/game/${data.game.id}`;

    } catch (error) {
      alert("Erreur lors de la connexion à la partie");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">CodeNames</h1>
      <button 
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={handleCreateRoom}
      >
        Créer une nouvelle partie 
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