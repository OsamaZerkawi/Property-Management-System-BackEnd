import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { City } from "src/domain/entities/city.entity";
import { Permission } from "src/domain/entities/permissions.entity";
import { Region } from "src/domain/entities/region.entity";
import { Role } from "src/domain/entities/role.entity";
import OrmConfig from "src/infrastructure/config/typeorm.config";
import { TypeORMError } from "typeorm";
import { SeederService } from "./seeder.service";
import { CityRegionSeeder } from "./city-region.seeder";
import { PermissionSeeder } from "./permission.seeder";
import { RoleSeeder } from "./role.seeder";


@Module({
    imports:[
        ConfigModule.forRoot({
         isGlobal: true,
         envFilePath: '.env', 
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => OrmConfig(configService),
          inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([Role,Permission,City,Region])
    ],
    providers:[
        SeederService,CityRegionSeeder,PermissionSeeder,
        RoleSeeder,
    ],
    exports:[SeederService]
})
export class SeederModule {}