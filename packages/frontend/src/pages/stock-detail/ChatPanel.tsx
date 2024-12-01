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
import { cn } from '@/utils/cn';

interface ChatPanelProps {
  loginStatus: GetLoginStatus;
  isOwnerStock: boolean;
}

export const ChatPanel = ({ loginStatus, isOwnerStock }: ChatPanelProps) => {
  const { stockId = '' } = useParams();
  const [chatData, setChatData] = useState<ChatData[]>([]);
  const { mutate } = usePostChatLike();
  const { message, nickname, subName } = loginStatus;

  const socket = useMemo(() => socketChat({ stockId }), [stockId]);

  const { isConnected } = useWebsocket(socket);

  const userStatus: ChatPlaceholder = useMemo(() => {
    if (message === 'Not Authenticated') {
      return 'NOT_AUTHENTICATED';
    }

    return isOwnerStock ? 'OWNERSHIP' : 'NOT_OWNERSHIP';
  }, [message, isOwnerStock]);

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
          { ...validatedSingleChat } as ChatData,
          ...prev,
        ]);
      }
    },
    [],
  );

  const handleSendMessage = (message: string) => {
    if (!message) return;

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

  const handleLikeClick = (chatId: number) => {
    if (isOwnerStock) {
      mutate({ chatId });
      return;
    }
    alert('주식 소유자만 가능합니다.');
  };

  return (
    <article className="flex min-w-80 flex-col gap-5 rounded-md bg-white p-7 shadow">
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
      <section
        className={cn(
          'flex h-[40rem] flex-col gap-8 overflow-auto break-words break-all p-3',
          isOwnerStock ? 'overflow-auto' : 'overflow-hidden',
        )}
      >
        {chatData ? (
          <>
            {chatData.slice(0, 3).map((chat) => (
              <ChatMessage
                key={chat.id}
                name={chat.nickname}
                contents={chat.message}
                likeCount={chat.likeCount}
                liked={chat.liked}
                writer={chat.subName === subName}
                onClick={() => handleLikeClick(chat.id)}
              />
            ))}
            {chatData.slice(3).map((chat, index) => (
              <div className="relative" key={chat.id}>
                {!isOwnerStock && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/5 text-center backdrop-blur-sm">
                    {index === 0 && (
                      <p>
                        주식 소유자만 <br />
                        확인할 수 있습니다.
                      </p>
                    )}
                  </div>
                )}
                <ChatMessage
                  name={chat.nickname}
                  contents={isOwnerStock ? chat.message : '로그인 후 이용 가능'}
                  likeCount={chat.likeCount}
                  liked={chat.liked}
                  writer={nickname || ''}
                  onClick={() => handleLikeClick(chat.id)}
                />
              </div>
            ))}
          </>
        ) : (
          <p className="text-center">채팅이 없어요.</p>
        )}
      </section>
    </article>
  );
};
