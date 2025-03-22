/* eslint-disable @typescript-eslint/no-explicit-any */
  export const getUtilisateur = () => {
    const utilisateurJSON = sessionStorage.getItem('utilisateur');
    if (!utilisateurJSON) {
      return null;
    }
    const utilisateur = JSON.parse(utilisateurJSON);
    return utilisateur;
  };
  
  
  export const setUtilisateur = (utilisateur: any) => {
    sessionStorage.setItem('utilisateur', JSON.stringify(utilisateur));
  };
  
  export const removeUtilisateur = () => {
    sessionStorage.removeItem('utilisateur');
  };
  