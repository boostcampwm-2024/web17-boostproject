import { IChartApi } from 'lightweight-charts';
import { MutableRefObject, useEffect, useRef, type RefObject } from 'react';

interface UseChartResize {
  containerRef: RefObject<HTMLDivElement>;
  chart: MutableRefObject<IChartApi | undefined>;
}

export const useChartResize = ({ containerRef, chart }: UseChartResize) => {
  const resizeObserver = useRef<ResizeObserver>();

  useEffect(() => {
    if (!containerRef.current || !chart.current) return;

    resizeObserver.current = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;

      chart.current?.applyOptions({ width, height });

      requestAnimationFrame(() => {
        chart.current?.timeScale().fitContent();
      });
    });

    resizeObserver.current.observe(containerRef.current);

    return () => {
      resizeObserver.current?.disconnect();
    };
  }, [chart, containerRef]);
};
