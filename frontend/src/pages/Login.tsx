/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../assets/Logo_CodeNames_blanc.svg';
import axios from "axios";
import { setUtilisateur } from '../../utils/utilisateurs';


export default function Login() {
  const [login, setLogin] = useState("");//Login povant être un email ou un pseudo
  const [password, setPassword] = useState("");//Mot de passe
  const [error, setError] = useState(""); // Stocke l'erreur à afficher
  const [showPassword, setShowPassword] = useState(false); // État pour afficher/masquer le mot de passe
  const navigate = useNavigate();//Permet de changer de page  

  //Gere la connexion
  const handleLogin = async () => {
    setError(""); // Reset de l'erreur

    //Essaye de faire un POST sur back pour gerer la connexion 
    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", {
        pseudo: login,
        email: login,
        mdp: password,
      });
      //Genere un token contenant les données de l'utilisateur connecté 
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("utilisateur", JSON.stringify(response.data.user));
      setUtilisateur(response.data.user);
      alert("Connexion réussie !");
      //Renvoi vers la page game
      navigate('/join', { state: { user: response.data.user } });
      //Si le POST echoue, renvoi une erreur
    } catch (error: any) {
      setError(error.response?.data?.error || "Erreur de connexion front.");
    }
  };


  //HTML utilisant Tailwind css de la page de connexion
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      {/*Pour placer le logo en haut a gauche*/}
      <div className="absolute top-4 left-4">
        <img src={logo} alt="Codenames Logo" className="w-20 h-20" />
      </div>
      <div className="grid grid-cols-2 gap-8 p-8 w-full max-w-7xl">
        {/*Partie qui se trouve a gauche*/}
        <div className="p-6 flex flex-col justify-center">
          <h1 className="text-gray-400 text-6xl font-bold mt-2">CodeNames</h1>
          <p className="text-gray-600 text-3xl font-bold mt-2">CodeNames est un jeu de déduction et d'association d'idées où deux équipes composées d'agents et espions. Le but est de faire identifier des mots aux agents secrets à partir d'indices donnés par leur espion. Attention!!! Un faux pas et tout peux basculer!</p>
        </div>

        {/*Partie qui se trouve a droite*/}
        <div className="flex flex-col items-center bg-gray-800 p-6 rounded-lg shadow-md justify-center">
          {/*Partie Connexion*/}
          <h2 className="text-gray-600 text-5xl font-bold mb-2">Connexion</h2>
          {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
          
          {/*Champ Pseudo ou Email*/}
          <input type="text" placeholder="Pseudo ou Email" className="border p-2 mt-2 w-full bg-gray-700 text-white rounded" onChange={(e) => setLogin(e.target.value)}/>
          {/*Champ mot de passe*/}
          <div className="relative mt-2 w-full">
            <input type={showPassword ? "text" : "password"} placeholder="Mot de passe" className="border p-2 w-full bg-gray-700 text-white rounded pr-10" onChange={(e) => setPassword(e.target.value)}/>
            <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300" onClick={() => setShowPassword(!showPassword)}> {showPassword ? "🙈" : "👁️"}</button>
          </div>
          <button onClick={handleLogin} className="bg-blue-500 text-white p-2 mt-4 w-full rounded disabled:bg-gray-400" disabled={!login || !password}> Se Connecter </button>
          {/*Partie redirigeant vers la connexion*/}
          <div className="w-full border-t border-gray-700 mt-4 pt-4">
            <p className="text-gray-600 text-2xl font-bold text-center"> Vous n'avez toujours pas de compte ? </p>
            <p className="text-gray-600 text-2xl font-bold text-center mb-6"> Inscrivez-vous! </p> 
            <button onClick={() => { window.location.href = "/register";}} className="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-600" > S'inscrire </button>
          </div>
        </div>
      </div>
    </div>
  );
}
