import { useState, useEffect } from 'react';
import { useChat } from '../contexts/ChatContext';
// import { useSocket } from '../contexts/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';

export default function Chat() {
  const { messages, currentChannel, channels, sendMessage, switchChannel } = useChat();
  const [messageInput, setMessageInput] = useState('');
  const socket = io('http://localhost:3000');


  useEffect(() => {
    socket.on('nouveauMessage', (message: Message) => {
      sendMessage(message.content, message.channel);
    });

    return () => {
      socket.off('nouveauMessage');
    };
  }, [socket, sendMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    console.log('handleSubmit');
    e.preventDefault();
    if (messageInput.trim()) {
        console.log('handleSubmit2');

      socket.emit('envoyerMessage', {
        content: messageInput,
        channel: currentChannel,
        utilisateurId: 1, 
        partieId: 'partieId',
      });
      setMessageInput('');
    }
  };

  return (
    <div className="chat-container">
      <div className="channel-selector">
        {channels.map((channel) => (
          <button
            key={channel}
            onClick={() => switchChannel(channel)}
            className={currentChannel === channel ? 'active' : ''}
          >
            {channel.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="messages-container">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`message ${msg.channel}`}
            >
              <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
              <span className="user">{msg.pseudo}:</span>
              <span className="content">{msg.content}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder={`Écrire dans ${currentChannel}...`}
        />
        <button onClick={handleSubmit} type="submit">Envoyer</button>
      </form>
    </div>
  );
}