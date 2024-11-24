import { z } from 'zod';

export const ChatDataSchema = z.object({
  id: z.number(),
  likeCount: z.number(),
  message: z.string(),
  type: z.string(),
  createdAt: z.date(),
  liked: z.boolean(),
  nickname: z.string(),
});

export type ChatData = z.infer<typeof ChatDataSchema>;

export const ChatDataResponseSchema = z.object({
  chats: z.array(ChatDataSchema),
  hasMore: z.boolean(),
});

export type ChatDataResponse = z.infer<typeof ChatDataResponseSchema>;
