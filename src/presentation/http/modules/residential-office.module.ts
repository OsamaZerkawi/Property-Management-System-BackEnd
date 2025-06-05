import { Module } from "@nestjs/common";
import { ResidentialOfficeController } from "../controllers/residential-office.controller";
import { AuthModule } from "./auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Property } from "src/domain/entities/property.entity";
import { Region } from "src/domain/entities/region.entity";
import { City } from "src/domain/entities/city.entity";
import { Residential } from "src/domain/entities/residential.entity";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { jwtConfig } from "src/infrastructure/config/jwt.config";
import { CityModule } from "./city.module";
import { CreateResidentialPropertyDetailsUseCase } from "src/application/use-cases/property/create-residential-property-details.use-case";
import { TagModule } from "./tag.module";
import { RegionModule } from "./region.module";
import { Tag } from "src/domain/entities/tag.entity";
import { PropertyPost } from "src/domain/entities/property-posts.entitiy";
import { PROPERTY_REPOSITORY } from "src/domain/repositories/property.repository";
import { PropertyRepository } from "uploads/properties/images/property.repository";
import { CreatePropertyUseCase } from "src/application/use-cases/property/create-property.use-case";
import { PropertyPostModule } from "./property-post.module";
import { RESIDENTIAL_PROPERTY_REPOSITORY_INTERFACE } from "src/domain/repositories/residential-property.repository";
import { ResidentialPropertyRepository } from "src/infrastructure/repositories/residetial-property.repository";
import { createResidentialPropertyUseCase } from "src/application/use-cases/property/create-residential-propety.use-case";
import { Office } from "src/domain/entities/offices.entity";
import { GetPropertiesForOfficeUseCase } from "src/application/use-cases/property/get-properties-for-office.use-case";
import { GetPropertiesForOfficeWithFiltersUseCase } from "src/application/use-cases/property/get-properties-for-office-with-filters.use-case";

@Module({
    imports: [
        TagModule,
        PropertyPostModule,
        RegionModule,
        AuthModule,
        CityModule,
        TypeOrmModule.forFeature([Property,Region,City,Residential,Tag,PropertyPost,Office]),
        JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: jwtConfig
    })
    ],
    controllers:[ResidentialOfficeController],
    providers:[
        {
            provide:PROPERTY_REPOSITORY,
            useClass:PropertyRepository
        },
        {
            provide:RESIDENTIAL_PROPERTY_REPOSITORY_INTERFACE,
            useClass:ResidentialPropertyRepository
        },
        CreateResidentialPropertyDetailsUseCase,
        createResidentialPropertyUseCase,
        CreatePropertyUseCase,
        GetPropertiesForOfficeUseCase,
        GetPropertiesForOfficeWithFiltersUseCase,
    ],
})
export class ResidentialOfficeModule {}