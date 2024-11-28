import { useCallback, useEffect, useMemo, useState } from 'react';
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
  ChatDataSchema,
  ChatLikeSchema,
  type ChatLikeResponse,
  type ChatData,
  type ChatDataResponse,
} from '@/sockets/schema';
import { useWebsocket } from '@/sockets/useWebsocket';

interface ChatPanelProps {
  loginStatus: GetLoginStatus;
  isOwnerStock: boolean;
}

export const ChatPanel = ({ loginStatus, isOwnerStock }: ChatPanelProps) => {
  const { stockId = '' } = useParams();
  const [chatData, setChatData] = useState<ChatData[]>([]);
  const { mutate } = usePostChatLike();

  const socket = useMemo(() => socketChat({ stockId }), [stockId]);

  const { isConnected } = useWebsocket(socket);

  const userStatus: ChatPlaceholder = useMemo(() => {
    if (loginStatus.message === 'Not Authenticated') {
      return 'NOT_AUTHENTICATED';
    }

    return isOwnerStock ? 'OWNERSHIP' : 'NOT_OWNERSHIP';
  }, [loginStatus, isOwnerStock]);

  const handleChat = useCallback(
    (message: ChatDataResponse | Partial<ChatData>) => {
      if ('chats' in message && message.chats) {
        const validatedChatData = ChatDataResponseSchema.parse(message);
        if (validatedChatData) {
          setChatData((prev) => [...message.chats, ...prev]);
        }
        return;
      }

      const validatedSingleChat = ChatDataSchema.partial().parse(message);
      if (validatedSingleChat) {
        setChatData((prev) => [
          {
            nickname: loginStatus?.nickname,
            ...validatedSingleChat,
          } as ChatData,
          ...prev,
        ]);
      }
    },
    [loginStatus],
  );

  const handleSendMessage = (message: string) => {
    socket.emit('chat', {
      room: stockId,
      content: message,
    });
  };

  const handleLike = (message: ChatLikeResponse) => {
    const validatedLikeData = ChatLikeSchema.parse(message);

    if (validatedLikeData) {
      setChatData((prev) =>
        prev.map((chat) =>
          chat.id === message.chatId
            ? { ...chat, likeCount: message.likeCount, liked: !chat.liked }
            : chat,
        ),
      );
    }
  };

  useEffect(() => {
    socket.on('chat', handleChat);
    socket.on('like', handleLike);

    return () => {
      socket.off('chat', handleChat);
      socket.off('like', handleLike);
    };
  }, [stockId, socket, handleChat]);

  return (
    <article className="flex min-w-80 flex-col gap-5 rounded-md bg-white p-7">
      <h2 className="display-bold20 text-center font-bold">채팅</h2>
      <TextArea
        onSend={handleSendMessage}
        disabled={!isOwnerStock}
        placeholder={chatPlaceholder[userStatus].message}
      />
      <div className="border-light-gray display-medium12 text-dark-gray flex items-center justify-between gap-1 border-b-2 pb-2">
        <span>{isConnected ? '🟢 접속 중' : '❌ 연결 끊김'}</span>
        <div className="flex items-center gap-2">
          <p>최신순</p>
          <DownArrow className="cursor-pointer" />
        </div>
      </div>
      <section className="flex h-[40rem] flex-col gap-8 overflow-auto p-3">
        {chatData ? (
          chatData.map((chat, index) => (
            <ChatMessage
              key={index}
              name={chat.nickname}
              contents={chat.message}
              likeCount={chat.likeCount}
              liked={chat.liked}
              writer={loginStatus?.nickname || ''}
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
