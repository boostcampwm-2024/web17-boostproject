import { z } from 'zod';

export const GetUserInfoSchema = z.object({
  nickname: z.string(),
  subName: z.string(),
  createdAt: z.string().datetime(),
  email: z.string(),
  type: z.string(),
});

export type GetUserInfo = z.infer<typeof GetUserInfoSchema>;

export const GetUserStockSchema = z.object({
  id: z.number(),
  stockId: z.string(),
  name: z.string(),
  isTrading: z.boolean(),
  groupCode: z.string(),
  createdAt: z.string().datetime(),
});

export type GetUserStock = z.infer<typeof GetUserStockSchema>;

export const GetUserStockResponseSchema = z.object({
  userStocks: z.array(GetUserStockSchema),
});

export type GetUserStockResponse = z.infer<typeof GetUserStockResponseSchema>;

export const PostUserNicknameSchema = z.object({
  message: z.string(),
  date: z.string().datetime(),
});

export type PostUserNickname = z.infer<typeof PostUserNicknameSchema>;

export const GetUserThemeSchema = z.object({
  theme: z.enum(['light', 'dark']),
});

export type GetUserTheme = z.infer<typeof GetUserThemeSchema>;
