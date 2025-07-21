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
import { PropertyFeedbackSeeder } from "./property-feedback.seeder";
import { OfficePropertySeeder } from "./office-property.seeder";
import { Office } from "src/domain/entities/offices.entity";
import { Property } from "src/domain/entities/property.entity";
import { Residential } from "src/domain/entities/residential.entity";
import { PropertyPost } from "src/domain/entities/property-posts.entitiy";
import { PropertyFeedback } from "src/domain/entities/property-feedback.entity";
import { Image } from "src/domain/entities/image.entity";
import { User } from "src/domain/entities/user.entity";
import { OfficeSocial } from "src/domain/entities/office-social.entity";
import { ServicePriceSeeder } from "./service-price.seeder";
import { ServicePrice } from "src/domain/entities/service-price.entity";
import { UserRole } from "src/domain/entities/user-role.entity";
import { TouristicPropertySeeder } from "./touristic-property.seeder";
import { Touristic } from "src/domain/entities/touristic.entity";
import { AdditionalService } from "src/domain/entities/additional-service.entity";
import { Service } from "src/domain/entities/services.entity";


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
        TypeOrmModule.forFeature([
            Role,Permission,City,Region,Office,
            Property,Residential,PropertyPost,
            PropertyFeedback,Image,User,OfficeSocial,
            ServicePrice,UserRole,Touristic,AdditionalService,Service,
        ])
    ],
    providers:[
        SeederService,CityRegionSeeder,PermissionSeeder,
        RoleSeeder,PropertyFeedbackSeeder,OfficePropertySeeder,
        ServicePriceSeeder,TouristicPropertySeeder,
    ],
    exports:[SeederService]
})
export class SeederModule {}