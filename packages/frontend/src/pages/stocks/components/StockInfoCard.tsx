import { cn } from '@/utils/cn';

interface StockInfoCardProps {
  name: string;
  currentPrice: number;
  changeRate: number;
  index: number;
  onClick: () => void;
}

export const StockInfoCard = ({
  name,
  currentPrice,
  changeRate,
  index,
  onClick,
}: StockInfoCardProps) => {
  return (
    <div
      className={cn(
        'flex cursor-pointer flex-col gap-2 rounded-md py-4 pl-5 pr-12 shadow transition-all duration-300 hover:scale-105',
        index === 0 ? 'bg-light-yellow' : 'bg-white',
      )}
      onClick={onClick}
    >
      <p className="display-bold16 text-dark-gray mb-3 text-ellipsis">{name}</p>
      <div className="flex items-center gap-5">
        <span className="display-bold12 text-dark-gray">등락률</span>
        <span
          className={cn(
            'display-bold16',
            changeRate >= 0 ? 'text-red' : 'text-blue',
          )}
        >
          {changeRate >= 0 && '+'}
          {changeRate}%
        </span>
      </div>
      <div className="flex items-center gap-5">
        <span className="display-bold12 text-dark-gray">현재가</span>
        <span className="display-medium12 text-dark-gray">
          {currentPrice?.toLocaleString()}
        </span>
      </div>
    </div>
  );
};
