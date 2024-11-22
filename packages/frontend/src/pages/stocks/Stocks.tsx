import { StockIndexCard } from './components/StockIndexCard';
import { StockInfoCard } from './components/StockInfoCard';
import { StockRankingTable } from './StockRankingTable';
// import { useGetTopViews } from '@/apis/queries/stocks';
import marketData from '@/mocks/market.json';
import stock from '@/mocks/stock.json';

// const LIMIT = 5;

export const Stocks = () => {
  const kospi = marketData.data.filter((value) => value.name === '코스피')[0];
  const kosdaq = marketData.data.filter((value) => value.name === '코스닥')[0];
  const rateOfExchange = marketData.data.filter(
    (value) => value.name === '달러환율',
  )[0];

  // const { data: topViews } = useGetTopViews({ limit: LIMIT });

  return (
    <main className="flex flex-col gap-16">
      <h1 className="display-bold24">오늘의 투자</h1>
      <article>
        <h2 className="display-bold16 text-dark-gray mb-5">
          지금 시장, 이렇게 움직이고 있어요.
        </h2>
        <div className="grid w-fit grid-cols-3 gap-5">
          <StockIndexCard
            price={kospi.price}
            change={kospi.change}
            changePercent={kospi.changePercent}
          >
            코스피
          </StockIndexCard>
          <StockIndexCard
            price={kosdaq.price}
            change={kosdaq.change}
            changePercent={kosdaq.changePercent}
          >
            코스닥
          </StockIndexCard>
          <StockIndexCard
            price={rateOfExchange.price}
            change={rateOfExchange.change}
            changePercent={rateOfExchange.changePercent}
          >
            달러환율
          </StockIndexCard>
        </div>
      </article>
      <article>
        <h2 className="display-bold16 text-dark-gray mb-5">
          이 종목은 어떠신가요?
        </h2>
        <div className="grid w-fit grid-cols-5 gap-5">
          {stock.data
            .slice(0, 5)
            ?.map((stock, index) => (
              <StockInfoCard
                key={stock.id}
                index={index}
                name={stock.name}
                currentPrice={stock.currentPrice}
                changeRate={stock.changeRate}
              />
            ))}
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
