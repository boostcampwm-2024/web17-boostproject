import { useEffect, useMemo, useState } from 'react';
import { socketChat, type SocketChatType } from './config';

export const useSocketChat = ({ stockId, pageSize }: SocketChatType) => {
  const socket = useMemo(() => {
    return socketChat({ stockId, pageSize });
  }, [pageSize, stockId]);

  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, [socket]);

  return { socket, isConnected };
};
