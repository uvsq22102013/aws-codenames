// import { useEffect, useState } from 'react';
// import { JSEncrypt } from 'jsencrypt';
// import { io } from 'socket.io-client';
// import { getUtilisateur } from '../../utils/utilisateurs';
// import { getToken } from '../../utils/token';
// import { useParams } from 'react-router-dom';
// import Cellule from '../components/Cellule';


// const privateKey = `-----BEGIN PRIVATE KEY-----
// MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBK...
// -----END PRIVATE KEY-----`;

// const decryptData = (encryptedData: string) => {
//   const decryptor = new JSEncrypt();
//   decryptor.setPrivateKey(privateKey);
//   const decrypted = decryptor.decrypt(encryptedData);
//   return decrypted ? JSON.parse(decrypted) : null;
// };

// const chargerPartie = async () => {
//   try {
//     const token = getToken();

//     const res = await fetch(`http://localhost:3000/api/parties/${partieIdNumber}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     if (!res.ok) throw new Error(`Erreur HTTP : ${res.status}`);

//     const encryptedData = await res.text(); // Récupérer en texte (car chiffré)
//     const data = decryptData(encryptedData);

//     if (data) {
//       setPartie(data);
//       localStorage.setItem('partie', JSON.stringify(data));
//     } else {
//       console.error("Erreur : impossible de déchiffrer les données !");
//     }
//   } catch (err) {
//     console.error('Erreur chargement partie :', err);
//   }
// };

// const chargerIndice = async () => {
//   try {
//     const token = getToken();

//     const res = await fetch(`http://localhost:3000/api/parties/${partieIdNumber}/indice`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!res.ok) throw new Error(`Erreur HTTP : ${res.status}`);

//     const encryptedData = await res.text(); // Récupération sous forme de texte
//     const data = decryptData(encryptedData);

//     if (data) {
//     //   setIndice(data);
//       localStorage.setItem('indice', JSON.stringify(data));
//     } else {
//       console.error("Erreur : impossible de déchiffrer l'indice !");
//     }
//   } catch (err) {
//     console.error('Erreur chargement indice :', err);
//   }
// };




// import { Router } from 'express';
// import { getpartieById } from '../services/game.service';
// import { promises } from 'dns';
// import NodeRSA from 'node-rsa';
// import fs from 'fs';
// import path from 'path';
// import { verifierToken } from '../utils/verifierToken';
// import { getPartiePourUtilisateur } from '../services/game.service';
// import { validerCarte,recupererDernierIndice, donnerIndice, selectionnerCarte, changerRole, lancerPartie, trouverMembreEquipe} from '../services/game.service';

// import { RequestAvecUtilisateur } from '../utils/verifierToken';

// const router = Router();
// const publicKeyPath = path.join(__dirname, '../clefs/public_key.pem');
// const publicKey = fs.readFileSync(publicKeyPath, 'utf8');

// const crypterData = (data: any) => {
//   const key = new NodeRSA(publicKey, 'pkcs8-public');
//   return key.encrypt(JSON.stringify(data), 'base64'); // Chiffrement en base64
// };


// router.get('/:id', verifierToken , async (req, res) => {
//   const partieId = parseInt(req.params.id);
//   const utilisateurId = (req as RequestAvecUtilisateur).user!.id;


//   console.log(`Back: fetch partie ${partieId}`);
//   try {
//     const partie = await getPartiePourUtilisateur(partieId, utilisateurId);

//     if (!partie) {
//       console.log(`Back: fetch partie ${partieId} not found`);
//       res.status(404).json({ message: 'Partie non trouvée' });
//       return ;
//     }
//     const partieCryptee = crypterData(partie); // Chiffrement 
//     console.log(`🔒 Partie chiffrée envoyée pour ${partieId}`);

//     res.json({ partie: partieCryptee });
//   } catch (error) {
//     console.log(`Back: fetch partie ${partieId} error`);
//     console.error(error);
//     res.status(500).json({ message: 'Erreur serveur', error });
//   }
// });

// router.get('/:id/indice', verifierToken , async (req, res) => {
//   const partieId = parseInt(req.params.id);

//   console.log(`Back: fetch indice de la partie  ${partieId}`);
//   try {
//     const indice = await recupererDernierIndice(partieId);

//     if (!indice) {
//       console.log(`Back: fetch indice de la partie  ${partieId} not found`);
//       res.status(404).json({ message: 'indice non trouvée' });
//       return ;
//     }
//     const indiceCrypte = crypterData(indice); // Chiffrement ici
//     console.log(`🔒 Indice chiffré pour partie ${partieId}`);
//     res.json({ indice: indiceCrypte });
//   } catch (error) {
//     console.log(`Back: fetch indice de la partie  ${partieId} error`);
//     console.error(error);
//     res.status(500).json({ message: 'Erreur serveur', error });
//   }
// });


// export default router;
