import { INestApplication, ValidationPipe } from '@nestjs/common';

export const GLOBAL_PREFIX = 'api';

/**
 * App-wide HTTP setup shared by `main.ts` and the e2e tests, so the tests
 * exercise the same validation and routing as the real server.
 */
export const configureApp = (app: INestApplication): INestApplication => {
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );
  app.setGlobalPrefix(GLOBAL_PREFIX);

  return app;
};
