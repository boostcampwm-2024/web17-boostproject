import type { DeepPartial, ChartOptions } from 'lightweight-charts';

export interface ChartTheme extends DeepPartial<ChartOptions> {
  background: string;
  textColor: string;
  gridLines: string;
  borderColor: string;
  candlestick: {
    upColor: string;
    downColor: string;
    borderUpColor: string;
    borderDownColor: string;
    wickUpColor: string;
    wickDownColor: string;
  };
}
