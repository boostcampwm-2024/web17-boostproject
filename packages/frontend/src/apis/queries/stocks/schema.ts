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
