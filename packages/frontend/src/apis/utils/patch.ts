import { AxiosRequestConfig } from 'axios';
import { z } from 'zod';
import { instance } from '../config';
import { formatZodError } from './formatZodError';

interface PatchParams {
  params?: AxiosRequestConfig['params'];
  schema: z.ZodType;
  url: string;
}

export const patch = async <T>({
  params,
  schema,
  url,
}: PatchParams): Promise<T> => {
  const { data } = await instance.patch(url, params);
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new Error(formatZodError(result.error));
  }

  return data;
};
