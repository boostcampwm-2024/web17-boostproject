import resolveConfig from 'tailwindcss/resolveConfig';
import { ChartTheme } from '.';
import tailwindConfig from '@/../tailwind.config.js';

const colorConfig = resolveConfig(tailwindConfig).theme.colors;

export const lightTheme: ChartTheme = {
  background: colorConfig.white,
  textColor: '#000000e6',
  gridLines: '#e0e3eb',
  borderColor: '#d6dcde',
  candlestick: {
    upColor: colorConfig.red,
    downColor: colorConfig.blue,
    borderUpColor: colorConfig.red,
    borderDownColor: colorConfig.blue,
    wickUpColor: '#737375',
    wickDownColor: '#737375',
  },
};
