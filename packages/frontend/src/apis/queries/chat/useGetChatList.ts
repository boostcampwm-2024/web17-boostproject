import { useInfiniteQuery } from '@tanstack/react-query';
import { GetChatListRequest } from './schema';
import { get } from '@/apis/utils/get';
import { ChatDataResponse, ChatDataResponseSchema } from '@/sockets/schema';

const getChatList = ({
  stockId,
  latestChatId,
  pageSize,
  order,
}: GetChatListRequest) =>
  get<ChatDataResponse>({
    schema: ChatDataResponseSchema,
    url: '/api/chat',
    params: {
      stockId,
      latestChatId,
      pageSize,
      order,
    },
  });

export const useGetChatList = ({
  stockId,
  latestChatId,
  pageSize,
  order,
}: GetChatListRequest) => {
  return useInfiniteQuery({
    queryKey: ['chatList', stockId, pageSize, latestChatId, order],
    queryFn: ({ pageParam }) =>
      getChatList({
        stockId,
        latestChatId: pageParam?.latestChatId,
        pageSize,
        order,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore
        ? {
            latestChatId: lastPage.chats[lastPage.chats.length - 1].id,
          }
        : undefined,
    initialPageParam: { latestChatId },
    select: (data) => ({
      pages: [...data.pages].flatMap((page) => page.chats),
      pageParams: [...data.pageParams],
    }),
    enabled: !!latestChatId,
    staleTime: 1000 * 60 * 5,
  });
};
