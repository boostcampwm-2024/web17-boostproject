import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Stock } from '@/stock/domain/stock.entity';

@Entity()
export class FluctuationRankStock {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Stock, (stock) => stock.id)
  @JoinColumn({ name: 'stock_id' })
  stock: Stock;

  @Column()
  isRising: boolean;

  @Column()
  rank: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
