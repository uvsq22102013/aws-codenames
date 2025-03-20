import { useEffect, useState } from "react";

// Declare grecaptcha on the Window interface
declare global {
  interface Window {
    grecaptcha: any;
  }
}
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setUtilisateur } from '../../utils/utilisateurs';
import styles from "../styles/Login.module.css"; // Si tu préfères les CSS Modules


export default function Login() {
  const [login, setLogin] = useState("");//Login povant être un email ou un pseudo
  const [password, setPassword] = useState("");//Mot de passe
  const [error, setError] = useState(""); // Stocke l'erreur à afficher
  const [showPassword, setShowPassword] = useState(false); // État pour afficher/masquer le mot de passe
  const [grecaptchaLoaded, setGreCaptchaLoaded] = useState(false); // État pour vérifier si reCAPTCHA est chargé
  const navigate = useNavigate();//Permet de changer de page  


  //Gere la connexion
  const handleLogin = async () => {
    setError(""); // Reset de l'erreur

    //Essaye de faire un POST sur back pour gerer la connexion 
    try {

      const token = await window.grecaptcha.execute('6LfuF_gqAAAAAPOdbfcGrFlNUh2XcazAJnmg0NCu', { action: 'login' });
      console.log("Token reCAPTCHA reçu : ", token); //pour voir si c'est bon dans la console



      const response = await axios.post("/api/auth/login", {
        pseudo: login,
        email: login,
        mdp: password,
        captchaToken: token,
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
    <section className={styles.section}>
       <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
      <div className={styles.signin}>
        <div className={styles.content}>

          <h2 >Sign In</h2>

          <div className={styles.form}>

            {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
            <div className={styles.inputBox}>

              <input type="text" onChange={(e) => setLogin(e.target.value)} required /> <i>Username</i>

            </div>

            <div className={styles.inputBox}>

              <input type={showPassword ? "text" : "password"} onChange={(e) => setPassword(e.target.value)} required /> <i>Password</i>
              <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300" onClick={() => setShowPassword(!showPassword)}> {showPassword ? "🙈" : "👁️"}</button>


            </div>

            <div className={styles.links}> <a href="/register">Signup</a>

            </div>

            <div className={styles.inputBox}>

              <input onClick={handleLogin} disabled={!login || !password} type="submit" value="Login" />

            </div>

          </div>

        </div>

      </div>

    </section>
    
  );
}
