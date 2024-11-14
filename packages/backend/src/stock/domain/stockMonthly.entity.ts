import { Entity } from 'typeorm';
import { StockPeriod } from './stockPeriod';

@Entity('stock_monthly')
export class StockMonthly extends StockPeriod {
}
