import { NestFactory } from '@nestjs/core';
import { AppModule } from './config/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,  // automatically transforms payloads to DTO objects
      whitelist: true,  // automatically strips properties that are not in the DTO
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
