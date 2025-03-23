import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
  reconnection: true,
  reconnectionAttempts: 50,
  reconnectionDelay: 100000,
  timeout: 500000,
});

export default socket;