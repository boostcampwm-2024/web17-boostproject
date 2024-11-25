import { z } from 'zod';

export const GetStockRequestSchema = z.object({
  stockId: z.string(),
});

export type GetStockRequest = z.infer<typeof GetStockRequestSchema>;

export const GetStockResponseSchema = z.object({
  marketCap: z.number(),
  name: z.string(),
  eps: z.number(),
  per: z.number(),
  high52w: z.number(),
  low52w: z.number(),
});

export type GetStockResponse = z.infer<typeof GetStockResponseSchema>;

export const PostStockViewRequestSchema = z.object({
  stockId: z.string(),
});

export type PostStockViewRequest = z.infer<typeof PostStockViewRequestSchema>;

export const PostViewResponseSchema = z.object({
  id: z.string(),
  message: z.string(),
  date: z.date(),
});

export type PostViewResponse = z.infer<typeof PostViewResponseSchema>;
