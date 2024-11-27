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
        loginStatus={loginStatus.message}
        isOwnerStock={userOwnerStock.isOwner}
      />
      <article className="grid flex-1 grid-cols-2 gap-5 [&_section]:gap-5">
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
          loginStatus={loginStatus.message}
          isOwnerStock={userOwnerStock.isOwner}
        />
        <section className="flex flex-col">
          <NotificationPanel className="h-1/2" />
          <AddAlarmForm className="h-1/2" />
        </section>
      </article>
    </div>
  );
};
