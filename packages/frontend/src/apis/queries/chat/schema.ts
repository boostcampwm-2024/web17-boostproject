import { z } from 'zod';

export const GetChatLikeRequestSchema = z.object({
  chatId: z.number(),
});

export type GetChatLikeRequest = z.infer<typeof GetChatLikeRequestSchema>;

export const GetChatLikeResponseSchema = z.object({
  chatId: z.number(),
  stockId: z.string(),
  likeCount: z.number(),
  message: z.string(),
  date: z.string().datetime(),
});

export type GetChatLikeResponse = z.infer<typeof GetChatLikeResponseSchema>;

export const GetChatListRequestSchema = z.object({
  stockId: z.string(),
  latestChatId: z.number().optional(),
  pageSize: z.number().optional(),
  order: z.enum(['latest', 'like']).optional(),
});

export type GetChatListRequest = z.infer<typeof GetChatListRequestSchema>;
