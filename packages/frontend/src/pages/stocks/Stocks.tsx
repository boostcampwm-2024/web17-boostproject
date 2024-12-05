import { lazy, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useNavigate } from 'react-router-dom';
import { StockIndexCard } from './components/StockIndexCard';
import { StockInfoCard } from './components/StockInfoCard';
import { usePostStockView } from '@/apis/queries/stock-detail';
import { useStockQueries } from '@/apis/queries/stocks';
import { Loader } from '@/components/ui/loader';

const StockRankingTable = lazy(() => import('./StockRankingTable'));

const LIMIT = 5;

export const Stocks = () => {
  const navigate = useNavigate();

  const [stockIndex, topViews] = useStockQueries({ viewsLimit: LIMIT });
  const { mutate } = usePostStockView();

  return (
    <main className="flex flex-col gap-16">
      <h1 className="display-bold24">오늘의 투자</h1>
      <article>
        <h2 className="display-bold16 text-dark-gray mb-5">
          지금 시장, 이렇게 움직이고 있어요.
        </h2>
        <ErrorBoundary
          fallback={<p className="py-3">지수 정보를 불러오는데 실패했어요.</p>}
        >
          <Suspense fallback={<Loader />}>
            <div className="flex flex-col gap-5 lg:grid lg:w-fit lg:grid-cols-3">
              {stockIndex.data.map((info) => (
                <StockIndexCard
                  key={info.name}
                  name={info.name}
                  currentPrice={info.currentPrice}
                  changeRate={info.changeRate}
                  high={info.high}
                  low={info.low}
                  open={info.open}
                />
              ))}
            </div>
          </Suspense>
        </ErrorBoundary>
      </article>

      <article>
        <h2 className="display-bold16 text-dark-gray mb-5">
          이 종목은 어떠신가요?
        </h2>
        <ErrorBoundary
          fallback={<p className="py-3">종목 정보를 불러오는데 실패했어요.</p>}
        >
          <Suspense fallback={<Loader />}>
            <div className="flex flex-col gap-5 lg:grid lg:w-fit lg:grid-cols-5">
              {topViews.data.map((stock, index) => (
                <StockInfoCard
                  key={stock.id}
                  index={index}
                  name={stock.name || ''}
                  currentPrice={stock.currentPrice || 0}
                  changeRate={stock.changeRate || 0}
                  onClick={() => {
                    mutate({ stockId: stock.id ?? '' });
                    navigate(`/stocks/${stock.id}`);
                  }}
                />
              ))}
            </div>
          </Suspense>
        </ErrorBoundary>
      </article>

      <article>
        <h2 className="display-bold16 text-dark-gray mb-5">
          지금 가장 활발한 종목이에요.
        </h2>
        <StockRankingTable />
      </article>
    </main>
  );
};
