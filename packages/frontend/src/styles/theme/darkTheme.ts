import resolveConfig from 'tailwindcss/resolveConfig';
import { ChartTheme } from '.';
import tailwindConfig from '@/../tailwind.config.js';

const colorConfig = resolveConfig(tailwindConfig).theme.colors;

export const darkTheme: ChartTheme = {
  background: '#1a1a1a',
  textColor: '#ffffffe6',
  gridLines: '#334158',
  borderColor: '#485c7b',
  candlestick: {
    upColor: colorConfig.red,
    downColor: colorConfig.blue,
    borderUpColor: colorConfig.red,
    borderDownColor: colorConfig.blue,
    wickUpColor: '#838ca1',
    wickDownColor: '#838ca1',
  },
};
