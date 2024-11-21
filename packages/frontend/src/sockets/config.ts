import { io } from 'socket.io-client';

const URL = 'ws://juchum.info';

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
  });
};

export const socketStock = io(`${URL}/api/stock/realtime`, {
  transports: ['websocket'],
  reconnectionDelayMax: 10000,
});
