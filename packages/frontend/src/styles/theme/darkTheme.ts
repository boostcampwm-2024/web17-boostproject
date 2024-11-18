import resolveConfig from 'tailwindcss/resolveConfig';
import { ChartTheme } from '.';
import tailwindConfig from '@/../tailwind.config';

const colorConfig = resolveConfig(tailwindConfig).theme.colors;
console.log(colorConfig.red);
export const darkTheme: ChartTheme = {
  background: '#1a1a1a',
  textColor: '#ffffffe6',
  gridLines: '#334158',
  borderColor: '#485c7b',
  candlestick: {
    upColor: colorConfig.red.toString(),
    downColor: colorConfig.blue.toString(),
    borderUpColor: colorConfig.red.toString(),
    borderDownColor: colorConfig.blue.toString(),
    wickUpColor: '#838ca1',
    wickDownColor: '#838ca1',
  },
};
