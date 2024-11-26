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
}: PostParams): Promise<T> => {
  const { data } = await instance.post(url, { params });
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new Error(formatZodError(result.error));
  }

  return data;
};
