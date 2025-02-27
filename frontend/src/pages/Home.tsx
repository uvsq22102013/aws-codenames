import { Link } from "react-router-dom";
import logo from '../assets/Logo_CodeNames_blanc.svg';
import "../index.css"

export default function Home() {
  //HTML utilisant Tailwind css de la page d'Accueil  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0f1f]">
      <img src={logo} alt="Codenames Logo" className="w-42 h-40=2 mb-4" />
      <h1 className="text-4xl font-bold text-blue-300">Bienvenue sur Codenames !</h1>
      <Link to="/login" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Se Connecter</Link>
      <Link to="/register" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">S'inscrire</Link>
      <p className="mt-4 font-bold text-blue-300">À vous de décrypter le message !</p>
    </div>

  );
}
