import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
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

export class StockData {
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

  @Column({ type: 'timestamp', name: 'start_time' })
  startTime: Date;

  @ManyToOne(() => Stock)
  @JoinColumn({ name: 'stock_id' })
  stock: Stock;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

@Entity('stock_minutely')
export class StockMinutely extends StockData {}
@Entity('stock_daily')
export class StockDaily extends StockData {}
@Entity('stock_weekly')
export class StockWeekly extends StockData {}
@Entity('stock_monthly')
export class StockMonthly extends StockData {}
@Entity('stock_yearly')
export class StockYearly extends StockData {}
