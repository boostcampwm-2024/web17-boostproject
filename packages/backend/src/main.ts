import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useSwagger } from '@/configs/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  useSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
