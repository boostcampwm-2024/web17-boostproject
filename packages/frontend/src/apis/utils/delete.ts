/* eslint-disable */
import { z } from 'zod';
import { instance } from '../config';
import { formatZodError } from './formatZodError';

interface DeleteParams {
  data: any;
  schema: z.ZodType;
  url: string;
}

export const deleteRequest = async <T>({
  data,
  schema,
  url,
}: DeleteParams): Promise<T> => {
  const response = await instance.delete(url, { data });
  const result = schema.safeParse(response.data);

  if (!result.success) {
    throw new Error(formatZodError(result.error));
  }

  return data;
};
