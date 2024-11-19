import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import {
  StockDaily,
  StockMinutely,
  StockMonthly,
  StockWeekly,
  StockYearly,
} from './stockData.entity';
import { Like } from '@/chat/domain/like.entity';
import { DateEmbedded } from '@/common/dateEmbedded.entity';
import { UserStock } from '@/stock/domain/userStock.entity';

@Entity()
export class Stock {
  @PrimaryColumn({ name: 'stock_id' })
  id: string;

  @Column({ name: 'stock_name' })
  name: string;

  @Column({ default: 0 })
  views: number = 0;

  @Column({ name: 'is_trading', default: true })
  isTrading: boolean = true;

  @Column({ name: 'group_code' })
  groupCode: string;

  @Column(() => DateEmbedded, { prefix: '' })
  date?: DateEmbedded;

  @OneToMany(() => Like, (like) => like.chat)
  likes?: Like[];

  @OneToMany(() => UserStock, (userStock) => userStock.stock)
  userStocks?: UserStock[];

  @OneToMany(() => StockMinutely, (stockMinutely) => stockMinutely.stock)
  stockMinutely?: StockMinutely[];

  @OneToMany(() => StockDaily, (stockDaily) => stockDaily.stock)
  stockDaily?: StockDaily[];

  @OneToMany(() => StockWeekly, (stockWeekly) => stockWeekly.stock)
  stockWeekly?: StockWeekly[];

  @OneToMany(() => StockMonthly, (stockMonthly) => stockMonthly.stock)
  stockMonthly?: StockMonthly[];

  @OneToMany(() => StockYearly, (stockYearly) => stockYearly.stock)
  stockYearly?: StockYearly[];
}
