export interface MetricItemProps {
  label: string;
  value: string;
}

export const MetricItem = ({ label, value }: MetricItemProps) => {
  return (
    <>
      <span className="display-medium14 text-gray font-bold">{label}</span>
      <span className="display-medium14 text-dark-gray">{value}</span>
    </>
  );
};
