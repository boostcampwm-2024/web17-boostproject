/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';
import { instance } from '../config';
import { formatZodError } from './formatZodError';

interface GetParams {
  schema: z.ZodType;
  url: string;
  payload?: Record<string, any>;
}

export const get = async <T>({
  schema,
  url,
  payload,
}: GetParams): Promise<T> => {
  const { data } = await instance.get(url, {
    params: payload,
  });
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new Error(formatZodError(result.error));
  }

  return data;
};
