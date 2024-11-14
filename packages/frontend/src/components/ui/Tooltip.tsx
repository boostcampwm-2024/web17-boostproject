import { type ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface TooltipProps {
  className?: string;
  children?: ReactNode;
}

export const Tooltip = ({ className, children }: TooltipProps) => {
  return (
    <div
      className={cn(
        'bg-light-yellow display-medium14 text-dark-gray pointer-events-none relative w-fit whitespace-nowrap rounded-md px-5 py-1 text-center',
        'opacity-0 transition-all duration-200 ease-out group-hover:translate-y-2 group-hover:opacity-100',
        className,
      )}
    >
      {children}
      <div className="border-t-light-yellow absolute top-full h-0 w-0 -translate-x-1/2 border-l-[10px] border-r-[10px] border-t-[15px] border-l-white border-r-white" />
    </div>
  );
};
