import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import * as passport from 'passport';
import { AppModule } from './app.module';
import { sessionConfig } from '@/configs/session.config';
import { useSwagger } from '@/configs/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(session(sessionConfig));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  useSwagger(app);
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
