import { createChart, type IChartApi } from 'lightweight-charts';
import { useEffect, useRef, RefObject, useContext } from 'react';
import {
  PriceSchema,
  StockTimeSeriesResponse,
  VolumeSchema,
} from '@/apis/queries/stocks';
import { ThemeContext } from '@/contexts/themeContext';
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
  const candleSeries = useRef<ReturnType<IChartApi['addCandlestickSeries']>>();
  const volumeSeries = useRef<ReturnType<IChartApi['addHistogramSeries']>>();
  const containerInstance = containerRef.current;

  const { theme } = useContext(ThemeContext);
  const graphTheme = theme === 'light' ? lightTheme : darkTheme;

  useEffect(() => {
    if (!containerInstance) return;

    chart.current = createChart(containerInstance, {
      width: containerInstance.clientWidth,
      height: containerInstance.clientHeight,
      ...createChartOptions(graphTheme),
    });

    volumeSeries.current = chart.current.addHistogramSeries(
      createVolumeOptions(),
    );
    volumeSeries.current.priceScale().applyOptions({
      scaleMargins: {
        top: 0.93,
        bottom: 0,
      },
    });

    candleSeries.current = chart.current.addCandlestickSeries(
      createCandlestickOptions(graphTheme),
    );

    return () => {
      chart.current?.remove();
    };
  }, [containerInstance]);

  useEffect(() => {
    if (!chart.current || !candleSeries.current) return;

    chart.current.applyOptions(createChartOptions(graphTheme));
    candleSeries.current.applyOptions(createCandlestickOptions(graphTheme));
  }, [graphTheme]);

  useEffect(() => {
    if (!candleSeries.current || !volumeSeries.current) return;

    const transformedVolumeData = volumeData.map((item) =>
      TransformVolumeData.parse(item),
    );

    const transformedPriceData = priceData.map((item) =>
      TransformPriceData.parse(item),
    );

    const histogramData = getHistogramColorData(transformedVolumeData);

    candleSeries.current.setData(transformedPriceData);
    volumeSeries.current.setData(histogramData);
  }, [priceData, volumeData]);

  return chart;
};
