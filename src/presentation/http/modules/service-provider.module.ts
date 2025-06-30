import { Module } from "@nestjs/common";
import { ServiceProviderController } from "../controllers/service-provider.controller";
import { AuthModule } from "./auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ServiceProvider } from "src/domain/entities/service-provider.entity";
import { ServiceFeedback } from "src/domain/entities/service-feedback.entity";
import { SERVICE_PROVIDER_REPOSITORY } from "src/domain/repositories/service-provider.repository";
import { ServiceProviderRepository } from "src/infrastructure/repositories/service-provider.repository";
import { User } from "src/domain/entities/user.entity";
import { Region } from "src/domain/entities/region.entity";
import { City } from "src/domain/entities/city.entity";
import { GetAllServiceProvidersUseCase } from "src/application/use-cases/service-provider/get-all-service-provider.use-case";
import { GetAllServiceProvidersWithFiltersUseCase } from "src/application/use-cases/service-provider/get-all-service-provider-with-filters.use-case";
import { SearchServiceProviderUseCase } from "src/application/use-cases/service-provider/search-service-provider.use-case";
import { GetTopRatedServiceProvidersUseCase } from "src/application/use-cases/service-provider/get-top-rated-providers.use-case";
import { CreateOrUpdateServiceProviderFeedbackUseCase } from "src/application/use-cases/service-provider/create-or-update-service-provider-feedback.use-case";
import { GetServiceProviderDetailsUseCase } from "src/application/use-cases/service-provider/get-service-provider-details.use-case";

@Module({
    imports:[
        AuthModule,
        TypeOrmModule.forFeature([ServiceProvider,ServiceFeedback,User,Region,City]),
    ],
    controllers:[ServiceProviderController],
    providers:[
        GetAllServiceProvidersUseCase,
        GetAllServiceProvidersWithFiltersUseCase,
        SearchServiceProviderUseCase,
        GetTopRatedServiceProvidersUseCase,
        CreateOrUpdateServiceProviderFeedbackUseCase,
        GetServiceProviderDetailsUseCase,
        {
            provide:SERVICE_PROVIDER_REPOSITORY,
            useClass: ServiceProviderRepository,
        }
    ],
    exports:[
        SERVICE_PROVIDER_REPOSITORY
    ]  
})
export class ServiceProviderModule{}