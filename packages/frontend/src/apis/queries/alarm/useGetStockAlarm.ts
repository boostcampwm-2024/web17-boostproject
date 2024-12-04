import { useQuery } from '@tanstack/react-query';
import {
  type AlarmResponse,
  StockAlarmRequest,
  AlarmResponseSchema,
} from './schema';
import { get } from '@/apis/utils/get';

const getStockAlarm = ({ stockId }: StockAlarmRequest) =>
  get<AlarmResponse>({
    schema: AlarmResponseSchema,
    url: `/api/alarm/stock/${stockId}`,
  });

export const useGetStockAlarm = ({
  stockId,
  loginStatus,
}: StockAlarmRequest & { loginStatus: boolean }) => {
  return useQuery({
    queryKey: ['getStockAlarm', stockId],
    queryFn: () => getStockAlarm({ stockId }),
    enabled: loginStatus,
  });
};
