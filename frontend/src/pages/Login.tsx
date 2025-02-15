import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        mdp: password,
      });

      localStorage.setItem("token", response.data.token);
      alert("Connexion réussie !");
      navigate("/game");
    } catch (error) {
      alert("Erreur de connexion.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="p-6 bg-white shadow-lg rounded">
        <h2 className="text-2xl font-bold">Connexion</h2>
        <input type="email" placeholder="Email" className="border p-2 mt-2 w-full" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Mot de passe" className="border p-2 mt-2 w-full" onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin} className="bg-blue-500 text-white p-2 mt-4 w-full">Se Connecter</button>
      </div>
    </div>
  );
}
