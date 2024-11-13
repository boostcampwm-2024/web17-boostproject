import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Stock } from './stock.entity';

@Entity('stock_live_data')
export class StockLiveData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  current_price: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  change_rate: number;

  @Column()
  volume: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  high: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  low: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  open: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  previous_close: number;

  @Column({ type: 'timestamp' })
  updated_at: Date;

  @OneToOne(() => Stock)
  @JoinColumn({ name: 'stock_id' })
  stock: Stock;
}
