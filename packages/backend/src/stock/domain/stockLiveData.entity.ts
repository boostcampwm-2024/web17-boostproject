import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Stock } from './stock.entity';

@Entity('stock_live_data')
export class StockLiveData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'current_price', type: 'decimal', precision: 15, scale: 2 })
  currentPrice: number;

  @Column({ name: 'change_rate', type: 'decimal', precision: 5, scale: 2 })
  changeRate: number;

  @Column()
  volume: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  high: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  low: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  open: number;

  @UpdateDateColumn()
  @Column({ type: 'timestamp' })
  updatedAt: Date;

  @OneToOne(() => Stock)
  @JoinColumn({ name: 'stock_id' })
  stock: Stock;
}
