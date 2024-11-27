import { AxiosRequestConfig } from 'axios';
import { z } from 'zod';
import { instance } from '../config';
import { formatZodError } from './formatZodError';

interface DeleteParams {
  params: AxiosRequestConfig['params'];
  schema: z.ZodType;
  url: string;
}

export const deleteRequest = async <T>({
  params,
  schema,
  url,
}: DeleteParams): Promise<T> => {
  const { data } = await instance.delete(url, { params });
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new Error(formatZodError(result.error));
  }

  return data;
};
