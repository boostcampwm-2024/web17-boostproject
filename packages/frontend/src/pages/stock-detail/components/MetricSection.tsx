import { type MetricItemProps } from './MetricItem';
import { Title, MetricItem } from '.';

interface MetricSectionProps {
  title: string;
  metricInfo: MetricItemProps[];
}

export const MetricSection = ({ title, metricInfo }: MetricSectionProps) => {
  return (
    <section className="flex flex-col">
      <Title>{title}</Title>
      <section className="grid grid-cols-[repeat(4,100px)] items-center">
        {metricInfo.map((info) => (
          <MetricItem label={info.label} value={info.value} key={info.label} />
        ))}
      </section>
    </section>
  );
};
