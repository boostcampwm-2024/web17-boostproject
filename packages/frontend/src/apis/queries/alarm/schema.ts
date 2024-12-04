import { z } from 'zod';

const KeysSchema = z.object({
  p256dh: z.string(),
  auth: z.string(),
});

export const PostInitAlarmRequestSchema = z.object({
  endpoint: z.string(),
  keys: KeysSchema,
});

export type PostInitAlarmRequest = z.infer<typeof PostInitAlarmRequestSchema>;

export const PostInitAlarmResponseSchema = z.object({
  message: z.string(),
});

export type PostInitAlarmResponse = z.infer<typeof PostInitAlarmResponseSchema>;

export const PostCreateAlarmRequestSchema = z.object({
  stockId: z.string(),
  targetPrice: z.number(),
  targetVolum: z.number(),
  alarmDate: z.string().datetime(),
});

export type PostCreateAlarmRequest = z.infer<
  typeof PostCreateAlarmRequestSchema
>;

export const AlarmInfoSchema = z.object({
  alarmId: z.number(),
  stockId: z.string(),
  targetPrice: z.number(),
  targetVolume: z.number(),
  alarmDate: z.string().datetime(),
});

export type AlarmInfoResponse = z.infer<typeof AlarmInfoSchema>;

export const StockAlarmRequestSchema = z.object({
  stockId: z.string(),
  id: z.string(),
});

export type StockAlarmRequest = z.infer<typeof StockAlarmRequestSchema>;
