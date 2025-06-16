import { Module } from '@nestjs/common';
import { AppController } from '../presentation/http/controllers/app.controller';
import { AppService } from '../shared/common/app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import OrmConfig from 'src/infrastructure/config/typeorm.config';
import { AuthController } from 'src/presentation/http/controllers/auth.controller';
import { AuthModule } from 'src/presentation/http/modules/auth.module';
import { PropertyImageModule } from 'src/presentation/http/modules/property-image.module';
import { ResidentialOfficeModule } from 'src/presentation/http/modules/residential-office.module';
import { CityModule } from 'src/presentation/http/modules/city.module';
import { RegionModule } from 'src/presentation/http/modules/region.module';
import { TagModule } from 'src/presentation/http/modules/tag.module';
import { PropertyPostModule } from 'src/presentation/http/modules/property-post.module';
import { OfficeModule } from 'src/presentation/http/modules/office.module';

@Module({
  imports: [
    OfficeModule,
    AuthModule,
    TagModule,
    CityModule,
    PropertyPostModule,
    RegionModule,
    PropertyImageModule,
    ResidentialOfficeModule, 
    
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', 
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
