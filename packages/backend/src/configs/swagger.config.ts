import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function useSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('juchumjuchum API')
    .setDescription('주춤주춤 API 문서입니다.')
    .setVersion('0.01')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
}
