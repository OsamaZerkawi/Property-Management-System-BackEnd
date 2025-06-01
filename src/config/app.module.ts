import { Module } from '@nestjs/common';
import { AppController } from '../presentation/http/controllers/app.controller';
import { AppService } from '../shared/common/app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import OrmConfig from 'src/infrastructure/config/typeorm.config';
import { AuthController } from 'src/presentation/http/controllers/auth.controller';
import { AuthModule } from 'src/presentation/http/modules/auth.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal:true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => OrmConfig(configService),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
