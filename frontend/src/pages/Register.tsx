import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:3000/api/auth/register", {
        pseudo,
        email,
        mdp: password,
      });
      alert("Inscription réussie !");
      navigate("/login");
    } catch (error) {
      alert("Erreur d'inscription front.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="p-6 bg-white shadow-lg rounded">
        <h2 className="text-2xl font-bold">Inscription</h2>
        <input type="text" placeholder="Pseudo" className="border p-2 mt-2 w-full" onChange={(e) => setPseudo(e.target.value)} />
        <input type="email" placeholder="Email" className="border p-2 mt-2 w-full" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Mot de passe" className="border p-2 mt-2 w-full" onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleRegister} className="bg-green-500 text-white p-2 mt-4 w-full">S'inscrire</button>
      </div>
    </div>
  );
}
