import { PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, ManyToOne } from 'typeorm';
import { Stock } from './stock.entity';

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

  @Column()
  volume: number;

  @Column({ type: 'timestamp' })
  start_time: Date;

  @Column({ type: 'timestamp' })
  created_at: Date;

  @ManyToOne(() => Stock)
  @JoinColumn({ name: 'stock_id' })
  stock: Stock;
}
