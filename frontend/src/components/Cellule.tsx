/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';

interface CelluleProps {
  carte: any;
  roleUtilisateur: string | undefined;
  roleEncours: string | undefined;
  equipeUtilisateur: string | undefined
  equipeEnCours: string | undefined;
  onSelectionner: (carteId: number) => void;
  onValiderCarte: (carteId: number) => void;
  estSelectionnee?: boolean;
}

const Cellule = ({
  carte,
  roleUtilisateur,
  roleEncours,
  equipeUtilisateur,
  equipeEnCours,
  onSelectionner,
  onValiderCarte,
  estSelectionnee = false,
}: CelluleProps) => {
  const [flipped, setFlipped] = useState(carte.revelee);
  const carteRevelee = carte.revelee || roleUtilisateur === 'MAITRE_ESPION';

  useEffect(() => {
    if (carteRevelee && !flipped) {
      setTimeout(() => setFlipped(true), 150);
    }
  }, [carteRevelee, flipped]);

  // Fond image selon type de carte
  const getBackgroundImage = () => {
    if (!carteRevelee) return '';
    switch (carte.type) {
      case 'ROUGE':
        return 'url(/images/rouge.png)';
      case 'BLEU':
        return 'url(/images/bleu.png)';
      case 'NEUTRE':
        return 'url(/images/neutre.png)';
      case 'ASSASSIN':
        return 'url(/images/assassin.png)';
      default:
        return 'url(/images/neutre.png)';
    }
  };

  // Couleur backup si pas d'image (ou pendant le flip)
  const getCouleurCarte = () => {
    if (carteRevelee) {
      switch (carte.type) {
        case 'ROUGE':
          return 'bg-red-600 text-white';
        case 'BLEU':
          return 'bg-blue-600 text-white';
        case 'NEUTRE':
          return 'bg-yellow-300 text-black';
        case 'ASSASSIN':
          return 'bg-black text-white';
        default:
          return 'bg-gray-400';
      }
    }
    return 'bg-gray-300 text-black';
  };

  const estCliquable = !carte.revelee && roleUtilisateur === 'AGENT' && roleEncours === roleUtilisateur && equipeEnCours === equipeUtilisateur;

  return (
    <div
      className={`relative w-[80px] h-[60px] sm:w-[140px] sm:h-[75px] text-[20px] sm:text-[15px] flex items-center justify-center rounded border ${
        estSelectionnee ? 'border-yellow-400 border-4' : 'border-gray-400'
      } transition-all duration-300 ease-in-out`}
    >
      {/* FACE CACHEE */}
      <div
        className={`absolute inset-0 backface-hidden ${
          flipped ? 'opacity-0' : 'opacity-100'
        } transition-opacity duration-300 ease-in-out bg-gray-300 flex justify-center items-center rounded`}
      >
        {carte.mot.mot}
      </div>

      {/* FACE REVELEE*/}
      <div
        className={`absolute inset-0 backface-hidden ${
          flipped ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-500 ease-in-out ${getCouleurCarte()} flex justify-center items-center rounded`}
        style={{
          backgroundImage: carteRevelee ? getBackgroundImage() : '',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay */}
        {carteRevelee && (
          <div className="absolute inset-0 bg-black bg-opacity-30 rounded" />
        )}

        <span className="relative font-bold">{carte.mot.mot}</span>
      </div>

      {/* BOUTON JAUNE POUR VALIDER */}
      {estCliquable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onValiderCarte(carte.id);
          }}
          className="absolute -top-2 -right-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-full w-5 h-5 text-xs flex justify-center items-center shadow-md"
        >
          ✅
        </button>
      )}

      {/* ZONE CLIQUABLE POUR SELECTIONNER */}
      {estCliquable && (
        <button
          onClick={() => onSelectionner(carte.id)}
          className="absolute inset-0 opacity-0"
        />
      )}
    </div>
  );
};

export default Cellule;
