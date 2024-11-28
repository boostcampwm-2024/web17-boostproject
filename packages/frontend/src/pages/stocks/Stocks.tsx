import { useNavigate } from 'react-router-dom';
import { StockIndexCard } from './components/StockIndexCard';
import { StockInfoCard } from './components/StockInfoCard';
import { StockRankingTable } from './StockRankingTable';
import { usePostStockView } from '@/apis/queries/stock-detail';
import { useGetTopViews } from '@/apis/queries/stocks';
import { useGetStockIndex } from '@/apis/queries/stocks/useGetStockIndex';

const LIMIT = 5;

export const Stocks = () => {
  const navigate = useNavigate();

  const { data: stockIndex } = useGetStockIndex();
  const { data: topViews } = useGetTopViews({ limit: LIMIT });
  const { mutate } = usePostStockView();

  return (
    <main className="flex flex-col gap-16">
      <h1 className="display-bold24">오늘의 투자</h1>
      <article>
        <h2 className="display-bold16 text-dark-gray mb-5">
          지금 시장, 이렇게 움직이고 있어요.
        </h2>
        {stockIndex ? (
          <div className="grid w-fit grid-cols-3 gap-5">
            {stockIndex?.map((info) => (
              <StockIndexCard
                name={info.name}
                currentPrice={info.currentPrice}
                changeRate={info.changeRate}
                high={info.high}
                low={info.low}
                open={info.open}
              />
            ))}
          </div>
        ) : (
          <p>지수 정보를 불러오는 데 실패했어요.</p>
        )}
      </article>
      <article>
        <h2 className="display-bold16 text-dark-gray mb-5">
          이 종목은 어떠신가요?
        </h2>
        <div className="grid w-fit grid-cols-5 gap-5">
          {topViews ? (
            topViews.map((stock, index) => (
              <StockInfoCard
                key={stock.id}
                index={index}
                name={stock.name || ''}
                currentPrice={stock.currentPrice || 0}
                changeRate={stock.changeRate || 0}
                onClick={() => {
                  mutate({ stockId: stock.id ?? '' });
                  navigate(`stocks/${stock.id}`);
                }}
              />
            ))
          ) : (
            <p>종목 정보를 불러오는데 실패했어요.</p>
          )}
        </div>
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
