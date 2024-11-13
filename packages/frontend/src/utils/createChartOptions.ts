import type { ChartTheme } from '@/styles/theme';
import {
  type DeepPartial,
  type HistogramStyleOptions,
  type SeriesOptionsCommon,
  CrosshairMode,
  ColorType,
} from 'lightweight-charts';

export const createChartOptions = (theme: ChartTheme) => {
  const { background, textColor, gridLines, borderColor } = theme;

  return {
    layout: {
      background: { type: ColorType.Solid, color: background },
      textColor: textColor,
    },
    grid: {
      vertLines: {
        color: gridLines,
      },
      horzLines: {
        color: gridLines,
      },
    },
    crosshair: {
      mode: CrosshairMode.Normal,
    },
    timeScale: {
      borderColor: borderColor,
    },
  };
};

export const createVolumeOptions = (): DeepPartial<
  HistogramStyleOptions & SeriesOptionsCommon
> => ({
  priceLineWidth: 2,
  priceFormat: {
    type: 'volume',
  },
  priceScaleId: '',
});

export const createCandlestickOptions = (theme: ChartTheme) => {
  return { ...theme.candlestick };
};
