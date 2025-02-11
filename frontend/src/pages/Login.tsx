import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
      alert("Connexion réussie !");
      //Renvoi vers la page game
      navigate("/join");
      //Si le POST echoue, renvoi une erreur
    } catch (error: any) {
      setError(error.response?.data?.error || "Erreur de connexion front.");
    }
  };


  //HTML utilisant Tailwind css de la page de connexion
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="p-6 bg-white shadow-lg rounded">
        <h2 className="text-2xl font-bold">Connexion</h2>
        {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
        <input type="text" placeholder="Pseudo ou Email" className="border p-2 mt-2 w-full" onChange={(e) => setLogin(e.target.value)} />
        <div className="relative mt-2">
        <input type={showPassword ? "text" : "password"} placeholder="Mot de passe" className="border p-2 w-full pr-10" onChange={(e) => setPassword(e.target.value)} />
        <button type="button" className="absolute right-3 top-3 text-gray-600" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "🙈" : "👁️"}</button>
        </div>
        <button onClick={handleLogin} className="bg-blue-500 text-white p-2 mt-4 w-full disabled:bg-gray-400" disabled={!login || !password }>Se Connecter</button>
      </div>
    </div>
  );
}
