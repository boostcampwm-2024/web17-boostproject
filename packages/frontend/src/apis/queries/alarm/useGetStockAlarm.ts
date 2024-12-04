import { useQuery } from '@tanstack/react-query';
import {
  type AlarmInfoResponse,
  StockAlarmRequest,
  StockAlarmRequestSchema,
} from './schema';
import { get } from '@/apis/utils/get';

const getStockAlarm = ({ stockId, id }: StockAlarmRequest) =>
  get<AlarmInfoResponse>({
    params: { id },
    schema: StockAlarmRequestSchema,
    url: `/api/alarm/stock/${stockId}`,
  });

export const useGetStockAlarm = ({ stockId, id }: StockAlarmRequest) => {
  return useQuery({
    queryKey: ['getStockAlarm', stockId, id],
    queryFn: () => getStockAlarm({ stockId, id }),
  });
};
