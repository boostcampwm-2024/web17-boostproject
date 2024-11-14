import { Title, MetricItem, type MetricItemProps } from '.';

interface MetricSectionProps {
  title: string;
  metricInfo: MetricItemProps[];
}

export const MetricSection = ({ title, metricInfo }: MetricSectionProps) => {
  return (
    <section className="flex flex-col">
      <Title>{title}</Title>
      <section className="grid grid-cols-[repeat(4,100px)] items-center">
        {Object.values(metricInfo).map((info) => (
          <MetricItem name={info.name} key={info.name} message={info.message} />
        ))}
      </section>
    </section>
  );
};
