import io from 'socket.io-client';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const socket = io(backendUrl, {
  reconnection: true,
  reconnectionAttempts: 50,
  reconnectionDelay: 100000,
  timeout: 500000,
});

export default socket;