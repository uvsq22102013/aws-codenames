/* eslint-disable @typescript-eslint/no-explicit-any */
  export const getUtilisateur = () => {
    const utilisateurJSON = localStorage.getItem('utilisateur');
    if (!utilisateurJSON) {
      return null;
    }
    const utilisateur = JSON.parse(utilisateurJSON);
    return utilisateur;
  };
  
  
  export const setUtilisateur = (utilisateur: any) => {
    localStorage.setItem('utilisateur', JSON.stringify(utilisateur));
  };
  
  export const removeUtilisateur = () => {
    localStorage.removeItem('utilisateur');
  };
  