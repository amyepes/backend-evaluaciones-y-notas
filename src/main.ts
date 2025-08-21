import { PORT } from 'src/core/constant/env.constant';
import { GlobalExceptionFilter } from 'src/infrastructure/filter/global-exception.filter';
import { AppModule } from 'src/infrastructure/module/app.module';
import { GlobalValidationPipe } from 'src/infrastructure/pipe/global-validation.pipe';
import { ClassSerializerInterceptor, ConsoleLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      logLevels: ['error', 'warn', 'log']
    }),
    rawBody: true
  });

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ limit: '1mb', extended: true }));

  app.useGlobalPipes(new GlobalValidationPipe());
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      exposeUnsetFields: true
    })
  );

  app.enableCors({
    origin: '*',
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type, Accept'
  });

  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<number>(PORT);
  await app.listen(port);
  console.log(`Application is running on port: ${port}`);
}

bootstrap().catch((err) => {
  console.error('Error starting the application:', err);
  process.exit(1);
});
