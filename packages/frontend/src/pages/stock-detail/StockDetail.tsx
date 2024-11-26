import { useParams } from 'react-router-dom';
import { StockDetailHeader } from './components';
import {
  AddAlarmForm,
  ChatPanel,
  NotificationPanel,
  StockMetricsPanel,
  TradingChart,
} from '.';
import { useGetStockDetail } from '@/apis/queries/stock-detail';

export const StockDetail = () => {
  const { stockId } = useParams();
  const { data: stockDetail } = useGetStockDetail({ stockId: stockId ?? '' });

  return (
    <div className="flex h-full flex-col gap-7">
      <StockDetailHeader
        stockId={stockId ?? ''}
        stockName={stockDetail?.name ?? ''}
      />
      <article className="grid flex-1 grid-cols-[2.5fr_1fr_1fr] gap-5 [&_section]:gap-5">
        <section className="flex flex-col">
          <div className="relative h-full">
            <TradingChart />
          </div>
          <StockMetricsPanel />
        </section>
        <ChatPanel />
        <section className="flex flex-col">
          <NotificationPanel className="h-1/2" />
          <AddAlarmForm className="h-1/2" />
        </section>
      </article>
    </div>
  );
};
