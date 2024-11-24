import { z } from 'zod';
import { instance } from '../config';
import { formatZodError } from './formatZodError';

interface GetParams {
  schema: z.ZodType;
  url: string;
}

export const get = async <T>({ schema, url }: GetParams): Promise<T | null> => {
  try {
    const { data } = await instance.get(url);
    const result = schema.parse(data);

    if (!result.success) {
      throw new Error(formatZodError(result.error));
    }

    return result;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('API error:', error);
    }
    return null;
  }
};
