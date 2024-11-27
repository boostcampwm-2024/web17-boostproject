import { type StockMetricsPanelProps } from '@/types/metrics';

export const METRIC_DETAILS = {
  price: {
    currentPrice: {
      name: '현재가',
      message: '현재 주식의 거래 가격이에요.',
    },
    tradingVolume: {
      name: '거래량',
      message: '해당 기간 동안 거래된 주식의 수량이에요.',
    },
    fluctuationRate: {
      name: '변동률',
      message: '전일 대비 주가 변동 비율이에요.',
    },
    fiftyTwoWeekRange: {
      name: '52주 최고/최저가',
      message: '최근 52주 동안의 최고/최저 주가예요.',
    },
  },
  enterpriseValue: {
    marketCap: {
      name: '시가총액',
      message: '발행 주식 수와 현재 가격을 곱한 값으로, 기업가치를 나타내요.',
    },
    per: {
      name: 'PER',
      message: '주가/주당순이익으로, 주식의 투자 매력도를 나타내요.',
    },
    eps: {
      name: 'EPS',
      message: '주당순이익으로, 기업의 수익성을 보여줘요.',
    },
  },
};

export const METRICS_DATA = ({
  price,
  volume,
  change,
  high52w,
  low52w,
  marketCap,
  per,
  eps,
}: StockMetricsPanelProps) => {
  return {
    price: {
      id: 1,
      title: '가격',
      metrics: [
        {
          ...METRIC_DETAILS.price.currentPrice,
          value: price?.toLocaleString(),
        },
        {
          ...METRIC_DETAILS.price.tradingVolume,
          value: volume?.toLocaleString(),
        },
        {
          ...METRIC_DETAILS.price.fluctuationRate,
          value: change?.toLocaleString(),
        },
        {
          ...METRIC_DETAILS.price.fiftyTwoWeekRange,
          value: `${high52w?.toLocaleString()}/${low52w?.toLocaleString()}`,
        },
      ],
    },
    enterpriseValue: {
      id: 2,
      title: '기업가치',
      metrics: [
        {
          ...METRIC_DETAILS.enterpriseValue.marketCap,
          value: marketCap?.toLocaleString(),
        },
        {
          ...METRIC_DETAILS.enterpriseValue.per,
          value: per?.toLocaleString(),
        },
        {
          ...METRIC_DETAILS.enterpriseValue.eps,
          value: eps?.toLocaleString(),
        },
      ],
    },
  };
};
