import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Stock } from '@/stock/domain/stock.entity';

@Entity('stock_news')
export class StockNews {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ name: 'stock_id' })
  stockId: string;

  @Column({ name: 'stock_name', length: 100 })
  stockName: string;

  @Column({ type: 'text' })
  link: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  summary: string;

  @Column({ name: 'positive_content', type: 'text' })
  positiveContent: string;

  @Column({ name: 'negative_content', type: 'text' })
  negativeContent: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Stock, (stock) => stock.news)
  @JoinColumn({ name: 'stock_id' })
  stock: Stock;

  getLinks(): string[] {
    return this.link.split(',').map(link => link.trim());
  }
}