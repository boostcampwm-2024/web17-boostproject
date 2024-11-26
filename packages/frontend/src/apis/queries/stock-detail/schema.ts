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

export const PostStockRequestSchema = z.object({
  stockId: z.string(),
});

export type PostStockRequest = z.infer<typeof PostStockRequestSchema>;

export const PostStockResponseSchema = z.object({
  id: z.string(),
  message: z.string(),
  date: z.date(),
});

export type PostStockResponse = z.infer<typeof PostStockResponseSchema>;

export const GetStockOwnershipResponseSchema = z.object({
  isOwner: z.boolean(),
  date: z.string().datetime(),
});

export type GetStockOwnershipResponse = z.infer<
  typeof GetStockOwnershipResponseSchema
>;
