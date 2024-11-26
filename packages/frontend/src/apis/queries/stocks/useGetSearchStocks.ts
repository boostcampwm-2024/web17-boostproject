import { useQuery } from '@tanstack/react-query';
import {
  SearchResultsResponseSchema,
  type SearchResultsResponse,
} from './schema';
import { get } from '@/apis/utils/get';

const getSearchStocks = (name: string) =>
  get<SearchResultsResponse>({
    schema: SearchResultsResponseSchema,
    url: `/api/stock?name=${name}`,
  });

export const useGetSearchStocks = (name: string) => {
  return useQuery({
    queryKey: ['stockSearch', name],
    queryFn: () => getSearchStocks(name),
    enabled: false,
    retry: 0,
  });
};
