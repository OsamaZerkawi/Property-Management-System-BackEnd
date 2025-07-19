import { NestFactory } from '@nestjs/core';
import { AppModule } from './config/app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express'; 
import { setupSwagger } from './presentation/http/swagger/swagger.config'; 
 import * as express from 'express'; 
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // const cache = app.get<Cache>(CACHE_MANAGER);

  // await cache.set('debug_key', 'hello_from_nest', 60);
  // const val = await cache.get('debug_key');
  // console.log('✅ Cache test value:', val); // ← يجب أن تطبع القيمة
  app.enableCors({
    origin: 'http://localhost:3030',
    credentials: true,
  });

  setupSwagger(app);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,  // automatically transforms payloads to DTO objects
      whitelist: true,  // automatically strips properties that are not in the DTO
      transformOptions: {
      enableImplicitConversion: true, 
    },
    }),
  );


  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  app.use(express.json());   
   await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
