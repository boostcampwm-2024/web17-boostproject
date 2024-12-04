import { z } from 'zod';

export const ErrorResponseSchema = z.object({
  message: z.string(),
  error: z.string(),
  statusCode: z.number(),
});

export const AxiosErrorSchema = z.object({
  response: z.object({
    data: ErrorResponseSchema,
    status: z.number(),
    statusText: z.string(),
  }),
  request: z.any().optional(),
  message: z.string(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type AxiosError = z.infer<typeof AxiosErrorSchema>;
