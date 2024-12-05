import { type LogicalRange } from 'lightweight-charts';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RadioButton } from './components/RadioButton';
import { useChart } from './hooks/useChart';
import { useChartResize } from './hooks/useChartResize';
import {
  StockTimeSeriesRequest,
  useGetStocksPriceSeries,
} from '@/apis/queries/stocks';
import { TIME_UNIT } from '@/constants/timeUnit';

export const TradingChart = () => {
  const { stockId } = useParams();
  const [timeunit, setTimeunit] =
    useState<StockTimeSeriesRequest['timeunit']>('day');
  const isPending = useRef(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage } = useGetStocksPriceSeries({
    stockId: stockId ?? '',
    timeunit,
  });

  const allPriceData = data?.pages.flatMap((page) => page.priceDtoList) ?? [];
  const allVolumeData = data?.pages.flatMap((page) => page.volumeDtoList) ?? [];

  const chart = useChart({
    priceData: allPriceData,
    volumeData: allVolumeData,
    containerRef,
  });

  const fetchGraphData = useCallback(
    async (logicalRange: LogicalRange | null) => {
      if (isPending.current) return;
      isPending.current = true;

      if (logicalRange && logicalRange.from < 10 && hasNextPage) {
        await fetchNextPage();
      }

      isPending.current = false;
    },
    [hasNextPage, fetchNextPage],
  );

  useEffect(() => {
    const chartInstance = chart.current;
    if (!chartInstance) return;

    const timeScale = chartInstance.timeScale();
    timeScale.subscribeVisibleLogicalRangeChange(fetchGraphData);

    return () => {
      timeScale.unsubscribeVisibleLogicalRangeChange(fetchGraphData);
    };
  }, [chart, fetchGraphData]);

  useChartResize({ containerRef, chart });

  return (
    <div className="flex h-[30rem] flex-col xl:h-full">
      <section className="flex justify-end gap-5">
        {TIME_UNIT.map((option) => (
          <RadioButton
            key={option.id}
            id={option.time}
            name="timeunit"
            selected={timeunit === option.time}
            onChange={() => setTimeunit(option.time)}
          >
            {option.label}
          </RadioButton>
        ))}
      </section>
      <div ref={containerRef} className="h-0 w-full flex-grow" />
    </div>
  );
};
