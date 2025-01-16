import { Column, Entity, Index, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import {
  StockDaily,
  StockMinutely,
  StockMonthly,
  StockWeekly,
  StockYearly,
} from './stockData.entity';
import { StockLiveData } from './stockLiveData.entity';
import { Alarm } from '@/alarm/domain/alarm.entity';
import { Like } from '@/chat/domain/like.entity';
import { DateEmbedded } from '@/common/dateEmbedded.entity';
import { FluctuationRankStock } from '@/stock/domain/FluctuationRankStock.entity';
import { UserStock } from '@/stock/domain/userStock.entity';

@Entity()
export class Stock {
  @PrimaryColumn({ name: 'stock_id' })
  id: string;

  @Column({ name: 'stock_name' })
  name: string;

  @Column({ default: 0 })
  @Index('idx_stock_views')
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

  @OneToOne(() => StockLiveData, (stockLiveData) => stockLiveData.stock)
  stockLive?: StockLiveData;

  @OneToMany(
    () => FluctuationRankStock,
    (fluctuationRankStock) => fluctuationRankStock.stock,
  )
  fluctuationRankStocks?: FluctuationRankStock[];

  @OneToMany(() => Alarm, (alarm) => alarm.stock)
  alarms?: Alarm[];
}
