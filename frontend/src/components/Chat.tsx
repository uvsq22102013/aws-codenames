import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import { getUtilisateur } from '../../utils/utilisateurs';
import socket from '../../utils/socket';

type Channel = 'GLOBAL' | 'EquipeROUGE' | 'EquipeBLEU' | 'ESPIONROUGE' | 'ESPIONBLEU' | 'ESPIONALL';
const CHANNELS: Channel[] = ['GLOBAL', 'EquipeROUGE', 'EquipeBLEU', 'ESPIONROUGE', 'ESPIONBLEU', 'ESPIONALL'];

interface Message {
  id: number;
  content: string;
  utilisateurId: number;
  pseudo: string;
  timestamp: Date;
  channel: Channel;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [currentChannel, setCurrentChannel] = useState<Channel>('GLOBAL');
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const partie = sessionStorage.getItem('partie');
      if (partie) {
        const parsedPartie = JSON.parse(partie);
        if (parsedPartie.messages) {
          setMessages(parsedPartie.messages.filter((msg: Message) => msg.channel === currentChannel));
        }
      }
    }, 1000); // Vérifie toutes les secondes
  
    return () => clearInterval(interval); // Nettoie l'intervalle à la désactivation du composant
  }, [currentChannel]);

  useEffect(() => {
    const handleNewMessage = (message: Message) => {
      setMessages(prev => {
        const newMessages = [...prev, message];
        const partie = sessionStorage.getItem('partie') || '{"messages":[]}';
        const parsedPartie = JSON.parse(partie);
        parsedPartie.messages = [...parsedPartie.messages, message];
        sessionStorage.setItem('partie', JSON.stringify(parsedPartie));
        return newMessages;
      });
    };

    socket.on('nouveauMessage', handleNewMessage);
    return () => socket.off('nouveauMessage', handleNewMessage);
  }, []); 

    // Scroller automatiquement vers le dernier message
    useEffect(() => {
      if (lastMessageRef.current) {
        lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, [messages]); // Déclenchement à chaque changement de messages

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const utilisateur = getUtilisateur();
    
    if (messageInput.trim()) {
      const newMessage = {
        content: messageInput, // Le contenu est bien pris de l'input
        utilisateurId: utilisateur.id,
        pseudo: utilisateur.pseudo,
        timestamp: new Date(),
        channel: currentChannel,
        partieId: JSON.parse(sessionStorage.getItem('partie') || '{}').id,
        id: Date.now()
      };

      socket.emit('envoyerMessage', newMessage);
      setMessageInput('');
    }
  };
  const partie = JSON.parse(sessionStorage.getItem('partie') || '{}');
  const utilisateur = getUtilisateur();

  const getRoleUtilisateur = () => {
    return partie?.membres.find((m: any) => m.utilisateurId === utilisateur.id)?.role;
  };
  const getEquipeUtilisateur = () => {
    return partie?.membres.find((m: any) => m.utilisateurId === utilisateur.id)?.equipe;
  };
  const roleUtilisateur = getRoleUtilisateur();
  const equipeUtilisateur = getEquipeUtilisateur();


  return (
    <div className="bg-gray-800 p-2 rounded h-full w-full flex flex-col">
      <p className="text-xs text-center mb-2">Chat -
        <select
          value={currentChannel}
          onChange={(e) => setCurrentChannel(e.target.value as Channel)}
          className="bg-gray-700 text-gray-200 text-[10px] px-2 py-1 rounded border border-gray-600 flex-shrink-0"
        >
          {CHANNELS.filter((channel) => {
            if (!utilisateur) return false;

            if (roleUtilisateur=== 'INCONNU') return false;

            if (channel.includes('ESPION') && roleUtilisateur !== 'MAITRE_ESPION') return false;

            if (roleUtilisateur === 'MAITRE_ESPION' &&
              (channel === 'EquipeBLEU' || channel === 'EquipeROUGE' || channel === 'GLOBAL')) {
              return false;
            }
            if (equipeUtilisateur !== 'ROUGE' &&
              (channel === 'EquipeROUGE' || channel === 'ESPIONROUGE')) {
              return false;
            }
            if (equipeUtilisateur !== 'BLEU' &&
              (channel === 'EquipeBLEU' || channel === 'ESPIONBLEU')) {
              return false;
            }
            return true;
          }).map((channel) => (
            <option key={channel} value={channel} className="bg-gray-800">
              #{channel.toLowerCase()}
            </option>
          ))}
        </select>
      </p>
      <div className="border-t border-gray-300 mb-2"></div>
      
      <div className="custom-scrollbar overflow-y-auto overflow-x-hidden bg-gray-700 rounded-lg p-1 border border-gray-600 flex-1">
        <AnimatePresence>
          {messages
            .filter(msg => msg.channel === currentChannel)
            .map((msg, index) => {
              const channelColor = msg.channel === 'EquipeROUGE' ? 'text-red-400' : 
                                msg.channel === 'EquipeBLEU' ? 'text-blue-400' :
                                msg.channel.includes('ESPION') ? 'text-purple-400' : 
                                'text-gray-300';

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs py-1 px-2 hover:bg-gray-600 rounded-sm"
                  ref={index === messages.length - 1 ? lastMessageRef : null} // Ajoutez la ref au dernier message
                >
                  <div className="flex gap-2 items-baseline">
                    <div className={`${channelColor} font-semibold truncate`}>
                      {msg.pseudo}
                    </div>
                    <div className="text-gray-400 text-xxs">
                      {new Date(msg.dateMessage).toLocaleTimeString('fr-FR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                    <div className="flex-1 truncate text-gray-200">
                      {msg.contenu}
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </AnimatePresence>
      </div>

      <form onSubmit={handleSubmit} className="mt-2 flex gap-1">       
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Écrire un message..."
          className="bg-gray-700 text-gray-200 text-[10px] px-1 py-1 rounded border border-gray-600 flex-grow"
        />
        
        <button
          type="submit"
          className="bg-gray-700 text-gray-200 text-xs px-1 py-1 rounded border border-gray-600 hover:bg-gray-600"
        >
          ➤
        </button>
      </form>
    </div>
  );
}