// src/contexts/ChatContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { Message, ChatChannel } from '../types/chat.types';
import { io } from 'socket.io-client';
type ChatContextType = {
  messages: Message[];
  currentChannel: ChatChannel;
  channels: ChatChannel[];
  sendMessage: (content: string, channel: ChatChannel) => void;
  switchChannel: (channel: ChatChannel) => void;
};

const ChatContext = createContext<ChatContextType>({} as ChatContextType);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChannel, setCurrentChannel] = useState<ChatChannel>('global');
  const [channels] = useState<ChatChannel[]>(['global', 'equipe', 'espion']);
  const socket = io('http://localhost:3000');

  // Écouter les nouveaux messages
  useEffect(() => {
    const handleNewMessage = (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on('nouveauMessage', handleNewMessage);

    return () => {
      socket.off('nouveauMessage', handleNewMessage);
    };
  }, [socket]);

  // Fonction pour envoyer un message
  const sendMessage = (content: string, channel: ChatChannel) => {
    if (content.trim()) {
      const newMessage: Message = {
        content,
        utilisateurId: 1,
        pseudo: 'Utilisateur', 
        timestamp: new Date(),
        channel,
      };

      socket.emit('envoyerMessage', {
        content,
        channel,
        utilisateurId: newMessage.utilisateurId,
        partieId: 'partieId', 
      });

      setMessages((prevMessages) => [...prevMessages, newMessage]);
    }
  };

  const switchChannel = (channel: ChatChannel) => {
    setCurrentChannel(channel);
  };

  return (
    <ChatContext.Provider value={{ messages, currentChannel, channels, sendMessage, switchChannel }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);