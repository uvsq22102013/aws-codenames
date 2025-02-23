/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { getUtilisateur } from '../../utils/utilisateurs';
import { getToken } from '../../utils/token';
import { useParams } from 'react-router-dom';
import Cellule from '../components/Cellule';
import Button from '../components/Buttons';

const socket = io('http://localhost:3000');

const Game = () => {
  const { partieId } = useParams();
  const partieIdNumber = Number(partieId);
  const [partie, setPartie] = useState<any>(null);
  const [cartes, setCartes] = useState<any>(null);

  const [motIndice, setMotIndice] = useState('');
  const [nombreMots, setNombreMots] = useState(1);
  const [indice, setIndice] = useState<any>(null);
  const utilisateur = getUtilisateur();
       

   const chargerPartie = async () => {
    try {
      const token = getToken();

      const res = await fetch(`http://localhost:3000/api/parties/${partieIdNumber}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`Erreur HTTP : ${res.status}`);
      const data = await res.json();
      setPartie(data);
      setCartes(data.cartes);
      localStorage.setItem('partie', JSON.stringify(data));
    } catch (err) {
      console.error('erreur chargement partie :', err);
    }
  };
  const chargerIndice = async () => {
    try {
      const token = getToken();

      const res = await fetch(`http://localhost:3000/api/parties/${partieIdNumber}/indice`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`Erreur HTTP : ${res.status}`);
      const data = await res.json();
      if (!data) return;
      setIndice(data);
      localStorage.setItem('indice', JSON.stringify(data));
    } catch (err) {
      console.error('erreur chargement indice :', err);
    }
  };

  useEffect(() => {
    if (!utilisateur) {
      console.error('Utilisateur non connecté');
      return;
    }
  
    socket.emit('rejoindrePartie', { partieId });
  
    const majHandler = () => {
      console.log('majPartie reçue, rechargement...');
      chargerPartie();
      chargerIndice();
    };
  
    socket.on('majPartie', majHandler);
  
    return () => {
      socket.off('majPartie', majHandler);
    };
  }, [partieId, utilisateur]);
  

  const donnerIndice = () => {
    const equipe = getEquipeUtilisateur();
    socket.emit('donnerIndice', {
      partieId,
      utilisateurId: utilisateur.id,
      motDonne: motIndice,
      nombreMots,
      equipe,
    });
    setMotIndice('');
    setNombreMots(1);
  };

  const passerTour = () => {
    socket.emit('finDeviner', { partieId : Number (partieId) , utilisateurId: utilisateur.id , equipe : getEquipeUtilisateur() });
  };

  const selectionnerCarte = (carteId: number) => {
    const equipe = getEquipeUtilisateur();
    socket.emit('selectionnerCarte', { partieId, carteId, equipe, utilisateurId: utilisateur.id });
  };
  const validerCarte = (carteId: number) => {
    const equipe = getEquipeUtilisateur();
    socket.emit('validerCarte', { partieId : partieIdNumber, carteId, equipe, utilisateurId: utilisateur.id });
  };
  const renitPartie = () => {
    socket.emit('renitPartie', partieIdNumber);
  };
  const getEquipeUtilisateur = () => {
    return partie?.membres.find((m: any) => m.utilisateurId === utilisateur.id)?.equipe;
  };

  const getRoleUtilisateur = () => {
    return partie?.membres.find((m: any) => m.utilisateurId === utilisateur.id)?.role;
  };
  const getRoleEnCours = () => {
    return partie?.roleEncours;
  };
  const getEquipeEnCours = () => {
    return partie?.equipeEncours;
  };
  const getIndiceEnCours = () => {
    return partie?.indice;
  };


  if (!partie)  { chargerPartie(); 
    chargerIndice();
    return <p>Chargement...</p>;
  }

  const equipeUtilisateur = getEquipeUtilisateur();
  const roleUtilisateur = getRoleUtilisateur();
  const roleEncours = getRoleEnCours();
  const equipeEnCours = getEquipeEnCours();
  const indiceEnCours = getIndiceEnCours();

  return (
    <div className="min-h-screen bg-[#8C2F25] text-white p-4">
      {/* Barre de navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <div className="text-lg font-bold">Joueurs : 👤 {partie.membres.length}</div>
        <div className="flex gap-2 flex-wrap">
        <Button onClick={renitPartie}  variant="solid" color="yellow">🔄 Réinitialiser</Button>    
        <Button   variant="solid" color="yellow">📜 Règles</Button>    
          <div className="bg-blue-500 px-4 py-2 rounded">{utilisateur.pseudo}</div>
        </div>
      </div>
      <h1 className="text-2xl  bg-[#2c1a15] font-bold text-center  text-gray-400">
        L'espion adverse est en train de jouer, veuillez attendre votre tour...
      </h1>
      

      {/* Grille des mots */}
      {/* <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-4">
        {partie.cartes.map((carte: any) => {
          const couleur =
            carte.revelee || roleUtilisateur === 'MAITRE_ESPION'
              ? {
                  ROUGE: 'bg-red-500',
                  BLEU: 'bg-blue-500',
                  NEUTRE: 'bg-gray-400',
                  ASSASSIN: 'bg-black text-white',
                }[carte.type as 'ROUGE' | 'BLEU' | 'NEUTRE' | 'ASSASSIN']
              : 'bg-gray-700';

          return (
            <button
              key={carte.id}
              onClick={() => validerCarte(carte.id)}
              disabled={carte.revelee || roleUtilisateur !== 'AGENT'}
              className={`p-4 rounded ${couleur} ${
                carte.revelee ? 'opacity-50' : 'hover:opacity-80'
              }`}
            >
              {carte.mot.mot}
            </button>
          );
        })}
      </div> */}
          
  <div className="w-full h-full flex">

    <div className="bg-red-700 text-white p-4 w-1/5 h-full flex flex-col items-center">
        <h3 className="font-bold">Agents</h3>
        {partie.membres
          .filter((m: any) => m.equipe === 'ROUGE' && m.role === 'AGENT')
          .map((m: any) => (
            <p className="bg-yellow-400 px-4 py-1 rounded" key={m.utilisateur.id}>{m.utilisateur.pseudo}</p>
          ))}
        <h3 className="font-bold mt-2">Espions</h3>
        {partie.membres
          .filter((m: any) => m.equipe === 'ROUGE' && m.role === 'MAITRE_ESPION')
          .map((m: any) => (
            <p className="bg-yellow-400 px-4 py-1 rounded" key={m.utilisateur.id}>{m.utilisateur.pseudo}</p>
          ))}

    </div>

    <div className="grid grid-cols-5 gap-2 bg-gray-800 p-6 rounded-lg flex-1 h-full flex flex-wra  justify-center items-center">
      {cartes.map((carte: any) => {

        return <Cellule
        key={carte.id}
        carte={carte}
        roleUtilisateur={roleUtilisateur}
        roleEncours={roleEncours}
        equipeUtilisateur={equipeUtilisateur}
        equipeEnCours={equipeEnCours}
        onSelectionner={selectionnerCarte}
        onValiderCarte={validerCarte}
        estSelectionnee={carte.selectionId}
      />
    
    })}
  </div>
  <div className="bg-blue-700 text-white p-4 w-1/5 h-full flex flex-col items-center">
        <h3 className="font-bold">Agents</h3>   
          {partie.membres    
            .filter((m: any) => m.equipe === 'BLEU' && m.role === 'AGENT' )    
            .map((m: any) => (    
              <p className="bg-yellow-400 px-4 py-1 rounded" key={m.utilisateur.id}>{m.utilisateur.pseudo}</p>   
            ))}     
          <h3 className="font-bold mt-2">Espions</h3>    
          {partie.membres    
            .filter((m: any) => m.equipe === 'BLEU' && m.role === 'MAITRE_ESPION' )    
            .map((m: any) => (    
              <p className="bg-yellow-400 px-4 py-1 rounded" key={m.utilisateur.id}>{m.utilisateur.pseudo}</p>   
            ))}  
        </div>

  


</div>
      {/* Zone indices - Seulement pour maître espion */}
      {roleUtilisateur === 'MAITRE_ESPION' && equipeUtilisateur === equipeEnCours && roleEncours === 'MAITRE_ESPION' &&(
        <div className="mb-4 bg-gray-800 p-4 rounded">
          <h2 className="text-lg mb-2">Donner un indice</h2>
          <input
            type="text"
            value={motIndice}
            onChange={(e) => setMotIndice(e.target.value)}
            placeholder="Mot indice"
            className="p-2 rounded bg-gray-700 text-white mr-2"
          />
          <input
            type="number"
            value={nombreMots}
            onChange={(e) => setNombreMots(Number(e.target.value))}
            className="p-2 rounded bg-gray-700 text-white w-16"
          />
          <button onClick={donnerIndice} className="bg-green-500 px-4 py-2 ml-2 rounded">
            Valider
          </button>
        </div>
      )}
      {roleEncours === 'AGENT' ? (
        <div className="mb-4 bg-gray-800 p-4 rounded">
          <h2 className="text-lg mb-2">Indice donné : {indice.mot} pour {indice.nbmots} mots </h2>
          {roleUtilisateur === 'AGENT' && equipeUtilisateur === equipeEnCours && roleEncours === 'AGENT' ? (
          <button onClick={passerTour} className="bg-green-500 px-4 py-2 ml-2 rounded">
            Valider
          </button>
          ) : null}
        </div>
      ) : null}

      <div className="bg-gray-800 p-4 rounded mt-4">     
        <h3 className="text-lg">Historique</h3>
        {partie.actions.map((action: any) => (    
          <p key={action.id}>
            {action.utilisateur?.pseudo} {action.motDonne && `a donné l'indice : ${action.motDonne}`}
            {action.carte && `a sélectionné : ${action.carte.mot.mot}`}
          </p>            
        ))}
      </div>           
    </div>
  );
};

export default Game;