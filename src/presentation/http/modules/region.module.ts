import { Module } from "@nestjs/common";
import { getRegionsByCityIdUseCase } from "src/application/use-cases/region/get-regions-by-city-id.use-case";
import { REGION_REPOSITORY } from "src/domain/repositories/region.repository";
import { RegionRepository } from "src/infrastructure/repositories/region.repository";
import { AuthModule } from "./auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { jwtConfig } from "src/infrastructure/config/jwt.config";
import { Region } from "src/domain/entities/region.entity";
import { City } from "src/domain/entities/city.entity";
import { RegionController } from "../controllers/region.controller";
import { FindRegionUseCase } from "src/application/use-cases/region/find-region-by-id.use-case";
import { GetExpectedPriceForRegionUseCase } from "src/application/use-cases/region/get-expected-price-for-region.use-case";

@Module({
    imports:[
        AuthModule,
        TypeOrmModule.forFeature([Region,City]),
    ],
    controllers:[RegionController],
    providers:[
        getRegionsByCityIdUseCase,
        GetExpectedPriceForRegionUseCase,
        FindRegionUseCase,
        {
            provide:REGION_REPOSITORY,
            useClass: RegionRepository
        }
    ],
    exports: [
        REGION_REPOSITORY,
        FindRegionUseCase,
        GetExpectedPriceForRegionUseCase
    ]
})
export class RegionModule{}