import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { Stock } from './stock.entity';

@Entity()
export class KospiStock {
  @PrimaryColumn({ name: 'stock_id' })
  id: string;

  @Column({ name: 'is_kospi' })
  isKospi: boolean;

  @OneToOne(() => Stock, (stock) => stock.id)
  stock: Stock;
}
