import { z } from 'zod';

export const GetLoginStatusSchema = z.object({
  message: z.enum(['Authenticated', 'Not Authenticated']),
  nickname: z.string().nullish(),
});

export type GetLoginStatus = z.infer<typeof GetLoginStatusSchema>;

export const GetTestLoginSchema = z.object({
  password: z.string(),
  username: z.string(),
});

export type GetTestLogin = z.infer<typeof GetTestLoginSchema>;

export const GetUserInfoSchema = z.object({
  nickname: z.string(),
  subName: z.string(),
  createdAt: z.string().datetime(),
  email: z.string(),
  type: z.string(),
});

export type GetUserInfo = z.infer<typeof GetUserInfoSchema>;

export const PostUserNicknameSchema = z.object({
  message: z.string(),
  date: z.string().datetime(),
});

export type PostUserNickname = z.infer<typeof PostUserNicknameSchema>;
