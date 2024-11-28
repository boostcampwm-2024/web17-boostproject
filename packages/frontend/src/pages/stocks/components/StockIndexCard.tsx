import { StockIndexResponse } from '@/apis/queries/stocks';
import { cn } from '@/utils/cn';

export const StockIndexCard = ({
  name,
  currentPrice,
  changeRate,
  volume,
  high,
  low,
  open,
}: Partial<StockIndexResponse>) => {
  return (
    <div className="flex w-full cursor-pointer flex-col gap-2 rounded-md bg-white py-4 pl-5 pr-20 shadow transition-all duration-300 hover:scale-105">
      <p className="display-bold16 text-dark-gray">{name}</p>
      <div className="flex items-center gap-3">
        <span className="display-bold24 text-dark-gray">{currentPrice}</span>
        <span
          className={cn(
            'display-medium14',
            changeRate && +changeRate >= 0 ? 'text-red' : 'text-blue',
          )}
        >
          {changeRate}%
        </span>
      </div>
      <div className="text-gray grid grid-cols-2 grid-rows-2 gap-3 [&_div]:flex [&_div]:gap-4">
        <div>
          <span className="display-bold14">시가</span>
          <span className="display-medium14">{open?.toLocaleString()}</span>
        </div>
        <div>
          <span className="display-bold14">거래량</span>
          <span className="display-medium14">{volume?.toLocaleString()}</span>
        </div>
        <div>
          <span className="display-bold14">고가</span>
          <span className="display-medium14">{high?.toLocaleString()}</span>
        </div>
        <div>
          <span className="display-bold14">저가</span>
          <span className="display-medium14">{low?.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
