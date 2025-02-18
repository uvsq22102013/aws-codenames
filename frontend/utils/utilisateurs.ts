export const getUtilisateur = () => {
    const utilisateurJSON = localStorage.getItem('utilisateur');
    return utilisateurJSON ? JSON.parse(utilisateurJSON) : null;
  };
  
  
  export const setUtilisateur = (utilisateur: any) => {
    localStorage.setItem('utilisateur', JSON.stringify(utilisateur));
  };
  
  export const removeUtilisateur = () => {
    localStorage.removeItem('utilisateur');
  };
  