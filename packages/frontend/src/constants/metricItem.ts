export type MetricItemValue = {
  id: number;
  label: string;
};

type MetricItem = {
  trading_volume: MetricItemValue[];
  enterprise_value: MetricItemValue[];
};

export const METRIC_ITEM: MetricItem = {
  trading_volume: [
    { id: 0, label: '현재가' },
    { id: 1, label: '52주 최고가' },
    { id: 2, label: '변동률' },
    { id: 3, label: '52주 최저가' },
  ],
  enterprise_value: [
    { id: 0, label: '시가총액' },
    { id: 1, label: 'EPS' },
    { id: 2, label: 'PER' },
  ],
};
