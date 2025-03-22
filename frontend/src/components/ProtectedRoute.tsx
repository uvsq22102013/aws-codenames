import { Navigate } from "react-router-dom";
import { getUtilisateur } from "../../utils/utilisateurs";
import { getToken } from "../../utils/token";
import { JSX } from "react";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const utilisateur = getUtilisateur();
  const token = getToken();
  const partie = sessionStorage.getItem('partie');

  if (!utilisateur || !token) {
    return <Navigate to="/login" />;
  }
  else if (!partie) {
    console.log('Accès refusé');
    return <Navigate to="/join" />;
  }
  return children;
};
export const ProtectedJoin = ({ children }: { children: JSX.Element }) => {
    const utilisateur = getUtilisateur();
    const token = getToken();  
    if (!utilisateur || !token) {
      return <Navigate to="/login" />;
    }
    return children;
  };

