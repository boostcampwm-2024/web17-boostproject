import { Entity } from 'typeorm';
import { StockPeriod } from './stockPeriod';

@Entity('stock_daily')
export class StockDaily extends StockPeriod {
}
