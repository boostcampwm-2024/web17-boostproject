import { AxiosRequestConfig } from 'axios';
import { z } from 'zod';
import { instance } from '../config';
import { formatZodError } from './formatZodError';

interface PostParams {
  params: AxiosRequestConfig['params'];
  schema: z.ZodType;
  url: string;
}

export const post = async <T>({
  params,
  schema,
  url,
}: PostParams): Promise<T | null> => {
  try {
    const { data } = await instance.post(url, { params });
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
