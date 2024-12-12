import { useContext, useEffect, useState } from 'react';
import Lottie from 'react-lottie-player';
import { useParams } from 'react-router-dom';
import { MetricItem, Title } from './components';
import darkSkeleton from '@/components/lottie/dark-skeleton.json';
import skeleton from '@/components/lottie/skeleton.json';
import { METRICS_DATA } from '@/constants/metricDetail';
import { ThemeContext } from '@/contexts/theme';
import { socketStock } from '@/sockets/config';
import { useWebsocket } from '@/sockets/useWebsocket';
import { type StockMetricsPanelProps } from '@/types/metrics';
import { cn } from '@/utils/cn';

interface RealTimeStockData {
  price: number;
  change: number;
  volume: number;
}

export const StockMetricsPanel = ({
  eps,
  high52w,
  low52w,
  marketCap,
  per,
}: Partial<StockMetricsPanelProps>) => {
  const { stockId } = useParams();
  const { isConnected } = useWebsocket(socketStock);
  const { theme } = useContext(ThemeContext);
  const [realTimeData, setRealTimeData] = useState<RealTimeStockData>({
    price: 0,
    change: 0,
    volume: 0,
  });

  useEffect(() => {
    if (!isConnected || !stockId) return;

    const handleStockUpdate = (data: RealTimeStockData) => {
      setRealTimeData(data);
    };

    socketStock.emit('connectStock', stockId);
    socketStock.on('updateStock', handleStockUpdate);

    return () => {
      socketStock.off('updateStock', handleStockUpdate);
    };
  }, [isConnected, stockId]);

  const { price, change, volume } = realTimeData;

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
    <article className="flex flex-1 flex-col gap-10 rounded-md bg-white p-6 shadow">
      {!price || !change || !volume ? (
        <section className="grid w-9/12 lg:grid-cols-2 lg:grid-rows-2">
          {Array.from({ length: 4 }, () => (
            <Lottie
              animationData={theme === 'light' ? skeleton : darkSkeleton}
              play
              className={cn(theme === 'light' ? 'w-64' : 'w-36')}
            />
          ))}
        </section>
      ) : (
        Object.values(metricsData).map((section) => (
          <section className="flex flex-col gap-5" key={section.id}>
            <Title>{section.title}</Title>
            <section className="grid items-center gap-5 lg:grid-cols-2 lg:grid-rows-2 2xl:w-9/12">
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
        ))
      )}
    </article>
  );
};
