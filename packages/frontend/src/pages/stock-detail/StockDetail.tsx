import { useParams } from 'react-router-dom';
import {
  AddAlarmForm,
  ChatPanel,
  NotificationPanel,
  StockMetricsPanel,
  TradingChart,
} from '.';
import { useGetStockDetail } from '@/apis/queries/stock-detail';
import Plus from '@/assets/plus.svg?react';
import { Button } from '@/components/ui/button';

export const StockDetail = () => {
  const { stockId } = useParams();
  const { data } = useGetStockDetail({ stockId: stockId ?? '' });

  return (
    <div className="flex h-full flex-col gap-7">
      <header className="flex gap-7">
        <h1 className="display-bold24">{data?.name}</h1>
        <Button className="flex items-center justify-center gap-1">
          <Plus /> 내 주식 추가
        </Button>
      </header>
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
