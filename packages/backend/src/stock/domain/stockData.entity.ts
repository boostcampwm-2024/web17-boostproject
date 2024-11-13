import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Stock } from './stock.entity';

@Entity('stock_minutely')
export class StockMinutely {
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

  @Column({ type: 'bigint' })
  volume: number;

  @Column({ type: 'timestamp', name: 'start_time' })
  startTime: Date;

  @OneToOne(() => Stock)
  @JoinColumn({ name: 'stock_id' })
  stock: Stock;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

@Entity('stock_daily')
export class StockDaily {
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

  @Column({ type: 'bigint' })
  volume: number;

  @Column({ type: 'timestamp', name: 'start_time' })
  startTime: Date;

  @OneToOne(() => Stock)
  @JoinColumn({ name: 'stock_id' })
  stock: Stock;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
@Entity('stock_weekly')
export class StockWeekly {
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

  @Column({ type: 'bigint' })
  volume: number;

  @Column({ type: 'timestamp', name: 'start_time' })
  startTime: Date;

  @OneToOne(() => Stock)
  @JoinColumn({ name: 'stock_id' })
  stock: Stock;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
@Entity('stock_monthly')
export class StockMonthly {
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

  @Column({ type: 'bigint' })
  volume: number;

  @Column({ type: 'timestamp', name: 'start_time' })
  startTime: Date;

  @OneToOne(() => Stock)
  @JoinColumn({ name: 'stock_id' })
  stock: Stock;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
@Entity('stock_yearly')
export class StockYearly {
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

  @Column({ type: 'bigint' })
  volume: number;

  @Column({ type: 'timestamp', name: 'start_time' })
  startTime: Date;

  @OneToOne(() => Stock)
  @JoinColumn({ name: 'stock_id' })
  stock: Stock;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
