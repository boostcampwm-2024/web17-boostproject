import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import * as passport from 'passport';
import { AppModule } from './app.module';
import { MEMORY_STORE } from '@/auth/session.module';
import { sessionConfig } from '@/configs/session.config';
import { useSwagger } from '@/configs/swagger.config';
import { HttpTraceInterceptor } from '@/common/interceptor/HttpTraceInterceptor';
import { CustomQueryLogger } from '@/configs/customQueryLogger';
import { DataSource } from 'typeorm';
import { HttpExceptionFilter } from '@/middlewares/filter/HttpExceptionFilter';
import { logger } from '@/configs/logger.config';

const setCors = (app: INestApplication) => {
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://juchum.info',
      'http://localhost:5173',
    ],
    methods: '*',
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
    ],
    credentials: true,
  });
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const store = app.get(MEMORY_STORE);

  // 4초 후 customQueryLogger 작동
  // 서버 초기화 쿼리는 로그 찍을 필요 없음
  setTimeout(() => {
    const dataSource = app.get(DataSource);
    dataSource.setOptions({
      logger: new CustomQueryLogger()
    });
  }, 4000);

  app.setGlobalPrefix('api');
  app.use(session({ ...sessionConfig, store }));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalInterceptors(new HttpTraceInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  setCors(app);
  useSwagger(app);
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
