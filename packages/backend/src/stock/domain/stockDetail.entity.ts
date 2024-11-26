import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
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
    name: 'market_cap',
    type: 'bigint',
    unsigned: true,
  })
  marketCap: string;

  @Column({ type: 'integer' })
  eps: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  per: number;

  @Column({ type: 'integer' })
  high52w: number;

  @Column({ type: 'integer' })
  low52w: number;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
