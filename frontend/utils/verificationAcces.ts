export const verificationAcces = (utilisateur: string, token: string, navigate: (path: string) => void) => {
    if (!utilisateur || !token) {
        console.log('Accès refusé');
        navigate('/login');
        sessionStorage.clear();
        return false;
    }
}