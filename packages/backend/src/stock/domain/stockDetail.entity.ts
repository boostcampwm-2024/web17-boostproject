import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Stock } from './stock.entity';

@Entity('stock_detail')
export class StockDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Stock)
  @JoinColumn({ name: 'stock_id' })
  stock: Stock;

  @Column({
    type: 'decimal',
    precision: 20,
    scale: 2,
  })
  marketCap: number;

  @Column({ type: 'integer' })
  eps: number;

  @Column({ type: 'decimal', precision: 6, scale: 3 })
  per: number;

  @Column({ type: 'integer' })
  high52w: number;

  @Column({ type: 'integer' })
  low52w: number;
}
