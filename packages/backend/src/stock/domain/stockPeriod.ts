import {
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  ColumnOptions,
} from 'typeorm';
import { Stock } from './stock.entity';
import { applyDecorators } from '@nestjs/common';

export const GenerateBigintColumn = (
  options?: ColumnOptions,
): PropertyDecorator => {
  return applyDecorators(
    Column({
      ...options,
      type: 'bigint',
      transformer: {
        to: (value: bigint): string =>
          typeof value === 'bigint' ? value.toString() : value,
        from: (value: string): bigint =>
          typeof value === 'string' ? BigInt(value) : value,
      },
    }),
  );
};

export class StockPeriod {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  close: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  low: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  high: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  open: number;

  @GenerateBigintColumn()
  volume: BigInt;

  @Column({ type: 'timestamp' })
  start_time: Date;

  @Column({ type: 'timestamp' })
  created_at: Date;

  @ManyToOne(() => Stock)
  @JoinColumn({ name: 'stock_id' })
  stock: Stock;
}
