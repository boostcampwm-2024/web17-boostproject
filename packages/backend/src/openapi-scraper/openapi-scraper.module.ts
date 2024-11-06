import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { OpenapiScraperService } from "./openapi-scraper.service";
import { EnvService } from "./env.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [OpenapiScraperService, EnvService],
})
export class OpenapiScraperModule {}
