import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState(""); // Stocke l'erreur à afficher
  const [showPassword, setShowPassword] = useState(false); // État pour afficher/masquer le mot de passe
  const [showPassword2, setShowPassword2] = useState(false); // État pour afficher/masquer la confirmation du mot de passe
  const navigate = useNavigate();

  // Fonction de validation du mot de passe
  const validatePassword = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  };
  // Fonction de validation d'email
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleRegister = async () => {
    setError(""); // Reset de l'erreur

    // Vérification des champs avant envoi
    if (!pseudo || !email || !password || !password2) {
      setError("Tous les champs sont requis.");
      return;
    }
    //verifie si le mail est valide
    if (!validateEmail(email)) {
      setError("L'email n'est pas valide.");
      return;
    }
    //verifie que les mdp sont identiques
    if (password !== password2) {
      setError("Les mots de passe doivent être identiques.");
      return;
    }
    // verifie si le mdp est valide
    if (!validatePassword(password)) {
      setError("Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.");
      return;
    }
    try {
      await axios.post("http://localhost:3000/api/auth/register", {
        pseudo,
        email,
        mdp: password,
        mdp2: password2,
      });
      alert("Inscription réussie !");
      navigate("/login");
    } catch (error: any) {
      setError(error.response?.data?.error || "Erreur d'inscription front.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="p-6 bg-white shadow-lg rounded">
        <h2 className="text-2xl font-bold">Inscription</h2>
        {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
        <input type="text" placeholder="Pseudo" className="border p-2 mt-2 w-full" onChange={(e) => setPseudo(e.target.value)} />
        <input type="email" placeholder="Email" className="border p-2 mt-2 w-full" onChange={(e) => setEmail(e.target.value)} />
        <div className="relative mt-2">
          <input type={showPassword ? "text" : "password"} placeholder="Mot de passe" className="border p-2 w-full pr-10" onChange={(e) => setPassword(e.target.value)} />
          <button type="button" className="absolute right-3 top-3 text-gray-600" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "🙈" : "👁️"}</button>
        </div>
        <div className="relative mt-2">
          <input type={showPassword2 ? "text" : "password"} placeholder="Confirmez le mot de passe" className="border p-2 w-full pr-10" onChange={(e) => setPassword2(e.target.value)} />
          <button type="button" className="absolute right-3 top-3 text-gray-600" onClick={() => setShowPassword2(!showPassword2)}>{showPassword2 ? "🙈" : "👁️"}</button>
        </div>
        <button onClick={handleRegister} className="bg-green-500 text-white p-2 mt-4 w-full disabled:bg-gray-400" disabled={!pseudo || !email || !password || !password2}>S'inscrire</button>
      </div>
    </div>
  );
}
