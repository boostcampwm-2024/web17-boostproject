import { Tooltip } from '@/components/ui/tooltip';

export interface MetricItemProps {
  name: string;
  message: string;
}

export const MetricItem = ({ name, message }: MetricItemProps) => {
  return (
    <>
      <div className="group relative">
        <Tooltip className="absolute bottom-full mb-6">{message}</Tooltip>
        <span className="display-medium14 text-gray cursor-pointer font-bold">
          {name}
        </span>
      </div>
      <span className="display-medium14 text-dark-gray">00.000</span>
    </>
  );
};
