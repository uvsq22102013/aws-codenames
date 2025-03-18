
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import styles from "../styles/Login.module.css";

export default function Reset() {

  const { code } = useParams<{ code: string }>();  
  const [password, setPassword] = useState("");//Mot de passe
  const [password2, setPassword2] = useState("");//Confirmer le mot de passe
  const [error, setError] = useState(""); // Stocke l'erreur à afficher
  const [showPassword, setShowPassword] = useState(false); // État pour afficher/masquer le mot de passe
  const [showPassword2, setShowPassword2] = useState(false); // État pour afficher/masquer la confirmation du mot de passe
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
  const handleReset = async () => {
    setError(""); // Reset de l'erreur 
    try {
      await axios.post(`/api/reset/${code}`, {
        mdp: password,
      });
      alert("Le mot de passe a bien été changé.");
      navigate('/login');
    } catch (error: any) {
      setError(error.response?.data?.error || "Erreur réinitialisation mdp front.");
    }
  };

  return (
    <section className={styles.section}> 
      <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> 
      <div className={styles.signin}>
      <div className={styles.content}>

          <h3>Nouveau mot de passe</h3> 

          <div className={styles.form}>

          {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}


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

              <input onClick={handleReset} disabled={!password || !password2 || passwordError !== "" || passwordMatchError !== ""} type="submit" value="Réinitialiser"/> 

            </div> 

          </div> 

        </div> 

      </div> 

    </section>
    
  );
}