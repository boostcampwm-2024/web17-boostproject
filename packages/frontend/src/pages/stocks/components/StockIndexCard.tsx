import { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface StockIndexCardProps {
  children: ReactNode;
  price: number;
  change: number;
  changePercent: number;
}

export const StockIndexCard = ({
  children,
  price,
  change,
  changePercent,
}: StockIndexCardProps) => {
  return (
    <div className="flex w-full cursor-pointer flex-col gap-2 rounded-md bg-white py-4 pl-5 pr-28 shadow transition-all duration-300 hover:scale-110">
      <p className="display-medium16">{children}</p>
      <p className="display-bold24 text-dark-gray">{price}</p>
      <p
        className={cn(
          'display-medium14',
          changePercent >= 0 ? 'text-red' : 'text-blue',
        )}
      >
        {changePercent >= 0 ? '▲' : '▼'}
        {change}({changePercent})
      </p>
    </div>
  );
};
