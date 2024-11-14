import { Entity } from 'typeorm';
import { StockPeriod } from './stockPeriod';

@Entity('stock_weekly')
export class StockWeekly extends StockPeriod {
}
