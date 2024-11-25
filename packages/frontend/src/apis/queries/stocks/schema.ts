import { z } from 'zod';

export const GetStockListRequestSchema = z.object({
  limit: z.number(),
  sortType: z.enum(['increase', 'decrease']),
});

export type GetStockListRequest = z.infer<typeof GetStockListRequestSchema>;

export const GetStockListResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  currentPrice: z.number(),
  changeRate: z.number(),
  volume: z.number(),
  marketCap: z.string(),
});

export type GetStockListResponse = z.infer<typeof GetStockListResponseSchema>;

export const StockTimeSeriesRequestSchema = z.object({
  stockId: z.string(),
  lastStartTime: z.string().datetime(),
  timeUnit: z.enum(['day', 'week', 'month', 'year']),
});

export type StockTimeSeriesRequest = z.infer<
  typeof StockTimeSeriesRequestSchema
>;

export const PriceSchema = z.object({
  startTime: z.string().datetime(),
  open: z.string(),
  high: z.string(),
  low: z.string(),
  close: z.string(),
});

export const VolumeSchema = z.object({
  startTime: z.string().datetime(),
  volume: z.string(),
});

export const StockTimeSeriesResponseSchema = z.object({
  priceDtoList: z.array(PriceSchema),
  volumeDtoList: z.array(VolumeSchema),
  hasMore: z.boolean(),
});

export type StockTimeSeriesResponse = z.infer<
  typeof StockTimeSeriesResponseSchema
>;
