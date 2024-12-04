import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TextArea } from './components';
import { ChatMessage } from './components/ChatMessage';
import { useChatOrder } from './hooks/useChatOrder';
import { usePostChatLike } from '@/apis/queries/chat';
import { useGetChatList } from '@/apis/queries/chat/useGetChatList';
import DownArrow from '@/assets/down-arrow.svg?react';
import { Loader } from '@/components/ui/loader';
import {
  type ChatStatus,
  chatPlaceholder,
  UserStatus,
} from '@/constants/chatStatus';
import { LoginContext } from '@/contexts/login';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { socketChat } from '@/sockets/config';
import {
  ChatDataSchema,
  ChatLikeSchema,
  type ChatLikeResponse,
  type ChatData,
  type ChatDataResponse,
} from '@/sockets/schema';
import { useWebsocket } from '@/sockets/useWebsocket';
import { checkChatWriter } from '@/utils/checkChatWriter';
import { cn } from '@/utils/cn';

interface ChatPanelProps {
  isOwnerStock: boolean;
}

const INITIAL_VISIBLE_CHATS = 3;

export const ChatPanel = ({ isOwnerStock }: ChatPanelProps) => {
  const { isLoggedIn, nickname, subName } = useContext(LoginContext);

  const { stockId = '' } = useParams();
  const [chatData, setChatData] = useState<ChatData[]>([]);

  const { mutate: clickLike } = usePostChatLike();
  const { order, handleOrderType } = useChatOrder();

  const socket = useMemo(() => socketChat({ stockId }), [stockId]);
  const { isConnected } = useWebsocket(socket);

  const userStatus: ChatStatus = useMemo(() => {
    if (!isLoggedIn) {
      return UserStatus.NOT_AUTHENTICATED;
    }

    return isOwnerStock ? UserStatus.OWNERSHIP : UserStatus.NOT_OWNERSHIP;
  }, [isLoggedIn, isOwnerStock]);

  const handleChat = useCallback((message: ChatDataResponse | ChatData) => {
    if ('chats' in message) return;

    const validatedSingleChat = ChatDataSchema.parse(message);
    if (validatedSingleChat) {
      setChatData((prev) => [{ ...validatedSingleChat } as ChatData, ...prev]);
    }
  }, []);

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
    if (!isOwnerStock) return alert('주식 소유자만 가능합니다.');
    clickLike({ chatId });
  };

  const { fetchNextPage, data, status, isFetching, hasNextPage } =
    useGetChatList({
      stockId,
      order,
    });

  useEffect(() => {
    if (status === 'success') {
      setChatData(data.pages);
    }
  }, [data, status]);

  const fetchMoreChats = () => {
    fetchNextPage();

    if (status === 'success') {
      setChatData(data.pages);
    }
  };

  const { ref } = useInfiniteScroll({
    onIntersect: fetchMoreChats,
    hasNextPage,
  });

  const isWriter = (chat: ChatData) => {
    if (!nickname || !subName) {
      return false;
    }

    return checkChatWriter({ chat, nickname, subName });
  };

  return (
    <article className="flex min-w-80 flex-col gap-5 rounded-md bg-white p-7 shadow">
      <h2 className="display-bold20 text-center font-bold">채팅</h2>
      <TextArea
        onSend={handleSendMessage}
        disabled={!isOwnerStock}
        placeholder={chatPlaceholder[userStatus]}
      />
      <div className="border-light-gray display-medium12 text-dark-gray flex items-center justify-between gap-1 border-b-2 pb-2">
        <span>{isConnected ? '🟢 접속 중' : '❌ 연결 끊김'}</span>
        <div className="flex items-center gap-2" onClick={handleOrderType}>
          <p>{order === 'latest' ? '최신순' : '좋아요순'}</p>
          <DownArrow
            className={cn(
              'cursor-pointer',
              order === 'latest' ? 'rotate-0' : 'rotate-180',
            )}
          />
        </div>
      </div>
      <section className="flex h-[40rem] flex-col gap-8 overflow-auto break-words break-all p-3">
        {chatData.length ? (
          <>
            {chatData.slice(0, INITIAL_VISIBLE_CHATS).map((chat) => (
              <ChatMessage
                key={chat.id}
                name={chat.nickname}
                contents={chat.message}
                likeCount={chat.likeCount}
                liked={chat.liked}
                subName={chat.subName}
                createdAt={chat.createdAt}
                writer={isWriter(chat)}
                onClick={() => handleLikeClick(chat.id)}
              />
            ))}
            {chatData.slice(INITIAL_VISIBLE_CHATS).map((chat, index) => (
              <div className="relative" key={`${chat.id}-${index}`}>
                {!isOwnerStock && (
                  <div className="absolute inset-0 flex items-center justify-center text-center backdrop-blur-sm">
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
                  subName={chat.subName}
                  createdAt={chat.createdAt}
                  writer={isWriter(chat)}
                  onClick={() => handleLikeClick(chat.id)}
                />
              </div>
            ))}
          </>
        ) : (
          <p className="text-center">채팅이 없어요.</p>
        )}
        {isFetching ? <Loader className="w-44" /> : <div ref={ref} />}
      </section>
    </article>
  );
};
