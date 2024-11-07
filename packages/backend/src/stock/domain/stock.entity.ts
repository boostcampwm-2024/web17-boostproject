import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Stock {
  @PrimaryColumn({ name: 'stock_id' })
  id: string;
  @Column({ name: 'stock_name' })
  name: string;
  @Column()
  views: number;

  constructor(id: string, name: string, views?: number) {
    this.id = id;
    this.name = name;
    this.views = views ?? 0;
  }
}
