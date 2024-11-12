import { MetricSection, Title } from './components';
import mockData from '@/mocks/data.json';

export const StockMetricsPanel = () => {
  return (
    <article className="flex flex-col gap-10 rounded-md bg-white p-6 shadow">
      <section className="flex items-center gap-10">
        <Title>거래량</Title>
        <span className="display-medium14 text-dark-gray">00.000</span>
      </section>
      <MetricSection title="가격" metricInfo={mockData.price} />
      <MetricSection
        title="기업가치"
        metricInfo={mockData['enterprise value']}
      />
    </article>
  );
};
