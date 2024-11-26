import { Tooltip } from '@/components/ui/tooltip';

export interface MetricItemProps {
  label: string;
  tooltip: string;
  value?: string | number;
}

export const MetricItem = ({ label, tooltip, value }: MetricItemProps) => {
  return (
    <>
      <div className="group relative">
        <Tooltip className="absolute bottom-full mb-6">{tooltip}</Tooltip>
        <span className="display-medium14 text-gray cursor-pointer font-bold">
          {label}
        </span>
      </div>
      <span className="display-medium14 text-dark-gray">{value}</span>
    </>
  );
};
