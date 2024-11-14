import { Entity } from 'typeorm';
import { StockPeriod } from './stockPeriod';

@Entity('stock_yearly')
export class StockYearly extends StockPeriod {
}
