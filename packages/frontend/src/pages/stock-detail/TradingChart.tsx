import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RadioButton } from './components/RadioButton';
import { useChart } from './hooks/useChart';
import { useChartResize } from './hooks/useChartResize';
import {
  StockTimeSeriesRequest,
  useGetStocksPriceSeries,
} from '@/apis/queries/stocks';
import { TIME_UNIT } from '@/constants/timeUnit';
import { ChartTheme, lightTheme } from '@/styles/theme';

interface TradingChartProps {
  theme?: ChartTheme;
}

export const TradingChart = ({ theme = lightTheme }: TradingChartProps) => {
  const { stockId } = useParams();
  const [timeunit, setTimeunit] =
    useState<StockTimeSeriesRequest['timeunit']>('day');
  const containerRef = useRef<HTMLDivElement>(null);

  const { data } = useGetStocksPriceSeries({
    stockId: stockId ?? '',
    timeunit,
  });

  const chart = useChart({
    priceData: data?.priceDtoList ?? [],
    volumeData: data?.volumeDtoList ?? [],
    containerRef,
    theme,
  });

  useChartResize({ containerRef, chart });

  return (
    <div className="flex h-[30rem] flex-col xl:h-full">
      <section className="flex justify-end">
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
