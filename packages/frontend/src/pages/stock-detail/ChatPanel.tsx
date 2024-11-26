import { useEffect, useMemo, useState } from 'react';
import { TextArea } from './components';
import { ChatMessage } from './components/ChatMessage';
import DownArrow from '@/assets/down-arrow.svg?react';
import { socketChat } from '@/sockets/config';
import {
  ChatDataSchema,
  type ChatData,
  type ChatDataResponse,
} from '@/sockets/schema';
import { useWebsocket } from '@/sockets/useWebsocket';

export const ChatPanel = () => {
  const STOCK_ID = '005930';
  const [chatData, setChatData] = useState<ChatData[]>();

  const socket = useMemo(() => {
    return socketChat({ stockId: STOCK_ID });
  }, [STOCK_ID]);

  const { isConnected } = useWebsocket(socket);

  const handleSendMessage = (message: string) => {
    if (isConnected) {
      socket.emit('chat', {
        room: STOCK_ID,
        content: message,
      });
    }
  };

  useEffect(() => {
    const handleChat = (message: ChatDataResponse) => {
      const validatedChatData = ChatDataSchema.safeParse(message?.chats);

      if (validatedChatData.success && message?.chats) {
        setChatData(message.chats);
      }
    };

    if (isConnected) {
      socket.on('chat', handleChat);

      return () => {
        socket.off('chat', handleChat);
      };
    }
  }, [isConnected, socket]);

  return (
    <article className="flex flex-col gap-5 rounded-md bg-white p-7">
      <h2 className="display-bold20 text-center font-bold">채팅</h2>
      <TextArea onSend={handleSendMessage} />
      <div className="border-light-gray flex items-center justify-end gap-1 border-b-2 pb-2">
        <p className="display-medium12 text-dark-gray">최신순</p>
        <DownArrow className="cursor-pointer" />
      </div>
      <section className="flex flex-col gap-5">
        {chatData ? (
          chatData.map((chat) => (
            <ChatMessage
              key={chat.id}
              name={chat.nickname}
              contents={chat.message}
              likeCount={chat.likeCount}
              liked={chat.liked}
            />
          ))
        ) : (
          <p className="text-center">채팅이 없어요.</p>
        )}
      </section>
    </article>
  );
};
