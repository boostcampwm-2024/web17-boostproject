import { MetricSection, Title } from './components';
import { Tooltip } from '@/components/ui/tooltip';
import { METRIC_DETAILS } from '@/constants/METRIC_DETAILS';

export const StockMetricsPanel = () => {
  return (
    <article className="flex flex-col gap-10 rounded-md bg-white p-6 shadow">
      <section className="group flex items-center gap-10">
        <div className="group relative">
          <Tooltip className="absolute bottom-full mb-6">
            {METRIC_DETAILS.tradingVolume.message}
          </Tooltip>
          <Title>{METRIC_DETAILS.tradingVolume.name}</Title>
        </div>
        <span className="display-medium14 text-dark-gray">00.000</span>
      </section>
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
