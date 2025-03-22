/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-wrapper-object-types */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../styles/Login.module.css"; // Si tu préfères les CSS Modules

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
  const [grecaptchaLoaded, setGreCaptchaLoaded] = useState(false);


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
      const token = await window.grecaptcha.execute('6LfuF_gqAAAAAPOdbfcGrFlNUh2XcazAJnmg0NCu', { action: 'register' });


      await axios.post("/api/auth/register", {
        pseudo,
        email,
        mdp: password,
        mdp2: password2,
        captchaToken: token,
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
    <section className={styles.section}> 
      <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> 
      <div className={styles.signin}>
      <div className={styles.content}>

          <h2>Sign Up</h2> 

          <div className={styles.form}>
  

          {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
          <div className={styles.inputBox}>
            <input type="text"  onChange={(e) => setPseudo(e.target.value)} required/><i>Pseudo</i> 
          </div> 

          {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
          <div className={styles.inputBox}>
            <input type="email"  onChange={handleEmailChange} required/><i>Email</i> 
          </div>

          {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
          <div className={styles.inputBox}>
            <input type={showPassword ? "text" : "password"} onChange={handlePasswordChange} required/> <i>Password</i> 
            <button type="button" className="absolute right-3 top-3 text-gray-600" onClick={() => setShowPassword(!showPassword)}> {showPassword ? "🙈" : "👁️"}</button>
          </div> 

          {passwordMatchError && <p className="text-red-500 text-sm mt-1">{passwordMatchError}</p>}
          <div className={styles.inputBox}>
            <input type={showPassword2 ? "text" : "password"}  onChange={handlePassword2Change} required/><i>Password</i> 
            <button type="button" className="absolute right-3 top-3 text-gray-600" onClick={() => setShowPassword2(!showPassword2)}>{showPassword2 ? "🙈" : "👁️"}</button>
          </div>

          <div className={styles.links}><a href=""></a><a href="/login">Signin</a> 
          </div> 
            <div className={styles.inputBox}>

              <input onClick={handleRegister} disabled={!pseudo || !email || !password || !password2 || emailError !== "" || passwordError !== "" || passwordMatchError !== ""} type="submit" value="Login"/> 

            </div> 

          </div> 

        </div> 

      </div> 

    </section>
    
  );
}