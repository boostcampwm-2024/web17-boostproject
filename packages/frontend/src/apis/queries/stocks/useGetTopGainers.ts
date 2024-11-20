import type { GetStockListRequest, GetStockListResponse } from './types';
import { useQuery } from '@tanstack/react-query';
import { instance } from '@/apis/config';

const getTopGainers = async ({
  limit,
}: GetStockListRequest): Promise<GetStockListResponse[]> => {
  const { data } = await instance.get(`/api/stock/topGainers?limit=${limit}`);
  return data;
};

export const useGetTopGainers = ({ limit }: GetStockListRequest) => {
  return useQuery<GetStockListResponse[], Error>({
    queryKey: ['stocks', 'topGainers'],
    queryFn: () => getTopGainers({ limit }),
  });
};
