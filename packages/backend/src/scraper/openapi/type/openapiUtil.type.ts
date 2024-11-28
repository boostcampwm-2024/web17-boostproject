export type TR_ID =
  | 'FHKST03010100'
  | 'FHKST03010200'
  | 'FHKST66430300'
  | 'HHKDB669107C0'
  | 'FHPST01700000'
  | 'FHKST01010100'
  | 'FHPUP02100000'
  | 'FHKST03030100'
  | 'CTPF1002R';

export const TR_IDS: Record<string, TR_ID> = {
  ITEM_CHART_PRICE: 'FHKST03010100',
  MINUTE_DATA: 'FHKST03010200',
  FINANCIAL_DATA: 'FHKST66430300',
  PRODUCTION_DETAIL: 'CTPF1002R',
  LIVE_DATA: 'FHKST01010100',
  INDEX_DATA: 'FHPUP02100000',
  RATE_DATA: 'FHKST03030100',
  FLUCTUATION_DATA: 'FHPST01700000',
};
