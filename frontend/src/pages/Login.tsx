import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Stocke l'erreur à afficher
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError(""); // Reset de l'erreur
    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", {
        pseudo: login,
        email: login,
        mdp: password,
      });

      localStorage.setItem("token", response.data.token);
      alert("Connexion réussie !");
      navigate("/game");
    } catch (error: any) {
      setError(error.response?.data?.error || "Erreur de connexion front.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="p-6 bg-white shadow-lg rounded">
        <h2 className="text-2xl font-bold">Connexion</h2>
        {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
        <input type="text" placeholder="Pseudo ou Email" className="border p-2 mt-2 w-full" onChange={(e) => setLogin(e.target.value)} />
        <input type="password" placeholder="Mot de passe" className="border p-2 mt-2 w-full" onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin} className="bg-blue-500 text-white p-2 mt-4 w-full disabled:bg-gray-400" disabled={!login || !password }>Se Connecter</button>
      </div>
    </div>
  );
}
