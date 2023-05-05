import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const PORT = 8000;
  const app = await NestFactory.create(AppModule);
  const logger = app.get(Logger);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      enableDebugMessages: true,
    }),
  );
  await app.listen(PORT);
  logger.log(`Running on port ${await app.getUrl()}\n`, 'NestApplication');
}
bootstrap();
