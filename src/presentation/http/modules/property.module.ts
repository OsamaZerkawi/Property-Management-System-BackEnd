import { forwardRef, Module } from "@nestjs/common";
import { AuthModule } from "./auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Property } from "src/domain/entities/property.entity";
import { Region } from "src/domain/entities/region.entity";
import { City } from "src/domain/entities/city.entity";
import { Residential } from "src/domain/entities/residential.entity";
import { PropertyPost } from "src/domain/entities/property-posts.entitiy";
import { PropertyRepository } from "src/infrastructure/repositories/property.repository";
import { PROPERTY_REPOSITORY } from "src/domain/repositories/property.repository";
import { GetAllPropertiesUseCase } from "src/application/use-cases/property/get-all-properties.use-case";
import { PropertyController } from "../controllers/property.controller";
import { GetAllPropertiesWithFiltersUseCase } from "src/application/use-cases/property/get-all-properties-with-filters.use-case";
import { SearchPropertiesByTitleUseCase } from "src/application/use-cases/property/search-properties-by-title.use-case";
import { SearchPropertyWithAdvancedFiltersUseCase } from "src/application/use-cases/property/search-property-with-advanced-filter.use-case";
import { ResidentialOfficeModule } from "./residential-office.module";
import { FindPropertyDetailsByIdUseCase } from "src/application/use-cases/property/find-property-details-by-id.use-case";
import { FindRelatedPropertiesUseCase } from "src/application/use-cases/property/find-related-properties.use-case";

@Module({
    imports:[
        AuthModule,
        forwardRef(() => ResidentialOfficeModule),
        TypeOrmModule.forFeature([Property,Region,City,Residential,PropertyPost])
    ],
    controllers:[PropertyController],
    providers:[
        GetAllPropertiesUseCase,
        GetAllPropertiesWithFiltersUseCase,
        SearchPropertiesByTitleUseCase,
        SearchPropertyWithAdvancedFiltersUseCase,
        FindPropertyDetailsByIdUseCase,
        FindRelatedPropertiesUseCase,
        {
            provide:PROPERTY_REPOSITORY,
            useClass:PropertyRepository
        },
    ],
    exports:[
        PROPERTY_REPOSITORY
    ]
})
export class PropertyModule{}