import { z } from 'zod';

export const GetLoginStatusSchema = z.object({
  message: z.enum(['Authenticated', 'Not Authenticated']),
});

export type GetLoginStatus = z.infer<typeof GetLoginStatusSchema>;
