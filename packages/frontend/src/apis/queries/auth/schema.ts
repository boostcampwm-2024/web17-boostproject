import { z } from 'zod';

export const GetLoginStatusSchema = z.object({
  message: z.enum(['Authenticated', 'Not Authenticated']),
  nickname: z.string(),
});

export type GetLoginStatus = z.infer<typeof GetLoginStatusSchema>;

export const GetTestLoginSchema = z.object({
  password: z.string(),
  username: z.string(),
});

export type GetTestLogin = z.infer<typeof GetTestLoginSchema>;
