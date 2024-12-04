import { lazy, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useParams } from 'react-router-dom';
import { StockDetailHeader } from './components';
import {
  AddAlarmForm,
  ChatPanel,
  NotificationPanel,
  StockMetricsPanel,
} from '.';
import {
  useGetOwnership,
  useGetStockDetail,
} from '@/apis/queries/stock-detail';
import { Loader } from '@/components/ui/loader';

const TradingChart = lazy(() => import('./TradingChart'));

export const StockDetail = () => {
  const { stockId = '' } = useParams();

  const { data: stockDetail } = useGetStockDetail({ stockId });
  const { eps, high52w, low52w, marketCap, per, name } = stockDetail;

  const { data: userOwnerStock } = useGetOwnership({ stockId });

  if (!userOwnerStock) {
    return <div>주식 소유 여부를 불러오지 못했습니다.</div>;
  }

  return (
    <div className="flex h-full flex-col gap-7">
      <StockDetailHeader
        stockId={stockId}
        stockName={name || ''}
        isOwnerStock={userOwnerStock.isOwner}
      />
      <article className="grid flex-1 grid-cols-1 gap-5 xl:grid-cols-[2fr_1fr] 2xl:grid-cols-[2.5fr_1fr_1fr] [&>section]:gap-5">
        <section className="flex flex-col">
          <TradingChart />
          <ErrorBoundary fallback={<p>상세 정보를 불러오지 못했어요.</p>}>
            <Suspense fallback={<Loader />}>
              <StockMetricsPanel
                eps={eps}
                high52w={high52w}
                low52w={low52w}
                marketCap={marketCap}
                per={per}
              />
            </Suspense>
          </ErrorBoundary>
        </section>
        <ChatPanel isOwnerStock={userOwnerStock.isOwner} />
        <section className="flex flex-col flex-wrap gap-5 lg:flex-row 2xl:flex-col 2xl:flex-nowrap">
          <div className="max-h-[500px] flex-1">
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
