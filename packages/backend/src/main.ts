import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import * as passport from 'passport';
import { AppModule } from './app.module';
import { MEMORY_STORE } from '@/auth/session.module';
import { sessionConfig } from '@/configs/session.config';
import { useSwagger } from '@/configs/swagger.config';

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

  app.setGlobalPrefix('api');
  app.use(session({ ...sessionConfig, store }));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  setCors(app);
  useSwagger(app);
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
