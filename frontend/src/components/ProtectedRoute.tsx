import { Navigate } from "react-router-dom";
import { getUtilisateur } from "../../utils/utilisateurs";
import axios from 'axios';
import { useEffect, useState } from "react";
import { JSX } from "react";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const utilisateur = getUtilisateur();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => { 
      try { 
        await axios.get("/api/check-auth");  
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }  
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!utilisateur || !isAuthenticated) {
    return <Navigate to="/" />; 
  }

  const partie = sessionStorage.getItem('partie');
  if (!partie) {
    console.log('Accès refusé');

    return <Navigate to="/join" />;
  }

  return children;
}; 

export const ProtectedJoin = ({ children }: { children: JSX.Element }) => {
  const utilisateur = getUtilisateur();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => { 
      try {
        await axios.get("/api/check-auth");
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Chargement...</div>;
  }

  if (!utilisateur || !isAuthenticated) {
    return <Navigate to="/" />;
  }

  return children;
};