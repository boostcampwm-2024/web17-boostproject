import { z } from 'zod';
import { instance } from '../config';
import { formatZodError } from './formatZodError';

interface GetParams {
  schema: z.ZodType;
  url: string;
}

export const get = async <T>({ schema, url }: GetParams): Promise<T> => {
  const { data } = await instance.get(url);
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new Error(formatZodError(result.error));
  }

  return data;
};
