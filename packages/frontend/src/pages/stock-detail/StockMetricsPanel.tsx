import { MetricSection } from './components';
import { METRIC_DETAILS } from '@/constants/METRIC_DETAILS';

export const StockMetricsPanel = () => {
  return (
    <article className="flex flex-col gap-10 rounded-md bg-white p-6 shadow">
      <MetricSection
        title="가격"
        metricInfo={Object.values(METRIC_DETAILS.price)}
      />
      <MetricSection
        title="기업가치"
        metricInfo={Object.values(METRIC_DETAILS.enterpriseValue)}
      />
    </article>
  );
};
