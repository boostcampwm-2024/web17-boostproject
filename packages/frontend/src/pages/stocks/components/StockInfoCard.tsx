import { type GetStockTopViewsResponse } from '@/apis/queries/stocks';
import { cn } from '@/utils/cn';

interface StockInfoCardProps extends GetStockTopViewsResponse {
  index: number;
  onClick: () => void;
}

export const StockInfoCard = ({
  name,
  currentPrice,
  changeRate,
  index,
  onClick,
}: Partial<StockInfoCardProps>) => {
  return (
    <div
      className={cn(
        'flex cursor-pointer flex-col gap-2 rounded-md p-5 shadow transition-all duration-300 hover:scale-105 2xl:py-4 2xl:pl-5 2xl:pr-16',
        index === 0 ? 'bg-light-yellow' : 'bg-white',
      )}
      onClick={onClick}
    >
      <p className="display-bold16 text-dark-gray mb-3">{name}</p>
      <section className="flex flex-col gap-2">
        <div className="flex items-center gap-5">
          <span className="display-bold12 text-dark-gray">등락률</span>
          <span
            className={cn(
              'xl:display-bold16 display-bold12',
              changeRate && changeRate >= 0 ? 'text-red' : 'text-blue',
            )}
          >
            {changeRate}%
          </span>
        </div>
        <div className="flex items-center gap-5">
          <span className="display-bold12 text-dark-gray">현재가</span>
          <span className="display-medium12 text-dark-gray">
            {currentPrice?.toLocaleString()}원
          </span>
        </div>
      </section>
    </div>
  );
};
