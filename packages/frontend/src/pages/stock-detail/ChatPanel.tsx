import type { ChatDataType, ChatDataResponse } from '@/sockets/types';
import { useEffect, useState } from 'react';
import { TextArea } from './components';
import { ChatMessage } from './components/ChatMessage';
import DownArrow from '@/assets/down-arrow.svg?react';
import { useSocketChat } from '@/sockets/chat';

export const ChatPanel = () => {
  const STOCK_ID = '005930';

  const [chatData, setChatData] = useState<ChatDataType[]>();
  const { socket: socketChat, isConnected } = useSocketChat({
    stockId: STOCK_ID,
  });

  const handleSendMessage = (message: string) => {
    if (isConnected) {
      socketChat.emit('chat', {
        room: STOCK_ID,
        content: message,
      });
    }
  };

  useEffect(() => {
    const handleChat = (message: ChatDataResponse) => {
      console.log('Received message:', message);
      if (message?.chats) {
        console.log('Chats:', message.chats);
        setChatData(message.chats);
      }
    };

    if (isConnected) {
      socketChat.on('chat', handleChat);

      return () => {
        socketChat.off('chat', handleChat);
      };
    }
  }, [socketChat, isConnected]);

  return (
    <article className="flex flex-col gap-5 rounded-md bg-white p-7">
      <h2 className="display-medium20 text-center">채팅</h2>
      <TextArea onSend={handleSendMessage} />
      <div className="border-light-gray flex items-center justify-end gap-1 border-b-2 pb-2">
        <p className="display-medium12 text-dark-gray">최신순</p>
        <DownArrow className="cursor-pointer" />
      </div>
      <section className="flex flex-col gap-5">
        {chatData?.map((chat) => (
          <ChatMessage
            key={chat.id}
            name={chat.nickname}
            contents={chat.message}
            likeCount={chat.likeCount}
            liked={chat.liked}
          />
        ))}
      </section>
    </article>
  );
};
