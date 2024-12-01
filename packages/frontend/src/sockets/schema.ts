import { z } from 'zod';

export const ChatDataSchema = z.object({
  id: z.number(),
  likeCount: z.number(),
  message: z.string(),
  type: z.string(),
  createdAt: z.string().datetime(),
  liked: z.boolean(),
  nickname: z.string(),
  mentioned: z.boolean(),
  subName: z.string(),
});

export type ChatData = z.infer<typeof ChatDataSchema>;

export const ChatDataResponseSchema = z.object({
  chats: z.array(ChatDataSchema),
  hasMore: z.boolean(),
});

export type ChatDataResponse = z.infer<typeof ChatDataResponseSchema>;

export const ChatLikeSchema = z.object({
  stockId: z.string(),
  chatId: z.number(),
  likeCount: z.number(),
  message: z.string(),
  date: z.string().datetime(),
});

export type ChatLikeResponse = z.infer<typeof ChatLikeSchema>;
