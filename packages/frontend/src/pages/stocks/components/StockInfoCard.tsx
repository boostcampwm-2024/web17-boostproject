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
        'flex cursor-pointer flex-col gap-2 rounded-md p-2 shadow transition-all duration-300 hover:scale-105 lg:py-4 lg:pl-5 lg:pr-16',
        index === 0 ? 'bg-light-yellow' : 'bg-white',
      )}
      onClick={onClick}
    >
      <p className="display-bold16 text-dark-gray mb-3">{name}</p>
      <section className="flex flex-row gap-2 xl:flex-col">
        <div className="flex flex-col items-start gap-2 xl:flex-row xl:items-center xl:gap-5">
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
        <div className="flex flex-col items-start gap-2 xl:flex-row xl:items-center xl:gap-5">
          <span className="display-bold12 text-dark-gray">현재가</span>
          <span className="display-medium12 text-dark-gray">
            {currentPrice?.toLocaleString()}원
          </span>
        </div>
      </section>
    </div>
  );
};
