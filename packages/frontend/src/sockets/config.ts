import { io } from 'socket.io-client';

const URL = 'wss://juchum.info';

export interface SocketChatType {
  stockId: string;
  pageSize?: number;
}

export const socketChat = ({ stockId, pageSize = 20 }: SocketChatType) => {
  return io(
    `${URL}/api/chat/realtime?stockId=${stockId}&pageSize=${pageSize}`,
    {
      transports: ['websocket'],
      reconnectionDelayMax: 10000,
    },
  );
};

export const socketStock = io(`${URL}/api/stock/realtime`, {
  transports: ['websocket'],
  reconnectionDelayMax: 10000,
});
