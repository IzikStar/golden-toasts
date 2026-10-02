import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { configureApp, GLOBAL_PREFIX } from './app/configure-app';

async function bootstrap() {
  const app = configureApp(await NestFactory.create(AppModule));
  const port = process.env.PORT || 3078;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${GLOBAL_PREFIX}`
  );
}

bootstrap();
