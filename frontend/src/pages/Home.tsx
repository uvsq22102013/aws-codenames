import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600">Bienvenue sur Codenames !</h1>
      <Link to="/login" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Se Connecter</Link>
      <Link to="/register" className="mt-2 px-4 py-2 bg-green-500 text-white rounded">S'inscrire</Link>
    </div>
  );
}
