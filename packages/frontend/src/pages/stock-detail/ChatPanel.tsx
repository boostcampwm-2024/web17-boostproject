import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TextArea } from './components';
import { ChatMessage } from './components/ChatMessage';
import { GetLoginStatus } from '@/apis/queries/auth/schema';
import { usePostChatLike } from '@/apis/queries/chat';
import DownArrow from '@/assets/down-arrow.svg?react';
import { ChatPlaceholder, chatPlaceholder } from '@/constants/chatPlaceholder';
import { socketChat } from '@/sockets/config';
import {
  ChatDataResponseSchema,
  type ChatData,
  type ChatDataResponse,
} from '@/sockets/schema';
import { useWebsocket } from '@/sockets/useWebsocket';

interface ChatPanelProps {
  loginStatus: GetLoginStatus['message'];
  isOwnerStock: boolean;
}

export const ChatPanel = ({ loginStatus, isOwnerStock }: ChatPanelProps) => {
  const { stockId = '' } = useParams();
  const [chatData, setChatData] = useState<ChatData[]>([]);
  const { mutate } = usePostChatLike();

  const socket = useMemo(() => {
    return socketChat({ stockId });
  }, [stockId]);

  const { isConnected } = useWebsocket(socket);

  const userStatus: ChatPlaceholder = useMemo(() => {
    if (loginStatus === 'Not Authenticated') {
      return 'NOT_AUTHENTICATED';
    }

    return isOwnerStock ? 'OWNERSHIP' : 'NOT_OWNERSHIP';
  }, [loginStatus, isOwnerStock]);

  const handleChat = (message: ChatDataResponse) => {
    const validatedChatData = ChatDataResponseSchema.safeParse(message);

    if (validatedChatData.success && message?.chats) {
      setChatData((prev) => [...prev, ...message.chats]);
    }
  };

  const handleSendMessage = (message: string) => {
    if (isConnected) {
      socket.emit('chat', {
        room: stockId,
        content: message,
      });
    }
  };

  useEffect(() => {
    if (isConnected) {
      socket.on('chat', handleChat);
      // socket.on('like');

      return () => {
        socket.off('chat', handleChat);
      };
    }
  }, [isConnected, socket]);

  return (
    <article className="flex flex-col gap-5 rounded-md bg-white p-7">
      <h2 className="display-bold20 text-center font-bold">채팅</h2>
      <TextArea
        onSend={handleSendMessage}
        disabled={!isOwnerStock}
        placeholder={chatPlaceholder[userStatus].message}
      />
      <div className="border-light-gray flex items-center justify-end gap-1 border-b-2 pb-2">
        <p className="display-medium12 text-dark-gray">최신순</p>
        <DownArrow className="cursor-pointer" />
      </div>
      <section className="flex h-[40rem] flex-col gap-5 overflow-auto">
        {chatData ? (
          chatData.map((chat, index) => (
            <ChatMessage
              key={index}
              name={chat.nickname}
              contents={chat.message}
              likeCount={chat.likeCount}
              liked={chat.liked}
              onClick={() => mutate({ chatId: chat.id })}
            />
          ))
        ) : (
          <p className="text-center">채팅이 없어요.</p>
        )}
      </section>
    </article>
  );
};
