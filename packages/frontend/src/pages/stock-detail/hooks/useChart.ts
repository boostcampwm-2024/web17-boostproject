import { createChart, type IChartApi } from 'lightweight-charts';
import { useEffect, useRef, RefObject } from 'react';
import {
  PriceSchema,
  StockTimeSeriesResponse,
  VolumeSchema,
} from '@/apis/queries/stocks';
import { useGetUserTheme } from '@/apis/queries/user';
import { darkTheme, lightTheme } from '@/styles/theme';
import {
  createCandlestickOptions,
  createChartOptions,
  createVolumeOptions,
} from '@/utils/createChartOptions';
import { getHistogramColorData } from '@/utils/getHistogramColorData';

interface UseChartProps {
  containerRef: RefObject<HTMLDivElement>;
  priceData: StockTimeSeriesResponse['priceDtoList'];
  volumeData: StockTimeSeriesResponse['volumeDtoList'];
}

const TransformPriceData = PriceSchema.transform((item) => ({
  time: new Date(item.startTime).toISOString().slice(0, 10),
  open: parseFloat(item.open),
  high: parseFloat(item.high),
  low: parseFloat(item.low),
  close: parseFloat(item.close),
}));

const TransformVolumeData = VolumeSchema.transform((item) => ({
  time: new Date(item.startTime).toISOString().slice(0, 10),
  value: parseFloat(item.volume),
}));

export const useChart = ({
  containerRef,
  priceData,
  volumeData,
}: UseChartProps) => {
  const chart = useRef<IChartApi>();

  const { data } = useGetUserTheme();
  const graphTheme = data?.theme === 'light' ? lightTheme : darkTheme;

  useEffect(() => {
    if (!containerRef.current) return;

    chart.current = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      ...createChartOptions(graphTheme),
      handleScroll: {
        mouseWheel: false,
        pressedMouseMove: false,
        horzTouchDrag: false,
        vertTouchDrag: false,
      },
      handleScale: false,
    });

    const volumeSeries = chart.current.addHistogramSeries(
      createVolumeOptions(),
    );
    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.93,
        bottom: 0,
      },
    });

    const transformedVolumeData = volumeData.map((item) =>
      TransformVolumeData.parse(item),
    );
    const histogramData = getHistogramColorData(transformedVolumeData);
    volumeSeries.setData(histogramData);

    const candleSeries = chart.current.addCandlestickSeries(
      createCandlestickOptions(graphTheme),
    );
    const transformedPriceData = priceData.map((item) =>
      TransformPriceData.parse(item),
    );
    candleSeries.setData(transformedPriceData);

    return () => {
      chart.current?.remove();
    };
  }, [containerRef, graphTheme, priceData, volumeData]);

  return chart;
};
