import type { GetStockListRequest, GetStockListResponse } from './types';
import { useQuery } from '@tanstack/react-query';
import { instance } from '@/apis/config';

const getTopGainers = async ({
  limit,
}: GetStockListRequest): Promise<GetStockListResponse[]> => {
  const { data } = await instance.get(`/api/stock/topGainers?limit=${limit}`);
  return data;
};

const getTopLosers = async ({
  limit,
}: GetStockListRequest): Promise<GetStockListResponse[]> => {
  const { data } = await instance.get(`/api/stock/topLosers?limit=${limit}`);
  return data;
};

export const useGetStocksByPrice = ({
  limit,
  isGaining,
}: GetStockListRequest & { isGaining: boolean }) => {
  return useQuery<GetStockListResponse[], Error>({
    queryKey: ['stocks', isGaining],
    queryFn: isGaining
      ? () => getTopGainers({ limit })
      : () => getTopLosers({ limit }),
  });
};
