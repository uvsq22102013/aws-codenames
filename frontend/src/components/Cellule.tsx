/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CelluleProps {
  carte: any;
  roleUtilisateur: string | undefined;
  roleEncours: string | undefined;
  equipeUtilisateur: string | undefined
  equipeEnCours: string | undefined;
  onSelectionner: (carteId: number) => void;
  onDeselectionner: (carteId: number) => void;
  onValiderCarte: (carteId: number) => void;
  estSelectionnee?: boolean;
  pseudosSelections: string[];
  estSelectionneeParJoueur?: boolean;
  trouvee: boolean;
}

const Cellule = ({
  carte,
  roleUtilisateur,
  roleEncours,
  equipeUtilisateur,
  equipeEnCours,
  onSelectionner,
  onDeselectionner,
  onValiderCarte,
  estSelectionnee = false,
  pseudosSelections,
  estSelectionneeParJoueur = false,
  trouvee,
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
        if (trouvee && roleUtilisateur === 'MAITRE_ESPION' ) {
          return 'url(/images/rouge_sombre.png)'
        } else {
          return 'url(/images/rouge.png)';
        }
      case 'BLEU':
        if (trouvee && roleUtilisateur === 'MAITRE_ESPION' ) {
          return 'url(/images/bleu_sombre.png)'
        } else {
          return 'url(/images/bleu.png)';
        }
      case 'NEUTRE':
        if (trouvee && roleUtilisateur === 'MAITRE_ESPION' ) {
          return 'url(/images/neutre_sombre.png)'
        } else {
          return 'url(/images/neutre.png)';
        }
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
    <motion.div
      className={`relative px-[30%] py-[30%] sm:px-[20%] sm:py-[20%] md:px-[20%] md:py-[20%] text-[60%] sm:text-[70%] md:text-[100%] flex items-center justify-center rounded border border-gray-400 transition-all duration-300 ease-in-out`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ rotate : 90 }}
    >
      {/* FACE CACHEE */}
      <motion.div
        className={`absolute inset-0 backface-hidden ${
          flipped ? 'opacity-0' : 'opacity-100'
        } transition-opacity duration-300 ease-in-out bg-gray-300 flex justify-center items-center rounded`}
        whileTap={{ scale: 1.5 }}
      >
        {carte.mot.mot}
      </motion.div>

      {/* FACE REVELEE*/}
      <motion.div
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

        <p className="relative font-bold">{carte.mot.mot}</p>
      </motion.div>

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

      {/* Liste des pseudos des joueurs qui ont sélectionné la carte */}
      {estSelectionnee && (
      <div className="absolute inset-0 bg-transparent text-yellow text-xs p-1 rounded-t flex items-center justify-center">
        <ul className="list-none p-0 m-0 grid grid-cols-2 grid-rows-2 gap-1 w-full h-full">
          {pseudosSelections.map((pseudo, index) => (
            <li
              key={index}
              className={`
                bg-yellow-400 text-black p-1 rounded
                ${index === 0 ? 'justify-self-start self-start' : ''}
                ${index === 1 ? 'justify-self-end self-start' : ''}
                ${index === 2 ? 'justify-self-start self-end' : ''}
                ${index === 3 ? 'justify-self-end self-end' : ''}
              `}
            >
              {pseudo}
            </li>
          ))}
        </ul>
      </div>
    )}

      {/* ZONE CLIQUABLE POUR SELECTIONNER OU DESELECTIONNER */}
      {estCliquable && (
        <button
          onClick={() => {
            if (estSelectionneeParJoueur) {
              onDeselectionner(carte.id);
            } else {
              onSelectionner(carte.id);
            }
          }}
          className="absolute inset-0 opacity-0"
        />
      )}
    </motion.div>
  );
};

export default Cellule;