import type { GetStockListRequest, GetStockListResponse } from './types';
import { useQuery } from '@tanstack/react-query';
import { instance } from '@/apis/config';

const getTopViews = async ({
  limit,
}: GetStockListRequest): Promise<GetStockListResponse[]> => {
  const { data } = await instance.get(`/api/stock/topViews?limit=${limit}`);
  return data;
};

export const useGetTopViews = ({ limit }: GetStockListRequest) => {
  return useQuery<GetStockListResponse[], Error>({
    queryKey: ['stocks', 'topViews'],
    queryFn: () => getTopViews({ limit }),
  });
};
