import { Entity } from 'typeorm';
import { StockPeriod } from './stockPeriod';

@Entity('stock_minutely')
export class StockMinutely extends StockPeriod {
}
