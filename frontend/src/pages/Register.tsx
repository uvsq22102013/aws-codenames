import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../assets/Logo_CodeNames_blanc.svg';
import axios from "axios";

export default function Register() {
  const [pseudo, setPseudo] = useState("");//Pseudo
  const [email, setEmail] = useState("");//Email
  const [password, setPassword] = useState("");//Mot de passe
  const [password2, setPassword2] = useState("");//Confirmer le mot de passe
  const [error, setError] = useState(""); // Stocke l'erreur à afficher
  const [showPassword, setShowPassword] = useState(false); // État pour afficher/masquer le mot de passe
  const [showPassword2, setShowPassword2] = useState(false); // État pour afficher/masquer la confirmation du mot de passe
  const [emailError, setEmailError] = useState("");// Erreur du mail invalide
  const [passwordError, setPasswordError] = useState("");// Erreur du mot de passe invalide
  const [passwordMatchError, setPasswordMatchError] = useState("");// Erreur du mot de passe invalide
  const navigate = useNavigate();//Pour aller vers la page suivante

  //Fonction de validation du mot de passe 
  const validatePassword = (password: string) => {
    //Expression regulière pour le mot de passe 
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if ((!regex.test(password)) && (password != "")) {
      setPasswordError("Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spéciale.");
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  //Fonction de validation d'email  
  const validateEmail = (email: string) => {
    //Expression regulière pour le mail   
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if ((!regex.test(email)) && (email != "")) {
      setEmailError("Veuillez entrer une adresse email valide.");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

  //Fonction qui vérifie si les mots de passe sont identiques 
  const validatePasswordMatch = (password : String, password2 : String) => {  
    if ((password2 != password) && (password2 != "")) {
      setPasswordMatchError("Le mot de passe est différent.");
      return false;
    } else {
      setPasswordMatchError("");
      return true;
    }
  };

  //Gere le changement pour l'email
  const handleEmailChange = (e : any) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value); //Valide l'email en temps réel
  };

  //Gere le changement pour le mot de passe
  const handlePasswordChange = (e : any) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value); //Valide le mot de passe en temps réel
  };

  // Gere le changement pour la confirmation du mot de passe
  const handlePassword2Change = (e : any) => {
    const value = e.target.value;
    setPassword2(value);
    validatePasswordMatch(password,value); //Valide la correspondance entre les 2 mots de passe;
  };
  
  //Gerer l'inscription
  const handleRegister = async () => {
    setError(""); // Reset de l'erreur 
    //Essaye de faire un POST sur le back pour gerer une inscription 
    try {
      await axios.post("/api/auth/register", {
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
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      {/*Pour placer le logo en haut a gauche*/}
      <div className="absolute top-4 left-4">
        <img src={logo} alt="Codenames Logo" className="w-20 h-20" /> {/* Ajustez la taille ici */}
      </div>
      <div className="grid grid-cols-2 gap-8 p-8 w-full max-w-7xl">
        {/*Partie qui se trouve a gauche*/}
        <div className="p-6 flex flex-col justify-center">
          <h1 className="text-gray-400 text-6xl font-bold mt-2">Rejoignez nous!!</h1>
          <p className="text-gray-600 text-3xl font-bold mt-2">En rejoignant CodeNames, vous pourrez défier vos amis dans un jeu de mots et de stratégie où chaque indice compte. Formez des équipes, trouvez vos agents secrets avant l'adversaire et évitez l'assassin pour mener votre équipe à la victoire !</p>
        </div>

        {/*Partie qui se trouve a droite*/}
        <div className="flex flex-col items-center bg-gray-800 p-6 rounded-lg shadow-md justify-center">
        {/*Partie Inscription*/}
        <h2 className="text-gray-600 text-5xl font-bold mb-2">Inscription</h2>
          {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
          <input type="text" placeholder="Pseudo" className="border p-2 mt-2 w-full bg-gray-700 text-white rounded" onChange={(e) => setPseudo(e.target.value)} />
          <input type="email" placeholder="Email" className="border p-2 mt-2 w-full bg-gray-700 text-white rounded" onChange={handleEmailChange} />
          {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
          <div className="relative mt-2 w-full">
            <input type={showPassword ? "text" : "password"} placeholder="Mot de passe" className="border p-2 w-full bg-gray-700 text-white rounded pr-10" onChange={handlePasswordChange} />
            <button type="button" className="absolute right-3 top-3 text-gray-600" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "🙈" : "👁️"}</button>
            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
          </div>
          <div className="relative mt-2 w-full">
            <input type={showPassword2 ? "text" : "password"} placeholder="Confirmez le mot de passe" className="border p-2 w-full bg-gray-700 text-white rounded pr-10" onChange={handlePassword2Change} />
            <button type="button" className="absolute right-3 top-3 text-gray-600" onClick={() => setShowPassword2(!showPassword2)}>{showPassword2 ? "🙈" : "👁️"}</button>
            {passwordMatchError && <p className="text-red-500 text-sm mt-1">{passwordMatchError}</p>}
          </div>
          <button onClick={handleRegister} className="bg-green-500 text-white p-2 mt-4 w-full disabled:bg-gray-400" disabled={!pseudo || !email || !password || !password2 || emailError !== "" || passwordError !== "" || passwordMatchError !== ""}>S'inscrire</button>
          {/*Partie redirigeant vers l'inscription*/}
          <div className="w-full border-t border-gray-700 mt-4 pt-4">
            <p className="text-gray-600 text-2xl font-bold text-center"> Vous avez déjà un compte ? </p>
            <p className="text-gray-600 text-2xl font-bold text-center mb-6"> Connectez-vous! </p> 
            <button onClick={() => { window.location.href = "/login";}} className="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-600" > Se Connecter </button>
          </div>
        </div>
      </div>
    </div>
  );
}
