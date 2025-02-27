export const verificationAcces = (utilisateur: string, token: string, navigate: (path: string) => void) => {
    if (!utilisateur || !token) {
        console.log('Accès refusé');
        navigate('/login');
        localStorage.clear();
        return false;
    }
}