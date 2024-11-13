import { Module } from '@nestjs/common';
import { KoreaStockInfoModule } from './korea-stock-info/korea-stock-info.module';

@Module({
  imports: [KoreaStockInfoModule],
  controllers: [],
  providers: [],
})
export class ScraperModule {}
