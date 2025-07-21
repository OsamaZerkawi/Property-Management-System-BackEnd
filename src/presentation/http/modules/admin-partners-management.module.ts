import { Module } from "@nestjs/common";
import { AuthModule } from "./auth.module";
import { AdminPartnersManagementController } from "../controllers/admin-partners-management.controller";
import { ADMIN_CITY_REPOSITORY } from "src/domain/repositories/admin-city.repository";
import { AdminCityRepository } from "src/infrastructure/repositories/admin-city.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Office } from "src/domain/entities/offices.entity";
import { User } from "src/domain/entities/user.entity";
import { AdminCity } from "src/domain/entities/admin-city.entity";
import { ServiceProvider } from "src/domain/entities/service-provider.entity";
import { OfficeModule } from "./office.module";
import { GetOfficesByAdminCityUseCase } from "src/application/use-cases/office/get-offices-by-admin-city.use-case";
import { City } from "src/domain/entities/city.entity";
import { Region } from "src/domain/entities/region.entity";

@Module({
    imports:[
        OfficeModule,
        TypeOrmModule.forFeature([Office,User,AdminCity,ServiceProvider,City,Region]),
        AuthModule,
    ],
    controllers:[AdminPartnersManagementController],
    providers:[
        GetOfficesByAdminCityUseCase,
        {
            provide:ADMIN_CITY_REPOSITORY,
            useClass: AdminCityRepository,
        }
    ],
    exports:[],
})
export class AdminPartnersManagementModule {}