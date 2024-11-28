import { z } from 'zod';

export const GetStockListRequestSchema = z.object({
  limit: z.number(),
});

export type GetStockListRequest = z.infer<typeof GetStockListRequestSchema>;

export const GetStockSchema = z.object({
  id: z.string(),
  name: z.string(),
  currentPrice: z.number(),
  changeRate: z.number(),
  volume: z.number(),
  marketCap: z.string(),
  rank: z.number(),
});

export const GetStockListResponseSchema = z.object({
  result: z.array(GetStockSchema),
});

export type GetStockTopViewsResponse = z.infer<typeof GetStockSchema>;

export type GetStockListResponse = z.infer<typeof GetStockListResponseSchema>;

export const StockTimeSeriesRequestSchema = z.object({
  stockId: z.string(),
  lastStartTime: z.string().datetime().optional(),
  timeunit: z.enum(['day', 'week', 'month', 'year']),
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

export const SearchResultSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const SearchResultsResponseSchema = z.object({
  searchResults: z.array(SearchResultSchema),
});

export type SearchResultsResponse = z.infer<typeof SearchResultsResponseSchema>;
