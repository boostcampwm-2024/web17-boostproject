export const TIME_UNIT = {
  MINUTE: 'minute',
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
} as const;

export type TIME_UNIT = (typeof TIME_UNIT)[keyof typeof TIME_UNIT];
