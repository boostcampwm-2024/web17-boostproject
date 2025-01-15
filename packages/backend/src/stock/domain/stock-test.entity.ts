import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class StockTest {
  @PrimaryColumn()
  id: string;

  @Column({ default: 0 })
  views: number;
}
