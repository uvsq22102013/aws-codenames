import { useState } from "react";

export default function HomePage() {
  const [roomCode, setRoomCode] = useState("");

  const handleCreateRoom = () => {
    alert("Nouvelle partie créée !");
    //Code pour rediriger vers la nouvelle salle
  };

  const handleJoinRoom = () => {
    if (roomCode.trim() === "") {
      alert("Veuillez entrer un numéro de partie");
      return;
    }
    alert(`Connexion au salon ${roomCode}...`);
    // Code pour rejoindre la salle
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