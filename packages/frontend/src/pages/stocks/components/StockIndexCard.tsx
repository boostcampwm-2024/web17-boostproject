import { StockIndexResponse } from '@/apis/queries/stocks';
import { cn } from '@/utils/cn';

export const StockIndexCard = ({
  name,
  currentPrice,
  changeRate,
  high,
  low,
  open,
}: Partial<StockIndexResponse>) => {
  return (
    <div className="flex w-full cursor-pointer flex-col gap-2 rounded-md bg-white py-4 pl-5 shadow transition-all duration-300 hover:scale-105 lg:pr-6 2xl:pr-20">
      <p className="display-bold16 text-dark-gray">{name}</p>
      <div className="flex items-center gap-3">
        <span className="display-bold20 text-dark-gray">{currentPrice}</span>
        <span
          className={cn(
            'display-medium14',
            changeRate && +changeRate >= 0 ? 'text-red' : 'text-blue',
          )}
        >
          {changeRate}%
        </span>
      </div>
      <div className="text-gray flex flex-col gap-3 xl:grid xl:grid-cols-2 xl:grid-rows-2 [&_div]:flex [&_div]:gap-4">
        <div>
          <span className="display-bold14">시가</span>
          <span className="display-medium14">{open?.toLocaleString()}</span>
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
