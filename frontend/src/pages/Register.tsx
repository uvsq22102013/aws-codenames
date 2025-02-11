import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [pseudo, setPseudo] = useState("");//Pseudo
  const [email, setEmail] = useState("");//Email
  const [password, setPassword] = useState("");//Mot de passe
  const [password2, setPassword2] = useState("");//Confirmer le mot de passe
  const [error, setError] = useState(""); // Stocke l'erreur à afficher
  const [showPassword, setShowPassword] = useState(false); // État pour afficher/masquer le mot de passe
  const [showPassword2, setShowPassword2] = useState(false); // État pour afficher/masquer la confirmation du mot de passe
  const navigate = useNavigate();//Pour aller vers la page suivante

  // Fonction de validation du mot de passe 
  const validatePassword = (password: string) => {
    //Expression regulière pour le mot de passe 
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    //Teste la vlidité du mot de passe   
    return regex.test(password);
  };

  // Fonction de validation d'email  
  const validateEmail = (email: string) => {
    //Expression regulière pour le mail   
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //Teste la validité de l'email  
    return regex.test(email);
  };
  
  //Gerer l'inscription
  const handleRegister = async () => {
    setError(""); // Reset de l'erreur 
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
    //Essaye de faire un POST sur le back pour gerer une inscription 
    try {
      await axios.post("http://localhost:3000/api/auth/register", {
        pseudo,
        email,
        mdp: password,
        mdp2: password2,
      });
      alert("Inscription réussie !");
      //Renvoi vers la page de connexion 
      navigate("/login");
      //Renvoi une erreur si le POST echoue 
    } catch (error: any) {
      setError(error.response?.data?.error || "Erreur d'inscription front.");
    }
  };
  //HTML utilisant Tailwind css de la page de Inscription
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
