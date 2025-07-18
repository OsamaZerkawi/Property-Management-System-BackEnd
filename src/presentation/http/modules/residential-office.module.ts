import { forwardRef, Module } from "@nestjs/common";
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
import { RegionModule } from "./region.module";
import { PropertyPost } from "src/domain/entities/property-posts.entitiy";
import { PROPERTY_REPOSITORY } from "src/domain/repositories/property.repository";
import { PropertyRepository } from "src/infrastructure/repositories/property.repository";
import { CreatePropertyUseCase } from "src/application/use-cases/property/create-property.use-case";
import { PropertyPostModule } from "./property-post.module";
import { RESIDENTIAL_PROPERTY_REPOSITORY } from "src/domain/repositories/residential-property.repository";
import { ResidentialPropertyRepository } from "src/infrastructure/repositories/residetial-property.repository";
import { createResidentialPropertyUseCase } from "src/application/use-cases/property/create-residential-propety.use-case";
import { Office } from "src/domain/entities/offices.entity";
import { GetPropertiesForOfficeUseCase } from "src/application/use-cases/property/get-properties-for-office.use-case";
import { GetPropertiesForOfficeWithFiltersUseCase } from "src/application/use-cases/property/get-properties-for-office-with-filters.use-case";
import { GetPropertyForOfficeUseCase } from "src/application/use-cases/property/get-propety-for-office.use-case";
import { FindOneResidentialPropertyUseCase } from "src/application/use-cases/property/find-one-residential-property.use-case";
import { UpdateResidentialPropertyDetailsUseCase } from "src/application/use-cases/property/update-residential-property-details.use-case";
import { UpdatePropertyPostUseCase } from "src/application/use-cases/property-post/update-propety-post.use-case";
import { UpdateResidentialPropertyUseCase } from "src/application/use-cases/property/update-residential-property.use-case";
import { ResidentialPropertyAccessService } from "src/application/services/residentialPropertyAccess.service";
import { FindOfficeForUserUseCase } from "src/application/use-cases/office/find-office-for-user.use-case";
import { OfficeModule } from "./office.module";
import { SearchResidentialPropertyByTitleUseCase } from "src/application/use-cases/property/search-residential-property.dto";
import { GetExpectedPricePropertyUseCase } from "src/application/use-cases/property/get-expected-price.use-case";
import { PropertyModule } from "./property.module";
import { GetRentalPriceUseCase } from "src/application/use-cases/residential/get-rental-price.use-case";


@Module({
    imports: [
        forwardRef(() => PropertyModule),
        forwardRef(() => OfficeModule),
        PropertyPostModule,
        RegionModule,
        AuthModule,
        CityModule,
        TypeOrmModule.forFeature([Property,Region,City,Residential,PropertyPost,Office]),
    ],
    controllers:[ResidentialOfficeController],
    providers:[
        {
            provide:RESIDENTIAL_PROPERTY_REPOSITORY,
            useClass:ResidentialPropertyRepository
        },
        CreateResidentialPropertyDetailsUseCase,
        createResidentialPropertyUseCase,
        CreatePropertyUseCase,
        GetPropertiesForOfficeUseCase,
        GetPropertiesForOfficeWithFiltersUseCase,
        GetPropertyForOfficeUseCase,
        UpdateResidentialPropertyDetailsUseCase,
        UpdateResidentialPropertyUseCase,
        FindOneResidentialPropertyUseCase,
        UpdatePropertyPostUseCase,
        ResidentialPropertyAccessService,
        FindOfficeForUserUseCase,
        SearchResidentialPropertyByTitleUseCase,
        GetExpectedPricePropertyUseCase, 
        GetRentalPriceUseCase, 
    ],
    exports: [
        RESIDENTIAL_PROPERTY_REPOSITORY, 
        GetRentalPriceUseCase,  
    ]
})
export class ResidentialOfficeModule {}