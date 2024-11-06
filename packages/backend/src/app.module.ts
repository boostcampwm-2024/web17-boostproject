import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpenapiScraperModule } from './openapi-scraper/openapi-scraper.module';

@Module({
  imports: [OpenapiScraperModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
