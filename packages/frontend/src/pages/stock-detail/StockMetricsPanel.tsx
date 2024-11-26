import { MetricItem, Title } from './components';
import { METRICS_DATA } from '@/constants/METRIC_DETAILS';
import { type StockMetricsPanelProps } from '@/types/metrics';

export const StockMetricsPanel = ({
  eps,
  high52w,
  low52w,
  marketCap,
  per,
  price,
  change,
  volume,
}: StockMetricsPanelProps) => {
  const metricsData = METRICS_DATA({
    eps,
    high52w,
    low52w,
    marketCap,
    per,
    price,
    change,
    volume,
  });

  return (
    <article className="flex flex-col gap-10 rounded-md bg-white p-6 shadow">
      {Object.values(metricsData).map((section) => (
        <section className="flex flex-col">
          <Title>{section.title}</Title>
          <section className="grid grid-cols-[repeat(4,100px)] items-center">
            {section.metrics.map((metric) => (
              <MetricItem
                key={metric.name}
                label={metric.name}
                value={metric.value}
                tooltip={metric.message}
              />
            ))}
          </section>
        </section>
      ))}
    </article>
  );
};
