import type { GetStockListRequest, GetStockListResponse } from './types';
import { useQuery } from '@tanstack/react-query';
import { instance } from '@/apis/config';

const getTopLosers = async ({
  limit,
}: GetStockListRequest): Promise<GetStockListResponse[]> => {
  const { data } = await instance.get(`/api/stock/topLosers?limit=${limit}`);
  return data;
};

export const useGetTopLosers = ({ limit }: GetStockListRequest) => {
  return useQuery<GetStockListResponse[], Error>({
    queryKey: ['stocks', 'topLosers'],
    queryFn: () => getTopLosers({ limit }),
  });
};
