import resolveConfig from 'tailwindcss/resolveConfig';
import { ChartTheme } from '.';
import tailwindConfig from '@/../tailwind.config';

const colorConfig = resolveConfig(tailwindConfig).theme.colors;

export const lightTheme: ChartTheme = {
  background: colorConfig.white,
  textColor: '#000000e6',
  gridLines: '#e0e3eb',
  borderColor: '#d6dcde',
  candlestick: {
    upColor: colorConfig.red.toString(),
    downColor: colorConfig.blue.toString(),
    borderUpColor: colorConfig.red.toString(),
    borderDownColor: colorConfig.blue.toString(),
    wickUpColor: '#737375',
    wickDownColor: '#737375',
  },
};
