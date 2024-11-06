import { Module } from '@nestjs/common';
import { OpenapiScraperController } from './openapi-scraper.controller';
import { OpenapiScraper } from './openapi-scraper';

@Module({
  controllers: [OpenapiScraperController],
  providers: [OpenapiScraper]
})
export class OpenapiScraperModule {}
