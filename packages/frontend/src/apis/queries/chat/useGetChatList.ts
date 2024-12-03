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
    queryKey: ['chatList', stockId, latestChatId, pageSize, order],
    queryFn: () => getChatList({ stockId, latestChatId, pageSize, order }),
    getNextPageParam: (data) => (data.hasMore ? true : null),
    initialPageParam: false,
    staleTime: 60 * 1000 * 5,
    enabled: !!latestChatId,
  });
};
