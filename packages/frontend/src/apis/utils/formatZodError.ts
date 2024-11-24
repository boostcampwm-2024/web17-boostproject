import { z } from 'zod';

export const formatZodError = (error: z.ZodError): string => {
  return error.errors
    .map((err) => `${err.path.join('.')}: ${err.message}`)
    .join(', ');
};
