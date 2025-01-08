import { io } from 'socket.io-client';

// const URL = 'wss://juchum.info';
const URL = 'ws://localhost:3000';

export interface SocketChatType {
  stockId: string;
  pageSize?: number;
}

export const socketChat = ({ stockId, pageSize = 20 }: SocketChatType) => {
  return io(`${URL}/api/chat/realtime`, {
    transports: ['websocket'],
    reconnectionDelayMax: 10000,
    query: {
      stockId,
      pageSize,
    },
    forceNew: true,
    autoConnect: false,
  });
};

export const socketStock = io(`${URL}/api/stock/realtime`, {
  transports: ['websocket'],
  reconnectionDelayMax: 10000,
  autoConnect: false,
});
