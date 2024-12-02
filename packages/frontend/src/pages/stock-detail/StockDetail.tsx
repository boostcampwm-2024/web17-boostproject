import { useParams } from 'react-router-dom';
import { StockDetailHeader } from './components';
import {
  AddAlarmForm,
  ChatPanel,
  NotificationPanel,
  StockMetricsPanel,
  TradingChart,
} from '.';
import { useGetLoginStatus } from '@/apis/queries/auth';
import {
  useGetOwnership,
  useGetStockDetail,
} from '@/apis/queries/stock-detail';

export const StockDetail = () => {
  const { stockId = '' } = useParams();

  const { data: stockDetail } = useGetStockDetail({ stockId });
  const { eps, high52w, low52w, marketCap, per, name } = stockDetail || {};

  const { data: loginStatus } = useGetLoginStatus();
  const { data: userOwnerStock } = useGetOwnership({ stockId });

  if (!stockDetail || !loginStatus || !userOwnerStock) {
    return <div>데이터가 없습니다.</div>;
  }

  return (
    <div className="flex h-full flex-col gap-7">
      <StockDetailHeader
        stockId={stockId}
        stockName={name || ''}
        loginStatus={loginStatus}
        isOwnerStock={userOwnerStock.isOwner}
      />
      <article className="grid flex-1 grid-cols-1 gap-5 xl:grid-cols-[2fr_1fr] 2xl:grid-cols-[2.5fr_1fr_1fr] [&>section]:gap-5">
        <section className="flex flex-col">
          <div className="relative h-full">
            <TradingChart />
          </div>
          <StockMetricsPanel
            eps={eps}
            high52w={high52w}
            low52w={low52w}
            marketCap={marketCap}
            per={per}
          />
        </section>
        <ChatPanel
          loginStatus={loginStatus}
          isOwnerStock={userOwnerStock.isOwner}
        />
        <section className="flex flex-wrap gap-5 2xl:flex-col 2xl:flex-nowrap">
          <div className="flex-1">
            <NotificationPanel className="h-full w-full" />
          </div>
          <div className="flex-1">
            <AddAlarmForm className="h-full w-full" />
          </div>
        </section>
      </article>
    </div>
  );
};
