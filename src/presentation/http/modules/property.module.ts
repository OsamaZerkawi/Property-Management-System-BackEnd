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
import { PropertyFeedback } from "src/domain/entities/property-feedback.entity";
import { RatePropertyUseCase } from "src/application/use-cases/property/rate-property.use-case";
import { CompareTwoPropertiesUseCase } from "src/application/use-cases/property/compare-two-properties.use-case";
import { OfficeFeedback } from "src/domain/entities/office-feedback.entity";
import { PropertyFavoriteController } from "../controllers/property-favorite.controller";
import { PropertyFavorite } from "src/domain/entities/property-favorite.entity";
import { PROPERTY_FAVORITE_REPOSITORY } from "src/domain/repositories/property-favorite.repository";
import { PropertyFavoriteRepository } from "src/infrastructure/repositories/property-favorite.repository";
import { AddPropertyToFavoriteUseCase } from "src/application/use-cases/favorite/add-property-to-favorite.use-case";
import { RemovePropertyFromFavoriteUseCase } from "src/application/use-cases/favorite/remove-property-from-favorite.use-case";
import { FindTopRatedPropertiesUseCase } from "src/application/use-cases/residential/find-top-rated-residential-properties.use-case";
import { GetFavoritePropertiesUseCase } from "src/application/use-cases/favorite/get-favorite-properties.use-case";
import { Touristic } from "src/domain/entities/touristic.entity";
import { PromotedProperty } from "src/domain/entities/promoted-property.entity";
import { PROMOTED_PROPERTY_REPOISTORY } from "src/domain/repositories/promoted-property.repository";
import { PromotedPropertyRepository } from "src/infrastructure/repositories/promoted-property.repository";
import { GetPromotedPropertiesUseCase } from "src/application/use-cases/property/get-promoted-properties.use-case";

@Module({
    imports:[
        AuthModule,
        forwardRef(() => ResidentialOfficeModule),
        TypeOrmModule.forFeature([
           PropertyFeedback,Property,Region,City,
           Residential,PropertyPost,OfficeFeedback,
           PropertyFavorite,Touristic,PromotedProperty,
        ])
    ],
    controllers:[PropertyController,PropertyFavoriteController],
    providers:[
        GetAllPropertiesUseCase,
        GetAllPropertiesWithFiltersUseCase,
        SearchPropertiesByTitleUseCase,
        SearchPropertyWithAdvancedFiltersUseCase,
        FindPropertyDetailsByIdUseCase,
        FindRelatedPropertiesUseCase,
        RatePropertyUseCase,
        CompareTwoPropertiesUseCase,
        AddPropertyToFavoriteUseCase,
        RemovePropertyFromFavoriteUseCase,
        FindTopRatedPropertiesUseCase,
        GetFavoritePropertiesUseCase,
        GetPromotedPropertiesUseCase,
        {
            provide:PROPERTY_REPOSITORY,
            useClass:PropertyRepository
        },
        {
            provide:PROPERTY_FAVORITE_REPOSITORY,
            useClass: PropertyFavoriteRepository,
        },
        {
            provide: PROMOTED_PROPERTY_REPOISTORY,
            useClass: PromotedPropertyRepository
        }
    ],
    exports:[
        PROPERTY_REPOSITORY
    ]
})
export class PropertyModule{}