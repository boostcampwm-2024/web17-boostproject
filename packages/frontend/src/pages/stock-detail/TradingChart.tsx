import { useRef } from 'react';
import { useChart } from './hooks/useChart';
import { useChartResize } from './hooks/useChartResize';
import { ChartTheme, darkTheme } from '@/styles/theme';

interface TradingChartProps {
  theme?: ChartTheme;
}

export const TradingChart = ({ theme = darkTheme }: TradingChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chart = useChart({ containerRef, theme });

  useChartResize({ containerRef, chart });

  return <div ref={containerRef} className="absolute h-full w-full" />;
};
