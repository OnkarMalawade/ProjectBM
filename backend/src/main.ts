import { ValidationPipe } from './common/pipes/validation.pipe';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Static Assets
  app.useStaticAssets(join(__dirname, '..', 'static'));

  // Global Middleware
  app.use(new LoggerMiddleware().use);

  // Global Pipes
  app.useGlobalPipes(new ValidationPipe());

  // Global Filters
  app.useGlobalFilters(new AllExceptionsFilter());

  app.enableCors();
  await app.listen(3000);
}
bootstrap();
